import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { FileText } from 'lucide-react'

const Templates = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get('/admin/templates')
      return response.data.data.templates
    },
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <p className="text-gray-600 mt-2">Manage portfolio templates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((template) => (
          <div key={template._id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="text-primary-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No templates found</p>
        </div>
      )}
    </div>
  )
}

export default Templates
