import { supabase } from './supabase';
import type { StudentRegistration, RegistrationFormData } from '../types/registration';

const TABLE = 'student_registrations' as const;

// ── Public: check duplicate ───────────────────────────────────────────────────
export async function isDuplicateRegistration(trainingId: string, mobile: string): Promise<boolean> {
  const { data } = await supabase
    .from(TABLE)
    .select('id')
    .eq('training_id', trainingId)
    .eq('mobile', mobile.trim())
    .maybeSingle();
  return data !== null;
}

// ── Public: submit registration ───────────────────────────────────────────────
export async function submitRegistration(form: RegistrationFormData): Promise<StudentRegistration> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      training_id:       form.training_id,
      full_name:         form.full_name.trim(),
      mobile:            form.mobile.trim(),
      email:             form.email.trim().toLowerCase(),
      city:              form.city.trim(),
      state:             form.state,
      company:           form.company.trim() || null,
      designation:       form.designation.trim() || null,
      experience:        form.experience,
      industry:          form.industry,
      gender:            form.gender,
      date_of_birth:     form.date_of_birth || null,
      emergency_contact: form.emergency_contact.trim() || null,
      address:           form.address.trim() || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as StudentRegistration;
}

// ── Admin: fetch all registrations with filters ───────────────────────────────
export async function getRegistrations(opts?: {
  search?: string;
  status?: string;
  trainingId?: string;
}): Promise<StudentRegistration[]> {
  let q = supabase
    .from(TABLE)
    .select('*, trainings(title, start_date, mode)')
    .order('registered_at', { ascending: false });

  if (opts?.status)     q = q.eq('status', opts.status);
  if (opts?.trainingId) q = q.eq('training_id', opts.trainingId);
  if (opts?.search) {
    const s = opts.search.trim();
    q = q.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,registration_id.ilike.%${s}%`);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((row) => {
    const t = row.trainings;
    return {
      ...row,
      training_title: t?.title,
      training_start: t?.start_date,
      training_mode:  t?.mode,
    } as StudentRegistration;
  });
}

// ── Admin: get counts ─────────────────────────────────────────────────────────
export async function getRegistrationCounts() {
  const { data } = await supabase.from(TABLE).select('status');
  const rows = (data ?? []) as { status: string }[];
  return {
    total:     rows.length,
    pending:   rows.filter((r) => r.status === 'Pending').length,
    confirmed: rows.filter((r) => r.status === 'Confirmed').length,
    cancelled: rows.filter((r) => r.status === 'Cancelled').length,
  };
}

// ── Admin: get total count ────────────────────────────────────────────────────
export async function getRegistrationTotalCount(): Promise<number> {
  const { count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

// ── Admin: update registration ────────────────────────────────────────────────
export async function updateRegistration(
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: Record<string, any>,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Admin: delete registration ────────────────────────────────────────────────
export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export function formatRegistrationDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
