'use client';

import { ErrorCard } from '@/components/ui/ErrorCard';

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorCard
      title="Failed to load profile"
      message={error.message || 'Could not load this profile. The user may not exist.'}
      reset={reset}
    />
  );
}
