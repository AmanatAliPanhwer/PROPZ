import { redirect, notFound } from 'next/navigation';
import { getCurrentUser, getUserStats } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/features/StatsCard';
import { ThankList } from '@/components/features/ThankList';
import Link from 'next/link';

export default async function ProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const { id } = await paramsPromise;
  const user = await getUserStats(id);

  if (!user || !user.name) notFound();

  const initialThanks = await prisma.thank.findMany({
    where: { receiverId: id },
    include: {
      sender: { select: { id: true, name: true, profession: true } },
      receiver: { select: { id: true, name: true, profession: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {user.profilePicture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-16 h-16 border-4 border-black neo-shadow-sm object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl font-black uppercase">{user.name}</h1>
              {user.profession && (
                <p className="text-lg font-medium text-black/60">{user.profession}</p>
              )}
            </div>
          </div>
          {currentUser.id !== id && (
            <Link
              href={`/thank/new?receiverId=${id}`}
              className="px-4 py-2 bg-neo-yellow border-4 border-black font-bold uppercase text-sm neo-shadow hover:neo-shadow-lg hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
            >
              Thank {user.name!.split(' ')[0]}
            </Link>
          )}
        </div>

        {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

        <div className="flex items-center gap-2 text-xs font-bold text-black/50">
          <span>Joined {new Date(user.createdAt!).toLocaleDateString()}</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Thanks Received" value={user.receivedCount} color="yellow" />
        <StatsCard title="Thanks Sent" value={user.sentCount} color="blue" />
        <StatsCard title="Verified" value={user.verifiedCount} color="green" />
        <StatsCard title="Trust Score" value={user.trustScore} color="pink" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-black uppercase">Thanks Received ({user.receivedCount})</h2>
        <ThankList
          initialThanks={initialThanks}
          emptyMessage="No thanks received yet."
          apiParams={`receiverId=${id}&limit=10`}
        />
      </div>
    </div>
  );
}
