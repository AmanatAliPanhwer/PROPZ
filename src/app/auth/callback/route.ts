import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

type CookieItem = { name: string; value: string; options?: Record<string, unknown> };

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const cookieJar: CookieItem[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll() as unknown as CookieItem[];
        },
        setAll(cookiesToSet: CookieItem[]) {
          cookiesToSet.forEach((c) => cookieJar.push(c));
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  const existing = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!existing) {
    await prisma.user.create({
      data: {
        authId: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        profilePicture: authUser.user_metadata?.avatar_url || null,
      },
    });
    const res = NextResponse.redirect(`${origin}/onboarding`);
    cookieJar.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
    return res;
  }

  const res = NextResponse.redirect(`${origin}/dashboard`);
  cookieJar.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
  return res;
}
