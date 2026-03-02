import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import api from '../services/api'
import Navbar from '../components/Navbar'
import SEO from '../components/SEO'
import { Upload, Loader2, CheckCircle, Zap, Shield, Star, Award, Users, Mail, Phone, MapPin, Sparkles, Code, Palette, Rocket, Clock, Target } from 'lucide-react'

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
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const navigate = useNavigate()
  const observerRef = useRef(null)

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

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
      <SEO 
        title="Portfolio Builder - Create Professional Portfolios Online | Free Portfolio Maker"
        description="Build stunning professional portfolios in minutes. Free portfolio builder with customizable templates, resume upload, and instant sharing. Perfect for developers, designers, and professionals."
        keywords="portfolio builder, online portfolio, professional portfolio, resume builder, portfolio maker, free portfolio, portfolio website, developer portfolio, designer portfolio, create portfolio online, portfolio templates, portfolio design"
      />
      <Navbar />
      
      {/* Floating Chat Widget Indicator - Responsive */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 group">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping opacity-75"></div>
          <button className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-bounce-slow touch-target">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-xs sm:text-sm px-3 py-2 sm:px-4 rounded-lg whitespace-nowrap shadow-xl">
              Need help? Chat with us!
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Hero Section with Animated Background and Parallax - Fully Responsive */}
      <section 
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-40 sm:w-80 h-40 sm:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-xs sm:text-sm font-semibold">🚀 Trusted by 500+ Professionals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100 leading-tight">
            Build Your Dream Portfolio
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-primary-50 max-w-3xl mx-auto leading-relaxed px-4">
            Stand out from the crowd with a professionally designed portfolio
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 px-4">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base">
              <CheckCircle size={16} className="text-green-300 flex-shrink-0 sm:w-5 sm:h-5" />
              <span className="font-medium whitespace-nowrap">Professional Design</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base">
              <Zap size={16} className="text-yellow-300 flex-shrink-0 sm:w-5 sm:h-5" />
              <span className="font-medium whitespace-nowrap">Quick Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base">
              <Shield size={16} className="text-blue-300 flex-shrink-0 sm:w-5 sm:h-5" />
              <span className="font-medium whitespace-nowrap">100% Satisfaction</span>
            </div>
          </div>
          <a href="#apply" className="inline-block bg-white text-primary-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl touch-target">
            Get Started Now →
          </a>
        </div>
      </section>

      {/* Premium Apply Form Section - Fully Responsive */}
      <section id="apply" className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-xs sm:text-sm">
              ✨ Start Your Journey
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">Apply Now</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Fill out the form below and we'll create an amazing portfolio for you</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Name *</label>
                <input {...register('name')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.name.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email *</label>
                <input {...register('email')} type="email" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="john@example.com" />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.email.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Phone *</label>
                <input {...register('phone')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="+1234567890" />
                {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.phone.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Role *</label>
                <input {...register('role')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="React Developer" />
                {errors.role && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.role.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Experience (Years) *</label>
                <input {...register('experienceYears', { valueAsNumber: true })} type="number" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="3" />
                {errors.experienceYears && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.experienceYears.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">City *</label>
                <input {...register('city')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="New York" />
                {errors.city && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1"><span>⚠️</span>{errors.city.message}</p>}
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Budget (Optional)</label>
                <input {...register('budget', { valueAsNumber: true })} type="number" className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none text-sm sm:text-base touch-target" placeholder="5000" />
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Resume * (PDF, DOC, DOCX - Max 10MB)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-300 cursor-pointer group-hover:scale-[1.01]">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary-400 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">
                      {file ? `✓ ${file.name}` : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Message (Optional)</label>
                <textarea {...register('message')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 outline-none resize-none text-sm sm:text-base" rows="4" placeholder="Tell us about your requirements..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 touch-target"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Premium Portfolio Designs Section */}
      <section id="samples" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm">
              🎨 Our Templates
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Portfolio Designs</h2>
            <p className="text-xl text-gray-600">Choose from our professional templates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Template - Pasu AI Portfolio */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 h-56 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-lg rotate-12 animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 right-20 w-12 h-12 bg-white rounded-lg -rotate-12 animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full mb-3">
                    <span className="text-sm font-semibold">🤖 AI Specialist</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2">Basic</h3>
                  <p className="text-purple-200 font-medium">Simple & Clean</p>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Basic Template</h4>
                <p className="text-gray-600 mb-4">Perfect for beginners and professionals</p>
                <div className="mb-6">
                  <a 
                    href="https://portfolio.pasuai.online/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors group-hover:gap-3"
                  >
                    <span>View Live Demo</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Custom Animations & Transitions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Interactive UI Elements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Dynamic Project Showcase</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Responsive Design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Modern Typography</span>
                  </li>
                </ul>
                <div className="flex gap-1 justify-center pt-4 border-t border-gray-100">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                  <Star className="text-gray-300" size={18} />
                </div>
              </div>
            </div>

            {/* Professional Template */}
            <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                ⭐ Most Popular
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-56 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full mb-3">
                    <span className="text-sm font-semibold">💼 Professional</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2">Professional</h3>
                  <p className="text-purple-100 font-medium">Feature Rich</p>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Professional Template</h4>
                <p className="text-gray-600 mb-4">Best for developers & designers</p>
                <div className="mb-6">
                  <a 
                    href="https://gitpawangupta.github.io/sandhya-portfolio/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors group-hover:gap-3"
                  >
                    <span>View Live Demo</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Multi-Page Layout</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Advanced Project Gallery</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Blog & Articles Section</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Smooth Animations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Contact Form Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Social Media Links</span>
                  </li>
                </ul>
                <div className="flex gap-1 justify-center pt-4 border-t border-gray-100">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Template */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 h-56 flex items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="inline-block px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full mb-3">
                    <span className="text-sm font-semibold">👑 Premium</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2">Premium</h3>
                  <p className="text-gray-300 font-medium">Enterprise Level</p>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Premium Template</h4>
                <p className="text-gray-600 mb-4">For top-tier professionals</p>
                <div className="mb-6">
                  <a 
                    href="https://a-portfolio-azure.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors group-hover:gap-3"
                  >
                    <span>View Live Demo</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
                <ul className="text-sm text-gray-600 space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Fully Custom Design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Advanced Animations & Effects</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Interactive Portfolio Showcase</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>SEO Optimized</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Performance Optimized</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Analytics Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <div className="flex gap-1 justify-center pt-4 border-t border-gray-100">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Project Showcase Section */}
      <section 
        id="showcase" 
        data-animate
        className={`py-24 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has('showcase') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-4000"></div>
          <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full font-semibold text-sm shadow-lg">
              <Sparkles className="inline-block mr-2" size={16} />
              Interactive Features
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">What Makes Us Different?</h2>
            <p className="text-xl text-gray-600">Advanced features that set your portfolio apart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Code className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Clean Code Structure</h3>
                <p className="text-gray-600 leading-relaxed">Well-organized, semantic HTML with optimized performance and SEO-friendly structure</p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Palette className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Animations</h3>
                <p className="text-gray-600 leading-relaxed">Smooth transitions, hover effects, and scroll-triggered animations that engage visitors</p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Rocket className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">Optimized images, lazy loading, and efficient code for blazing-fast load times</p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Target className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Responsive</h3>
                <p className="text-gray-600 leading-relaxed">Perfect display on all devices - desktop, tablet, and mobile with adaptive layouts</p>
              </div>
            </div>

            {/* Feature Card 5 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Reliable</h3>
                <p className="text-gray-600 leading-relaxed">HTTPS enabled, secure forms, and reliable hosting with 99.9% uptime guarantee</p>
              </div>
            </div>

            {/* Feature Card 6 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full filter blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <Clock className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Revisions</h3>
                <p className="text-gray-600 leading-relaxed">Fast turnaround on changes and updates to ensure your portfolio is always current</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Section - Professional Indian Pricing */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full font-semibold text-xs sm:text-sm">
              💰 Affordable Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">Simple Pricing</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Choose the perfect plan for your portfolio needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border-2 border-gray-100 hover:border-primary-200 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold mb-4">
                  🎯 Starter
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Basic</h3>
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-600">₹500</span>
                    <span className="text-sm sm:text-base text-gray-500">/portfolio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Perfect for beginners</p>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 text-left">
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>1 Modern Portfolio Template</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>5 Sections (About, Skills, Projects, Contact)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Responsive Design (Mobile + Desktop)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Basic Color Customization</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>48 Hours Delivery</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Email Support (Business Hours)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Free Hosting Setup Guide</span>
                  </li>
                </ul>
                <a href="#apply" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 touch-target">
                  Choose Basic
                </a>
              </div>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-6 sm:p-8 border-2 border-primary-500 relative transform hover:-translate-y-3 scale-105">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10 whitespace-nowrap">
                ⭐ Most Popular
              </div>
              <div className="text-center">
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold mb-4">
                  🚀 Recommended
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Professional</h3>
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-600">₹2,500</span>
                    <span className="text-sm sm:text-base text-gray-500">/portfolio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Best value for professionals</p>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 text-left">
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Choose from 3 Premium Templates</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>1 Professional Portfolio Website</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>8+ Sections (Hero, About, Skills, Experience, Projects, Testimonials, Blog, Contact)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Advanced Animations & Transitions</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Full Color & Font Customization</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Contact Form Integration</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>SEO Optimized (Meta Tags, Sitemap)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>24 Hours Express Delivery</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Priority Support (24/7 Chat)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>2 Free Revisions</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Free Domain Connection Guide</span>
                  </li>
                </ul>
                <a href="#apply" className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl touch-target">
                  Choose Professional
                </a>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 border-2 border-gray-100 hover:border-purple-200 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold mb-4">
                  👑 Enterprise
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Premium</h3>
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-primary-600">₹5,000</span>
                    <span className="text-sm sm:text-base text-gray-500">/portfolio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">For top-tier professionals</p>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 text-left">
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Choose from Unlimited Premium Templates</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>1 Fully Custom Portfolio Website</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>100% Custom Design from Scratch</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>10+ Sections (All Features + Case Studies, Certifications, Awards)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Advanced Animations, Parallax & 3D Effects</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Interactive Project Showcase with Filters</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Blog/CMS Integration (Optional)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Advanced SEO + Google Analytics Setup</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Performance Optimization (90+ Score)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>12 Hours Express Delivery</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>24/7 Dedicated Support (Phone + Chat)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Unlimited Revisions (30 Days)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>Free Domain + Hosting Setup</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5 sm:w-5 sm:h-5" />
                    <span>3 Months Free Maintenance & Updates</span>
                  </li>
                </ul>
                <a href="#apply" className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl touch-target">
                  Choose Premium
                </a>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee Badge */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-green-50 border-2 border-green-200 text-green-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>100% Money Back Guarantee • Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Premium Stats Section with Animated Counters */}
      <section 
        id="stats" 
        data-animate
        className={`relative py-24 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-900 text-white overflow-hidden transition-all duration-1000 ${
          visibleSections.has('stats') ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full animate-float animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:rotate-2">
                <div className="text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">500+</div>
                <div className="text-primary-100 font-semibold text-lg">Portfolios Created</div>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-white to-transparent mx-auto rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:rotate-2">
                <div className="text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">98%</div>
                <div className="text-primary-100 font-semibold text-lg">Satisfaction Rate</div>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-white to-transparent mx-auto rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:rotate-2">
                <div className="text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">24h</div>
                <div className="text-primary-100 font-semibold text-lg">Average Delivery</div>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-white to-transparent mx-auto rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:rotate-2">
                <div className="text-6xl md:text-7xl font-black mb-3 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">4.9★</div>
                <div className="text-primary-100 font-semibold text-lg">Client Rating</div>
                <div className="mt-3 h-1 w-16 bg-gradient-to-r from-white to-transparent mx-auto rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section with 3D Cards */}
      <section 
        id="features" 
        data-animate
        className={`py-24 px-4 bg-white relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm animate-slide-up">
              💎 Premium Features
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-slide-up">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up">We make portfolio creation simple and professional</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group perspective-1000">
              <div className="relative bg-gradient-to-br from-white to-primary-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-primary-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full filter blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Award className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Professional Templates</h3>
                  <p className="text-gray-600 text-center leading-relaxed">Choose from multiple professionally designed templates that make you stand out from the competition</p>
                </div>
              </div>
            </div>

            <div className="group perspective-1000">
              <div className="relative bg-gradient-to-br from-white to-green-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-green-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full filter blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Zap className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Fast Turnaround</h3>
                  <p className="text-gray-600 text-center leading-relaxed">Get your portfolio ready within 24-48 hours of submission with our streamlined process</p>
                </div>
              </div>
            </div>

            <div className="group perspective-1000">
              <div className="relative bg-gradient-to-br from-white to-purple-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-purple-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full filter blur-2xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Users className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Expert Support</h3>
                  <p className="text-gray-600 text-center leading-relaxed">Our team of designers ensures your portfolio looks perfect and represents you professionally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="how-it-works" 
        data-animate
        className={`py-20 px-4 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm">
              📋 Simple Process
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple 3-step process to get your portfolio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Submit Your Details</h3>
              <p className="text-gray-600 leading-relaxed">Fill out the form with your information and upload your resume</p>
              <div className="mt-4 w-16 h-1 bg-gradient-to-r from-primary-600 to-transparent mx-auto rounded-full"></div>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">We Create Magic</h3>
              <p className="text-gray-600 leading-relaxed">Our team designs a stunning portfolio tailored to your profile</p>
              <div className="mt-4 w-16 h-1 bg-gradient-to-r from-purple-600 to-transparent mx-auto rounded-full"></div>
            </div>

            <div className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-green-600 to-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receive & Share</h3>
              <p className="text-gray-600 leading-relaxed">Get your portfolio link via email and start impressing employers</p>
              <div className="mt-4 w-16 h-1 bg-gradient-to-r from-green-600 to-transparent mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="testimonials" 
        data-animate
        className={`py-20 px-4 bg-white transition-all duration-1000 ${
          visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-sm">
              ⭐ Client Reviews
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Join hundreds of satisfied professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 transform hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 transform group-hover:scale-125 transition-transform" style={{transitionDelay: `${i * 50}ms`}} size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                "Amazing service! My portfolio looks incredibly professional and I've already received multiple job offers. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  RK
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rahul Kumar</div>
                  <div className="text-sm text-gray-500">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 transform hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 transform group-hover:scale-125 transition-transform" style={{transitionDelay: `${i * 50}ms`}} size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                "The team was super responsive and delivered exactly what I wanted. The design is modern and showcases my work perfectly!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  PS
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Priya Sharma</div>
                  <div className="text-sm text-gray-500">UX Designer</div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 transform hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400 transform group-hover:scale-125 transition-transform" style={{transitionDelay: `${i * 50}ms`}} size={20} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">
                "Best investment I made for my career! The portfolio helped me land my dream job. Thank you so much!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  AG
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Amit Gupta</div>
                  <div className="text-sm text-gray-500">Data Scientist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
        </div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 animate-bounce-slow">
            <span className="text-lg font-semibold">🎉 Limited Time Offer</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 animate-slide-up">Ready to Build Your Portfolio?</h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed animate-slide-up animation-delay-500">
            Join 500+ professionals who have already transformed their careers with our portfolios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-1000">
            <a href="#apply" className="inline-flex items-center justify-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group">
              <span>Get Started Now</span>
              <span className="transform group-hover:translate-x-2 transition-transform">→</span>
            </a>
            <a href="#samples" className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <span>View Samples</span>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-300" size={20} />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-300" size={20} />
              <span>Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-300" size={20} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-600 rounded-full filter blur-3xl opacity-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                  </svg>
                </div>
                <span className="text-xl font-bold">Portfolio Builder</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">Creating professional portfolios for talented individuals worldwide.</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#samples" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Portfolio Designs</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#features" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#apply" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Apply Now</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3 group">
                  <Mail size={20} className="text-primary-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">admin@pasuai.online</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <Phone size={20} className="text-primary-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">+91 9795635252</span>
                </li>
                <li className="flex items-start gap-3 group">
                  <MapPin size={20} className="text-primary-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-white transition-colors">New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-center sm:text-left">
                &copy; 2024 Portfolio Builder. All rights reserved. Made with <span className="text-red-500 animate-heartbeat inline-block">❤️</span> for professionals worldwide.
              </p>
              
              {/* Admin Login Button */}
              <a 
                href="/admin/login" 
                className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 text-gray-400 hover:text-white text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLeadForm
