import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser, getVerificationRequests } from '@/lib/queries';
import { approveVerification, rejectVerification } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Verification Requests - PROPZ',
  description: 'Admin panel for reviewing worker verification requests.',
};

export default async function VerificationsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const requests = await getVerificationRequests();

  const pending = requests.filter((r) => r.status === 'PENDING');
  const resolved = requests.filter((r) => r.status !== 'PENDING');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-black uppercase">Verification Requests</h2>
        <p className="text-sm font-medium text-black/50 mt-1">
          {pending.length} pending request{pending.length !== 1 ? 's' : ''}
        </p>
      </div>

      {pending.length === 0 && resolved.length === 0 && (
        <p className="text-sm text-black/40 font-medium">No verification requests yet.</p>
      )}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase text-black/60">Pending</h3>
          {pending.map((req) => (
            <div key={req.id} className="bg-card border-4 border-black neo-shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold uppercase">{req.user.name}</p>
                  <p className="text-xs text-black/50">{req.user.email}</p>
                </div>
                <span className="text-xs font-bold bg-neo-yellow px-2 py-1 border-2 border-black uppercase">
                  {req.type}
                </span>
              </div>
              {req.notes && <p className="text-sm text-black/60">{req.notes}</p>}
              <div className="flex gap-2">
                <form action={approveVerification.bind(null, req.id)}>
                  <button className="px-3 py-1.5 bg-neo-green border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Approve
                  </button>
                </form>
                <form action={rejectVerification.bind(null, req.id, 'Rejected by admin')}>
                  <button className="px-3 py-1.5 bg-neo-pink border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase text-black/60">Resolved</h3>
          {resolved.map((req) => (
            <div key={req.id} className="bg-card border-4 border-black neo-shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-bold uppercase text-sm">{req.user.name}</p>
                <p className="text-xs text-black/50">{req.type} — {req.status}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 border-2 border-black uppercase ${
                req.status === 'APPROVED' ? 'bg-neo-green' : 'bg-neo-pink'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
