import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

// ── Social icon SVGs (inline, no extra package needed) ────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.882c-.072.272.159.527.437.47l6.305-1.438A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.213-3.731.851.87-3.638-.235-.375A9.818 9.818 0 112 12a9.818 9.818 0 0110 9.818z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Home',     href: '#hero' },
  { label: 'Programs', href: '#programs' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
];

const PROGRAM_LINKS = [
  { label: 'Sales Training',         href: '/trainings' },
  { label: 'Leadership Training',    href: '/trainings' },
  { label: 'Corporate Training',     href: '/trainings' },
  { label: 'Motivational Sessions',  href: '/trainings' },
];

const SOCIAL_LINKS = [
  { icon: WhatsAppIcon,  href: 'https://wa.me/919000000000', label: 'WhatsApp',  color: '#25D366' },
  { icon: InstagramIcon, href: 'https://instagram.com/',     label: 'Instagram', color: '#E1306C' },
  { icon: LinkedInIcon,  href: 'https://linkedin.com/',      label: 'LinkedIn',  color: '#0A66C2' },
  { icon: YouTubeIcon,   href: 'https://youtube.com/',       label: 'YouTube',   color: '#FF0000' },
];

const DIVIDER_GOLD: CSSProperties = {
  borderColor: 'rgba(212,175,55,0.2)',
};

export default function PublicFooter() {
  const scrollTo = (hash: string) => {
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{ background: 'linear-gradient(180deg, #050b18 0%, #020810 100%)' }}
      className="relative"
    >
      {/* Gold top border accent */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f0c040, #d4af37, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 – Brand */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm tracking-widest select-none flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                  color: '#020810',
                  boxShadow: '0 0 18px rgba(212,175,55,0.35)',
                }}
              >
                RT
              </div>
              <div className="leading-none">
                <p
                  className="text-white font-bold text-xl tracking-wide"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  RealTalks
                </p>
                <p className="text-xs tracking-widest uppercase" style={{ color: '#d4af37' }}>
                  Prashanth Kumar
                </p>
              </div>
            </div>

            {/* Tagline */}
            <p
              className="text-base font-medium italic leading-snug"
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                background: 'linear-gradient(135deg, #d4af37, #f0c040)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              "Transforming Careers, Inspiring Greatness"
            </p>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              India's premier corporate training platform, empowering professionals to reach
              their highest potential through world-class training programs.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = color;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = color;
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 12px ${color}55`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#d4af37' }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-colors group-hover:bg-yellow-400"
                      style={{ background: 'rgba(212,175,55,0.5)' }}
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Training Programs */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#d4af37' }}
            >
              Training Programs
            </h4>
            <ul className="flex flex-col gap-2.5">
              {PROGRAM_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm transition-colors hover:text-white flex items-center gap-1.5 group"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-colors group-hover:bg-yellow-400"
                      style={{ background: 'rgba(212,175,55,0.5)' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Contact */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-widest mb-5"
              style={{ color: '#d4af37' }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:+919000000000"
                  className="flex items-start gap-3 text-sm transition-colors hover:text-white group"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Phone
                    className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-yellow-400 transition-colors"
                    style={{ color: '#d4af37' }}
                  />
                  +91 90000 00000
                </a>
              </li>
              <li>
                <a
                  href="mailto:prashanth@realtalks.in"
                  className="flex items-start gap-3 text-sm transition-colors hover:text-white group"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Mail
                    className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:text-yellow-400 transition-colors"
                    style={{ color: '#d4af37' }}
                  />
                  prashanth@realtalks.in
                </a>
              </li>
              <li>
                <div
                  className="flex items-start gap-3 text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: '#d4af37' }}
                  />
                  <span>Hyderabad, Telangana, India</span>
                </div>
              </li>
              <li>
                <a
                  href="https://realtalks.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white group"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <ExternalLink
                    className="w-4 h-4 flex-shrink-0 group-hover:text-yellow-400 transition-colors"
                    style={{ color: '#d4af37' }}
                  />
                  www.realtalks.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div className="border-t mb-6" style={DIVIDER_GOLD} />

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <p>© 2026 RealTalks Prashanth. All Rights Reserved.</p>
          <p>
            Crafted with ❤️ for{' '}
            <span style={{ color: '#d4af37' }}>Prashanth Kumar</span>
            {' '}· Designed to Inspire
          </p>
        </div>
      </div>
    </footer>
  );
}
