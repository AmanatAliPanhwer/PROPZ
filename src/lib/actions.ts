'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createThank(formData: FormData) {
  const senderId = formData.get('senderId') as string;
  const receiverId = formData.get('receiverId') as string;
  const note = formData.get('note') as string;
  const tagNames = formData.getAll('tags') as string[];

  if (!senderId || !receiverId || !note) {
    throw new Error('Missing required fields');
  }

  await prisma.thank.create({
    data: {
      senderId,
      receiverId,
      note,
      images: '[]',
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

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const profession = formData.get('profession') as string;
  const bio = formData.get('bio') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  const user = await prisma.user.create({
    data: { name, profession: profession || null, bio: bio || null },
  });

  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect(`/profile/${user.id}`);
}
