'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { InlineSearch } from '@/components/features/InlineSearch';

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

  const handleSignOut = async () => {
    setUser(null);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <header className="sticky top-0 z-50 bg-neo-yellow border-b-4 border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:opacity-80 transition-opacity">
          PROPZ
        </Link>
        <nav className="flex items-center gap-4">
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
                <Link href="/admin/verifications" className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70 text-neo-pink">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 border-2 border-black object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 border-2 border-black bg-white flex items-center justify-center text-xs font-black uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold uppercase">{user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-xs font-bold uppercase underline underline-offset-2 hover:text-black/70"
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
