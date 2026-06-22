'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load dashboard"
      message={error.message || 'Could not load your dashboard. Please try again.'}
      reset={reset}
    />
  );
}
