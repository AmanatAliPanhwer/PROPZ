'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ImageViewer } from './ImageViewer';
import { VerificationBadge } from './VerificationBadge';
import { ReportModal } from './ReportModal';

interface ThankCardProps {
  thank: {
    id: string;
    note: string;
    images: string;
    isVerified: boolean;
    isFlagged?: boolean;
    createdAt: string | Date;
    sender: { id: string; name: string; profession: string | null; verificationLevel?: string; profilePicture?: string | null };
    receiver: { id: string; name: string; profession: string | null; verificationLevel?: string; profilePicture?: string | null };
    tags: { id: string; name: string }[];
  };
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className="w-11 h-11 border-2 border-black object-cover neo-shadow-sm flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-11 h-11 border-2 border-black bg-white flex items-center justify-center text-sm font-black uppercase flex-shrink-0">
      {name.charAt(0)}
    </div>
  );
}

export const ThankCard = ({ thank }: ThankCardProps) => {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(thank.createdAt));

  let imageUrls: string[] = [];
  try { imageUrls = JSON.parse(thank.images); } catch { /* ignore */ }

  return (
    <>
      <Card className={`flex flex-col gap-0 ${thank.isFlagged ? 'opacity-60' : ''}`}>
        {/* Top bar: badges + date + menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {thank.isVerified && (
              <span className="text-[10px] font-bold bg-neo-green px-2 py-0.5 border-2 border-black tracking-wide">
                VERIFIED
              </span>
            )}
            {thank.isFlagged && (
              <span className="text-[10px] font-bold bg-neo-pink px-2 py-0.5 border-2 border-black tracking-wide">
                FLAGGED
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-black/50">{formattedDate}</span>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-xs font-bold px-2 py-1 border-2 border-black bg-white hover:bg-black/5 transition-colors leading-none"
              >
                ⋯
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 z-40 bg-card border-4 border-black neo-shadow-sm min-w-36">
                  <button
                    onClick={() => { setShowMenu(false); setShowReport(true); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold uppercase hover:bg-neo-pink/30 transition-colors"
                  >
                    🚩 Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sender */}
        <div className="flex items-center gap-3 pb-3 border-b-2 border-black/10">
          <Link href={`/profile/${thank.sender.id}`} className="flex items-center gap-3 group">
            <Avatar src={thank.sender.profilePicture} name={thank.sender.name} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase text-sm group-hover:underline">{thank.sender.name}</span>
                <VerificationBadge level={thank.sender.verificationLevel || 'NONE'} size="sm" />
              </div>
              {thank.sender.profession && (
                <p className="text-xs font-medium text-black/50">{thank.sender.profession}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Note */}
        <div className="py-4">
          <p className="text-base leading-relaxed italic">"{thank.note}"</p>
        </div>

        {/* Receiver */}
        <div className="flex items-center gap-3 pt-3 border-t-2 border-black/10">
          <Link href={`/profile/${thank.receiver.id}`} className="flex items-center gap-3 group flex-1">
            <Avatar src={thank.receiver.profilePicture} name={thank.receiver.name} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-black/40 tracking-wide">To</span>
                <span className="font-bold uppercase text-sm group-hover:underline">{thank.receiver.name}</span>
                <VerificationBadge level={thank.receiver.verificationLevel || 'NONE'} size="sm" />
              </div>
              {thank.receiver.profession && (
                <p className="text-xs font-medium text-black/50">{thank.receiver.profession}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Tags + Images row */}
        {thank.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t-2 border-black/10">
            {thank.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] font-bold uppercase bg-neo-blue px-2 py-0.5 border-2 border-black tracking-wide"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className={`${thank.tags.length > 0 ? 'mt-3 pt-3 border-t-2 border-black/10' : 'mt-3'} ${
            imageUrls.length === 1 ? '' : 'grid grid-cols-2 gap-2'
          }`}>
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
      </Card>

      {lightbox && (
        <ImageViewer
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
      {showReport && (
        <ReportModal
          thankId={thank.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
};
