import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const receiverId = searchParams.get('receiverId');
  const cursor = searchParams.get('cursor');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

  const where: Record<string, unknown> = {};
  if (receiverId) where.receiverId = receiverId;

  const items = await prisma.thank.findMany({
    where,
    include: {
      sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}
