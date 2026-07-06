/*
# Contact Enquiries Table

## Overview
Creates a contact_enquiries table to capture and persist form submissions from the
public-facing Contact section. Enquiries are submitted anonymously (no sign-in required)
and can be viewed and managed by the authenticated admin in the Admin Dashboard.

## New Tables

### contact_enquiries
Stores all contact form submissions from website visitors.
- `id` (uuid, PK) — auto-generated unique identifier
- `name` (text, NOT NULL) — visitor's full name
- `phone` (text, default '') — visitor's phone number
- `email` (text, default '') — visitor's email address
- `company` (text, default '') — visitor's company or organization
- `message` (text, NOT NULL) — the enquiry message body
- `is_read` (boolean, default false) — admin marks enquiry as read
- `created_at` (timestamptz) — auto-set on insert

## Security (RLS)

Split access model:
- INSERT: open to `anon` + `authenticated` so any website visitor can submit
- SELECT: restricted to `authenticated` only — only the signed-in admin can read submissions
- UPDATE: restricted to `authenticated` only — admin can mark as read/unread
- DELETE: restricted to `authenticated` only — admin can delete enquiries

This ensures that contact submissions are write-only for the public and
fully manageable by the admin.

## Index
An index on `created_at DESC` is added so the admin dashboard
(which orders by newest first) performs efficiently.
*/

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
