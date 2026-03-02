import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Activity, Briefcase, Zap } from 'lucide-react'

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard')
      return response.data.data
    },
  })

  const stats = [
    { 
      name: 'New Leads', 
      value: data?.new || 0, 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      status: 'NEW',
      change: '+12%'
    },
    { 
      name: 'In Progress', 
      value: data?.inProgress || 0, 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      status: 'IN_PROGRESS',
      change: '+8%'
    },
    { 
      name: 'Completed', 
      value: data?.completed || 0, 
      icon: CheckCircle, 
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/10',
      iconColor: 'text-green-600',
      status: 'COMPLETED',
      change: '+23%'
    },
    { 
      name: 'Rejected', 
      value: data?.rejected || 0, 
      icon: XCircle, 
      gradient: 'from-red-500 to-pink-500',
      bg: 'bg-red-500/10',
      iconColor: 'text-red-600',
      status: 'REJECTED',
      change: '-5%'
    },
  ]

  const quickActions = [
    {
      title: 'View All Leads',
      description: 'Manage all portfolio requests',
      icon: Briefcase,
      link: '/admin/leads',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600'
    },
    {
      title: 'New Leads',
      description: 'Review pending requests',
      icon: Zap,
      link: '/admin/leads?status=NEW',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Templates',
      description: 'Manage portfolio designs',
      icon: Activity,
      link: '/admin/templates',
      gradient: 'from-green-500 to-teal-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600'
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="text-primary-600 animate-pulse" size={24} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          </div>
          <p className="text-white/80 text-lg">Welcome back! Here's what's happening with your portfolio requests.</p>
        </div>
      </div>

      {/* Stats Grid with Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              to={`/admin/leads?status=${stat.status}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`${stat.iconColor}`} size={24} />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.change}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 font-medium mb-1">{stat.name}</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span className="group-hover:text-primary-600 transition-colors">View details →</span>
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions with Modern Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
            <Zap className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon
            return (
              <Link
                key={action.title}
                to={action.link}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-3 ${action.iconBg} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <ActionIcon className={`${action.iconColor}`} size={24} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  
                  <div className="flex items-center text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                    <span>Get started</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Total Leads Card with Premium Design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-bold">Total Portfolio Requests</h2>
            </div>
            <p className="text-5xl font-bold mt-4">{data?.total || 0}</p>
            <p className="text-white/80 mt-2">All time requests received</p>
          </div>
          
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <TrendingUp size={64} className="text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
