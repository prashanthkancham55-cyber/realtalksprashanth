import { supabase } from './supabase';
import type { Training, TrainingFormData } from '@/components/admin/trainings/data';
import { slugify } from '@/components/admin/trainings/data';

const TABLE = 'trainings' as const;

// ── Fetch all trainings ordered by start_date desc ────────────────────────────
export async function getTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Training[];
}

// Keep the original name as an alias so existing page.tsx import still works
export { getTrainings as fetchTrainings };

// ── Fetch a single training by ID ─────────────────────────────────────────────
export async function getTraining(id: string): Promise<Training | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Training | null;
}

// ── Build the insert/update payload ──────────────────────────────────────────
function buildPayload(form: TrainingFormData) {
  return {
    ...form,
    slug:            form.slug.trim() || slugify(form.title),
    tags:            Array.isArray(form.tags) ? form.tags : [],
    price:           Number(form.price)           || 0,
    total_seats:     Number(form.total_seats)     || 0,
    available_seats: Number(form.available_seats) || 0,
  };
}

// ── Create a new training ─────────────────────────────────────────────────────
export async function createTraining(form: TrainingFormData): Promise<Training> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(buildPayload(form))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Training;
}

// ── Update an existing training ───────────────────────────────────────────────
export async function updateTraining(id: string, form: TrainingFormData): Promise<Training> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(buildPayload(form))
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

// ── Validate form fields — returns first error message or null ────────────────
export function validateTrainingForm(form: TrainingFormData): string | null {
  if (!form.title.trim())        return 'Training title is required.';
  if (!form.trainer_name.trim()) return 'Trainer name is required.';
  if (!form.category)            return 'Category is required.';
  if (!form.mode)                return 'Delivery mode is required.';
  if (!form.start_date)          return 'Start date is required.';
  if (!form.end_date)            return 'End date is required.';
  if (form.end_date < form.start_date)
    return 'End date must be on or after start date.';
  if (Number(form.price) < 0)
    return 'Price cannot be negative.';
  if (Number(form.total_seats) < 0)
    return 'Total seats cannot be negative.';
  if (Number(form.available_seats) < 0)
    return 'Available seats cannot be negative.';
  if (Number(form.available_seats) > Number(form.total_seats))
    return 'Available seats cannot exceed total seats.';
  return null;
}
