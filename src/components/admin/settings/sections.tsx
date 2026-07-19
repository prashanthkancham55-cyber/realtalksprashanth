import type { SiteSettings, SectionKey } from '../../../types/settings';
import { Field, TextInput, TextArea, SelectInput, Toggle, ColorInput, ImageUpload, StringListEditor, LinkListEditor } from './fields';

interface SectionProps<K extends SectionKey> {
  value: SiteSettings[K];
  onChange: (v: SiteSettings[K]) => void;
}

// ── 1. General ────────────────────────────────────────────────────────────────
export function GeneralSection({ value, onChange }: SectionProps<'general'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Site Name" required>
          <TextInput value={v.site_name} onChange={e => set('site_name', e.target.value)} placeholder="RealTalks" />
        </Field>
        <Field label="Tagline">
          <TextInput value={v.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Transforming Lives Through Training" />
        </Field>
      </div>
      <Field label="Description">
        <TextArea rows={3} value={v.description} onChange={e => set('description', e.target.value)} placeholder="Short site description…" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Site URL" required>
          <TextInput value={v.site_url} onChange={e => set('site_url', e.target.value)} placeholder="https://realtalks.com" />
        </Field>
        <Field label="Language">
          <SelectInput value={v.language} onChange={e => set('language', e.target.value)}>
            <option value="en">English</option><option value="hi">Hindi</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="kn">Kannada</option>
          </SelectInput>
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Timezone">
          <TextInput value={v.timezone} onChange={e => set('timezone', e.target.value)} placeholder="Asia/Kolkata" />
        </Field>
        <Field label="Currency">
          <SelectInput value={v.currency} onChange={e => set('currency', e.target.value)}>
            <option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
          </SelectInput>
        </Field>
      </div>
      <Toggle checked={v.maintenance_mode} onChange={val => set('maintenance_mode', val)} label="Maintenance Mode" sub="Show a maintenance page to visitors" />
    </div>
  );
}

// ── 2. Homepage ───────────────────────────────────────────────────────────────
export function HomepageSection({ value, onChange }: SectionProps<'homepage'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <Field label="Hero Title" required>
        <TextInput value={v.hero_title} onChange={e => set('hero_title', e.target.value)} placeholder="Real Training. Real Transformation." />
      </Field>
      <Field label="Hero Subtitle" required>
        <TextInput value={v.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} placeholder="Founder & Corporate Trainer" />
      </Field>
      <ImageUpload label="Hero Background" folder="hero" value={v.hero_background} onChange={url => set('hero_background', url)} />
      <Field label="Featured Training Slug">
        <TextInput value={v.featured_training_slug} onChange={e => set('featured_training_slug', e.target.value)} placeholder="sales-mastery-bootcamp" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle checked={v.show_announcement} onChange={val => set('show_announcement', val)} label="Announcement Bar" sub="Show a banner at the top" />
        <Toggle checked={v.show_trainings}    onChange={val => set('show_trainings', val)}    label="Trainings Section" />
      </div>
      {v.show_announcement && (
        <Field label="Announcement Text">
          <TextInput value={v.announcement_bar} onChange={e => set('announcement_bar', e.target.value)} placeholder="New batch starting soon!" />
        </Field>
      )}
      <div className="grid sm:grid-cols-3 gap-3">
        <Toggle checked={v.show_testimonials} onChange={val => set('show_testimonials', val)} label="Testimonials" />
        <Toggle checked={v.show_gallery}       onChange={val => set('show_gallery', val)}       label="Gallery" />
        <Toggle checked={v.show_videos}         onChange={val => set('show_videos', val)}         label="Videos" />
      </div>
      <Toggle checked={v.show_blog} onChange={val => set('show_blog', val)} label="Blog Section" />
    </div>
  );
}

