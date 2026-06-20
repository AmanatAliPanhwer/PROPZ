'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { InlineSearch } from '@/components/features/InlineSearch';

interface HeaderProps {
  initialUser: { name: string; picture: string | null } | null;
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
              <Link href="/thank/new">
                <Button variant="primary" className="!py-2 !px-4 !text-sm">
                  + Thank
                </Button>
              </Link>
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
