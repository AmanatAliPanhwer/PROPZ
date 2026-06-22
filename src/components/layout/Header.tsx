'use client'

import { useEffect, useState, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { InlineSearch } from '@/components/features/InlineSearch';
import { WalletButton } from '@/components/features/WalletButton';

interface HeaderProps {
  initialUser: { name: string; picture: string | null; role?: string } | null;
}

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) supabaseClient = createClient();
  return supabaseClient;
}

export const Header = ({ initialUser }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    if (initialUser) { setUser(initialUser); return; }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          name: (data.user.user_metadata?.name as string) || data.user.email?.split('@')[0] || 'User',
          picture: null,
        });
      } else {
        setUser(null);
      }
    });
  }, [initialUser, supabase.auth]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          const name = (data.user.user_metadata?.name as string) || data.user.email?.split('@')[0] || 'User';
          setUser((prev) => (prev?.picture ? prev : { name, picture: null }));
        } else {
          setUser(null);
        }
      });
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    startTransition(() => { setMenuOpen(false); });
  }, [pathname]);

  const handleSignOut = async () => {
    setUser(null);
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-neo-yellow border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="text-xl sm:text-2xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity">
          PROPZ
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthPage && user && (
            <div className="sm:hidden flex items-center gap-2">
              <Link
                href="/thank/new"
                className="w-9 h-9 border-4 border-black bg-neo-yellow neo-shadow hover:neo-shadow-lg transition-all flex items-center justify-center"
                aria-label="Send Thank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                  <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                  <path d="m21 3 1 11h-2" />
                  <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                  <path d="M3 4h8" />
                </svg>
              </Link>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 border-4 border-black bg-white neo-shadow flex items-center justify-center text-sm font-black"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? 'X' : '☰'}
              </button>
            </div>
          )}

          <nav className="items-center gap-4 hidden sm:flex">
            {!isAuthPage && user && (
              <>
                <InlineSearch />
                <Link
                  href="/thank/new"
                  className="w-9 h-9 border-4 border-black bg-neo-yellow neo-shadow hover:neo-shadow-lg transition-all flex items-center justify-center group"
                  aria-label="Send Thank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  >
                    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                    <path d="m21 3 1 11h-2" />
                    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                    <path d="M3 4h8" />
                  </svg>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin/verifications" className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70 text-neo-pink max-sm:hidden">
                    Admin
                  </Link>
                )}
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity max-sm:hidden">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={28}
                    height={28}
                    className="border-2 border-black object-cover"
                    unoptimized
                  />
                ) : (
                    <div className="w-7 h-7 border-2 border-black bg-white flex items-center justify-center text-xs font-black uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold uppercase">{user.name}</span>
                </Link>
                <Link href="/rewards" className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70 max-sm:hidden">
                  Rewards
                </Link>
                <span className="max-sm:hidden"><WalletButton /></span>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70 max-sm:hidden"
                >
                  Sign out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {menuOpen && !isAuthPage && user && (
        <div className="sm:hidden border-t-4 border-black bg-neo-yellow px-4 py-3 flex flex-col gap-3">
          <InlineSearch />
          <Link
            href="/thank/new"
            className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white font-bold uppercase text-xs neo-shadow-sm"
            onClick={() => setMenuOpen(false)}
          >
            Send Thank
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              href="/admin/verifications"
              className="text-xs font-bold uppercase underline underline-offset-2 text-neo-pink px-3 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white font-bold uppercase text-xs neo-shadow-sm"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/rewards"
            className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white font-bold uppercase text-xs neo-shadow-sm"
            onClick={() => setMenuOpen(false)}
          >
            Rewards
          </Link>
          <div className="px-3 py-1"><WalletButton /></div>
          <button
            onClick={handleSignOut}
            className="text-left text-xs font-bold uppercase underline underline-offset-2 px-3 py-1"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
};