// ── 3. Founder ────────────────────────────────────────────────────────────────
export function FounderSection({ value, onChange }: SectionProps<'founder'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <TextInput value={v.name} onChange={e => set('name', e.target.value)} placeholder="Prashanth" />
        </Field>
        <Field label="Role" required>
          <TextInput value={v.role} onChange={e => set('role', e.target.value)} placeholder="Founder & Corporate Trainer" />
        </Field>
      </div>
      <ImageUpload label="Founder Image" folder="founder" value={v.image_url} onChange={url => set('image_url', url)} aspect="aspect-[3/4]" />
      <Field label="Bio">
        <TextArea rows={4} value={v.bio} onChange={e => set('bio', e.target.value)} placeholder="Short biography…" />
      </Field>
      <Field label="Quote">
        <TextArea rows={2} value={v.quote} onChange={e => set('quote', e.target.value)} placeholder="Real training creates real transformation." />
      </Field>
      <Field label="Years of Experience">
        <TextInput type="number" value={v.years_experience} onChange={e => set('years_experience', Number(e.target.value))} />
      </Field>
      <Field label="Specializations">
        <StringListEditor values={v.specializations} onChange={val => set('specializations', val)} placeholder="e.g. Sales, Leadership" />
      </Field>
      <Field label="Certifications">
        <StringListEditor values={v.certifications} onChange={val => set('certifications', val)} placeholder="e.g. ICF Certified" />
      </Field>
    </div>
  );
}

