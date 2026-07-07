'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Facebook, Youtube, MessageCircle, Mail, Phone, ArrowUp } from 'lucide-react';
import { useBookingModal } from './BookingModal';

const quickLinks = [
  { label: 'Home',             href: '#home' },
  { label: 'About',            href: '#about' },
  { label: 'Training Programs', href: '#programs' },
  { label: 'Gallery',          href: '#gallery' },
  { label: 'Testimonials',     href: '#testimonials' },
  { label: 'FAQ',              href: '#faq' },
  { label: 'Contact',          href: '#contact' },
];

const services = [
  'Corporate Training',
  'Sales Training',
  'Leadership Coaching',
  'Motivational Speaking',
  'Freshers Training',
  'Custom Programs',
];

const socials = [
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/realtalksprashanth?utm_source=qr&igsh=ZWozNXV5amRyOGNw',
    color: '#E1306C',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1CegWPdwhT/',
    color: '#1877F2',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    href: 'https://youtube.com/@realtalks_prashanth?si=2AATle6IF0UP6lWH',
    color: '#FF0000',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/prashanth-k-0772423b8?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    color: '#0A66C2',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/918143062777',
    color: '#25D366',
  },
];

export default function Footer() {
  const { openModal } = useBookingModal();

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: '#081B33' }}
    >
      {/* Top accent line */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(224,192,64,0.5), transparent)' }} />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(224,192,64,0.2) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Image
              src="/images/Untitled_design_(7).png"
              alt="Real Talks Prashanth"
              height={50}
              width={260}
              className="h-12 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
            <p className="text-xs tracking-widest font-semibold" style={{ color: 'rgba(224,192,64,0.7)' }}>
              SPEAK • INSPIRE • TRANSFORM
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              Transforming professionals, leaders, and businesses through world-class training and coaching.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 flex-wrap">
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/30 text-white/50 hover:text-white transition-all duration-250 hover:scale-110 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}50`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Quick Links</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-3">
              {quickLinks.map(({ label, href }) => (
                <button
                  key={href + label}
                  onClick={() => scrollTo(href)}
                  className="text-white/50 text-sm hover:text-gold-400 transition-colors duration-200 text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold-500/0 group-hover:bg-gold-500/80 transition-all duration-200 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Services ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Services</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={openModal}
                  className="text-white/50 text-sm hover:text-gold-400 transition-colors duration-200 text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gold-500/0 group-hover:bg-gold-500/80 transition-all duration-200 flex-shrink-0" />
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Contact</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-4">
              <a
                href="tel:+918143062777"
                className="flex items-start gap-3 group"
              >
                <Phone className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm group-hover:text-gold-400 transition-colors duration-200">
                  +91 8143062777
                </span>
              </a>
              <a
                href="mailto:speaker@realtalksprashanth.in"
                className="flex items-start gap-3 group"
              >
                <Mail className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm group-hover:text-gold-400 transition-colors duration-200 break-all">
                  speaker@realtalksprashanth.in
                </span>
              </a>

              <button
                onClick={openModal}
                className="btn-gold flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold mt-1"
              >
                Book Free Discovery Call
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t"
          style={{ borderTopColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="text-white/35 text-sm text-center sm:text-left">
            &copy; 2026 RealTalks Prashanth. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/25 text-xs tracking-widest uppercase">Crafted for Impact</span>
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border text-gold-500 hover:bg-gold-500/10 transition-colors duration-200"
              style={{ borderColor: 'rgba(224,192,64,0.3)' }}
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
