import { redirect } from 'next/navigation';
import { getCurrentUser, getWorkers } from '@/lib/queries';
import { WorkersSearch } from './WorkersSearch';

export default async function WorkersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const workers = await getWorkers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black uppercase">Workers</h1>
        <p className="text-sm font-medium text-black/50 mt-1">
          Browse and search all workers
        </p>
      </div>
      <WorkersSearch workers={workers} />
    </div>
  );
}
