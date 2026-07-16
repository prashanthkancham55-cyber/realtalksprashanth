// ── Canonical Training type — mirrors the Supabase `trainings` table ──────────
export type TrainingMode     = 'Online' | 'Offline' | 'Hybrid';
export type TrainingStatus   = 'Draft' | 'Active' | 'Upcoming' | 'Completed';
export type TrainingCategory = 'Sales' | 'Leadership' | 'Communication' | 'Real Estate' | 'Corporate' | 'Mindset';

export interface Training {
  id:              string;
  title:           string;
  slug:            string;
  category:        string;
  trainer_name:    string;
  description:     string;
  mode:            TrainingMode;
  location:        string;
  start_date:      string;   // ISO date string "YYYY-MM-DD"
  end_date:        string;   // ISO date string "YYYY-MM-DD"
  duration:        string;
  price:           number;
  total_seats:     number;
  available_seats: number;
  banner_url:      string;
  status:          TrainingStatus;
  featured:        boolean;
  tags:            string[];
  created_at:      string;
  updated_at:      string;
}

// ── Form payload — omit server-managed fields ─────────────────────────────────
export type TrainingFormData = Omit<Training, 'id' | 'created_at' | 'updated_at'>;

export const EMPTY_FORM: TrainingFormData = {
  title:           '',
  slug:            '',
  category:        'Sales',
  trainer_name:    'Prashanth Kumar',
  description:     '',
  mode:            'Offline',
  location:        '',
  start_date:      '',
  end_date:        '',
  duration:        '',
  price:           0,
  total_seats:     0,
  available_seats: 0,
  banner_url:      '',
  status:          'Draft',
  featured:        false,
  tags:            [],
};

// ── Filter/select option lists ────────────────────────────────────────────────
export const STATUS_OPTIONS = [
  { value: '',          label: 'All Status' },
  { value: 'Active',    label: 'Active' },
  { value: 'Upcoming',  label: 'Upcoming' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Draft',     label: 'Draft' },
];

export const CATEGORY_OPTIONS = [
  { value: '',              label: 'All Categories' },
  { value: 'Sales',         label: 'Sales' },
  { value: 'Leadership',    label: 'Leadership' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Real Estate',   label: 'Real Estate' },
  { value: 'Corporate',     label: 'Corporate' },
  { value: 'Mindset',       label: 'Mindset' },
];

export const MODE_OPTIONS = [
  { value: '',        label: 'All Modes' },
  { value: 'Online',  label: 'Online' },
  { value: 'Offline', label: 'Offline' },
  { value: 'Hybrid',  label: 'Hybrid' },
];

export const CATEGORY_FORM_OPTIONS = CATEGORY_OPTIONS.slice(1).map((o) => ({ value: o.value, label: o.label }));
export const MODE_FORM_OPTIONS     = MODE_OPTIONS.slice(1).map((o) => ({ value: o.value, label: o.label }));
export const STATUS_FORM_OPTIONS   = STATUS_OPTIONS.slice(1).map((o) => ({ value: o.value, label: o.label }));

export const PER_PAGE = 5;

// ── Display helpers ───────────────────────────────────────────────────────────
export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
