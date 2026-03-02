import { useLocation, Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import SEO from '../components/SEO'

const ThankYou = () => {
  const location = useLocation()
  const trackingId = location.state?.trackingId

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <SEO 
        title="Thank You - Application Submitted | Portfolio Builder"
        description="Your portfolio application has been successfully submitted. Track your application status with your unique tracking ID."
        keywords="portfolio submitted, application success, portfolio tracking"
      />
      <div className="max-w-md w-full card text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your application has been submitted successfully. We'll review your information and get back to you soon.
        </p>
        
        {trackingId && (
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Tracking ID</p>
            <p className="text-2xl font-bold text-primary-600">{trackingId}</p>
            <p className="text-xs text-gray-500 mt-2">Save this ID to track your application status</p>
          </div>
        )}

        <Link to="/" className="btn btn-primary">
          Submit Another Application
        </Link>
      </div>
    </div>
  )
}

export default ThankYou
