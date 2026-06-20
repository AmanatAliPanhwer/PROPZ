import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  : null;

const workers = [
  { name: 'Alice Kamau', email: 'alice@propz.test', profession: 'Plumber', bio: 'Master plumber with 10+ years of experience in residential and commercial plumbing.', trustScore: 85 },
  { name: 'Bob Ochieng', email: 'bob@propz.test', profession: 'Electrician', bio: 'Licensed electrician specializing in solar installations and home wiring.', trustScore: 72 },
  { name: 'Carol Wanjiku', email: 'carol@propz.test', profession: 'Teacher', bio: 'Primary school teacher passionate about early childhood education.', trustScore: 95 },
  { name: 'David Mwangi', email: 'david@propz.test', profession: 'Chef', bio: 'Private chef specializing in East African fusion cuisine.', trustScore: 68 },
  { name: 'Grace Akinyi', email: 'grace@propz.test', profession: 'Cleaner', bio: 'Reliable home and office cleaning services.', trustScore: 90 },
  { name: 'Helper Kimani', email: 'helper@propz.test', profession: 'General Laborer', bio: 'Hardworking general laborer available for moving, repairs, and maintenance.', trustScore: 78 },
];

async function createAuthUser(email: string, name: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: 'test123456',
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) {
    console.warn(`  Warning: Could not create auth user ${email}: ${error.message}`);
    return null;
  }
  return data.user;
}

async function main() {
  console.log('Seeding...');

  // Create auth users + DB users (idempotent — upsert by email)
  const createdUsers: { id: string; name: string }[] = [];

  for (const w of workers) {
    console.log(`  Creating user: ${w.name}`);
    let authUser = await createAuthUser(w.email, w.name);

    if (!authUser) {
      // Auth user already exists — fetch it
      const { data: existing } = await supabaseAdmin!.auth.admin.listUsers();
      const found = existing?.users.find((u) => u.email === w.email);
      if (found) {
        authUser = found;
        console.log(`  Found existing auth user for ${w.email}`);
      } else {
        console.warn(`  Skipping DB record for ${w.name} (no auth user)`);
        continue;
      }
    }

    const user = await prisma.user.upsert({
      where: { authId: authUser.id },
      update: {
        name: w.name,
        email: w.email,
        profession: w.profession,
        bio: w.bio,
        trustScore: w.trustScore,
      },
      create: {
        authId: authUser.id,
        email: w.email,
        name: w.name,
        profession: w.profession,
        bio: w.bio,
        trustScore: w.trustScore,
      },
    });
    createdUsers.push({ id: user.id, name: user.name });
  }

  if (createdUsers.length < 2) {
    console.log('Need at least 2 users to create Thanks. Skipping tags and thanks.');
    await prisma.$disconnect();
    return;
  }

  // Create tags (idempotent)
  const tagNames = ['reliable', 'hardworking', 'professional', 'on-time', 'kind', 'skilled', 'team-player', 'recommended', 'trustworthy'];
  const { count: tagCount } = await prisma.tag.createMany({
    data: tagNames.map((name) => ({ name })),
    skipDuplicates: true,
  });
  console.log(`  Created ${tagCount} tags`);

  // Helper to find user by name
  const findUser = (name: string) => createdUsers.find((u) => u.name.startsWith(name))!;

  // Create thanks (idempotent — skip if same note exists for same receiver)
  const thanksData = [
    { sender: 'Bob', receiver: 'Alice', note: 'Alice fixed a burst pipe at our office on a Sunday. She came within an hour and did an amazing job. Truly a lifesaver!', verified: true, tags: ['reliable', 'professional', 'on-time'] },
    { sender: 'Alice', receiver: 'Bob', note: 'Bob rewired our entire workshop. Clean work, fair price, and very safety-conscious. Highly recommend.', verified: true, tags: ['skilled', 'professional', 'recommended'] },
    { sender: 'David', receiver: 'Carol', note: 'Carol is an incredible teacher. My daughter has improved so much in math since joining her class. Thank you for your patience!', verified: true, tags: ['kind', 'professional'] },
    { sender: 'Carol', receiver: 'Grace', note: 'Grace keeps our school spotless every single day. She works so hard and always with a smile. We appreciate you!', verified: false, tags: ['hardworking', 'kind'] },
    { sender: 'Grace', receiver: 'Helper', note: 'Helper helped me move furniture last weekend. Strong, careful, and very efficient. Would work with him anytime.', verified: false, tags: ['reliable', 'hardworking', 'team-player'] },
    { sender: 'Bob', receiver: 'David', note: 'David catered my birthday party and the food was absolutely amazing. Everyone kept asking who the chef was!', verified: true, tags: ['skilled', 'professional', 'recommended'] },
    { sender: 'Alice', receiver: 'Grace', note: 'Grace cleans our office building and it has never looked better. She is thorough, trustworthy, and gentle with our equipment.', verified: true, tags: ['reliable', 'trustworthy'] },
  ];

  let createdThanks = 0;
  for (const t of thanksData) {
    const existingThank = await prisma.thank.findFirst({
      where: { note: t.note, receiverId: findUser(t.receiver).id },
    });
    if (existingThank) continue;
    await prisma.thank.create({
      data: {
        senderId: findUser(t.sender).id,
        receiverId: findUser(t.receiver).id,
        note: t.note,
        isVerified: t.verified,
        tags: { connect: t.tags.map((name) => ({ name })) },
      },
    });
    createdThanks++;
  }
  console.log(`  Created ${createdThanks} thanks`);

  console.log('Seed complete!');
  console.log(`  Test accounts (password: test123456):`);
  for (const w of workers) {
    console.log(`    ${w.email} — ${w.name}`);
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
