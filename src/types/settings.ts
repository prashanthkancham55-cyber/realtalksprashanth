// ── Section types ────────────────────────────────────────────────────────────

export interface GeneralSettings {
  site_name:        string;
  tagline:          string;
  description:      string;
  site_url:         string;
  language:         string;
  timezone:         string;
  currency:         string;
  maintenance_mode: boolean;
}

export interface HomepageSettings {
  hero_title:        string;
  hero_subtitle:     string;
  hero_background:   string;
  show_trainings:    boolean;
  show_testimonials: boolean;
  show_gallery:      boolean;
  show_videos:       boolean;
  show_blog:         boolean;
  featured_training_slug: string;
  announcement_bar:      string;
  show_announcement:      boolean;
}

export interface FounderSettings {
  name:          string;
  role:          string;
  bio:           string;
  image_url:     string;
  quote:         string;
  years_experience: number;
  specializations:  string[];
  certifications:   string[];
}

export interface ContactSettings {
  email:        string;
  phone:        string;
  alt_phone:    string;
  address:      string;
  city:         string;
  state:        string;
  country:      string;
  postal_code:  string;
  map_embed:    string;
  business_hours: string;
}

export interface SocialSettings {
  youtube:    string;
  instagram:  string;
  facebook:   string;
  linkedin:   string;
  twitter:    string;
  whatsapp:   string;
  telegram:   string;
}

export interface BrandingSettings {
  logo_url:        string;
  logo_light_url:  string;
  favicon_url:     string;
  og_image_url:     string;
  primary_color:   string;
  secondary_color: string;
  accent_color:    string;
  font_heading:    string;
  font_body:       string;
}

export interface SEOSettings {
  meta_title:        string;
  meta_description:  string;
  meta_keywords:     string;
  og_title:           string;
  og_description:     string;
  twitter_card:       string;
  canonical_url:      string;
  robots_index:        boolean;
  sitemap_enabled:     boolean;
  structured_data:     string;
}

export interface AnalyticsSettings {
  google_analytics_id: string;
  facebook_pixel_id:   string;
  hotjar_id:           string;
  microsoft_clarity:   string;
  tag_manager_id:      string;
  enable_tracking:     boolean;
}

export interface EmailSettings {
  smtp_host:      string;
  smtp_port:      number;
  smtp_username:  string;
  smtp_password:  string;
  from_email:     string;
  from_name:      string;
  reply_to:       string;
  contact_email:  string;
  enable_smtp:    boolean;
}

export interface ControlsSettings {
  registration_open:  boolean;
  contact_form_open:  boolean;
  comments_enabled:   boolean;
  force_https:         boolean;
  cache_enabled:       boolean;
  debug_mode:          boolean;
}

export interface LegalSettings {
  privacy_policy:   string;
  terms_of_service:  string;
  cookie_policy:     string;
  disclaimer:        string;
  refund_policy:     string;
}

export interface FooterSettings {
  about_text:     string;
  copyright_text: string;
  show_social:    boolean;
  show_legal:     boolean;
  show_contact:   boolean;
  footer_links:   { label: string; url: string }[];
}

export interface SiteSettings {
  general:   GeneralSettings;
  homepage:  HomepageSettings;
  founder:   FounderSettings;
  contact:   ContactSettings;
  social:    SocialSettings;
  branding:  BrandingSettings;
  seo:       SEOSettings;
  analytics: AnalyticsSettings;
  email:     EmailSettings;
  controls:  ControlsSettings;
  legal:     LegalSettings;
  footer:    FooterSettings;
}

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    site_name: 'RealTalks',
    tagline: 'Transforming Lives Through Training',
    description: 'Premium corporate training and coaching by Prashanth.',
    site_url: 'https://realtalks.com',
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    maintenance_mode: false,
  },
  homepage: {
    hero_title: 'Real Training. Real Transformation.',
    hero_subtitle: 'Founder & Corporate Trainer',
    hero_background: '',
    show_trainings: true,
    show_testimonials: true,
    show_gallery: true,
    show_videos: true,
    show_blog: false,
    featured_training_slug: '',
    announcement_bar: 'New batch starting soon — enroll today!',
    show_announcement: false,
  },
  founder: {
    name: 'Prashanth',
    role: 'Founder & Corporate Trainer',
    bio: 'With over a decade of experience, Prashanth has trained thousands of professionals across India.',
    image_url: '',
    quote: 'Real training creates real transformation.',
    years_experience: 12,
    specializations: ['Sales', 'Leadership', 'Communication'],
    certifications: [],
  },
  contact: {
    email: 'contact@realtalks.com',
    phone: '+91 98765 43210',
    alt_phone: '',
    address: 'RealTalks Training Academy',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postal_code: '560001',
    map_embed: '',
    business_hours: 'Mon–Sat, 9:00 AM – 7:00 PM',
  },
  social: {
    youtube: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    whatsapp: '',
    telegram: '',
  },
  branding: {
    logo_url: '',
    logo_light_url: '',
    favicon_url: '',
    og_image_url: '',
    primary_color: '#d4af37',
    secondary_color: '#020810',
    accent_color: '#f0c040',
    font_heading: 'Cormorant Garamond',
    font_body: 'Inter',
  },
  seo: {
    meta_title: 'RealTalks — Corporate Training & Coaching',
    meta_description: 'Premium corporate training by Prashanth. Sales, leadership, and communication programs.',
    meta_keywords: 'corporate training, sales training, leadership, coaching',
    og_title: '',
    og_description: '',
    twitter_card: 'summary_large_image',
    canonical_url: '',
    robots_index: true,
    sitemap_enabled: true,
    structured_data: '',
  },
  analytics: {
    google_analytics_id: '',
    facebook_pixel_id: '',
    hotjar_id: '',
    microsoft_clarity: '',
    tag_manager_id: '',
    enable_tracking: false,
  },
  email: {
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    from_email: '',
    from_name: 'RealTalks',
    reply_to: '',
    contact_email: 'contact@realtalks.com',
    enable_smtp: false,
  },
  controls: {
    registration_open: true,
    contact_form_open: true,
    comments_enabled: false,
    force_https: true,
    cache_enabled: true,
    debug_mode: false,
  },
  legal: {
    privacy_policy: '',
    terms_of_service: '',
    cookie_policy: '',
    disclaimer: '',
    refund_policy: '',
  },
  footer: {
    about_text: 'RealTalks is a premium corporate training academy.',
    copyright_text: '© 2026 RealTalks. All rights reserved.',
    show_social: true,
    show_legal: true,
    show_contact: true,
    footer_links: [],
  },
};

export type SectionKey = keyof SiteSettings;

export const SECTION_META: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'general',   label: 'General Settings',   icon: 'Settings' },
  { key: 'homepage',  label: 'Homepage Settings',   icon: 'Home' },
  { key: 'founder',   label: 'Founder Settings',    icon: 'User' },
  { key: 'contact',   label: 'Contact Settings',    icon: 'Mail' },
  { key: 'social',    label: 'Social Media',        icon: 'Share2' },
  { key: 'branding',  label: 'Branding',            icon: 'Palette' },
  { key: 'seo',       label: 'SEO Settings',        icon: 'Search' },
  { key: 'analytics', label: 'Analytics',           icon: 'BarChart3' },
  { key: 'email',     label: 'Email Settings',      icon: 'Inbox' },
  { key: 'controls',  label: 'Website Controls',    icon: 'ToggleRight' },
  { key: 'legal',     label: 'Legal Pages',         icon: 'FileText' },
  { key: 'footer',    label: 'Footer Settings',     icon: 'PanelBottom' },
];
