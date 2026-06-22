interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => (
  <div
    className={`bg-neo-yellow/30 border-4 border-black border-dashed animate-pulse ${className}`}
  />
);
