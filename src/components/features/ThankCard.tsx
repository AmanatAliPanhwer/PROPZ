import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface ThankCardProps {
  thank: {
    id: string;
    note: string;
    isVerified: boolean;
    createdAt: string | Date;
    sender: { id: string; name: string; profession: string | null };
    receiver: { id: string; name: string; profession: string | null };
    tags: { id: string; name: string }[];
  };
}

export const ThankCard = ({ thank }: ThankCardProps) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(thank.createdAt));

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/profile/${thank.sender.id}`} className="font-bold uppercase hover:underline">
            {thank.sender.name}
          </Link>
          <span className="text-black/40">→</span>
          <Link href={`/profile/${thank.receiver.id}`} className="font-bold uppercase hover:underline">
            {thank.receiver.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {thank.isVerified && (
            <span className="text-xs font-bold bg-neo-green px-2 py-0.5 border-2 border-black">
              VERIFIED
            </span>
          )}
          <span className="text-xs font-medium text-black/50">{formattedDate}</span>
        </div>
      </div>

      <p className="text-base leading-relaxed">{thank.note}</p>

      {thank.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {thank.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs font-bold uppercase bg-neo-blue px-2 py-0.5 border-2 border-black"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};
