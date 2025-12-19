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
import { Tournaments } from './components/dashboard/pages/TournamentsPage'
import { TournamentDetailsPage } from './components/dashboard/pages/TournamentDetailsPage'
import { ProfilePage } from './components/dashboard/pages/ProfilePage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ContactPage } from './pages/ContactPage'
import { AboutPage } from './pages/AboutPage'
import { Information } from './components/dashboard/pages/Information'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

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
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetailsPage />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/leagues/:id" element={<LeagueDetailsPage />} />
        <Route path="/betting" element={<Betting />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/information" element={<Information />} />
      </Route>

      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppLinks />
          <Toaster position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
