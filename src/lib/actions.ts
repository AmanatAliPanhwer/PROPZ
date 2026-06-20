'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function createThank(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');

  const dbUser = await prisma.user.findUnique({ where: { authId: authUser.id } });
  if (!dbUser) throw new Error('User not found');

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
