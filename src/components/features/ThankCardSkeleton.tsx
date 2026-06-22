import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export const ThankCardSkeleton = () => (
  <Card className="flex flex-col gap-0">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-5 w-20" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-8" />
      </div>
    </div>

    <div className="flex items-center gap-3 pb-3 border-b-2 border-black/10">
      <Skeleton className="w-11 h-11 flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>

    <div className="py-4 flex flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>

    <div className="flex items-center gap-3 pt-3 border-t-2 border-black/10">
      <Skeleton className="w-11 h-11 flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t-2 border-black/10">
      <Skeleton className="h-5 w-14" />
      <Skeleton className="h-5 w-18" />
      <Skeleton className="h-5 w-12" />
    </div>

    <div className="mt-3 pt-3 border-t-2 border-black/10 grid grid-cols-2 gap-2">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </Card>
);
