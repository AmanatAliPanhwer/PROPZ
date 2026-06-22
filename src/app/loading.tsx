import { ThankCardSkeleton } from '@/components/features/ThankCardSkeleton';

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="h-9 w-48 bg-neo-yellow/30 border-4 border-black border-dashed animate-pulse" />
        <div className="h-4 w-72 bg-neo-yellow/30 border-2 border-black border-dashed animate-pulse mt-1" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <ThankCardSkeleton key={i} />
      ))}
    </div>
  );
}
