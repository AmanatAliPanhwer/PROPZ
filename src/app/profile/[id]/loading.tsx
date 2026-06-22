import { StatsCardSkeleton } from '@/components/features/StatsCardSkeleton';
import { ThankCardSkeleton } from '@/components/features/ThankCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border-4 border-black neo-shadow p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <ThankCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
