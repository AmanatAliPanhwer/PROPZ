import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Suspense fallback={<div className="text-sm font-bold text-black/40">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
