'use client'

interface VerificationBadgeProps {
  level: string;
  size?: 'sm' | 'md';
}

const labels: Record<string, string> = {
  NONE: '',
  EMAIL: 'EMAIL VERIFIED',
  PHONE: 'PHONE VERIFIED',
  FULL: 'IDENTITY VERIFIED',
};

const colors: Record<string, string> = {
  NONE: '',
  EMAIL: 'bg-neo-blue',
  PHONE: 'bg-neo-yellow',
  FULL: 'bg-neo-green',
};

export const VerificationBadge = ({ level, size = 'sm' }: VerificationBadgeProps) => {
  if (level === 'NONE') return null;

  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span className={`${textSize} font-bold ${colors[level]} px-1.5 py-0.5 border-2 border-black inline-flex items-center gap-1`}>
      <span className="text-[10px]">✓</span>
      {labels[level]}
    </span>
  );
};
