import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/queries';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');
  if (currentUser.role !== 'ADMIN') redirect('/dashboard');

  const links = [
    { href: '/admin/verifications', label: 'Verifications' },
    { href: '/admin/moderation', label: 'Moderation' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase">Admin Dashboard</h1>
      </div>
      <nav className="flex gap-2 border-b-4 border-black pb-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 border-4 border-black font-bold uppercase text-sm bg-white neo-shadow-sm hover:neo-shadow-lg transition-all"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
