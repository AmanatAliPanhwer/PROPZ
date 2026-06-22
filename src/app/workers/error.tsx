'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function WorkersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load workers"
      message={error.message || 'Could not load the workers directory.'}
      reset={reset}
    />
  );
}
