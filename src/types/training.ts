export type TrainingMode     = 'Online' | 'Offline' | 'Hybrid';
export type TrainingStatus   = 'Draft' | 'Active' | 'Upcoming' | 'Completed';
export type TrainingCategory = 'Sales' | 'Leadership' | 'Communication' | 'Real Estate' | 'Corporate' | 'Mindset';

export interface AgendaItem {
  time:        string;
  topic:       string;
  description: string;
}

export interface Training {
  id:                  string;
  title:               string;
  slug:                string;
  category:            string;
  trainer_name:        string;
  description:         string;
  short_description:   string;
  full_description:    string;
  mode:                TrainingMode;
  location:            string;
  start_date:          string;
  end_date:            string;
  session_time:        string;
  duration:            string;
  language:            string;
  price:               number;
  total_seats:         number;
  available_seats:     number;
  banner_url:          string;
  status:              TrainingStatus;
  featured:            boolean;
  show_in_hero:        boolean;
  show_as_popup:       boolean;
  display_order:       number;
  tags:                string[];
  benefits:            string[];
  who_should_attend:   string[];
  what_you_will_learn: string[];
  agenda:              AgendaItem[];
  created_at:          string;
  updated_at:          string;
}

export type TrainingFormData = Omit<Training, 'id' | 'created_at' | 'updated_at'>;

export const EMPTY_TRAINING: TrainingFormData = {
  title:               '',
  slug:                '',
  category:            'Sales',
  trainer_name:        'Prashanth Kumar',
  description:         '',
  short_description:   '',
  full_description:    '',
  mode:                'Offline',
  location:            '',
  start_date:          '',
  end_date:            '',
  session_time:        '',
  duration:            '',
  language:            'English',
  price:               0,
  total_seats:         0,
  available_seats:     0,
  banner_url:          '',
  status:              'Draft',
  featured:            false,
  show_in_hero:        false,
  show_as_popup:       false,
  display_order:       0,
  tags:                [],
  benefits:            [],
  who_should_attend:   [],
  what_you_will_learn: [],
  agenda:              [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `₹${price.toLocaleString('en-IN')}`;
}

// ── Option lists ──────────────────────────────────────────────────────────────
export const STATUS_OPTIONS  = ['Draft', 'Active', 'Upcoming', 'Completed'] as const;
export const MODE_OPTIONS    = ['Online', 'Offline', 'Hybrid'] as const;
export const CATEGORY_OPTIONS = ['Sales', 'Leadership', 'Communication', 'Real Estate', 'Corporate', 'Mindset'] as const;
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'English & Hindi'] as const;
