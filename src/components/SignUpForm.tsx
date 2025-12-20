import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from 'react-router-dom'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
      if (password !== confirmPassword) {
        throw new Error('Lösenorden matchar inte')
      }
      if (!termsAccepted) {
        throw new Error('Du måste godkänna användarvillkoren')
      }

      await signUp(email, password)
      setSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kunde inte skapa konto'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card variant="elevated" className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Verifiera din email</CardTitle>
            <CardDescription className="text-base">
              Vi har skickat en verifieringslänk till <strong className="text-text-primary">{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary">
              Klicka på länken i mailet för att aktivera ditt konto. Om du inte hittar mailet, kontrollera din skräppost.
            </p>
            <Button asChild variant="default" size="lg" className="w-full">
              <Link to="/login">Gå till inloggning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleGoogleSignUp = async () => {
    try {
      if (!termsAccepted) {
        setError('Du måste godkänna användarvillkoren')
        return
      }
      await signInWithGoogle()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kunde inte registrera med Google'
      setError(message)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tillbaka till startsidan
      </Link>

      {/* Header */}
      <div className="text-center">
        <div className="lg:hidden flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Skapa konto
        </h1>
        <p className="text-text-secondary mt-2">
          Fyll i uppgifterna nedan för att komma igång
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl font-medium flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-danger/20 flex items-center justify-center shrink-0">
            <span className="text-danger font-bold">!</span>
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary font-medium">E-postadress</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              id="email"
              type="email"
              placeholder="namn@exempel.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 h-12 bg-bg-subtle border-border-subtle rounded-xl focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary font-medium">Lösenord</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="pl-11 pr-11 h-12 bg-bg-subtle border-border-subtle rounded-xl focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-text-tertiary">Minst 6 tecken</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-text-primary font-medium">Bekräfta lösenord</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-11 pr-11 h-12 bg-bg-subtle border-border-subtle rounded-xl focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-3 p-4 bg-bg-subtle rounded-xl border border-border-subtle">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal text-text-secondary leading-relaxed cursor-pointer">
            Jag godkänner{' '}
            <Link to="/terms" className="text-brand-600 hover:text-brand-700 font-medium" target="_blank">
              användarvillkoren
            </Link>
            {' '}och{' '}
            <Link to="/privacy" className="text-brand-600 hover:text-brand-700 font-medium" target="_blank">
              integritetspolicyn
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base font-semibold"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? 'Skapar konto...' : 'Skapa konto'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-text-tertiary font-medium">
            Eller registrera med
          </span>
        </div>
      </div>

      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleGoogleSignUp}
        className="w-full h-12 font-medium gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Fortsätt med Google
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-text-secondary">
        Har du redan ett konto?{' '}
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
          Logga in
        </Link>
      </p>
    </div>
  )
}
