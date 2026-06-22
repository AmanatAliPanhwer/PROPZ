import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - PROPZ',
  description: 'Sign in to your PROPZ account.',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div className="text-sm font-bold text-black/40">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
