'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ImageViewer } from './ImageViewer';

interface ThankCardProps {
  thank: {
    id: string;
    note: string;
    images: string;
    isVerified: boolean;
    createdAt: string | Date;
    sender: { id: string; name: string; profession: string | null };
    receiver: { id: string; name: string; profession: string | null };
    tags: { id: string; name: string }[];
  };
}

export const ThankCard = ({ thank }: ThankCardProps) => {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(thank.createdAt));

  let imageUrls: string[] = [];
  try { imageUrls = JSON.parse(thank.images); } catch { /* ignore */ }

  return (
    <>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link href={`/profile/${thank.sender.id}`} className="font-bold uppercase hover:underline">
              {thank.sender.name}
            </Link>
            <span className="text-black/40">→</span>
            <Link href={`/profile/${thank.receiver.id}`} className="font-bold uppercase hover:underline">
              {thank.receiver.name}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {thank.isVerified && (
              <span className="text-xs font-bold bg-neo-green px-2 py-0.5 border-2 border-black">
                VERIFIED
              </span>
            )}
            <span className="text-xs font-medium text-black/50">{formattedDate}</span>
          </div>
        </div>

        <p className="text-base leading-relaxed">{thank.note}</p>

        {imageUrls.length > 0 && (
          <div className={
            imageUrls.length === 1
              ? 'mt-1'
              : 'grid grid-cols-2 gap-2 mt-1'
          }>
            {imageUrls.map((url, i) => (
              <button
                key={url}
                onClick={() => setLightbox({ images: imageUrls, index: i })}
                className={`relative group border-4 border-black neo-shadow-sm hover:neo-shadow-lg transition-all text-left ${
                  imageUrls.length === 1 ? 'w-full' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Thank photo ${i + 1}`}
                  className={
                    imageUrls.length === 1
                      ? 'w-full max-h-64 object-contain'
                      : 'w-full max-h-48 object-contain'
                  }
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                    ⊕
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {thank.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {thank.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs font-bold uppercase bg-neo-blue px-2 py-0.5 border-2 border-black"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </Card>

      {lightbox && (
        <ImageViewer
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
};
