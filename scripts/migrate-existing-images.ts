/**
 * One-time script: migrate existing images from public/uploads/thanks/
 * to Supabase Storage bucket 'thank-images'.
 *
 * Usage: tsx scripts/migrate-existing-images.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL env vars.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SOURCE_DIR = join(__dirname, '..', 'public', 'uploads', 'thanks');

async function main() {
  const files = readdirSync(SOURCE_DIR).filter((f) => f !== '.gitkeep');
  console.log(`Found ${files.length} files to migrate:\n`);

  for (const file of files) {
    const filePath = join(SOURCE_DIR, file);
    const buffer = readFileSync(filePath);

    console.log(`  Uploading ${file}...`);

    const { data, error } = await supabase.storage
      .from('thank-images')
      .upload(file, buffer, {
        contentType: undefined,
        upsert: true,
      });

    if (error) {
      console.error(`    FAILED: ${error.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('thank-images')
        .getPublicUrl(data.path);
      console.log(`    OK: ${publicUrl}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
