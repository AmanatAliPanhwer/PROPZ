'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function VerificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load verification requests"
      message={error.message || 'Could not load the admin verification panel.'}
      reset={reset}
    />
  );
}
