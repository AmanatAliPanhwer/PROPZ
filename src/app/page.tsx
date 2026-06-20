import { getThanksFeed } from '@/lib/queries';
import { ThankList } from '@/components/features/ThankList';

export default async function Home() {
  const thanks = await getThanksFeed(10);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black uppercase">Global Feed</h1>
        <p className="text-sm font-medium text-black/50 mt-1">
          Latest appreciation from the community
        </p>
      </div>

      <ThankList
        initialThanks={thanks}
        emptyMessage="No thanks yet. Be the first to appreciate someone!"
        apiParams="limit=10"
      />
    </div>
  );
}
