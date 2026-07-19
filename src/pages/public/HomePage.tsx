import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../lib/useSettings';

export default function HomePage() {
  const { settings, loading } = useSettings();
  const { homepage: hp, founder, contact, social, branding, footer, general } = settings;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#020810' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#d4af37', borderTopColor: 'transparent' }} />
    </div>;
  }

  if (general.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#020810' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Under Maintenance</h1>
          <p className="text-white/50">We'll be back shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#020810' }}>
      {/* Announcement bar */}
      {hp.show_announcement && hp.announcement_bar && (
        <div className="px-4 py-2.5 text-center text-sm" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>
          {hp.announcement_bar}
        </div>
      )}

      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32 text-center" style={{ background: branding.secondary_color }}>
        {hp.hero_background && (
          <img src={hp.hero_background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display text-white leading-tight"
          >
            {hp.hero_title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-lg text-white/50 mt-4"
          >
            {hp.hero_subtitle}
          </motion.p>
        </div>
      </section>

      {/* Founder */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[280px_1fr] gap-10 items-center">
          {founder.image_url && (
            <div className="rounded-2xl overflow-hidden aspect-[3/4] mx-auto max-w-xs" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={founder.image_url} alt={founder.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: branding.primary_color }}>{founder.role}</span>
            <h2 className="text-3xl font-bold font-display text-white">{founder.name}</h2>
            <p className="text-white/55 leading-relaxed">{founder.bio}</p>
            {founder.quote && (
              <blockquote className="text-lg italic font-display text-white/70 pl-4" style={{ borderLeft: `2px solid ${branding.primary_color}` }}>
                "{founder.quote}"
              </blockquote>
            )}
            {founder.specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {founder.specializations.map(s => (
                  <span key={s} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: `${branding.primary_color}15`, border: `1px solid ${branding.primary_color}30`, color: branding.primary_color }}>{s}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-display text-white text-center mb-10">Get in Touch</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a href={`mailto:${contact.email}`} className="flex flex-col items-center gap-2 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Mail className="w-5 h-5" style={{ color: branding.primary_color }} />
            <span className="text-sm text-white/70">{contact.email}</span>
          </a>
          <a href={`tel:${contact.phone}`} className="flex flex-col items-center gap-2 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Phone className="w-5 h-5" style={{ color: branding.primary_color }} />
            <span className="text-sm text-white/70">{contact.phone}</span>
          </a>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <MapPin className="w-5 h-5" style={{ color: branding.primary_color }} />
            <span className="text-sm text-white/70 text-center">{contact.city}, {contact.country}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10" style={{ background: '#050b18', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/40 text-sm max-w-md">{footer.about_text}</p>
          </div>
          {footer.show_social && (
            <div className="flex gap-3">
              {Object.entries(social).filter(([, url]) => url).map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noreferrer" className="text-xs capitalize text-white/50 hover:text-white transition-colors">{k}</a>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white/30 text-xs text-center">{footer.copyright_text}</p>
        </div>
      </footer>
    </div>
  );
}
