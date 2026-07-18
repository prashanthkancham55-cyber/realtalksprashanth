import { supabase } from './supabase';
import type { Video, VideoFormData } from '../types/video';
import { extractYouTubeId, buildThumbnailUrl } from '../types/video';

const TABLE = 'youtube_videos' as const;

function buildPayload(form: VideoFormData) {
  const youtubeId    = form.youtube_id || extractYouTubeId(form.youtube_url);
  const thumbnailUrl = form.thumbnail_url || buildThumbnailUrl(youtubeId);
  return {
    ...form,
    title:         form.title.trim(),
    youtube_url:   form.youtube_url.trim(),
    youtube_id:    youtubeId,
    thumbnail_url: thumbnailUrl,
    description:   form.description.trim(),
    display_order: Number(form.display_order) || 0,
  };
}

// ── Public: homepage featured video ──────────────────────────────────────────
export async function getFeaturedVideo(): Promise<Video | null> {
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('featured', true)
    .eq('status', 'Published')
    .maybeSingle();
  return data ?? null;
}

// ── Public: homepage videos (show_on_homepage = true) ────────────────────────
export async function getHomepageVideos(): Promise<Video[]> {
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('show_on_homepage', true)
    .eq('status', 'Published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  return (data ?? []) as Video[];
}

// ── Public: all published videos ──────────────────────────────────────────────
export async function getPublishedVideos(category?: string): Promise<Video[]> {
  let q = supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'Published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (category && category !== 'All') q = q.eq('category', category);
  const { data } = await q;
  return (data ?? []) as Video[];
}

// ── Admin: fetch all videos ───────────────────────────────────────────────────
export async function getAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Video[];
}

// ── Admin: create ─────────────────────────────────────────────────────────────
export async function createVideo(form: VideoFormData): Promise<Video> {
  const payload = buildPayload(form);
  // Enforce single featured
  if (payload.featured) {
    await supabase.from(TABLE).update({ featured: false }).eq('featured', true);
  }
  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as Video;
}

// ── Admin: update ─────────────────────────────────────────────────────────────
export async function updateVideo(id: string, form: VideoFormData): Promise<Video> {
  const payload = buildPayload(form);
  if (payload.featured) {
    await supabase.from(TABLE).update({ featured: false }).eq('featured', true).neq('id', id);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Video;
}

// ── Admin: delete ─────────────────────────────────────────────────────────────
export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Admin: reorder (drag-and-drop) ───────────────────────────────────────────
export async function reorderVideos(ordered: { id: string; display_order: number }[]): Promise<void> {
  await Promise.all(
    ordered.map(({ id, display_order }) =>
      supabase.from(TABLE).update({ display_order }).eq('id', id),
    ),
  );
}

export function validateVideoForm(form: VideoFormData): string | null {
  if (!form.title.trim())       return 'Video title is required.';
  if (!form.youtube_url.trim()) return 'YouTube URL is required.';
  const id = extractYouTubeId(form.youtube_url);
  if (!id) return 'Please enter a valid YouTube URL.';
  if (!form.category)           return 'Category is required.';
  return null;
}
