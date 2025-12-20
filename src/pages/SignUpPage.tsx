import { SignUpForm } from '../components/SignUpForm'
import { AuthLayout } from '../components/auth/AuthLayout'

export function SignUpPage() {
  return (
    <AuthLayout mode="register">
      <SignUpForm />
    </AuthLayout>
  )
}