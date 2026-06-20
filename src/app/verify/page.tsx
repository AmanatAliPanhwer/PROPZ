import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/queries';
import { VerifyForm } from './VerifyForm';

export default async function VerifyPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-3xl font-black uppercase">Get Verified</h1>
        <p className="text-sm font-medium text-black/50 mt-1">
          Submit a verification request to earn trust badges on your profile.
        </p>
      </div>
      <VerifyForm currentLevel={currentUser.verificationLevel} />
    </div>
  );
}
