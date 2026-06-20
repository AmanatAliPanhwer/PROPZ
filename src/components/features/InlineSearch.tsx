'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchWorkers } from '@/lib/actions';

interface WorkerResult {
  id: string;
  name: string;
  profession: string | null;
  profilePicture: string | null;
}

export const InlineSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WorkerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchWorkers(query);
        setResults(data);
      } finally {
        setIsLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="p-2 border-2 border-black transition-all hover:bg-black/10"
        title="Search workers"
      >
        <FiSearch className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 border-4 border-black bg-white neo-shadow-lg z-50">
          <div className="flex items-center border-b-4 border-black">
            <FiSearch className="w-4 h-4 ml-3 text-black/40 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search workers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-3 text-sm font-medium focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="mr-2 text-black/40 hover:text-black">
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isLoading && (
              <p className="text-xs text-black/40 text-center py-4 font-medium">Searching...</p>
            )}
            {!isLoading && query && results.length === 0 && (
              <p className="text-xs text-black/40 text-center py-4 font-medium">No workers found</p>
            )}
            {!isLoading && results.map((w) => (
              <Link
                key={w.id}
                href={`/profile/${w.id}`}
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors border-b border-black/10 last:border-b-0"
              >
                {w.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.profilePicture} alt="" className="w-8 h-8 border-2 border-black object-cover flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center text-xs font-black uppercase flex-shrink-0">
                    {w.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold uppercase">{w.name}</p>
                  {w.profession && <p className="text-xs text-black/50 font-medium">{w.profession}</p>}
                </div>
              </Link>
            ))}
            {!query && !isLoading && (
              <p className="text-xs text-black/40 text-center py-4 font-medium">Type to search workers</p>
            )}
          </div>

          <Link
            href="/workers"
            onClick={close}
            className="block w-full text-center py-2 text-xs font-bold uppercase border-t-4 border-black bg-black/5 hover:bg-black/10 transition-colors"
          >
            View all workers →
          </Link>
        </div>
      )}
    </div>
  );
};
