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