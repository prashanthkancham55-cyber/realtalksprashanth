import { supabase } from './supabase';
import type { Training, TrainingFormData } from '../types/training';
import { slugify } from '../types/training';

const TABLE = 'trainings' as const;

function buildPayload(form: TrainingFormData) {
  return {
    ...form,
    slug:                form.slug.trim() || slugify(form.title),
    tags:                Array.isArray(form.tags) ? form.tags : [],
    benefits:            Array.isArray(form.benefits) ? form.benefits : [],
    who_should_attend:   Array.isArray(form.who_should_attend) ? form.who_should_attend : [],
    what_you_will_learn: Array.isArray(form.what_you_will_learn) ? form.what_you_will_learn : [],
    agenda:              Array.isArray(form.agenda) ? form.agenda : [],
    price:               Number(form.price) || 0,
    total_seats:         Number(form.total_seats) || 0,
    available_seats:     Number(form.available_seats) || 0,
    display_order:       Number(form.display_order) || 0,
  };
}

// ── Public: fetch active + upcoming trainings ─────────────────────────────────
export async function getPublicTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .in('status', ['Active', 'Upcoming'])
    .order('display_order', { ascending: true })
    .order('featured', { ascending: false })
    .order('start_date', { ascending: true });
  if (error) throw new Error(error.message);
  return castAll(data ?? []);
}

// ── Public: fetch hero training ───────────────────────────────────────────────
export async function getHeroTraining(): Promise<Training | null> {
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('show_in_hero', true)
    .in('status', ['Active', 'Upcoming'])
    .maybeSingle();
  return data ? cast(data) : null;
}

// ── Public: fetch popup training ──────────────────────────────────────────────
export async function getPopupTraining(): Promise<Training | null> {
  const { data } = await supabase
    .from(TABLE)
    .select('id, title, slug, banner_url, start_date, session_time, location, price, show_as_popup')
    .eq('show_as_popup', true)
    .in('status', ['Active', 'Upcoming'])
    .maybeSingle();
  return data ? cast(data) : null;
}

// ── Public: fetch training by slug ────────────────────────────────────────────
export async function getTrainingBySlug(slug: string): Promise<Training | null> {
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data ? cast(data) : null;
}

// ── Public: fetch related trainings ───────────────────────────────────────────
export async function getRelatedTrainings(category: string, excludeId: string): Promise<Training[]> {
  const { data } = await supabase
    .from(TABLE)
    .select('id, title, slug, banner_url, start_date, price, available_seats, status, category, mode, location')
    .eq('category', category)
    .neq('id', excludeId)
    .in('status', ['Active', 'Upcoming'])
    .limit(3);
  return castAll(data ?? []);
}

// ── Admin: fetch all trainings ────────────────────────────────────────────────
export async function getAllTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return castAll(data ?? []);
}

// ── Admin: fetch single training ──────────────────────────────────────────────
export async function getTrainingById(id: string): Promise<Training | null> {
  const { data } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  return data ? cast(data) : null;
}

// ── Admin: create training ────────────────────────────────────────────────────
export async function createTraining(form: TrainingFormData): Promise<Training> {
  const payload = buildPayload(form);

  // Enforce single hero banner: clear show_in_hero on all others first
  if (payload.show_in_hero) {
    await supabase.from(TABLE).update({ show_in_hero: false }).eq('show_in_hero', true);
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw new Error(error.message);
  return cast(data);
}

// ── Admin: update training ────────────────────────────────────────────────────
export async function updateTraining(id: string, form: TrainingFormData): Promise<Training> {
  const payload = buildPayload(form);

  if (payload.show_in_hero) {
    await supabase.from(TABLE).update({ show_in_hero: false }).eq('show_in_hero', true).neq('id', id);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return cast(data);
}

// ── Admin: delete training ────────────────────────────────────────────────────
export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Admin: validate form ──────────────────────────────────────────────────────
export function validateTrainingForm(form: TrainingFormData): string | null {
  if (!form.title.trim())        return 'Training title is required.';
  if (!form.trainer_name.trim()) return 'Trainer name is required.';
  if (!form.category)            return 'Category is required.';
  if (!form.mode)                return 'Delivery mode is required.';
  if (!form.start_date)          return 'Start date is required.';
  if (!form.end_date)            return 'End date is required.';
  if (form.end_date < form.start_date) return 'End date must be on or after start date.';
  if (Number(form.price) < 0)   return 'Price cannot be negative.';
  if (Number(form.available_seats) > Number(form.total_seats)) return 'Available seats cannot exceed total seats.';
  return null;
}

// ── Type casts (JSONB arrays come back as unknown) ────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cast(row: any): Training {
  return {
    ...row,
    tags:                Array.isArray(row.tags)                ? row.tags                : [],
    benefits:            Array.isArray(row.benefits)            ? row.benefits            : [],
    who_should_attend:   Array.isArray(row.who_should_attend)   ? row.who_should_attend   : [],
    what_you_will_learn: Array.isArray(row.what_you_will_learn) ? row.what_you_will_learn : [],
    agenda:              Array.isArray(row.agenda)              ? row.agenda              : [],
  } as Training;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function castAll(rows: any[]): Training[] {
  return rows.map(cast);
}
