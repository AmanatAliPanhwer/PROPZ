'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function NewThankError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load thank form"
      message={error.message || 'Could not load the thank-you form.'}
      reset={reset}
    />
  );
}