// ── 4. Contact ────────────────────────────────────────────────────────────────
export function ContactSection({ value, onChange }: SectionProps<'contact'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" required>
          <TextInput value={v.email} onChange={e => set('email', e.target.value)} placeholder="contact@realtalks.com" />
        </Field>
        <Field label="Phone" required>
          <TextInput value={v.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        </Field>
      </div>
      <Field label="Alt Phone">
        <TextInput value={v.alt_phone} onChange={e => set('alt_phone', e.target.value)} />
      </Field>
      <Field label="Address" required>
        <TextArea rows={2} value={v.address} onChange={e => set('address', e.target.value)} />
      </Field>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="City"><TextInput value={v.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label="State"><TextInput value={v.state} onChange={e => set('state', e.target.value)} /></Field>
        <Field label="Country"><TextInput value={v.country} onChange={e => set('country', e.target.value)} /></Field>
        <Field label="Postal Code"><TextInput value={v.postal_code} onChange={e => set('postal_code', e.target.value)} /></Field>
      </div>
      <Field label="Business Hours">
        <TextInput value={v.business_hours} onChange={e => set('business_hours', e.target.value)} placeholder="Mon–Sat, 9:00 AM – 7:00 PM" />
      </Field>
      <Field label="Google Map Embed URL" hint="Paste the src URL from Google Maps embed">
        <TextArea rows={2} value={v.map_embed} onChange={e => set('map_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
      </Field>
    </div>
  );
}

// ── 5. Social ─────────────────────────────────────────────────────────────────
export function SocialSection({ value, onChange }: SectionProps<'social'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  const fields: [keyof typeof v, string][] = [
    ['youtube',   'YouTube'], ['instagram', 'Instagram'], ['facebook', 'Facebook'],
    ['linkedin', 'LinkedIn'], ['twitter',   'Twitter / X'], ['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'],
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map(([k, label]) => (
        <Field key={k} label={label}>
          <TextInput value={v[k] as string} onChange={e => set(k, e.target.value)} placeholder={`https://${label.toLowerCase()}.com/…`} />
        </Field>
      ))}
    </div>
  );
}

// ── 6. Branding ───────────────────────────────────────────────────────────────
export function BrandingSection({ value, onChange }: SectionProps<'branding'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <ImageUpload label="Logo (Light / Default)" folder="logo" value={v.logo_url} onChange={url => set('logo_url', url)} aspect="aspect-[3/1]" />
      <ImageUpload label="Logo (Dark / White)" folder="logo" value={v.logo_light_url} onChange={url => set('logo_light_url', url)} aspect="aspect-[3/1]" />
      <ImageUpload label="Favicon" folder="favicon" value={v.favicon_url} onChange={url => set('favicon_url', url)} aspect="aspect-square" />
      <ImageUpload label="OG Image" folder="og" value={v.og_image_url} onChange={url => set('og_image_url', url)} aspect="aspect-[1.91/1]" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Primary Color" required><ColorInput value={v.primary_color} onChange={c => set('primary_color', c)} /></Field>
        <Field label="Secondary Color" required><ColorInput value={v.secondary_color} onChange={c => set('secondary_color', c)} /></Field>
        <Field label="Accent Color"><ColorInput value={v.accent_color} onChange={c => set('accent_color', c)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Heading Font"><TextInput value={v.font_heading} onChange={e => set('font_heading', e.target.value)} placeholder="Cormorant Garamond" /></Field>
        <Field label="Body Font"><TextInput value={v.font_body} onChange={e => set('font_body', e.target.value)} placeholder="Inter" /></Field>
      </div>
    </div>
  );
}

// ── 7. SEO ─────────────────────────────────────────────────────────────────────
export function SeoSection({ value, onChange }: SectionProps<'seo'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <Field label="Meta Title" required>
        <TextInput value={v.meta_title} onChange={e => set('meta_title', e.target.value)} />
      </Field>
      <Field label="Meta Description" required>
        <TextArea rows={3} value={v.meta_description} onChange={e => set('meta_description', e.target.value)} />
      </Field>
      <Field label="Meta Keywords">
        <TextInput value={v.meta_keywords} onChange={e => set('meta_keywords', e.target.value)} placeholder="corporate training, sales, leadership" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="OG Title"><TextInput value={v.og_title} onChange={e => set('og_title', e.target.value)} /></Field>
        <Field label="OG Description"><TextInput value={v.og_description} onChange={e => set('og_description', e.target.value)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Twitter Card Type">
          <SelectInput value={v.twitter_card} onChange={e => set('twitter_card', e.target.value)}>
            <option value="summary">Summary</option><option value="summary_large_image">Summary Large Image</option><option value="player">Player</option>
          </SelectInput>
        </Field>
        <Field label="Canonical URL"><TextInput value={v.canonical_url} onChange={e => set('canonical_url', e.target.value)} /></Field>
      </div>
      <Field label="Structured Data (JSON-LD)">
        <TextArea rows={4} value={v.structured_data} onChange={e => set('structured_data', e.target.value)} placeholder='{ "@context": "https://schema.org" }' />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle checked={v.robots_index}   onChange={val => set('robots_index', val)}    label="Allow Search Engine Indexing" />
        <Toggle checked={v.sitemap_enabled} onChange={val => set('sitemap_enabled', val)} label="Sitemap Enabled" />
      </div>
    </div>
  );
}

// ── 8. Analytics ──────────────────────────────────────────────────────────────
export function AnalyticsSection({ value, onChange }: SectionProps<'analytics'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <Toggle checked={v.enable_tracking} onChange={val => set('enable_tracking', val)} label="Enable Tracking" sub="Master switch for all analytics" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Google Analytics ID"><TextInput value={v.google_analytics_id} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXX" /></Field>
        <Field label="Facebook Pixel ID"><TextInput value={v.facebook_pixel_id} onChange={e => set('facebook_pixel_id', e.target.value)} placeholder="123456789" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Hotjar ID"><TextInput value={v.hotjar_id} onChange={e => set('hotjar_id', e.target.value)} /></Field>
        <Field label="Microsoft Clarity"><TextInput value={v.microsoft_clarity} onChange={e => set('microsoft_clarity', e.target.value)} /></Field>
      </div>
      <Field label="Google Tag Manager ID"><TextInput value={v.tag_manager_id} onChange={e => set('tag_manager_id', e.target.value)} placeholder="GTM-XXXXXX" /></Field>
    </div>
  );
}

// ── 9. Email ───────────────────────────────────────────────────────────────────
export function EmailSection({ value, onChange }: SectionProps<'email'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <Toggle checked={v.enable_smtp} onChange={val => set('enable_smtp', val)} label="Enable SMTP" sub="Use custom SMTP server for outgoing email" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="SMTP Host"><TextInput value={v.smtp_host} onChange={e => set('smtp_host', e.target.value)} placeholder="smtp.gmail.com" /></Field>
        <Field label="SMTP Port"><TextInput type="number" value={v.smtp_port} onChange={e => set('smtp_port', Number(e.target.value))} placeholder="587" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="SMTP Username"><TextInput value={v.smtp_username} onChange={e => set('smtp_username', e.target.value)} /></Field>
        <Field label="SMTP Password"><TextInput type="password" value={v.smtp_password} onChange={e => set('smtp_password', e.target.value)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="From Email" required={!!v.enable_smtp}><TextInput value={v.from_email} onChange={e => set('from_email', e.target.value)} /></Field>
        <Field label="From Name"><TextInput value={v.from_name} onChange={e => set('from_name', e.target.value)} /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Reply-To"><TextInput value={v.reply_to} onChange={e => set('reply_to', e.target.value)} /></Field>
        <Field label="Contact Email"><TextInput value={v.contact_email} onChange={e => set('contact_email', e.target.value)} /></Field>
      </div>
    </div>
  );
}

// ── 10. Controls ──────────────────────────────────────────────────────────────
export function ControlsSection({ value, onChange }: SectionProps<'controls'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Toggle checked={v.registration_open} onChange={val => set('registration_open', val)} label="Registration Open" sub="Allow new student registrations" />
      <Toggle checked={v.contact_form_open} onChange={val => set('contact_form_open', val)} label="Contact Form Open" sub="Accept contact form submissions" />
      <Toggle checked={v.comments_enabled}  onChange={val => set('comments_enabled', val)}  label="Comments Enabled" />
      <Toggle checked={v.force_https}       onChange={val => set('force_https', val)}       label="Force HTTPS" />
      <Toggle checked={v.cache_enabled}      onChange={val => set('cache_enabled', val)}     label="Cache Enabled" />
      <Toggle checked={v.debug_mode}         onChange={val => set('debug_mode', val)}        label="Debug Mode" sub="Show detailed errors (disable in production)" />
    </div>
  );
}

