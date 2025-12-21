import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { AppShell } from './components/shell/AppShell'
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
import { PreLaunchPage } from './pages/PreLaunchPage'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Check if pre-launch mode is enabled
const PRE_LAUNCH_MODE = import.meta.env.VITE_PRE_LAUNCH === 'true'

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
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <span className="text-sm text-text-secondary">Laddar...</span>
      </div>
    </div>
  )
  if (user) return <Navigate to="/overview" replace />
  return <HomePage />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <span className="text-sm text-text-secondary">Laddar...</span>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppLinks() {
  // When pre-launch mode is enabled, only show the pre-launch page
  if (PRE_LAUNCH_MODE) {
    return (
      <Routes>
        <Route path="*" element={<PreLaunchPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomeWrapper />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Dashboard Routes */}
      <Route element={
        <ProtectedRoute>
          <AppShell />
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
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppLinks />
            <Toaster
              position="top-center"
              toastOptions={{
                className: '!bg-bg-surface !text-text-primary !border !border-border-subtle !shadow-lg !rounded-xl',
                success: {
                  iconTheme: {
                    primary: 'hsl(160 84% 39%)',
                    secondary: 'white',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'hsl(0 84% 60%)',
                    secondary: 'white',
                  },
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
