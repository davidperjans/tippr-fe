import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, UserPlus, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (password.length < 6) {
        throw new Error('Lösenordet måste vara minst 6 tecken')
      }
      await signUp(email, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-lg mx-auto p-10 bg-card rounded-3xl shadow-xl border border-border/50 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Verifiera din email</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Vi har skickat en verifieringslänk till <span className="font-medium text-foreground">{email}</span>.
          Vänligen klicka på länken för att aktivera ditt konto.
        </p>
        <div className="p-4 bg-muted/30 rounded-xl mb-6 text-sm text-muted-foreground">
          Hittar du inte mailet? Kolla i skräpposten.
        </div>
        <a href="/login" className="text-primary hover:underline font-medium">
          Gå till inloggning
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto p-8 sm:p-10 bg-card rounded-3xl shadow-2xl border border-border/50 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-500" />

      <a 
        href="/" 
        className="absolute top-8 left-8 text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Tillbaka
      </a>

      <div className="text-center mb-10 mt-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
           <UserPlus className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Skapa konto</h2>
        <p className="text-muted-foreground mt-2">Börja tippa med vänner idag</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
           {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
             <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-12 pr-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-background hover:border-primary/50"
              required
              placeholder="namn@exempel.se"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none ml-1">
            Lösenord <span className="text-muted-foreground font-normal ml-1">(minst 6 tecken)</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 pl-12 pr-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-background hover:border-primary/50"
              minLength={6}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Skapar konto...' : 'Skapa konto'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase z-10">
          <span className="bg-card px-4 text-muted-foreground font-medium">Eller registrera med</span>
        </div>
      </div>

       <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => signInWithGoogle()}
           className="flex items-center justify-center gap-2 h-12 bg-background border hover:bg-muted/50 hover:border-primary/30 rounded-xl transition-all font-medium text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
             {/* Same Google icon path for consistency */}
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

       <div className="mt-8 text-center text-sm">
        <span className="text-muted-foreground">Har du redan ett konto? </span>
        <a href="/login" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
          Logga in
        </a>
      </div>
    </div>
  )
}