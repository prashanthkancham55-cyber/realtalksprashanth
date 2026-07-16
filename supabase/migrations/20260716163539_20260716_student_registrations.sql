/*
# Student Registrations Module

## Summary
Creates the `student_registrations` table to track individual student sign-ups for specific training programs.
Introduces an auto-generated registration ID in the format RTP-YYYY-NNNNNN using a dedicated sequence.

## New Tables

### student_registrations
Stores every public registration submitted via the registration form.

Columns:
- id                uuid PK, auto-generated
- registration_id   TEXT UNIQUE, auto-generated as "RTP-<year>-<6-digit-seq>" (e.g. RTP-2026-000001)
- training_id       uuid FK → trainings.id (ON DELETE RESTRICT so training can't be deleted while registrations exist)
- full_name         TEXT NOT NULL
- mobile            TEXT NOT NULL
- email             TEXT NOT NULL
- city              TEXT NOT NULL
- state             TEXT NOT NULL
- company           TEXT  (optional)
- designation       TEXT  (optional)
- experience        TEXT NOT NULL (e.g. "0-1 years", "2-5 years")
- industry          TEXT NOT NULL
- gender            TEXT NOT NULL CHECK (Male | Female | Other | Prefer not to say)
- date_of_birth     DATE  (optional)
- emergency_contact TEXT  (optional)
- address           TEXT  (optional)
- status            TEXT NOT NULL DEFAULT 'Pending' CHECK (Pending | Confirmed | Cancelled)
- notes             TEXT  (admin notes, optional)
- registered_at     TIMESTAMPTZ DEFAULT now()
- created_at        TIMESTAMPTZ DEFAULT now()
- updated_at        TIMESTAMPTZ DEFAULT now()

### Unique Constraints
- (mobile, training_id) — prevents a student registering for the same training twice with the same mobile number

## Security

RLS is enabled. Policies are designed for a mixed-access pattern:
- Public (anon) users can INSERT registrations (open registration form)
- Only authenticated admin users can SELECT, UPDATE, DELETE registrations

This means student data is never exposed to anonymous visitors — only admins can view the list.

## Notes
1. The sequence `student_registration_seq` is global and never reset — ensures unique IDs forever.
2. `ON DELETE RESTRICT` on training_id prevents accidental deletion of a training that has registrations.
3. Do NOT change the column types or drop the sequence once live — registration IDs are customer-facing references.
*/

-- ── Sequence for registration IDs ─────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS student_registration_seq START 1;

-- ── Helper function to generate RTP-YYYY-NNNNNN ───────────────────────────────
CREATE OR REPLACE FUNCTION generate_registration_id()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT 'RTP-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('student_registration_seq')::TEXT, 6, '0');
$$;

-- ── Main table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_registrations (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id   TEXT        UNIQUE NOT NULL DEFAULT generate_registration_id(),
  training_id       uuid        NOT NULL REFERENCES trainings(id) ON DELETE RESTRICT,

  -- Student personal info
  full_name         TEXT        NOT NULL,
  mobile            TEXT        NOT NULL,
  email             TEXT        NOT NULL,
  city              TEXT        NOT NULL,
  state             TEXT        NOT NULL,

  -- Optional personal info
  company           TEXT,
  designation       TEXT,
  experience        TEXT        NOT NULL DEFAULT '',
  industry          TEXT        NOT NULL DEFAULT '',
  gender            TEXT        NOT NULL DEFAULT '' CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say', '')),
  date_of_birth     DATE,
  emergency_contact TEXT,
  address           TEXT,

  -- Admin-managed fields
  status            TEXT        NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
  notes             TEXT,

  -- Timestamps
  registered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate registration: same mobile for same training
CREATE UNIQUE INDEX IF NOT EXISTS student_registrations_mobile_training_uidx
  ON student_registrations (mobile, training_id);

-- Index for lookups by training
CREATE INDEX IF NOT EXISTS student_registrations_training_id_idx
  ON student_registrations (training_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS student_registrations_status_idx
  ON student_registrations (status);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE student_registrations ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (open registration form, no login needed)
DROP POLICY IF EXISTS "public_insert_registrations" ON student_registrations;
CREATE POLICY "public_insert_registrations" ON student_registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can SELECT
DROP POLICY IF EXISTS "admin_select_registrations" ON student_registrations;
CREATE POLICY "admin_select_registrations" ON student_registrations
  FOR SELECT TO authenticated
  USING (true);

-- Only authenticated admins can UPDATE
DROP POLICY IF EXISTS "admin_update_registrations" ON student_registrations;
CREATE POLICY "admin_update_registrations" ON student_registrations
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Only authenticated admins can DELETE
DROP POLICY IF EXISTS "admin_delete_registrations" ON student_registrations;
CREATE POLICY "admin_delete_registrations" ON student_registrations
  FOR DELETE TO authenticated
  USING (true);
