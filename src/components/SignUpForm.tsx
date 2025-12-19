import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

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
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full px-4">
        <Card className="w-full max-w-md shadow-lg border-border/40 text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Verifiera din email</CardTitle>
            <CardDescription>
              Vi har skickat en verifieringslänk till <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Klicka på länken i mailet för att aktivera ditt konto. Om du inte hittar mailet, kontrollera din skräppost.
            </p>
            <Button asChild variant="secondary" className="w-full">
              <a href="/login">Gå till inloggning</a>
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
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit mb-4">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </a>
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img src="/logo.svg" alt="Tippr" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Skapa konto</h1>
            <p className="text-muted-foreground">
              Fyll i uppgifterna nedan för att komma igång
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="namn@exempel.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="bg-background pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[0.8rem] text-muted-foreground">Minst 6 tecken</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="******"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-normal cursor-pointer">
              Jag godkänner <a href="/terms" className="underline hover:text-foreground" target="_blank">användarvillkoren</a> och <a href="/privacy" className="underline hover:text-foreground" target="_blank">integritetspolicyn</a>.
            </Label>
          </div>

          <Button type="submit" className="w-full font-semibold h-11" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-100 px-2 text-muted-foreground">
              Eller registrera med
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 h-11 bg-white border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-sm"
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
          Google
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Har du redan ett konto? <a href="/login" className="text-primary hover:underline font-medium">Logga in</a>
        </p>
      </div>
    </div>
  )
}
