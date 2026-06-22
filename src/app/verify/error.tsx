'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function VerifyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load verification page"
      message={error.message || 'Could not load the verification form.'}
      reset={reset}
    />
  );
}
