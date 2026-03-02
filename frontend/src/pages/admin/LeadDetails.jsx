import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Download, Mail, MessageCircle, FileText, Share2, Copy, ExternalLink } from 'lucide-react'

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const LeadDetails = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [note, setNote] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customPortfolioUrl, setCustomPortfolioUrl] = useState('')
  const [showShareSection, setShowShareSection] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await api.get(`/admin/leads/${id}`)
      return response.data.data
    },
  })

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get('/admin/templates')
      return response.data.data.templates
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (updates) => {
      const response = await api.patch(`/admin/leads/${id}`, updates)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lead', id])
      toast.success('Lead updated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Update failed')
    },
  })

  const generateMutation = useMutation({
    mutationFn: async (templateId) => {
      const response = await api.post('/admin/portfolio/generate', {
        leadId: id,
        templateId,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lead', id])
      toast.success('Portfolio generated successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Generation failed')
    },
  })

  const sendMutation = useMutation({
    mutationFn: async ({ via, portfolioUrl, pdfUrl }) => {
      const response = await api.post('/admin/portfolio/send', {
        leadId: id,
        via,
        portfolioUrl,
        pdfUrl,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['lead', id])
      toast.success(`Portfolio sent via ${variables.via}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'Send failed')
    },
  })

  const handleStatusChange = (newStatus) => {
    updateMutation.mutate({ status: newStatus })
  }

  const handleAddNote = () => {
    if (!note.trim()) return
    updateMutation.mutate({ notes: note })
    setNote('')
  }

  const handleGeneratePortfolio = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template')
      return
    }
    generateMutation.mutate(selectedTemplate)
  }

  const handleSend = (via) => {
    if (!data?.portfolio) {
      toast.error('Please generate portfolio first')
      return
    }
    sendMutation.mutate({
      via,
      portfolioUrl: data.portfolio.portfolioUrl,
      pdfUrl: data.portfolio.pdfUrl,
    })
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard!')
  }

  const handleShareViaEmail = (url) => {
    const subject = encodeURIComponent('Your Portfolio is Ready!')
    const body = encodeURIComponent(`Hi ${lead.name},\n\nYour portfolio is ready! You can view it here:\n${url}\n\nBest regards,\nPortfolio Builder Team`)
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank')
  }

  const handleShareViaWhatsApp = (url) => {
    const message = encodeURIComponent(`Hi ${lead.name}, your portfolio is ready! View it here: ${url}`)
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const lead = data?.lead

  return (
    <div>
      <Link to="/admin/leads" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft size={20} />
        Back to Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                  <span className="font-mono text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">
                    ID: {lead.trackingId}
                  </span>
                </div>
                <p className="text-gray-600">{lead.role}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[lead.status]}`}>
                {lead.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-medium">{lead.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{lead.experienceYears} years</p>
              </div>
              {lead.budget && (
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">${lead.budget}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="font-medium">{lead.source}</p>
              </div>
            </div>

            {lead.message && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Message</p>
                <p className="text-gray-900">{lead.message}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <a
                href={lead.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary flex items-center gap-2 w-fit"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
            <div className="space-y-4 mb-4">
              {lead.notes.map((n, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900">{n.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {n.addedBy?.name} on {new Date(n.addedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="input flex-1"
              />
              <button onClick={handleAddNote} className="btn btn-primary">
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Status</h2>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
            >
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h2>
            
            {!data?.portfolio ? (
              <>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="input mb-4"
                >
                  <option value="">Select Template</option>
                  {templatesData?.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={generateMutation.isPending}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FileText size={20} />
                  Generate Portfolio
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">Portfolio Generated</p>
                  <a
                    href={data.portfolio.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    View Portfolio
                  </a>
                </div>

                <button
                  onClick={() => handleSend('EMAIL')}
                  disabled={sendMutation.isPending || data.portfolio.sentOnEmail}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  {data.portfolio.sentOnEmail ? 'Sent via Email' : 'Send via Email'}
                </button>

                <button
                  onClick={() => handleSend('WHATSAPP')}
                  disabled={sendMutation.isPending || data.portfolio.sentOnWhatsApp}
                  className="btn btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  {data.portfolio.sentOnWhatsApp ? 'Sent via WhatsApp' : 'Send via WhatsApp'}
                </button>
              </div>
            )}
          </div>

          {/* Share Custom Portfolio URL */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Share Portfolio URL</h2>
              <button
                onClick={() => setShowShareSection(!showShareSection)}
                className="text-primary-600 hover:text-primary-700"
              >
                <Share2 size={20} />
              </button>
            </div>

            {showShareSection && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={customPortfolioUrl}
                    onChange={(e) => setCustomPortfolioUrl(e.target.value)}
                    placeholder="https://example.com/portfolio"
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter any portfolio URL to share with customer
                  </p>
                </div>

                {customPortfolioUrl && (
                  <>
                    <button
                      onClick={() => handleCopyUrl(customPortfolioUrl)}
                      className="btn btn-secondary w-full flex items-center justify-center gap-2"
                    >
                      <Copy size={18} />
                      Copy URL
                    </button>

                    <button
                      onClick={() => handleShareViaEmail(customPortfolioUrl)}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Mail size={18} />
                      Share via Email
                    </button>

                    <button
                      onClick={() => handleShareViaWhatsApp(customPortfolioUrl)}
                      className="btn w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle size={18} />
                      Share via WhatsApp
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadDetails
