import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Rewards - PROPZ',
  description: 'View your $THANK token rewards.',
};

export default async function RewardsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const rewards = await prisma.reward.findMany({
    where: { userId: currentUser.id },
    include: {
      thank: {
        select: {
          note: true,
          sender: { select: { name: true } },
          receiver: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRewards = rewards.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase">$THANK Rewards</h1>
        <Card className="px-4 py-2 text-right">
          <p className="text-[10px] font-bold uppercase text-black/50">Total Earned</p>
          <p className="text-xl font-black">{totalRewards.toLocaleString()} $THANK</p>
        </Card>
      </div>

      {rewards.length === 0 ? (
        <Card>
          <p className="text-sm font-bold text-black/50 uppercase text-center py-8">
            No rewards yet. Verified thanks earn $THANK tokens.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {rewards.map((reward) => (
            <Card key={reward.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">
                  {reward.thank.note}
                </p>
                <p className="text-[10px] font-bold uppercase text-black/50 mt-1">
                  From {reward.thank.sender.name} → {reward.thank.receiver.name}
                </p>
                <p className="text-[10px] font-bold text-black/40 mt-0.5">
                  {new Date(reward.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-base font-black text-neo-yellow">
                  +{Number(reward.amount).toLocaleString()}
                </p>
                <a
                  href={`https://amoy.polygonscan.com/tx/${reward.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold uppercase text-black/40 hover:text-black underline underline-offset-2"
                >
                  Tx ↗
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
