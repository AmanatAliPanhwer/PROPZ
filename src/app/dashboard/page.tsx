import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { StatsCard } from '@/components/features/StatsCard';
import { DashboardProfile } from '@/components/features/DashboardProfile';
import { ThankList } from '@/components/features/ThankList';
import Link from 'next/link';

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const initialThanks = await prisma.thank.findMany({
    where: { receiverId: currentUser.id },
    include: {
      sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const receivedCount = await prisma.thank.count({ where: { receiverId: currentUser.id } });
  const sentCount = await prisma.thank.count({ where: { senderId: currentUser.id } });
  const verifiedCount = await prisma.thank.count({ where: { receiverId: currentUser.id, isVerified: true } });

  return (
    <div className="flex flex-col gap-6">
      <DashboardProfile user={currentUser} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Received" value={receivedCount} color="yellow" />
        <StatsCard title="Sent" value={sentCount} color="blue" />
        <StatsCard title="Verified" value={verifiedCount} color="green" />
        <StatsCard title="Trust Score" value={currentUser.trustScore} color="pink" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase">Thanks Received</h2>
          <Link
            href="/thank/new"
            className="px-4 py-2 bg-neo-yellow border-4 border-black font-bold uppercase text-sm neo-shadow hover:neo-shadow-lg transition-all"
          >
            Send Thank You
          </Link>
        </div>
        <ThankList
          initialThanks={initialThanks}
          emptyMessage="No thanks received yet."
          apiParams={`receiverId=${currentUser.id}&limit=10`}
        />
      </div>
    </div>
  );
}
