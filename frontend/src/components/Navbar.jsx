import { Link } from 'react-router-dom'
import { Briefcase, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">Portfolio Builder</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm lg:text-base text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#samples" className="text-sm lg:text-base text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Samples
            </a>
            <a href="#how-it-works" className="text-sm lg:text-base text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              How It Works
            </a>
            <a href="#pricing" className="text-sm lg:text-base text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              Pricing
            </a>
            <Link 
              to="/track" 
              className="text-sm lg:text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
            >
              🔍 Track Application
            </Link>
            <a href="#apply" className="btn btn-primary text-sm lg:text-base whitespace-nowrap">
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100 animate-slide-up">
            <a
              href="#features"
              className="block py-2 text-gray-600 hover:text-primary-600 transition-colors touch-target"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#samples"
              className="block py-2 text-gray-600 hover:text-primary-600 transition-colors touch-target"
              onClick={() => setIsOpen(false)}
            >
              Samples
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-gray-600 hover:text-primary-600 transition-colors touch-target"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="block py-2 text-gray-600 hover:text-primary-600 transition-colors touch-target"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <Link
              to="/track"
              className="block text-center font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all touch-target"
              onClick={() => setIsOpen(false)}
            >
              🔍 Track Application
            </Link>
            <a
              href="#apply"
              className="block btn btn-primary text-center touch-target"
              onClick={() => setIsOpen(false)}
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
