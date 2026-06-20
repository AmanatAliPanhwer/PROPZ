'use client'

import { useActionState, useState, useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createThank } from '@/lib/actions';
import { FiCamera } from 'react-icons/fi';

interface ThankFormProps {
  senderId: string;
  workers: { id: string; name: string; profession: string | null }[];
  tags: { id: string; name: string }[];
  preselectedReceiverId?: string;
}

interface UploadItem {
  id: string;
  preview: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  error?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;

export const ThankForm = ({ senderId, workers, tags, preselectedReceiverId }: ThankFormProps) => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const otherWorkers = workers.filter((w) => w.id !== senderId);

  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set('senderId', senderId);
      formData.set('imageUrls', JSON.stringify(uploads.filter((u) => u.status === 'done').map((u) => u.url)));
      try {
        await createThank(formData);
      } catch (e) {
        return { error: e instanceof Error ? e.message : 'Something went wrong' };
      }
      return { error: null };
    },
    { error: null }
  );

  const uploadFile = useCallback(async (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const preview = URL.createObjectURL(file);

    setUploads((prev) => [...prev, { id, preview, status: 'uploading' }]);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'done', url: data.url } : u))
      );
    } catch (e) {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: 'error', error: e instanceof Error ? e.message : 'Upload failed' }
            : u
        )
      );
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList) => {
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_SIZE) continue;
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = () => {
    const files = fileRef.current?.files;
    if (files && files.length > 0) handleFiles(files);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleCameraCapture = () => {
    const file = cameraRef.current?.files?.[0];
    if (file) uploadFile(file);
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => {
      const item = prev.find((u) => u.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((u) => u.id !== id);
    });
  };

  const retryUpload = (id: string) => {
    const item = uploads.find((u) => u.id === id);
    if (!item) return;
    setUploads((prev) => prev.filter((u) => u.id !== id));
    const urlParts = item.preview.split('/');
    const filename = urlParts[urlParts.length - 1];
    fetch(item.preview)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: blob.type });
        uploadFile(file);
      });
  };

  return (
    <Card>
      <h2 className="text-xl font-black uppercase mb-4">Send a Thank You</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="receiverId" className="font-bold text-sm uppercase tracking-wide">
            To (Worker)
          </label>
          <select
            id="receiverId"
            name="receiverId"
            required
            defaultValue={preselectedReceiverId === senderId ? '' : preselectedReceiverId || ''}
            className="w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all appearance-none"
          >
            <option value="">Select a worker...</option>
            {otherWorkers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}{w.profession ? ` — ${w.profession}` : ''}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Thank You Note"
          name="note"
          placeholder="Write your appreciation..."
          rows={4}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm uppercase tracking-wide">Photos (optional)</label>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileRef.current?.click()}
            className={`border-4 border-black neo-shadow-sm p-8 text-center cursor-pointer transition-all ${
              dragOver ? 'bg-neo-yellow scale-[1.02]' : 'bg-card hover:bg-neo-yellow/50'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="font-bold text-sm uppercase">
              {dragOver ? 'Drop images here' : 'Drop images here or click to browse'}
            </p>
            <p className="text-xs text-black/50 mt-1">JPG, PNG, WebP, GIF — max 5MB each</p>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
              className="mt-3 px-4 py-1.5 border-2 border-black bg-white text-black font-bold text-xs uppercase neo-shadow-sm hover:bg-neo-yellow transition-all flex items-center gap-1.5 mx-auto"
            >
              <FiCamera className="text-sm" />
              Camera
            </button>
          </div>

          {/* Upload previews */}
          {uploads.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {uploads.map((u) => (
                <div key={u.id} className="relative group border-4 border-black neo-shadow-sm bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.preview}
                    alt="Upload preview"
                    className="w-full h-24 object-cover"
                  />

                  {/* Status overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    {u.status === 'uploading' && (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {u.status === 'done' && (
                      <span className="text-white font-black text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">✓</span>
                    )}
                    {u.status === 'error' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); retryUpload(u.id); }}
                        className="w-6 h-6 bg-neo-pink border-2 border-black font-bold text-xs flex items-center justify-center neo-shadow-sm hover:scale-110 transition-transform"
                        title={u.error || 'Retry'}
                      >
                        ↻
                      </button>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeUpload(u.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-black border-2 border-white text-white font-bold text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-sm uppercase tracking-wide">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-card text-sm font-bold cursor-pointer hover:bg-neo-yellow transition-colors"
              >
                <input type="checkbox" name="tags" value={tag.name} className="accent-black" />
                #{tag.name}
              </label>
            ))}
          </div>
        </div>

        {state?.error && (
          <p className="text-sm font-bold text-neo-pink">{state.error}</p>
        )}

        <Button type="submit" variant="primary" disabled={pending} fullWidth>
          {pending ? 'Sending...' : 'Send Thank You'}
        </Button>
      </form>
    </Card>
  );
};
