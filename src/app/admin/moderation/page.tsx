import { redirect } from 'next/navigation';
import { getCurrentUser, getReports, getFlaggedThanks } from '@/lib/queries';
import { flagThank, unflagThank, removeThank, suspendUser } from '@/lib/actions';

export default async function ModerationPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const reports = await getReports();
  const flaggedThanks = await getFlaggedThanks();

  const pendingReports = reports.filter((r) => r.status === 'PENDING');
  const resolvedReports = reports.filter((r) => r.status !== 'PENDING');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-black uppercase">Moderation</h2>
        <p className="text-sm font-medium text-black/50 mt-1">
          {pendingReports.length} pending report{pendingReports.length !== 1 ? 's' : ''} &middot;{' '}
          {flaggedThanks.length} flagged {flaggedThanks.length === 1 ? 'thank' : 'thanks'}
        </p>
      </div>

      {/* Flagged Thanks */}
      {flaggedThanks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase text-black/60">Flagged Content</h3>
          {flaggedThanks.map((thank) => (
            <div key={thank.id} className="bg-card border-4 border-black neo-shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold uppercase text-sm">{thank.sender.name} → {thank.receiver.name}</p>
                  <p className="text-xs text-black/50 mt-1 line-clamp-2">{thank.note}</p>
                </div>
                <span className="text-xs font-bold bg-neo-pink px-2 py-1 border-2 border-black uppercase">
                  {thank.flagReason || 'FLAGGED'}
                </span>
              </div>
              <div className="flex gap-2">
                <form action={unflagThank.bind(null, thank.id)}>
                  <button className="px-3 py-1.5 bg-neo-green border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Unflag
                  </button>
                </form>
                <form action={removeThank.bind(null, thank.id)}>
                  <button className="px-3 py-1.5 bg-neo-pink border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Remove
                  </button>
                </form>
                <form action={suspendUser.bind(null, thank.senderId, 'Repeated violations')}>
                  <button className="px-3 py-1.5 bg-white border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Suspend Sender
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Reports */}
      {pendingReports.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-black uppercase text-black/60">Pending Reports</h3>
          {pendingReports.map((report) => (
            <div key={report.id} className="bg-card border-4 border-black neo-shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold uppercase text-sm">
                    {report.reporter.name} reported {report.thank.sender.name} &rarr; {report.thank.receiver.name}
                  </p>
                  <p className="text-xs text-black/50 mt-1 line-clamp-2">{report.thank.note}</p>
                  {report.description && (
                    <p className="text-xs text-black/60 mt-1 italic">&ldquo;{report.description}&rdquo;</p>
                  )}
                </div>
                <span className="text-xs font-bold bg-neo-yellow px-2 py-1 border-2 border-black uppercase">
                  {report.reason}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <form action={flagThank.bind(null, report.thankId, report.reason)}>
                  <button className="px-3 py-1.5 bg-neo-yellow border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Flag Content
                  </button>
                </form>
                <form action={removeThank.bind(null, report.thankId)}>
                  <button className="px-3 py-1.5 bg-neo-pink border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Remove Content
                  </button>
                </form>
                <form action={suspendUser.bind(null, report.thank.senderId, 'Repeated violations')}>
                  <button className="px-3 py-1.5 bg-white border-2 border-black font-bold text-xs neo-shadow-sm hover:neo-shadow-lg transition-all">
                    Suspend Sender
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingReports.length === 0 && flaggedThanks.length === 0 && (
        <p className="text-sm text-black/40 font-medium">No reported or flagged content. All clear!</p>
      )}

      {/* Resolved Reports */}
      {resolvedReports.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-sm font-black uppercase text-black/60">Resolved Reports</h3>
          {resolvedReports.map((report) => (
            <div key={report.id} className="bg-card border-4 border-black neo-shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-bold uppercase text-sm">{report.reason} — {report.thank.sender.name}</p>
                <p className="text-xs text-black/50">Resolved by {report.resolver?.name || 'unknown'}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 border-2 border-black uppercase ${
                report.status === 'ACTIONED' ? 'bg-neo-green' : 'bg-black/10'
              }`}>
                {report.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
