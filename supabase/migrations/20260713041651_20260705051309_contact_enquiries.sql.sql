CREATE TABLE IF NOT EXISTS contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS contact_enquiries_created_at_idx
  ON contact_enquiries (created_at DESC);

DROP POLICY IF EXISTS "public_insert_enquiries" ON contact_enquiries;
CREATE POLICY "public_insert_enquiries" ON contact_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_enquiries" ON contact_enquiries;
CREATE POLICY "admin_select_enquiries" ON contact_enquiries
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_enquiries" ON contact_enquiries;
CREATE POLICY "admin_update_enquiries" ON contact_enquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_enquiries" ON contact_enquiries;
CREATE POLICY "admin_delete_enquiries" ON contact_enquiries
  FOR DELETE TO authenticated USING (true);