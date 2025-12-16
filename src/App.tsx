import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { Overview } from './components/dashboard/pages/Overview'
import { Leagues } from './components/dashboard/pages/Leagues'
import { Betting } from './components/dashboard/pages/Betting'
import { Standings } from './components/dashboard/pages/Standings'
import { LeagueDetailsPage } from './components/dashboard/pages/LeagueDetailsPage'

function HomeWrapper() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center">Laddar...</div>
  // If user is logged in, redirect to Dashboard Overview
  if (user) return <Navigate to="/overview" replace />
  // Otherwise show Landing Page
  return <HomePage />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center">Laddar...</div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppLinks() {
  return (
    <Routes>
      <Route path="/" element={<HomeWrapper />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Dashboard Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/overview" element={<Overview />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:id" element={<LeagueDetailsPage />} />
        <Route path="/betting" element={<Betting />} />
        <Route path="/standings" element={<Standings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLinks />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App