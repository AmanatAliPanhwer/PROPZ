import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up - PROPZ',
  description: 'Create a new PROPZ account.',
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <RegisterForm />
    </div>
  );
}
