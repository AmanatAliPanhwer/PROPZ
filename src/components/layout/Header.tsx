'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Feed' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/workers', label: 'Workers' },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-neo-yellow border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity">
          PROPZ
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-bold uppercase text-sm transition-all ${
                  isActive
                    ? 'bg-black/10 border-b-2 border-black pointer-events-none'
                    : 'hover:underline underline-offset-4'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link href="/thank/new">
            <Button variant="primary" className="!py-2 !px-4 !text-sm">
              + Thank
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
