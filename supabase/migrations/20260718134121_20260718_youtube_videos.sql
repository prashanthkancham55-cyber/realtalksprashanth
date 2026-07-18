/*
# YouTube Videos Module

1. New Table: youtube_videos
   - id: uuid primary key
   - title: video title (required)
   - youtube_url: full YouTube URL (required)
   - youtube_id: extracted video ID for embed/thumbnail
   - thumbnail_url: auto-populated from YouTube ID
   - category: Training | Testimonial | Motivation | Podcast | Interview | Other
   - description: short description
   - featured: boolean — only one should be true at a time (enforced in app logic)
   - show_on_homepage: boolean — controls public homepage visibility
   - display_order: integer for manual drag-and-drop ordering
   - status: Published | Draft
   - created_at, updated_at timestamps

2. Security
   - RLS enabled
   - Public (anon + authenticated) SELECT — videos are shown on the public site
   - Only authenticated users can INSERT / UPDATE / DELETE (admin only)
*/

CREATE TABLE IF NOT EXISTS youtube_videos (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text        NOT NULL,
  youtube_url    text        NOT NULL,
  youtube_id     text        NOT NULL DEFAULT '',
  thumbnail_url  text        NOT NULL DEFAULT '',
  category       text        NOT NULL DEFAULT 'Other',
  description    text        NOT NULL DEFAULT '',
  featured       boolean     NOT NULL DEFAULT false,
  show_on_homepage boolean   NOT NULL DEFAULT false,
  display_order  integer     NOT NULL DEFAULT 0,
  status         text        NOT NULL DEFAULT 'Draft',
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Public read (homepage + public videos page)
DROP POLICY IF EXISTS "public_select_videos" ON youtube_videos;
CREATE POLICY "public_select_videos" ON youtube_videos FOR SELECT
  TO anon, authenticated USING (true);

-- Admin write
DROP POLICY IF EXISTS "admin_insert_videos" ON youtube_videos;
CREATE POLICY "admin_insert_videos" ON youtube_videos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_videos" ON youtube_videos;
CREATE POLICY "admin_update_videos" ON youtube_videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_videos" ON youtube_videos;
CREATE POLICY "admin_delete_videos" ON youtube_videos FOR DELETE
  TO authenticated USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_youtube_videos_status        ON youtube_videos (status);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_category      ON youtube_videos (category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_homepage      ON youtube_videos (show_on_homepage);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos (display_order);
