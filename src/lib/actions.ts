'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function getAuthUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');
  return authUser;
}

async function requireAdmin() {
  const authUser = await getAuthUser();
  const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!dbUser || dbUser.role !== 'ADMIN') throw new Error('Not authorized');
  return dbUser;
}

export async function createThank(formData: FormData) {
  const authUser = await getAuthUser();

  const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!dbUser) throw new Error('User not found');

  if (dbUser.isSuspended) {
    throw new Error('Your account has been suspended. You cannot send thanks.');
  }

  const senderId = dbUser.id;
  const receiverId = formData.get('receiverId') as string;
  const note = formData.get('note') as string;
  const tagNames = formData.getAll('tags') as string[];
  const imageUrlsRaw = formData.get('imageUrls') as string;
  const images: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  if (!receiverId || !note) {
    throw new Error('Missing required fields');
  }

  if (senderId === receiverId) {
    throw new Error('You cannot thank yourself');
  }

  // Rate limiting — max 10 thanks per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentThanks = await prisma.thank.count({
    where: { senderId, createdAt: { gte: oneHourAgo } },
  });
  if (recentThanks >= 10) {
    throw new Error('You have reached the maximum of 10 thanks per hour. Please wait before sending more.');
  }

  // Same-recipient cooldown — 1 hour between thanks to same person
  const recentToRecipient = await prisma.thank.findFirst({
    where: { senderId, receiverId, createdAt: { gte: oneHourAgo } },
    orderBy: { createdAt: 'desc' },
  });
  if (recentToRecipient) {
    throw new Error('You can only thank the same person once per hour. Please wait before sending another.');
  }

  // Fraud detection — rapid posting (less than 5 seconds since last thank)
  if (dbUser.lastThankAt) {
    const msSinceLast = Date.now() - dbUser.lastThankAt.getTime();
    if (msSinceLast < 5000) {
      throw new Error('You are sending thanks too quickly. Please slow down.');
    }
  }

  // Duplicate content detection — same note within 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicateThank = await prisma.thank.findFirst({
    where: { senderId, note, createdAt: { gte: oneDayAgo } },
  });
  if (duplicateThank) {
    throw new Error('You have already sent this exact thank you message recently. Please write something different.');
  }

  await prisma.thank.create({
    data: {
      senderId,
      receiverId,
      note,
      images: JSON.stringify(images),
      tags: {
        connectOrCreate: tagNames.filter(Boolean).map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  // Update lastThankAt for rate limiting
  await prisma.user.update({ where: { id: senderId }, data: { lastThankAt: new Date() } });

  // Update trust score after sending
  await recalculateTrustScore(senderId);
  await recalculateTrustScore(receiverId);

  revalidatePath('/');
  revalidatePath(`/profile/${receiverId}`);
  revalidatePath(`/profile/${senderId}`);
  revalidatePath('/dashboard');
  redirect(`/profile/${receiverId}`);
}

export async function updateProfile(data: {
  name: string
  profession: string
  bio: string
  profilePicture: string | null
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');

  const updateData: Record<string, unknown> = {};
  updateData.name = data.name;
  updateData.profession = data.profession;
  updateData.bio = data.bio;
  if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;

  const user = await prisma.user.update({
    where: { authId: authUser.id },
    data: updateData,
  });

  revalidatePath('/dashboard');
  return user;
}

export async function searchWorkers(query: string) {
  if (!query.trim()) return [];
  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { profession: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { id: true, name: true, profession: true, profilePicture: true },
    take: 20,
  });
}

// ── Verification Actions ──

const levelOrder = ['NONE', 'EMAIL', 'PHONE', 'FULL'];

function highestLevel(current: string, candidate: string): string {
  const curIdx = levelOrder.indexOf(current);
  const canIdx = levelOrder.indexOf(candidate);
  return canIdx > curIdx ? candidate : current;
}

export async function submitVerificationRequest(formData: FormData) {
  const authUser = await getAuthUser();
  const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!dbUser) throw new Error('User not found');

  const type = formData.get('type') as string;
  const documentUrl = formData.get('documentUrl') as string | null;

  if (!type || !['EMAIL', 'PHONE', 'ID'].includes(type)) {
    throw new Error('Invalid verification type');
  }

  // Check for existing approved request of this type
  const alreadyApproved = await prisma.verificationRequest.findFirst({
    where: { userId: dbUser.id, type, status: 'APPROVED' },
  });
  if (alreadyApproved) {
    throw new Error(`Your ${type} is already verified.`);
  }

  // Check for existing pending request — for EMAIL/PHONE, auto-approve it instead of blocking
  const existing = await prisma.verificationRequest.findFirst({
    where: { userId: dbUser.id, type, status: 'PENDING' },
  });

  // Auto-approve EMAIL and PHONE (no verification infrastructure needed)
  // ID verification requires admin review
  if (type === 'EMAIL' || type === 'PHONE') {
    const levelMap: Record<string, string> = { EMAIL: 'EMAIL', PHONE: 'PHONE' };
    const newLevel = highestLevel(dbUser.verificationLevel, levelMap[type]);

    if (existing) {
      await prisma.verificationRequest.update({
        where: { id: existing.id },
        data: { status: 'APPROVED', reviewedAt: new Date(), notes: 'Auto-approved (retroactive)' },
      });
    } else {
      await prisma.verificationRequest.create({
        data: {
          userId: dbUser.id,
          type,
          status: 'APPROVED',
          reviewedAt: new Date(),
          notes: 'Auto-approved',
        },
      });
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { verificationLevel: newLevel },
    });

    await recalculateTrustScore(dbUser.id);
  } else {
    if (existing) {
      throw new Error(`You already have a pending ${type} verification request.`);
    }
    await prisma.verificationRequest.create({
      data: {
        userId: dbUser.id,
        type,
        documentUrl: documentUrl || null,
      },
    });
  }

  revalidatePath('/verify');
  revalidatePath('/dashboard');
}

export async function approveVerification(requestId: string) {
  const admin = await requireAdmin();

  const request = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error('Verification request not found');
  if (request.status !== 'PENDING') throw new Error('Request already resolved');

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { status: 'APPROVED', reviewedById: admin.id, reviewedAt: new Date() },
  });

  // Update user verification level (highest wins)
  const levelMap: Record<string, string> = { EMAIL: 'EMAIL', PHONE: 'PHONE', ID: 'FULL' };
  const candidateLevel = levelMap[request.type] || 'NONE';
  const user = await prisma.user.findUnique({ where: { id: request.userId }, select: { verificationLevel: true } });
  const currentLevel = user?.verificationLevel || 'NONE';
  const newLevel = highestLevel(currentLevel, candidateLevel);

  await prisma.user.update({
    where: { id: request.userId },
    data: { verificationLevel: newLevel },
  });

  await recalculateTrustScore(request.userId);

  revalidatePath('/admin/verifications');
  revalidatePath(`/profile/${request.userId}`);
  revalidatePath('/dashboard');
}

