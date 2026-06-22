'use client';

interface ErrorCardProps {
  title?: string;
  message?: string;
  reset?: () => void;
}

export const ErrorCard = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  reset,
}: ErrorCardProps) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="bg-neo-yellow border-4 border-black neo-shadow-lg p-8 max-w-md w-full flex flex-col gap-4">
      <h2 className="text-2xl font-black uppercase">{title}</h2>
      <p className="text-sm font-medium text-black/60">{message}</p>
      {reset && (
        <button
          onClick={reset}
          className="self-start px-5 py-2 bg-white border-4 border-black font-bold uppercase text-sm neo-shadow hover:neo-shadow-lg transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);
