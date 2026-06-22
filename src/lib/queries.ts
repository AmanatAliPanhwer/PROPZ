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
      sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
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
          sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
          receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      receivedThanks: {
        include: {
          sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
          receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
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
      select: { id: true, trustScore: true, name: true, profession: true, bio: true, profilePicture: true, walletAddress: true, verificationLevel: true, createdAt: true },
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

export async function getVerificationRequests(status?: string) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  return prisma.verificationRequest.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, profession: true, email: true, verificationLevel: true } },
      reviewer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getReports(status?: string) {
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  return prisma.report.findMany({
    where,
    include: {
      thank: {
        include: {
          sender: { select: { id: true, name: true, profilePicture: true } },
          receiver: { select: { id: true, name: true, profilePicture: true } },
        },
      },
      reporter: { select: { id: true, name: true } },
      resolver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFlaggedThanks() {
  return prisma.thank.findMany({
    where: { isFlagged: true },
    include: {
      sender: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      receiver: { select: { id: true, name: true, profession: true, verificationLevel: true, profilePicture: true } },
      tags: true,
    },
    orderBy: { flaggedAt: 'desc' },
  });
}
