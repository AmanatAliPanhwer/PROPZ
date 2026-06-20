'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export const OnboardingForm = () => {
  const [profession, setProfession] = useState('')
  const [bio, setBio] = useState('')
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePic(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let profilePicture: string | null = null

      if (profilePic) {
        setUploading(true)
        const ext = profilePic.name.split('.').pop() || 'jpg'
        const filename = `profile-${user.id}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filename, profilePic, { upsert: true })

        if (uploadError) throw uploadError

        profilePicture = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${filename}`
        setUploading(false)
      }

      const res = await fetch('/api/auth/sync-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId: user.id, profession, bio, profilePicture }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setUploading(false)
      setLoading(false)
    }
  }

  const removePhoto = () => {
    setProfilePic(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black uppercase">Complete Your Profile</h1>
        <p className="text-sm font-medium text-black/50 mt-1">
          Add a photo and tell people about yourself
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile picture */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-28 h-28 border-4 border-black neo-shadow-sm bg-card flex items-center justify-center cursor-pointer hover:bg-neo-yellow/50 transition-all overflow-hidden"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-black/30">+</span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70"
            >
              {preview ? 'Change photo' : 'Add photo'}
            </button>
            {preview && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-xs font-bold uppercase text-neo-pink underline underline-offset-2 hover:text-black/70"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <Input
          label="Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="e.g. Plumber, Teacher, Chef"
        />

        <Textarea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself and your work"
          rows={3}
        />

        {error && (
          <p className="text-sm font-bold text-neo-pink">{error}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading || uploading} fullWidth>
          {uploading ? 'Uploading photo...' : loading ? 'Saving...' : 'Complete Profile'}
        </Button>
      </form>
    </Card>
  )
}
