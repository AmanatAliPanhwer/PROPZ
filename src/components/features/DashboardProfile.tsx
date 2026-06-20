'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/lib/actions'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { VerificationBadge } from './VerificationBadge'

interface DashboardProfileProps {
  user: {
    id: string
    name: string
    profilePicture: string | null
    profession: string | null
    bio: string | null
    verificationLevel?: string
  }
}

export const DashboardProfile = ({ user: initialUser }: DashboardProfileProps) => {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialUser.name)
  const [profession, setProfession] = useState(initialUser.profession || '')
  const [bio, setBio] = useState(initialUser.bio || '')
  const [userData, setUserData] = useState(initialUser)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePic(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      let profilePicture = userData.profilePicture

      if (profilePic) {
        setUploading(true)
        const ext = profilePic.name.split('.').pop() || 'jpg'
        const filename = `profile-${authUser.id}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filename, profilePic, { upsert: true })

        if (uploadError) throw uploadError

        profilePicture = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pictures/${filename}`
        setUploading(false)
      }

      const updatedUser = await updateProfile({ name, profession, bio, profilePicture })
      setUserData(updatedUser)

      setUploading(false)
      setSaving(false)
      setEditing(false)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setUploading(false)
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setName(userData.name)
    setProfession(userData.profession || '')
    setBio(userData.bio || '')
    setProfilePic(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError('')
    setEditing(false)
  }

  const currentPic = preview || userData.profilePicture

  if (editing) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-14 h-14 shrink-0 border-4 border-black neo-shadow-sm bg-card flex items-center justify-center cursor-pointer hover:bg-neo-yellow/50 transition-all overflow-hidden"
          >
            {currentPic ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentPic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-black/30">+</span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex-1 flex flex-col gap-2">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              placeholder="Tell us about yourself"
              rows={2}
            />
          </div>
        </div>

        {error && <p className="text-sm font-bold text-neo-pink">{error}</p>}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={saving || uploading}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSave} disabled={saving || uploading}>
            {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {currentPic && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentPic}
          alt={userData.name}
          className="w-14 h-14 border-4 border-black neo-shadow-sm object-cover"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black uppercase">{userData.name}</h1>
          <VerificationBadge level={userData.verificationLevel || 'NONE'} />
        </div>
        {userData.profession && (
          <p className="text-sm font-medium text-black/50">{userData.profession}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/verify"
          className="px-4 py-1.5 border-2 border-black bg-white text-black font-bold text-xs uppercase neo-shadow-sm hover:bg-neo-yellow transition-all shrink-0"
        >
          Verify
        </Link>
        <button
        type="button"
        onClick={() => {
          setName(userData.name)
          setProfession(userData.profession || '')
          setBio(userData.bio || '')
          setProfilePic(null)
          if (preview) URL.revokeObjectURL(preview)
          setPreview(null)
          setEditing(true)
        }}
        className="px-4 py-1.5 border-2 border-black bg-white text-black font-bold text-xs uppercase neo-shadow-sm hover:bg-neo-yellow transition-all shrink-0"
      >
        Edit
      </button>
      </div>
    </div>
  )
}
