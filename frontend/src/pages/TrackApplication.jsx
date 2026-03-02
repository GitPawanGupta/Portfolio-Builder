import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle, Clock, XCircle, Package } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import SEO from '../components/SEO'

const TrackApplication = () => {
  const [trackingId, setTrackingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [retrievedId, setRetrievedId] = useState(null)
  const navigate = useNavigate()

  const statusConfig = {
    NEW: {
      icon: Package,
      color: 'blue',
      text: 'New Application',
      description: 'Your application has been received and is under review.'
    },
    IN_PROGRESS: {
      icon: Clock,
      color: 'yellow',
      text: 'In Progress',
      description: 'We are working on your portfolio. It will be ready soon!'
    },
    COMPLETED: {
      icon: CheckCircle,
      color: 'green',
      text: 'Completed',
      description: 'Your portfolio is ready! Check your email for the link.'
    },
    REJECTED: {
      icon: XCircle,
      color: 'red',
      text: 'Rejected',
      description: 'Unfortunately, we could not process your application.'
    }
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    
    if (!trackingId.trim()) {
      toast.error('Please enter tracking ID')
      return
    }

    setLoading(true)
    try {
      const response = await api.get(`/leads/track/${trackingId}`)
      setResult(response.data.data.lead)
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Tracking ID not found')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotTrackingId = async (e) => {
    e.preventDefault()
    
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email')
      return
    }

    setForgotLoading(true)
    try {
      const response = await api.post('/leads/retrieve-tracking-id', { email: forgotEmail })
      setRetrievedId(response.data.data)
      toast.success('Tracking ID retrieved successfully!')
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Email not found')
      setRetrievedId(null)
    } finally {
      setForgotLoading(false)
    }
  }

  const handleUseRetrievedId = () => {
    setTrackingId(retrievedId.trackingId)
    setShowForgotModal(false)
    setRetrievedId(null)
    setForgotEmail('')
  }

  const StatusIcon = result ? statusConfig[result.status].icon : Search

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <SEO 
        title="Track Your Portfolio Application | Portfolio Builder"
        description="Track your portfolio application status in real-time. Enter your tracking ID to check the progress of your professional portfolio creation."
        keywords="track portfolio, application status, portfolio tracking, check portfolio status"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4">
            <Search className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your tracking ID to check the status of your portfolio request
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrack} className="relative">
            <div className="flex gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Enter your tracking ID (e.g., A1B2C3D4)"
                className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                maxLength={8}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search size={20} />
                    <span>Track</span>
                  </div>
                )}
              </button>
            </div>
          </form>
          
          {/* Forgot Tracking ID Button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm underline"
            >
              Forgot your tracking ID?
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Status Header */}
              <div className={`bg-gradient-to-r from-${statusConfig[result.status].color}-500 to-${statusConfig[result.status].color}-600 p-8 text-white`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <StatusIcon size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{statusConfig[result.status].text}</h2>
                    <p className="text-white/90 mt-1">{statusConfig[result.status].description}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Applicant Name</p>
                    <p className="text-lg font-semibold text-gray-900">{result.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
                    <p className="text-lg font-semibold text-gray-900 font-mono">{result.trackingId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(result.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-${statusConfig[result.status].color}-100 text-${statusConfig[result.status].color}-800`}>
                      {statusConfig[result.status].text}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Application Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Application Submitted</p>
                        <p className="text-sm text-gray-600">
                          {new Date(result.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {['IN_PROGRESS', 'COMPLETED'].includes(result.status) && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Under Review</p>
                          <p className="text-sm text-gray-600">Your application is being processed</p>
                        </div>
                      </div>
                    )}

                    {result.status === 'COMPLETED' && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-white" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Portfolio Completed</p>
                          <p className="text-sm text-gray-600">Check your email for the portfolio link</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!result && (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Need Help?</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">•</span>
                  <span>Your tracking ID was sent to your email after submitting the application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">•</span>
                  <span>Tracking ID format: 8 characters (e.g., A1B2C3D4)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600">•</span>
                  <span>Can't find your tracking ID? Contact us at admin@pasuai.online</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Tracking ID Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
            <button
              onClick={() => {
                setShowForgotModal(false)
                setRetrievedId(null)
                setForgotEmail('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Search className="text-primary-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Retrieve Tracking ID
              </h2>
              <p className="text-gray-600">
                Enter your email to get your tracking ID
              </p>
            </div>

            {!retrievedId ? (
              <form onSubmit={handleForgotTrackingId} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving...</span>
                    </div>
                  ) : (
                    'Retrieve Tracking ID'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-600" size={24} />
                    <h3 className="text-lg font-bold text-green-900">Tracking ID Found!</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-700 mb-1">Name</p>
                      <p className="font-semibold text-green-900">{retrievedId.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-green-700 mb-1">Tracking ID</p>
                      <p className="text-2xl font-bold font-mono text-green-900 bg-white px-4 py-2 rounded-lg border border-green-300">
                        {retrievedId.trackingId}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-green-700 mb-1">Applied Date</p>
                      <p className="font-semibold text-green-900">
                        {new Date(retrievedId.appliedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUseRetrievedId}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                >
                  Track This Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackApplication
