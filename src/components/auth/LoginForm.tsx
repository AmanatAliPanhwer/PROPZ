'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errCode = searchParams.get('error_code')
    const errDesc = searchParams.get('error_description')
    if (errCode === 'otp_expired') {
      setError('The confirmation link has expired. Please request a new one below.')
    } else if (errDesc) {
      setError(decodeURIComponent(errDesc))
    } else if (searchParams.get('error') === 'auth_failed') {
      setError('Authentication failed. Please try again.')
    } else if (searchParams.get('error') === 'no_code') {
      setError('Invalid authentication link.')
    } else if (searchParams.get('error') === 'no_user') {
      setError('Could not find your account. Please sign up.')
    }
  }, [searchParams])

  const handleResendConfirmation = async () => {
    const emailValue = email || searchParams.get('email') || ''
    if (!emailValue) {
      setError('Enter your email above, then click Resend Confirmation.')
      return
    }
    setLoading(true)
    setError('')
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: emailValue,
    })
    if (resendError) {
      setError(resendError.message)
    } else {
      setError('')
      alert('Confirmation email sent! Check your inbox.')
    }
    setLoading(false)
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black uppercase">PROPZ</h1>
        <p className="text-sm font-medium text-black/50 mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="text-sm font-bold text-neo-pink">{error}</p>
        )}

        {searchParams.get('error_code') === 'otp_expired' && (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={loading}
            className="text-xs font-bold underline underline-offset-2 hover:text-black/70 self-start"
          >
            {loading ? 'Sending...' : 'Resend confirmation email'}
          </button>
        )}

        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-0.5 bg-black/20" />
        <span className="text-xs font-bold text-black/40 uppercase">or</span>
        <div className="flex-1 h-0.5 bg-black/20" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full px-4 py-3 border-4 border-black bg-white text-black font-bold text-sm uppercase neo-shadow-sm hover:bg-neo-yellow transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-sm text-center font-medium text-black/50 mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-black underline underline-offset-2 hover:text-black/70">
          Create one
        </Link>
      </p>
    </Card>
  )
}
