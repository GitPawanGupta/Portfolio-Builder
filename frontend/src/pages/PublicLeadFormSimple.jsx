import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { Upload, Loader2, CheckCircle, Zap, Shield } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Phone number is required'),
  role: z.string().min(1, 'Role is required'),
  experienceYears: z.number().min(0, 'Experience must be positive'),
  city: z.string().min(1, 'City is required'),
  budget: z.number().optional(),
  message: z.string().optional(),
})

const PublicLeadForm = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Please upload your resume')
      return
    }

    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key])
      }
    })
    formData.append('resume', file)

    setUploading(true)
    try {
      const response = await api.post('/leads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      
      const trackingId = response.data.data.trackingId
      navigate('/thank-you', { state: { trackingId } })
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to submit form')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Only PDF, DOC, and DOCX files are allowed')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build Your Dream Portfolio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Stand out from the crowd with a professionally designed portfolio
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle size={20} />
              <span>Professional Design</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap size={20} />
              <span>Quick Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield size={20} />
              <span>100% Satisfaction</span>
            </div>
          </div>
          <a href="#apply" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Get Started Now
          </a>
        </div>
      </section>

      <section id="apply" className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Apply Now</h2>
            <p className="text-lg text-gray-600">Fill out the form below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input {...register('name')} className="input" placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input {...register('email')} type="email" className="input" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input {...register('phone')} className="input" placeholder="+1234567890" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <input {...register('role')} className="input" placeholder="React Developer" />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                <input {...register('experienceYears', { valueAsNumber: true })} type="number" className="input" placeholder="3" />
                {errors.experienceYears && <p className="text-red-500 text-sm mt-1">{errors.experienceYears.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input {...register('city')} className="input" placeholder="New York" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (Optional)</label>
                <input {...register('budget', { valueAsNumber: true })} type="number" className="input" placeholder="5000" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume * (PDF, DOC, DOCX - Max 10MB)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea {...register('message')} className="input" rows="4" placeholder="Tell us about your requirements..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 Portfolio Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLeadForm
