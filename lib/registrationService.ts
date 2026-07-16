import { supabase } from './supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RegistrationStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface StudentRegistration {
  id:                 string;
  registration_id:    string;
  training_id:        string;
  full_name:          string;
  mobile:             string;
  email:              string;
  city:               string;
  state:              string;
  company:            string | null;
  designation:        string | null;
  experience:         string;
  industry:           string;
  gender:             string;
  date_of_birth:      string | null;
  emergency_contact:  string | null;
  address:            string | null;
  status:             RegistrationStatus;
  notes:              string | null;
  registered_at:      string;
  created_at:         string;
  updated_at:         string;
  // joined from trainings
  training_title?:    string;
  training_start?:    string;
  training_mode?:     string;
}

export interface RegistrationFormData {
  training_id:        string;
  full_name:          string;
  mobile:             string;
  email:              string;
  city:               string;
  state:              string;
  company:            string;
  designation:        string;
  experience:         string;
  industry:           string;
  gender:             string;
  date_of_birth:      string;
  emergency_contact:  string;
  address:            string;
}

export interface RegistrationFilters {
  search:     string;
  status:     string;
  trainingId: string;
}

// ── Fetch all (admin) with joined training title ───────────────────────────────
export async function getRegistrations(filters?: Partial<RegistrationFilters>): Promise<StudentRegistration[]> {
  let q = supabase
    .from('student_registrations')
    .select(`
      *,
      trainings ( title, start_date, mode )
    `)
    .order('registered_at', { ascending: false });

  if (filters?.status)       q = q.eq('status', filters.status);
  if (filters?.trainingId)   q = q.eq('training_id', filters.trainingId);
  if (filters?.search) {
    const s = filters.search.trim();
    q = q.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,mobile.ilike.%${s}%,registration_id.ilike.%${s}%`);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown[]).map((row: unknown) => {
    const r = row as Record<string, unknown>;
    const t = r.trainings as Record<string, unknown> | null;
    const base = { ...r } as unknown as StudentRegistration;
    return {
      ...base,
      training_title: t?.title as string | undefined,
      training_start: t?.start_date as string | undefined,
      training_mode:  t?.mode as string | undefined,
    };
  });
}

// ── Fetch counts by status (admin) ────────────────────────────────────────────
export async function getRegistrationCounts() {
  const { data, error } = await supabase
    .from('student_registrations')
    .select('status');
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as { status: string }[];
  return {
    total:     rows.length,
    pending:   rows.filter((r) => r.status === 'Pending').length,
    confirmed: rows.filter((r) => r.status === 'Confirmed').length,
    cancelled: rows.filter((r) => r.status === 'Cancelled').length,
  };
}

// ── Fetch total count only (dashboard) ───────────────────────────────────────
export async function getRegistrationTotalCount(): Promise<number> {
  const { count, error } = await supabase
    .from('student_registrations')
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

// ── Check duplicate: same mobile for same training ────────────────────────────
export async function isDuplicateRegistration(trainingId: string, mobile: string): Promise<boolean> {
  const { data } = await supabase
    .from('student_registrations')
    .select('id')
    .eq('training_id', trainingId)
    .eq('mobile', mobile.trim())
    .maybeSingle();
  return data !== null;
}

// ── Submit a new registration (public, anon) ──────────────────────────────────
export async function submitRegistration(form: RegistrationFormData): Promise<StudentRegistration> {
  const { data, error } = await supabase
    .from('student_registrations')
    .insert({
      training_id:       form.training_id,
      full_name:         form.full_name.trim(),
      mobile:            form.mobile.trim(),
      email:             form.email.trim().toLowerCase(),
      city:              form.city.trim(),
      state:             form.state.trim(),
      company:           form.company.trim() || null,
      designation:       form.designation.trim() || null,
      experience:        form.experience,
      industry:          form.industry.trim(),
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

// ── Update status + notes (admin) ─────────────────────────────────────────────
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  notes?: string,
): Promise<void> {
  const { error } = await supabase
    .from('student_registrations')
    .update({ status, notes: notes ?? null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Full update (admin edit) ───────────────────────────────────────────────────
export async function updateRegistration(
  id: string,
  patch: Partial<RegistrationFormData> & { status?: RegistrationStatus; notes?: string },
): Promise<void> {
  const { error } = await supabase
    .from('student_registrations')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Delete (admin) ─────────────────────────────────────────────────────────────
export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase
    .from('student_registrations')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Validation ────────────────────────────────────────────────────────────────
export function validateRegistrationForm(form: RegistrationFormData): string | null {
  if (!form.training_id)                   return 'Please select a training program.';
  if (!form.full_name.trim())              return 'Full name is required.';
  if (!form.mobile.trim())                 return 'Mobile number is required.';
  if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return 'Enter a valid 10-digit Indian mobile number.';
  if (!form.email.trim())                  return 'Email address is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.';
  if (!form.city.trim())                   return 'City is required.';
  if (!form.state.trim())                  return 'State is required.';
  if (!form.experience)                    return 'Experience is required.';
  if (!form.industry.trim())               return 'Industry is required.';
  if (!form.gender)                        return 'Gender is required.';
  return null;
}

// ── Display helpers ───────────────────────────────────────────────────────────
export function formatRegistrationDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const STATUS_BADGE: Record<RegistrationStatus, { label: string; color: string; bg: string; border: string }> = {
  Pending:   { label: 'Pending',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)' },
  Confirmed: { label: 'Confirmed', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)' },
  Cancelled: { label: 'Cancelled', color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
};

export const EXPERIENCE_OPTIONS = [
  'Fresher (0 years)',
  '0–1 years',
  '1–2 years',
  '2–5 years',
  '5–10 years',
  '10+ years',
];

export const INDUSTRY_OPTIONS = [
  'Real Estate',
  'Banking & Finance',
  'Sales & Marketing',
  'IT & Technology',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Consulting',
  'Other',
];

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];
