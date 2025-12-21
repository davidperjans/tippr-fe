import { LoginForm } from '../components/LoginForm'
import { AuthLayout } from '../components/auth/AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  )
}