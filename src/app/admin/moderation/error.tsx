'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function ModerationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load moderation panel"
      message={error.message || 'Could not load the admin moderation panel.'}
      reset={reset}
    />
  );
}
