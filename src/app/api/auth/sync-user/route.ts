import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`sync-user:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { authId, email, name } = await request.json();

    // Verify the caller owns this authId
    if (authId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.create({
      data: { authId, email, name },
    });

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`sync-user-patch:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { authId, name, profession, bio, profilePicture, walletAddress } = await request.json();

    if (authId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (profession !== undefined) data.profession = profession;
    if (bio !== undefined) data.bio = bio;
    if (profilePicture !== undefined) data.profilePicture = profilePicture;
    if (walletAddress !== undefined) data.walletAddress = walletAddress;

    const user = await prisma.user.update({
      where: { authId },
      data,
    });

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}
