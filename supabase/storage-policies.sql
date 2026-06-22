-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Sets up RLS policies for storage buckets

-- Bucket: thank-images
-- Public can view, authenticated users can upload, bucket owner/authenticated can delete own files

CREATE POLICY "thank_images_public_select"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'thank-images');

CREATE POLICY "thank_images_authenticated_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'thank-images');

CREATE POLICY "thank_images_authenticated_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'thank-images' AND (auth.role() = 'authenticated'));

-- Bucket: profile-pictures
-- Public can view, authenticated users can upload/overwrite their own

CREATE POLICY "profile_pictures_public_select"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "profile_pictures_authenticated_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "profile_pictures_authenticated_upsert"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-pictures')
  WITH CHECK (bucket_id = 'profile-pictures');

CREATE POLICY "profile_pictures_authenticated_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-pictures' AND (auth.role() = 'authenticated'));
