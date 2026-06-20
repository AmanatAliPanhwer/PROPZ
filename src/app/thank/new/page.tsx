import { getWorkers, getAllTags } from '@/lib/queries';
import { ThankForm } from '@/components/features/ThankForm';
import { redirect } from 'next/navigation';

export default async function NewThankPage(props: PageProps<'/thank/new'>) {
  const searchParams = await props.searchParams;
  const [workers, tags] = await Promise.all([getWorkers(), getAllTags()]);

  if (workers.length === 0) {
    redirect('/dashboard');
  }

  // MVP: use first worker as logged-in sender
  const senderId = workers[0].id;

  const preselected = searchParams?.receiverId as string | undefined;
  const preselectedReceiverId = preselected === senderId ? undefined : preselected;

  return (
    <div className="max-w-lg mx-auto">
      <ThankForm
        senderId={senderId}
        workers={workers}
        tags={tags}
        preselectedReceiverId={preselectedReceiverId}
      />
    </div>
  );
}
