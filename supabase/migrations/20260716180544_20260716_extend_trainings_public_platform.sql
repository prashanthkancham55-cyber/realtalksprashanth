/*
# Extend Trainings Table for Public Training Platform

## Summary
Adds new columns to the `trainings` table to support the full public training website:
hero banner selection, popup display, ordering, rich content, and scheduling details.

## Modified Table: trainings

### New columns:
- `show_in_hero`       BOOLEAN — marks one training to be displayed in the dynamic Hero section (only one should be true)
- `show_as_popup`      BOOLEAN — shows this training as a popup after 5 seconds on the homepage
- `display_order`      INTEGER — controls sort order in public listings (lower = first)
- `language`           TEXT    — language of instruction (default 'English')
- `session_time`       TEXT    — session time string (e.g. "10:00 AM – 6:00 PM")
- `short_description`  TEXT    — 1-2 sentence summary shown on cards
- `full_description`   TEXT    — rich long-form description for detail page
- `benefits`           JSONB   — array of benefit strings
- `who_should_attend`  JSONB   — array of target audience strings
- `what_you_will_learn` JSONB  — array of learning outcome strings
- `agenda`             JSONB   — array of {time, topic, description} objects

## Notes
1. Only ONE training should have show_in_hero = true at a time. The application enforces this.
2. All new columns have safe defaults so existing rows continue to work without changes.
3. No columns are dropped or modified — existing data is fully preserved.
*/

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='show_in_hero') THEN
    ALTER TABLE trainings ADD COLUMN show_in_hero boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='show_as_popup') THEN
    ALTER TABLE trainings ADD COLUMN show_as_popup boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='display_order') THEN
    ALTER TABLE trainings ADD COLUMN display_order integer NOT NULL DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='language') THEN
    ALTER TABLE trainings ADD COLUMN language text NOT NULL DEFAULT 'English';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='session_time') THEN
    ALTER TABLE trainings ADD COLUMN session_time text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='short_description') THEN
    ALTER TABLE trainings ADD COLUMN short_description text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='full_description') THEN
    ALTER TABLE trainings ADD COLUMN full_description text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='benefits') THEN
    ALTER TABLE trainings ADD COLUMN benefits jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='who_should_attend') THEN
    ALTER TABLE trainings ADD COLUMN who_should_attend jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='what_you_will_learn') THEN
    ALTER TABLE trainings ADD COLUMN what_you_will_learn jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trainings' AND column_name='agenda') THEN
    ALTER TABLE trainings ADD COLUMN agenda jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Index for public listing query (active/upcoming, ordered by display_order)
CREATE INDEX IF NOT EXISTS trainings_public_listing_idx
  ON trainings (status, display_order, start_date)
  WHERE status IN ('Active', 'Upcoming');

-- Partial index: only one hero banner
CREATE UNIQUE INDEX IF NOT EXISTS trainings_single_hero_idx
  ON trainings (show_in_hero)
  WHERE show_in_hero = true;
