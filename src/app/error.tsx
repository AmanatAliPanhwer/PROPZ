'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Something went wrong"
      message={error.message || 'An unexpected error occurred on the home page.'}
      reset={reset}
    />
  );
}
