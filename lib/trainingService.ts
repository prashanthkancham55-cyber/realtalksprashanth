import { supabase } from './supabase';
import type { Training, TrainingFormData } from '@/components/admin/trainings/data';
import { slugify } from '@/components/admin/trainings/data';

const TABLE = 'trainings';

// ── Fetch all trainings ordered by start_date desc ────────────────────────────
export async function fetchTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Training[];
}

// ── Create a new training ─────────────────────────────────────────────────────
export async function createTraining(form: TrainingFormData): Promise<Training> {
  const payload = {
    ...form,
    slug: form.slug.trim() || slugify(form.title),
    tags: Array.isArray(form.tags) ? form.tags : [],
  };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Training;
}

// ── Update an existing training ───────────────────────────────────────────────
export async function updateTraining(id: string, form: TrainingFormData): Promise<Training> {
  const payload = {
    ...form,
    slug: form.slug.trim() || slugify(form.title),
    tags: Array.isArray(form.tags) ? form.tags : [],
  };
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Training;
}

// ── Delete a training ─────────────────────────────────────────────────────────
export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Validate form fields — returns first error or null ───────────────────────
export function validateTrainingForm(form: TrainingFormData): string | null {
  if (!form.title.trim())        return 'Training title is required.';
  if (!form.trainer_name.trim()) return 'Trainer name is required.';
  if (!form.category)            return 'Category is required.';
  if (!form.mode)                return 'Mode is required.';
  if (!form.start_date)          return 'Start date is required.';
  if (!form.end_date)            return 'End date is required.';
  if (form.end_date < form.start_date) return 'End date must be on or after start date.';
  if (form.price < 0)            return 'Price cannot be negative.';
  if (form.total_seats < 0)      return 'Total seats cannot be negative.';
  if (form.available_seats < 0)  return 'Available seats cannot be negative.';
  if (form.available_seats > form.total_seats) return 'Available seats cannot exceed total seats.';
  return null;
}
