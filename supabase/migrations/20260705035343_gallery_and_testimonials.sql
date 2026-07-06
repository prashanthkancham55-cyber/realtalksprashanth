/*
# Gallery Images and Testimonials Tables

## Overview
Creates two content-managed tables for the RealTalks_Prashanth website.
Gallery images and testimonials are managed via an Admin Dashboard and
publicly readable by all visitors (no sign-in required for viewing).

## New Tables

### gallery_images
Stores training/event photos displayed in the public Gallery section.
- `id` (uuid, PK) — auto-generated unique identifier
- `image_url` (text, NOT NULL) — public URL of the uploaded image
- `alt_text` (text, default 'Training Image') — accessibility description
- `display_order` (int, default 0) — controls sort order in gallery
- `created_at` (timestamptz) — auto-set on insert

### testimonials
Stores client testimonials displayed in the Testimonials section.
- `id` (uuid, PK) — auto-generated unique identifier
- `name` (text, NOT NULL) — client's full name
- `designation` (text, default '') — job title/designation
- `company` (text, default '') — employer/company name
- `photo_url` (text, default '') — URL of client headshot
- `review` (text, NOT NULL) — testimonial text
- `rating` (int, default 5) — star rating 1-5 (enforced by CHECK)
- `created_at` (timestamptz) — auto-set on insert

## Security (RLS)

Both tables enable Row Level Security with a split policy:
- SELECT: open to `anon` + `authenticated` so public visitors can read content
- INSERT / UPDATE / DELETE: restricted to `authenticated` (admin only)

This means the public website reads gallery images and testimonials freely,
but only a signed-in admin can create, modify, or remove them.

## Storage Buckets
Creates two public Supabase Storage buckets:
- `gallery` — for gallery image file uploads
- `testimonial-photos` — for client headshot uploads

Storage objects follow the same pattern: public read, admin-only write.
*/

-- ============================================================
-- GALLERY IMAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT 'Training Image',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_images" ON gallery_images;
CREATE POLICY "public_read_gallery_images" ON gallery_images
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery_images" ON gallery_images;
CREATE POLICY "admin_insert_gallery_images" ON gallery_images
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_gallery_images" ON gallery_images;
CREATE POLICY "admin_update_gallery_images" ON gallery_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_gallery_images" ON gallery_images;
CREATE POLICY "admin_delete_gallery_images" ON gallery_images
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- TESTIMONIALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  review text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_testimonials" ON testimonials;
CREATE POLICY "admin_insert_testimonials" ON testimonials
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-photos',
  'testimonial-photos',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for gallery bucket
DROP POLICY IF EXISTS "gallery_public_read" ON storage.objects;
CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "gallery_admin_insert" ON storage.objects;
CREATE POLICY "gallery_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "gallery_admin_update" ON storage.objects;
CREATE POLICY "gallery_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "gallery_admin_delete" ON storage.objects;
CREATE POLICY "gallery_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');

-- Storage RLS for testimonial-photos bucket
DROP POLICY IF EXISTS "testimonial_photos_public_read" ON storage.objects;
CREATE POLICY "testimonial_photos_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'testimonial-photos');

DROP POLICY IF EXISTS "testimonial_photos_admin_insert" ON storage.objects;
CREATE POLICY "testimonial_photos_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'testimonial-photos');

DROP POLICY IF EXISTS "testimonial_photos_admin_update" ON storage.objects;
CREATE POLICY "testimonial_photos_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'testimonial-photos');

DROP POLICY IF EXISTS "testimonial_photos_admin_delete" ON storage.objects;
CREATE POLICY "testimonial_photos_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'testimonial-photos');
