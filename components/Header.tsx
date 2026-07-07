'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useBookingModal } from './BookingModal';

const navLinks = [
  { label: 'Home',     href: '#home' },
  { label: 'About',   href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Contact',  href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { openModal } = useBookingModal();

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-2xl border-b' : 'bg-transparent'
      }`}
      style={scrolled ? {
        background: 'rgba(6,19,38,0.12)',
        borderBottomColor: 'rgba(224,192,64,0.10)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 lg:px-8">

        {/* Logo — 15-20% larger */}
        <button
          onClick={() => scrollTo('#home')}
          className="group flex-shrink-0"
          aria-label="Real Talks Prashanth — Home"
        >
          <Image
            src="/images/Untitled_design_(7).png"
            alt="Real Talks Prashanth"
            height={62}
            width={340}
            className="h-[46px] w-auto md:h-[62px] object-contain transition-opacity duration-300 group-hover:opacity-85"
            style={{ mixBlendMode: 'screen' }}
            priority
          />
        </button>

        {/* Desktop Nav — increased spacing */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => scrollTo(link.href)} className="nav-link">
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={openModal}
            className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            Book a Free Discovery Call
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 text-white/80 hover:text-gold-400 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-b"
            style={{ background: 'rgba(6,19,38,0.97)', backdropFilter: 'blur(20px)', borderBottomColor: 'rgba(224,192,64,0.12)' }}
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-white/80 hover:text-gold-400 font-medium py-2 border-b border-white/5 last:border-0 transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.07 }}
              >
                <button
                  onClick={() => scrollTo('#contact')}
                  className="btn-gold flex items-center justify-center gap-2 py-3 rounded-full text-sm w-full"
                >
                  <Phone className="w-4 h-4" />
                  Book a Free Discovery Call
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
