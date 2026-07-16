/*
# Create training-banners storage bucket

## Overview
Creates a public storage bucket named `training-banners` to hold banner images
for training programs. Mirrors the pattern used by the existing `gallery` and
`testimonial-photos` buckets.

## Changes
- Creates the `training-banners` bucket in `storage.buckets` (public: true).
- Adds storage policies so:
  - Anyone (anon + authenticated) can view/download images.
  - Only authenticated users (admin) can upload, update, or delete images.

## Notes
1. `INSERT INTO storage.buckets … ON CONFLICT DO NOTHING` is idempotent —
   re-running this migration will not duplicate the bucket.
2. Policy names are unique per bucket, so `DROP POLICY IF EXISTS` is used first.
*/

-- Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-banners', 'training-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "Public read training-banners" ON storage.objects;
CREATE POLICY "Public read training-banners"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'training-banners');

-- Admin upload
DROP POLICY IF EXISTS "Admin upload training-banners" ON storage.objects;
CREATE POLICY "Admin upload training-banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'training-banners');

-- Admin update
DROP POLICY IF EXISTS "Admin update training-banners" ON storage.objects;
CREATE POLICY "Admin update training-banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'training-banners');

-- Admin delete
DROP POLICY IF EXISTS "Admin delete training-banners" ON storage.objects;
CREATE POLICY "Admin delete training-banners"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'training-banners');
