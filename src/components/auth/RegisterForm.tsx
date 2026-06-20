'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export const RegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (!data.user) {
      setError('Sign up failed')
      setLoading(false)
      return
    }

    // If email confirmation is required, show prompt and skip sync
    if (data.user.identities && data.user.identities.length === 0) {
      setCheckEmail(true)
      setLoading(false)
      return
    }

    // Create User record in our DB via server action
    try {
      const res = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId: data.user.id, email, name }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create user')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create profile')
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  if (checkEmail) {
    return (
      <Card className="w-full max-w-md mx-auto text-center">
        <h1 className="text-2xl font-black uppercase mb-4">Check your email</h1>
        <p className="text-sm font-medium text-black/50 mb-6">
          We sent a confirmation link to <strong>{email}</strong>. Click it to complete your registration.
        </p>
        <p className="text-xs text-black/40">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <button
            type="button"
            onClick={() => setCheckEmail(false)}
            className="underline underline-offset-2 hover:text-black/70"
          >
            try again
          </button>
        </p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black uppercase">Join PROPZ</h1>
        <p className="text-sm font-medium text-black/50 mt-1">Create your worker profile</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
        />
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
          placeholder="At least 6 characters"
          required
          minLength={6}
        />

        {error && (
          <p className="text-sm font-bold text-neo-pink">{error}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-center font-medium text-black/50 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-black underline underline-offset-2 hover:text-black/70">
          Sign in
        </Link>
      </p>
    </Card>
  )
}
