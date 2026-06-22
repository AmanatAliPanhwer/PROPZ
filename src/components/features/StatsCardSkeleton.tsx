import { Skeleton } from '@/components/ui/Skeleton';

export const StatsCardSkeleton = () => (
  <div className="bg-neo-yellow/30 border-4 border-black border-dashed neo-shadow p-4 flex flex-col gap-2 animate-pulse">
    <Skeleton className="h-3 w-16" />
    <Skeleton className="h-8 w-12" />
  </div>
);