export async function rejectVerification(requestId: string, notes: string) {
  const admin = await requireAdmin();

  const request = await prisma.verificationRequest.findUnique({ where: { id: requestId } });
  if (!request) throw new Error('Verification request not found');
  if (request.status !== 'PENDING') throw new Error('Request already resolved');

  await prisma.verificationRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED', notes, reviewedById: admin.id, reviewedAt: new Date() },
  });

  revalidatePath('/admin/verifications');
}

// ── Moderation Actions ──

export async function reportThank(formData: FormData) {
  const authUser = await getAuthUser();
  const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!dbUser) throw new Error('User not found');

  const thankId = formData.get('thankId') as string;
  const reason = formData.get('reason') as string;
  const description = formData.get('description') as string | null;

  if (!thankId || !reason) {
    throw new Error('Missing required fields');
  }

  const validReasons = ['SPAM', 'INAPPROPRIATE', 'HARASSMENT', 'FAKE', 'OTHER'];
  if (!validReasons.includes(reason)) {
    throw new Error('Invalid report reason');
  }

  // Check for duplicate report
  const existing = await prisma.report.findFirst({
    where: { thankId, reporterId: dbUser.id, status: 'PENDING' },
  });
  if (existing) {
    throw new Error('You have already reported this thank.');
  }

  await prisma.report.create({
    data: {
      thankId,
      reporterId: dbUser.id,
      reason,
      description: description || null,
    },
  });

  revalidatePath('/');
  revalidatePath(`/profile/${dbUser.id}`);
}

export async function flagThank(thankId: string, reason: string) {
  await requireAdmin();

  await prisma.thank.update({
    where: { id: thankId },
    data: { isFlagged: true, flaggedAt: new Date(), flagReason: reason },
  });

  revalidatePath('/admin/moderation');
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function unflagThank(thankId: string) {
  await requireAdmin();

  await prisma.thank.update({
    where: { id: thankId },
    data: { isFlagged: false, flaggedAt: null, flagReason: null },
  });

  revalidatePath('/admin/moderation');
  revalidatePath('/');
  revalidatePath('/dashboard');
}

export async function removeThank(thankId: string) {
  await requireAdmin();

  const thank = await prisma.thank.findUnique({ where: { id: thankId } });
  if (!thank) throw new Error('Thank not found');

  await prisma.thank.delete({ where: { id: thankId } });

  revalidatePath('/admin/moderation');
  revalidatePath('/');
  revalidatePath(`/profile/${thank.receiverId}`);
  revalidatePath(`/profile/${thank.senderId}`);
  revalidatePath('/dashboard');
}

export async function suspendUser(userId: string, reason: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: true, suspendedAt: new Date(), suspensionReason: reason },
  });

  revalidatePath('/admin/moderation');
  revalidatePath('/dashboard');
}

export async function unsuspendUser(userId: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: false, suspendedAt: null, suspensionReason: null },
  });

  revalidatePath('/admin/moderation');
  revalidatePath('/dashboard');
}

// ── Trust Score ──

export async function recalculateTrustScore(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      receivedThanks: { where: { isVerified: true } },
      reports: true,
    },
  });
  if (!user) return;

  const accountAgeDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const accountScore = Math.min(accountAgeDays, 30);

  const verificationScores: Record<string, number> = {
    NONE: 0, EMAIL: 10, PHONE: 20, FULL: 30,
  };
  const verificationScore = verificationScores[user.verificationLevel] || 0;

  const verifiedThanksScore = Math.min(user.receivedThanks.length * 5, 25);

  const reportPenalty = Math.min(user.reports.length * 10, 20);

  const score = Math.max(0, Math.min(100, accountScore + verificationScore + verifiedThanksScore - reportPenalty));

  await prisma.user.update({ where: { id: userId }, data: { trustScore: score } });
}
