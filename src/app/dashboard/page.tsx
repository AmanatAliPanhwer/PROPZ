import { getWorkers, getUserStats } from '@/lib/queries';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/features/StatsCard';
import { ThankList } from '@/components/features/ThankList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createUser } from '@/lib/actions';

export default async function DashboardPage() {
  const workers = await getWorkers();

  if (workers.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <h1 className="text-2xl font-black uppercase mb-2">Welcome to PROPZ</h1>
          <p className="text-sm font-medium text-black/50 mb-6">
            Create a worker profile to get started.
          </p>
          <form action={createUser} className="flex flex-col gap-4 max-w-md">
            <Input label="Name" name="name" placeholder="Your name" required />
            <Input label="Profession" name="profession" placeholder="e.g. Plumber, Teacher, Chef" />
            <Input label="Bio" name="bio" placeholder="Tell us about yourself" />
            <Button type="submit" variant="primary">
              Create Profile
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const currentUser = await getUserStats(workers[0].id);
  const initialThanks = await prisma.thank.findMany({
    where: { receiverId: currentUser.id },
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
      <div>
        <h1 className="text-3xl font-black uppercase">{currentUser.name}</h1>
        {currentUser.profession && (
          <p className="text-sm font-medium text-black/50 mt-1">{currentUser.profession}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Received" value={currentUser.receivedCount} color="yellow" />
        <StatsCard title="Sent" value={currentUser.sentCount} color="blue" />
        <StatsCard title="Verified" value={currentUser.verifiedCount} color="green" />
        <StatsCard title="Trust Score" value={currentUser.trustScore} color="pink" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-black uppercase">Thanks Received</h2>
        <ThankList
          initialThanks={initialThanks}
          emptyMessage="No thanks received yet."
          apiParams={`receiverId=${currentUser.id}&limit=10`}
        />
      </div>
    </div>
  );
}
