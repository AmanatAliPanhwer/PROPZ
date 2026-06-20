'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/features/VerificationBadge';
import { submitVerificationRequest } from '@/lib/actions';

interface VerifyFormProps {
  currentLevel: string;
}

const verificationTypes = [
  { value: 'EMAIL', label: 'Email Verification', desc: 'Confirm your email address ownership', icon: '✉' },
  { value: 'PHONE', label: 'Phone Verification', desc: 'Verify your phone number', icon: '📱' },
  { value: 'ID', label: 'Identity Verification', desc: 'Upload a government-issued ID for full verification', icon: '🪪' },
];

export const VerifyForm = ({ currentLevel }: VerifyFormProps) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const levelOrder = ['NONE', 'EMAIL', 'PHONE', 'FULL'];
  const currentIdx = levelOrder.indexOf(currentLevel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      setError('Please select a verification type');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const form = new FormData();
      form.set('type', selectedType);
      await submitVerificationRequest(form);
      setSuccess('Verification request submitted successfully!');
      setSelectedType('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card padding="sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase">Current Level:</span>
          <VerificationBadge level={currentLevel} size="md" />
          {currentLevel === 'NONE' && (
            <span className="text-xs font-bold text-black/40">Not verified</span>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {verificationTypes.map((vt) => {
          const vtIdx = levelOrder.indexOf(vt.value);
          const disabled = vtIdx <= currentIdx;
          return (
            <button
              key={vt.value}
              type="button"
              disabled={disabled}
              onClick={() => { setSelectedType(vt.value); setError(''); }}
              className={`flex items-start gap-3 p-4 border-4 border-black text-left transition-all ${
                selectedType === vt.value
                  ? 'bg-neo-yellow neo-shadow-lg'
                  : disabled
                    ? 'bg-black/5 opacity-40 cursor-not-allowed'
                    : 'bg-white neo-shadow-sm hover:neo-shadow-lg'
              }`}
            >
              <span className="text-xl mt-0.5">{vt.icon}</span>
              <div>
                <p className="font-bold uppercase text-sm">{vt.label}</p>
                <p className="text-xs text-black/50 font-medium">{vt.desc}</p>
                {disabled && currentLevel !== 'NONE' && (
                  <p className="text-xs font-bold text-neo-green mt-1">✓ Completed</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm font-bold text-neo-pink">{error}</p>}
      {success && <p className="text-sm font-bold text-neo-green">{success}</p>}

      <button
        type="submit"
        disabled={submitting || !selectedType}
        className="self-start px-6 py-3 bg-neo-yellow border-4 border-black font-bold uppercase text-sm neo-shadow hover:neo-shadow-lg transition-all disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};
