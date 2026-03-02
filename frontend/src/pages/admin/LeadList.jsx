import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import { Search, Download } from 'lucide-react'

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const LeadList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))

  const { data, isLoading } = useQuery({
    queryKey: ['leads', status, search, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (search) params.append('search', search)
      params.append('page', page)
      params.append('limit', '20')
      
      const response = await api.get(`/admin/leads?${params}`)
      return response.data.data
    },
  })

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (search) params.set('search', search)
    setSearchParams(params)
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    setPage(1)
    const params = new URLSearchParams()
    if (newStatus) params.set('status', newStatus)
    if (search) params.set('search', search)
    setSearchParams(params)
  }

  const handleExport = async () => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (search) params.append('search', search)
    
    window.open(`${api.defaults.baseURL}/admin/export/leads?${params}`, '_blank')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Manage and track all lead submissions</p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary flex items-center gap-2">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="input pl-10"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input md:w-48"
          >
            <option value="">All Status</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {lead.trackingId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/leads/${lead._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lead.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {data.pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.pages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default LeadList
