import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const [backendUser, setBackendUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      syncWithBackend()
    }
  }, [user])

  const syncWithBackend = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBackendUser(data)
        console.log('Backend user:', data)
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Dashboard Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Tippr
            </span>
          </div>
          
          <button
            onClick={signOut}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Logga ut
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Välkommen tillbaka!</h1>
                <p className="text-muted-foreground">Här är en översikt av ditt konto.</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium w-fit">
                {user.email}
              </span>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
              {/* Account Info Card */}
              <div className="p-6 bg-card rounded-xl shadow-sm border border-border/50 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                   </div>
                   <h2 className="text-lg font-semibold">Profil & Konto</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                     <span className="text-sm text-muted-foreground">Email</span>
                     <span className="text-sm font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                     <span className="text-sm text-muted-foreground">Inloggning</span>
                     <span className="text-sm font-medium capitalize">{user.app_metadata.provider || 'email'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                     <span className="text-sm text-muted-foreground">Backend Status</span>
                     <span className={`text-xs px-2 py-1 rounded-full ${
                        loading ? 'bg-blue-100 text-blue-700' :
                        backendUser ? 'bg-green-100 text-green-700' : 
                        'bg-red-100 text-red-700' // Changed to red for error/not connected
                     }`}>
                        {loading ? 'Synkar...' : backendUser ? 'Ansluten' : 'Ej ansluten'}
                     </span>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="p-6 bg-card rounded-xl shadow-sm border border-border/50 flex flex-col justify-center items-center text-center space-y-4 min-h-[250px]">
                 <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                   </svg>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">Starta en liga</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">Skapa en egen liga och bjud in dina vänner för att börja tippa.</p>
                 </div>
                 <button disabled className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium cursor-not-allowed">
                    Kommer snart
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
