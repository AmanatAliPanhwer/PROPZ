import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser, getWorkers, getAllTags } from '@/lib/queries';
import { ThankForm } from '@/components/features/ThankForm';

export const metadata: Metadata = {
  title: 'Send Thank - PROPZ',
  description: 'Send a thank-you to a worker with a note, tags, and photos.',
};

export default async function NewThankPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const [workers, tags] = await Promise.all([getWorkers(), getAllTags()]);

  const preselected = searchParams?.receiverId as string | undefined;
  const preselectedReceiverId = preselected === currentUser.id ? undefined : preselected;

  return (
    <div className="max-w-lg mx-auto">
      <ThankForm
        senderId={currentUser.id}
        workers={workers}
        tags={tags}
        preselectedReceiverId={preselectedReceiverId}
      />
    </div>
  );
}
