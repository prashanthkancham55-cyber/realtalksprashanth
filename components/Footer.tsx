'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Facebook, Youtube, MessageCircle, Mail, Globe, ArrowUp } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Training Programs', href: '#programs' },
  { label: 'Gallery', href: '#gallery' },
];

const moreLinks = [
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
  { label: 'Book a Call', href: '#contact' },
];

const socials = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: '#0A66C2' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', color: '#E1306C' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', color: '#1877F2' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com', color: '#FF0000' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/918143062777', color: '#25D366' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #050b18 100%)' }}>
      {/* Top divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />

      {/* BG pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Image
              src="/images/ChatGPT_Image_Jul_5,_2026,_07_56_41_AM copy.png"
              alt="RealTalks Prashanth"
              height={50}
              width={250}
              className="h-12 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
            <div className="text-gold-500 text-xs tracking-widest">SPEAK • INSPIRE • TRANSFORM</div>

            <p className="text-white/50 text-sm leading-relaxed">
              Transforming professionals, leaders, and businesses through world-class training and coaching.
            </p>

            {/* Social Links */}
            <div className="flex gap-2.5 flex-wrap">
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/25 text-white/60 hover:text-white transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                  style={{ ['--hover-color' as string]: color }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Quick Links</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-3">
              {quickLinks.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="text-white/55 text-sm hover:text-gold-400 transition-colors duration-200 text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* More Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">More</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-3">
              {moreLinks.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => scrollTo(href)}
                  className="text-white/55 text-sm hover:text-gold-400 transition-colors duration-200 text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest">Contact</h4>
            <div className="divider-gold" />
            <div className="flex flex-col gap-4">
              <a
                href="mailto:speakers@realtalksprashanth.in"
                className="flex items-start gap-3 group"
              >
                <Mail className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/55 text-sm group-hover:text-gold-400 transition-colors duration-200 break-all">
                  speakers@realtalksprashanth.in
                </span>
              </a>
              <a
                href="https://www.realtalksprashanth.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <Globe className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span className="text-white/55 text-sm group-hover:text-gold-400 transition-colors duration-200">
                  www.realtalksprashanth.in
                </span>
              </a>

              {/* Book Call mini CTA */}
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-gold flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold mt-2"
              >
                Book Free Discovery Call
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/8">
          <p className="text-white/40 text-sm text-center sm:text-left">
            &copy; 2026 RealTalks_Prashanth. All Rights Reserved. Crafted with excellence.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/30 text-xs">Designed for Impact</span>
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-gold-500/30 text-gold-500 hover:bg-gold-500/10 transition-colors duration-200"
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
