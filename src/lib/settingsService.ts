import { supabase } from './supabase';
import type { SiteSettings, SectionKey } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const TABLE = 'site_settings' as const;
const BUCKET = 'site-assets' as const;

// Merge stored JSON over defaults so new fields always have values
function mergeSection<K extends SectionKey>(key: K, stored: unknown): SiteSettings[K] {
  const def = DEFAULT_SETTINGS[key];
  if (!stored || typeof stored !== 'object') return def;
  return { ...def, ...(stored as Record<string, unknown>) } as SiteSettings[K];
}

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', 1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return { ...DEFAULT_SETTINGS };
  return {
    general:   mergeSection('general',   data.general),
    homepage:  mergeSection('homepage',  data.homepage),
    founder:   mergeSection('founder',   data.founder),
    contact:   mergeSection('contact',   data.contact),
    social:    mergeSection('social',    data.social),
    branding:  mergeSection('branding',  data.branding),
    seo:       mergeSection('seo',       data.seo),
    analytics: mergeSection('analytics', data.analytics),
    email:     mergeSection('email',     data.email),
    controls:  mergeSection('controls',  data.controls),
    legal:     mergeSection('legal',     data.legal),
    footer:    mergeSection('footer',    data.footer),
  };
}

export async function saveSection<K extends SectionKey>(
  key: K,
  value: SiteSettings[K],
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ [key]: value, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw new Error(error.message);
}

export async function saveAllSettings(settings: SiteSettings): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) throw new Error(error.message);
}

export async function resetSection<K extends SectionKey>(
  key: K,
): Promise<SiteSettings[K]> {
  const def = DEFAULT_SETTINGS[key];
  await saveSection(key, def);
  return def;
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadSiteImage(
  file: File,
  folder: string,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Validation ────────────────────────────────────────────────────────────────

export function validateSection<K extends SectionKey>(key: K, value: SiteSettings[K]): string | null {
  const v = value as unknown as Record<string, unknown>;
  switch (key) {
    case 'general':
      if (!v.site_name) return 'Site name is required.';
      if (!v.site_url)  return 'Site URL is required.';
      return null;
    case 'homepage':
      if (!v.hero_title)    return 'Hero title is required.';
      if (!v.hero_subtitle) return 'Hero subtitle is required.';
      return null;
    case 'founder':
      if (!v.name) return 'Founder name is required.';
      if (!v.role) return 'Founder role is required.';
      return null;
    case 'contact':
      if (!v.email)   return 'Contact email is required.';
      if (!v.phone)   return 'Contact phone is required.';
      if (!v.address) return 'Address is required.';
      return null;
    case 'email':
      if (v.enable_smtp) {
        if (!v.smtp_host)     return 'SMTP host is required when SMTP is enabled.';
        if (!v.smtp_username) return 'SMTP username is required when SMTP is enabled.';
        if (!v.from_email)    return 'From email is required when SMTP is enabled.';
      }
      return null;
    case 'seo':
      if (!v.meta_title)       return 'Meta title is required.';
      if (!v.meta_description)  return 'Meta description is required.';
      return null;
    case 'branding':
      if (!v.primary_color)   return 'Primary color is required.';
      if (!v.secondary_color) return 'Secondary color is required.';
      return null;
    default:
      return null;
  }
}
