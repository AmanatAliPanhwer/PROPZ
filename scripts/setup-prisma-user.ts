import { Pool } from 'pg';

const pool = new Pool({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.uveszybvktropbtnkwff',
  password: 'zx3i4KzXh16lxmJM',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

const sql = `
create user "prisma" with password 'prisma_pw_2026' bypassrls createdb;
grant "prisma" to "postgres";
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
`;

async function main() {
  try {
    await pool.query(sql);
    console.log('Prisma user created successfully!');
  } catch (e: any) {
    console.error('Error:', e.message);
  }
  await pool.end();
}

main();
