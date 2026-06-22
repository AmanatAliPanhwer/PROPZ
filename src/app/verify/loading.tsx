import { Skeleton } from '@/components/ui/Skeleton';

export default function VerifyLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div className="flex flex-col gap-1">
        <div className="h-9 w-48 bg-neo-yellow/30 border-4 border-black border-dashed animate-pulse" />
        <div className="h-4 w-64 bg-neo-yellow/30 border-2 border-black border-dashed animate-pulse mt-1" />
      </div>

      <div className="bg-card border-4 border-black neo-shadow p-6 flex flex-col gap-4">
        <Skeleton className="h-5 w-36" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
