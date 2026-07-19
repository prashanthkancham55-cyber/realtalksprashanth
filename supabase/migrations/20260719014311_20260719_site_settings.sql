/*
# Website Settings Module

1. New Table: site_settings
   - Single-row design: one row (id = 1) holds all website configuration
   - Stored as JSONB columns grouped by section for clean retrieval
   - Sections: general, homepage, founder, contact, social, branding, seo, analytics, email, controls, legal, footer
   - created_at, updated_at timestamps

2. Storage
   - Public bucket 'site-assets' for logo, favicon, founder image, OG image uploads

3. Security
   - RLS enabled
   - Public (anon + authenticated) SELECT — settings are read by the public site
   - Only authenticated users can UPDATE (admin only)
   - Single row enforced via id = 1 with DEFAULT
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id          integer   PRIMARY KEY DEFAULT 1,
  general     jsonb     NOT NULL DEFAULT '{}'::jsonb,
  homepage    jsonb     NOT NULL DEFAULT '{}'::jsonb,
  founder     jsonb     NOT NULL DEFAULT '{}'::jsonb,
  contact     jsonb     NOT NULL DEFAULT '{}'::jsonb,
  social      jsonb     NOT NULL DEFAULT '{}'::jsonb,
  branding    jsonb     NOT NULL DEFAULT '{}'::jsonb,
  seo         jsonb     NOT NULL DEFAULT '{}'::jsonb,
  analytics   jsonb     NOT NULL DEFAULT '{}'::jsonb,
  email       jsonb     NOT NULL DEFAULT '{}'::jsonb,
  controls    jsonb     NOT NULL DEFAULT '{}'::jsonb,
  legal       jsonb     NOT NULL DEFAULT '{}'::jsonb,
  footer      jsonb     NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed the single row if it doesn't exist
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_select_settings" ON site_settings;
CREATE POLICY "public_select_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- Admin update only (no insert/delete — single fixed row)
DROP POLICY IF EXISTS "admin_update_settings" ON site_settings;
CREATE POLICY "admin_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_site_assets" ON storage.objects;
CREATE POLICY "public_read_site_assets" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_write_site_assets" ON storage.objects;
CREATE POLICY "admin_write_site_assets" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'site-assets');
