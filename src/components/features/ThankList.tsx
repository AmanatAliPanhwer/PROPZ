'use client'

import { useEffect, useRef, useState } from 'react';
import { ThankCard } from './ThankCard';

interface ThankItem {
  id: string;
  createdAt: string | Date;
  note: string;
  images: string;
  isVerified: boolean;
  senderId: string;
  receiverId: string;
  sender: { id: string; name: string; profession: string | null };
  receiver: { id: string; name: string; profession: string | null };
  tags: { id: string; name: string }[];
}

interface ThankListProps {
  initialThanks: ThankItem[];
  emptyMessage: string;
  apiParams: string;
}

export const ThankList = ({ initialThanks, emptyMessage, apiParams }: ThankListProps) => {
  const [items, setItems] = useState<ThankItem[]>(initialThanks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialThanks.length >= 10);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const cursorRef = useRef<string | null>(
    initialThanks.length > 0 ? initialThanks[initialThanks.length - 1].id : null
  );

  // Reset when initialThanks changes (e.g. navigating between profiles)
  useEffect(() => {
    setItems(initialThanks);
    cursorRef.current = initialThanks.length > 0 ? initialThanks[initialThanks.length - 1].id : null;
    setHasMore(initialThanks.length >= 10);
    loadingRef.current = false;
  }, [initialThanks]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || !hasMore || loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        try {
          const res = await fetch(`/api/thanks?${apiParams}&cursor=${cursorRef.current}&limit=10`);
          const data = await res.json();
          setItems((prev) => [...prev, ...data.items]);
          cursorRef.current = data.nextCursor;
          setHasMore(data.nextCursor !== null);
        } catch (e) {
          console.error('Failed to load more thanks:', e);
        } finally {
          loadingRef.current = false;
          setLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [apiParams, hasMore]);

  if (items.length === 0) {
    return <p className="text-sm text-black/40 font-medium">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((thank) => (
        <ThankCard key={thank.id} thank={thank} />
      ))}
      {loading && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-black/40">Loading...</span>
        </div>
      )}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
};
