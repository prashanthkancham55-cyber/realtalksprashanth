import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',         href: '#hero' },
  { label: 'Programs',     href: '#programs' },
  { label: 'About',        href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
];

export default function PublicHeader() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeHash,   setActiveHash]   = useState('#hero');
  const navigate = useNavigate();

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Active section detection ──────────────────────────────────────────────
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHash(`#${id}`); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegister = () => {
    setMenuOpen(false);
    navigate('/trainings');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(2,8,16,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            {/* Gold pill monogram */}
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm tracking-widest select-none"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                color: '#020810',
                boxShadow: '0 0 16px rgba(212,175,55,0.4)',
              }}
            >
              RT
            </div>

            <div className="leading-none">
              <p
                className="text-white font-bold text-lg tracking-wide group-hover:text-yellow-300 transition-colors"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                RealTalks
              </p>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#d4af37' }}>
                Prashanth Kumar
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
                style={{
                  color: activeHash === link.href ? '#f0c040' : 'rgba(255,255,255,0.8)',
                }}
              >
                {link.label}
                {activeHash === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 -bottom-px h-px rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, #f0c040, transparent)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* ── Desktop CTA ───────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center">
            <motion.button
              onClick={handleRegister}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                color: '#020810',
                boxShadow: '0 0 20px rgba(212,175,55,0.35)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.55)' }}
              whileTap={{ scale: 0.97 }}
            >
              Register Now
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* ── Mobile Hamburger ──────────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.8)' }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{
              background: 'rgba(5,11,24,0.97)',
              borderBottom: '1px solid rgba(212,175,55,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-3 rounded-lg text-base font-medium transition-colors"
                  style={{
                    color: activeHash === link.href ? '#f0c040' : 'rgba(255,255,255,0.8)',
                    background: activeHash === link.href ? 'rgba(212,175,55,0.08)' : 'transparent',
                  }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.button
                onClick={handleRegister}
                className="mt-3 w-full py-3 rounded-full text-sm font-semibold tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                  color: '#020810',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 }}
              >
                Register Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
