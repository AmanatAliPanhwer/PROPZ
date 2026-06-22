import { Skeleton } from '@/components/ui/Skeleton';

export default function NewThankLoading() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card border-4 border-black neo-shadow p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-18" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <div className="border-4 border-black border-dashed bg-neo-yellow/20 p-8 flex items-center justify-center">
            <Skeleton className="h-12 w-48" />
          </div>
        </div>

        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
