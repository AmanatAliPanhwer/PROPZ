'use client'

import { useState } from 'react';
import { reportThank } from '@/lib/actions';

interface ReportModalProps {
  thankId: string;
  onClose: () => void;
}

const reasons = [
  { value: 'SPAM', label: 'Spam' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'FAKE', label: 'Fake appreciation' },
  { value: 'OTHER', label: 'Other' },
];

export const ReportModal = ({ thankId, onClose }: ReportModalProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const form = new FormData();
      form.set('thankId', thankId);
      form.set('reason', reason);
      if (description.trim()) form.set('description', description.trim());
      await reportThank(form);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-card border-4 border-black neo-shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black uppercase">Report Submitted</h3>
            <p className="text-sm">Thank you. Our moderation team will review this report.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neo-yellow border-4 border-black font-bold text-sm neo-shadow hover:neo-shadow-lg transition-all self-start"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="text-lg font-black uppercase">Report Thank</h3>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm uppercase tracking-wide">Reason</label>
              <select
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(''); }}
                className="w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all"
              >
                <option value="">Select a reason...</option>
                {reasons.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm uppercase tracking-wide">Additional details (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black bg-white text-black font-medium neo-shadow-sm focus:outline-none focus:neo-shadow-lg transition-all resize-none h-24"
                placeholder="Describe the issue..."
              />
            </div>

            {error && <p className="text-sm font-bold text-neo-pink">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border-4 border-black font-bold text-sm neo-shadow hover:neo-shadow-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-neo-pink border-4 border-black font-bold text-sm neo-shadow hover:neo-shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