// ── 11. Legal ──────────────────────────────────────────────────────────────────
export function LegalSection({ value, onChange }: SectionProps<'legal'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  const fields: [keyof typeof v, string][] = [
    ['privacy_policy',  'Privacy Policy'],
    ['terms_of_service', 'Terms of Service'],
    ['cookie_policy',   'Cookie Policy'],
    ['disclaimer',       'Disclaimer'],
    ['refund_policy',    'Refund Policy'],
  ];
  return (
    <div className="flex flex-col gap-5">
      {fields.map(([k, label]) => (
        <Field key={k} label={label}>
          <TextArea rows={5} value={v[k] as string} onChange={e => set(k, e.target.value)} placeholder={`${label} content…`} />
        </Field>
      ))}
    </div>
  );
}

// ── 12. Footer ─────────────────────────────────────────────────────────────────
export function FooterSection({ value, onChange }: SectionProps<'footer'>) {
  const v = value; const set = (k: keyof typeof v, val: typeof v[typeof k]) => onChange({ ...v, [k]: val });
  return (
    <div className="flex flex-col gap-5">
      <Field label="About Text">
        <TextArea rows={3} value={v.about_text} onChange={e => set('about_text', e.target.value)} />
      </Field>
      <Field label="Copyright Text">
        <TextInput value={v.copyright_text} onChange={e => set('copyright_text', e.target.value)} placeholder="© 2026 RealTalks. All rights reserved." />
      </Field>
      <div className="grid sm:grid-cols-3 gap-3">
        <Toggle checked={v.show_social}  onChange={val => set('show_social', val)}  label="Show Social Links" />
        <Toggle checked={v.show_legal}   onChange={val => set('show_legal', val)}   label="Show Legal Links" />
        <Toggle checked={v.show_contact} onChange={val => set('show_contact', val)} label="Show Contact Info" />
      </div>
      <Field label="Footer Links">
        <LinkListEditor values={v.footer_links} onChange={val => set('footer_links', val)} />
      </Field>
    </div>
  );
}

// ── Section registry ──────────────────────────────────────────────────────────
export const SECTION_RENDERERS: Record<SectionKey, React.ComponentType<SectionProps<SectionKey>>> = {
  general:   GeneralSection   as React.ComponentType<SectionProps<SectionKey>>,
  homepage:  HomepageSection  as React.ComponentType<SectionProps<SectionKey>>,
  founder:   FounderSection   as React.ComponentType<SectionProps<SectionKey>>,
  contact:   ContactSection   as React.ComponentType<SectionProps<SectionKey>>,
  social:    SocialSection    as React.ComponentType<SectionProps<SectionKey>>,
  branding:  BrandingSection  as React.ComponentType<SectionProps<SectionKey>>,
  seo:       SeoSection       as React.ComponentType<SectionProps<SectionKey>>,
  analytics: AnalyticsSection as React.ComponentType<SectionProps<SectionKey>>,
  email:     EmailSection     as React.ComponentType<SectionProps<SectionKey>>,
  controls:  ControlsSection  as React.ComponentType<SectionProps<SectionKey>>,
  legal:     LegalSection     as React.ComponentType<SectionProps<SectionKey>>,
  footer:    FooterSection    as React.ComponentType<SectionProps<SectionKey>>,
};
