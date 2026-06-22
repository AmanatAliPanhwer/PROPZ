'use client'

import { useEffect, useState, useCallback } from 'react';

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewer = ({ images, initialIndex, onClose }: ImageViewerProps) => {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setZoomed(false);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoomed(false);
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowLeft': goPrev(); break;
        case 'ArrowRight': goNext(); break;
      }
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, goPrev, goNext]);

  const current = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <span className="text-white font-bold text-sm uppercase">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={current}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-neo-blue border-2 border-white text-black font-bold text-xs uppercase neo-shadow-sm hover:opacity-90 transition-opacity"
          >
            Download
          </a>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-neo-pink border-2 border-white text-black font-bold text-sm flex items-center justify-center neo-shadow-sm hover:scale-110 transition-transform"
            aria-label="Close image viewer"
          >
            X
          </button>
        </div>
      </div>

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-neo-yellow border-4 border-black text-black font-black text-xl flex items-center justify-center neo-shadow hover:neo-shadow-lg hover:-translate-x-0.5 transition-all z-10"
          aria-label="Previous image"
        >
          ←
        </button>
      )}

      {/* Image */}
      <div
        className={`w-full h-full flex items-center justify-center select-none ${zoomed ? 'overflow-auto cursor-zoom-out p-4' : 'cursor-zoom-in p-4 sm:p-8'}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) return;
          setZoomed((z) => !z);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={`Photo ${index + 1}`}
          className={zoomed
            ? 'max-w-none max-h-none border-4 border-white'
            : 'max-h-full max-w-full object-contain border-4 border-white neo-shadow-lg'
          }
          draggable={false}
        />
      </div>

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-neo-yellow border-4 border-black text-black font-black text-xl flex items-center justify-center neo-shadow hover:neo-shadow-lg hover:translate-x-0.5 transition-all z-10"
          aria-label="Next image"
        >
          →
        </button>
      )}

      {/* Bottom indicator dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setZoomed(false); }}
              className={`w-3 h-3 border-2 border-white transition-all ${
                i === index ? 'bg-neo-yellow scale-125' : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
