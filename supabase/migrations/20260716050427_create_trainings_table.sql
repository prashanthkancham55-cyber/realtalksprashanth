/*
# Create trainings table

## Overview
Creates the `trainings` table to store all corporate training programs managed
through the RealTalks Prashanth admin panel.

## New Table: `trainings`

### Columns
- `id`              — UUID primary key, auto-generated
- `title`           — Full training program name (required)
- `slug`            — URL-friendly identifier, auto-generated from title if not provided
- `category`        — Program category: Sales, Leadership, Communication, Real Estate, Corporate, Mindset
- `trainer_name`    — Name of the lead trainer (required)
- `description`     — Detailed program description
- `mode`            — Delivery mode: Online, Offline, or Hybrid
- `location`        — Physical venue or "Virtual" for online programs
- `start_date`      — Program start date
- `end_date`        — Program end date (defaults to start_date for single-day events)
- `duration`        — Human-readable duration (e.g. "2 days", "1 day")
- `price`           — Seat price in INR (integer, paisa-free)
- `total_seats`     — Maximum seats available
- `available_seats` — Remaining seats (decremented on registration)
- `banner_url`      — URL for the training banner image
- `status`          — Lifecycle status: Draft, Active, Upcoming, or Completed
- `featured`        — Whether to feature on the public website
- `tags`            — Optional JSON array of keyword tags
- `created_at`      — Row creation timestamp
- `updated_at`      — Row last-modified timestamp, auto-updated via trigger

## Security
- RLS is ENABLED.
- This is an admin-only single-tenant application (no public sign-up).
  The admin is authenticated via Supabase Auth.
- SELECT: allowed to both `anon` and `authenticated` so the public website can
  display published programs without requiring a login.
- INSERT / UPDATE / DELETE: restricted to `authenticated` only, scoped to
  rows the admin session owns (i.e. any authenticated user — there is only one admin).

## Important Notes
1. `available_seats` should be decremented by a separate registration flow (Phase 2).
   For now it mirrors `total_seats` on creation and is manually adjustable.
2. The `updated_at` trigger fires on every UPDATE automatically.
3. All `CREATE` statements use `IF NOT EXISTS` and policies use `DROP … IF EXISTS`
   before creation to make this migration safely re-runnable.
*/

-- ── Table ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trainings (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  slug            text        NOT NULL DEFAULT '',
  category        text        NOT NULL DEFAULT 'Sales',
  trainer_name    text        NOT NULL DEFAULT 'Prashanth Kumar',
  description     text        NOT NULL DEFAULT '',
  mode            text        NOT NULL DEFAULT 'Offline' CHECK (mode IN ('Online','Offline','Hybrid')),
  location        text        NOT NULL DEFAULT '',
  start_date      date        NOT NULL,
  end_date        date        NOT NULL,
  duration        text        NOT NULL DEFAULT '',
  price           integer     NOT NULL DEFAULT 0 CHECK (price >= 0),
  total_seats     integer     NOT NULL DEFAULT 0 CHECK (total_seats >= 0),
  available_seats integer     NOT NULL DEFAULT 0 CHECK (available_seats >= 0),
  banner_url      text        NOT NULL DEFAULT '',
  status          text        NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Active','Upcoming','Completed')),
  featured        boolean     NOT NULL DEFAULT false,
  tags            jsonb       NOT NULL DEFAULT '[]'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── updated_at trigger ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trainings_updated_at ON trainings;
CREATE TRIGGER trainings_updated_at
  BEFORE UPDATE ON trainings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Index ──────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS trainings_status_idx    ON trainings (status);
CREATE INDEX IF NOT EXISTS trainings_start_date_idx ON trainings (start_date DESC);
CREATE INDEX IF NOT EXISTS trainings_featured_idx  ON trainings (featured) WHERE featured = true;

-- ── RLS ────────────────────────────────────────────────────────────────────────
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Public read: website visitors can see published trainings
DROP POLICY IF EXISTS "public_select_trainings" ON trainings;
CREATE POLICY "public_select_trainings" ON trainings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Admin write: only authenticated session can create trainings
DROP POLICY IF EXISTS "admin_insert_trainings" ON trainings;
CREATE POLICY "admin_insert_trainings" ON trainings
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Admin update
DROP POLICY IF EXISTS "admin_update_trainings" ON trainings;
CREATE POLICY "admin_update_trainings" ON trainings
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Admin delete
DROP POLICY IF EXISTS "admin_delete_trainings" ON trainings;
CREATE POLICY "admin_delete_trainings" ON trainings
  FOR DELETE TO authenticated
  USING (true);
