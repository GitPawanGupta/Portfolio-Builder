import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLeadForm from './pages/PublicLeadForm'
import TrackApplication from './pages/TrackApplication'
import ThankYou from './pages/ThankYou'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import LeadList from './pages/admin/LeadList'
import LeadDetails from './pages/admin/LeadDetails'
import Templates from './pages/admin/Templates'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLeadForm />} />
        <Route path="/track" element={<TrackApplication />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="templates" element={<Templates />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
