'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface Worker {
  id: string;
  name: string;
  profession: string | null;
  trustScore: number;
  _count: { receivedThanks: number };
}

interface WorkersSearchProps {
  workers: Worker[];
}

export const WorkersSearch = ({ workers }: WorkersSearchProps) => {
  const [query, setQuery] = useState('');

  const filtered = query
    ? workers.filter(
        (w) =>
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          (w.profession?.toLowerCase() || '').includes(query.toLowerCase())
      )
    : workers;

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search workers by name or profession..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-black/40 font-medium text-center py-8">
          No workers found matching &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((w) => (
            <Link key={w.id} href={`/profile/${w.id}`}>
              <Card className="hover:-translate-y-1 hover:-translate-x-1 hover:neo-shadow-lg transition-all cursor-pointer" padding="sm">
                <p className="font-bold uppercase">{w.name}</p>
                {w.profession && (
                  <p className="text-sm text-black/50 font-medium">{w.profession}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                  <span>Score: {w.trustScore}</span>
                  <span>Thanks: {w._count.receivedThanks}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
