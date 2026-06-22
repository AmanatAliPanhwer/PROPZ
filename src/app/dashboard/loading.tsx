import { StatsCardSkeleton } from '@/components/features/StatsCardSkeleton';
import { ThankCardSkeleton } from '@/components/features/ThankCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border-4 border-black neo-shadow p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <ThankCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
