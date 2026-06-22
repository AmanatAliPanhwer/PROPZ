import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-neo-yellow border-4 border-black neo-shadow-lg p-8 max-w-md w-full flex flex-col gap-4">
        <h1 className="text-5xl font-black">404</h1>
        <h2 className="text-xl font-black uppercase">Page Not Found</h2>
        <p className="text-sm font-medium text-black/60">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="self-start px-5 py-2 bg-white border-4 border-black font-bold uppercase text-sm neo-shadow hover:neo-shadow-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
