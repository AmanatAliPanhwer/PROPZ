import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const alice = await prisma.user.create({
    data: {
      name: 'Alice Kamau',
      profession: 'Plumber',
      bio: 'Master plumber with 10+ years of experience in residential and commercial plumbing.',
      trustScore: 85,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Ochieng',
      profession: 'Electrician',
      bio: 'Licensed electrician specializing in solar installations and home wiring.',
      trustScore: 72,
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: 'Carol Wanjiku',
      profession: 'Teacher',
      bio: 'Primary school teacher passionate about early childhood education.',
      trustScore: 95,
    },
  });

  const david = await prisma.user.create({
    data: {
      name: 'David Mwangi',
      profession: 'Chef',
      bio: 'Private chef specializing in East African fusion cuisine.',
      trustScore: 68,
    },
  });

  const grace = await prisma.user.create({
    data: {
      name: 'Grace Akinyi',
      profession: 'Cleaner',
      bio: 'Reliable home and office cleaning services.',
      trustScore: 90,
    },
  });

  const helper = await prisma.user.create({
    data: {
      name: 'Helper Kimani',
      profession: 'General Laborer',
      bio: 'Hardworking general laborer available for moving, repairs, and maintenance.',
      trustScore: 78,
    },
  });

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'reliable' } }),
    prisma.tag.create({ data: { name: 'hardworking' } }),
    prisma.tag.create({ data: { name: 'professional' } }),
    prisma.tag.create({ data: { name: 'on-time' } }),
    prisma.tag.create({ data: { name: 'kind' } }),
    prisma.tag.create({ data: { name: 'skilled' } }),
    prisma.tag.create({ data: { name: 'team-player' } }),
    prisma.tag.create({ data: { name: 'recommended' } }),
    prisma.tag.create({ data: { name: 'trustworthy' } }),
  ]);

  await prisma.thank.create({
    data: {
      senderId: bob.id,
      receiverId: alice.id,
      note: 'Alice fixed a burst pipe at our office on a Sunday. She came within an hour and did an amazing job. Truly a lifesaver!',
      isVerified: true,
      tags: { connect: [{ name: 'reliable' }, { name: 'professional' }, { name: 'on-time' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: alice.id,
      receiverId: bob.id,
      note: 'Bob rewired our entire workshop. Clean work, fair price, and very safety-conscious. Highly recommend.',
      isVerified: true,
      tags: { connect: [{ name: 'skilled' }, { name: 'professional' }, { name: 'recommended' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: david.id,
      receiverId: carol.id,
      note: 'Carol is an incredible teacher. My daughter has improved so much in math since joining her class. Thank you for your patience!',
      isVerified: true,
      tags: { connect: [{ name: 'kind' }, { name: 'professional' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: carol.id,
      receiverId: grace.id,
      note: 'Grace keeps our school spotless every single day. She works so hard and always with a smile. We appreciate you!',
      isVerified: false,
      tags: { connect: [{ name: 'hardworking' }, { name: 'kind' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: grace.id,
      receiverId: helper.id,
      note: 'Helper helped me move furniture last weekend. Strong, careful, and very efficient. Would work with him anytime.',
      isVerified: false,
      tags: { connect: [{ name: 'reliable' }, { name: 'hardworking' }, { name: 'team-player' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: bob.id,
      receiverId: david.id,
      note: 'David catered my birthday party and the food was absolutely amazing. Everyone kept asking who the chef was!',
      isVerified: true,
      tags: { connect: [{ name: 'skilled' }, { name: 'professional' }, { name: 'recommended' }] },
    },
  });

  await prisma.thank.create({
    data: {
      senderId: alice.id,
      receiverId: grace.id,
      note: 'Grace cleans our office building and it has never looked better. She is thorough, trustworthy, and gentle with our equipment.',
      isVerified: true,
      tags: { connect: [{ name: 'reliable' }, { name: 'trustworthy' }] },
    },
  });

  console.log('Seed data created successfully!');
  console.log(`Users: 6`);
  console.log(`Tags: ${tags.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
