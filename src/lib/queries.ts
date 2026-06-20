import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/server';

function isValidUrl(url: string | undefined): boolean {
  if (!url) return false
  try { new URL(url); return true }
  catch { return false }
}

export async function getCurrentUser() {
  if (!isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) return null
  const supabase = await createServerSupabaseClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return null
  return prisma.user.findUnique({ where: { authId: authUser.id } })
}

export async function getThanksFeed(take?: number) {
  return prisma.thank.findMany({
    include: {
      sender: { select: { id: true, name: true, profession: true } },
      receiver: { select: { id: true, name: true, profession: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    ...(take ? { take } : {}),
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      sentThanks: {
        include: {
          sender: { select: { id: true, name: true, profession: true } },
          receiver: { select: { id: true, name: true, profession: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      receivedThanks: {
        include: {
          sender: { select: { id: true, name: true, profession: true } },
          receiver: { select: { id: true, name: true, profession: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getUserStats(id: string) {
  const [receivedCount, sentCount, verifiedCount, user] = await Promise.all([
    prisma.thank.count({ where: { receiverId: id } }),
    prisma.thank.count({ where: { senderId: id } }),
    prisma.thank.count({ where: { receiverId: id, isVerified: true } }),
    prisma.user.findUnique({
      where: { id },
      select: { id: true, trustScore: true, name: true, profession: true, bio: true, profilePicture: true, createdAt: true },
    }),
  ]);

  return { receivedCount, sentCount, verifiedCount, ...user };
}

export async function getWorkers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      profession: true,
      trustScore: true,
      _count: { select: { receivedThanks: true } },
    },
    orderBy: { trustScore: 'desc' },
  });
}

export async function getAllTags() {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } });
}
