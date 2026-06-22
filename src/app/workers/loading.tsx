import { Skeleton } from '@/components/ui/Skeleton';

export default function WorkersLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="h-9 w-36 bg-neo-yellow/30 border-4 border-black border-dashed animate-pulse" />
        <div className="h-4 w-52 bg-neo-yellow/30 border-2 border-black border-dashed animate-pulse mt-1" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border-4 border-black neo-shadow p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 flex-shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
