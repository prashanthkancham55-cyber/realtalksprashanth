import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { getPopupTraining } from '../../lib/trainingService';
import type { Training } from '../../types/training';
import { formatDate, formatPrice } from '../../types/training';

// ── Constants ─────────────────────────────────────────────────────────────────
const LS_KEY     = 'rt_popup_last_shown';
const DELAY_MS   = 5_000;          // show after 5 seconds
const COOLDOWN_H = 24;             // only once per 24 hours

function shouldShow(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return true;
    const last = parseInt(raw, 10);
    if (isNaN(last)) return true;
    const hoursSince = (Date.now() - last) / (1000 * 60 * 60);
    return hoursSince >= COOLDOWN_H;
  } catch {
    return true;
  }
}

function markShown(): void {
  try {
    localStorage.setItem(LS_KEY, Date.now().toString());
  } catch {
    // localStorage may be blocked in some environments — fail silently
  }
}

// ── Backdrop overlay ──────────────────────────────────────────────────────────
const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

// ── Modal card ────────────────────────────────────────────────────────────────
const modalVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 16,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

export default function TrainingPopup() {
  const [training, setTraining] = useState<Training | null>(null);
  const [visible,  setVisible]  = useState(false);
  const navigate = useNavigate();

  // ── Fetch + schedule ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow()) return;

    let timer: ReturnType<typeof setTimeout>;

    getPopupTraining()
      .then(data => {
        if (!data) return;
        setTraining(data);
        timer = setTimeout(() => {
          setVisible(true);
          markShown();
        }, DELAY_MS);
      })
      .catch(() => {
        // silently fail – popup is non-critical
      });

    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const handleRegister = () => {
    if (!training) return;
    close();
    navigate(`/register/${training.slug}`);
  };

  const handleRemindLater = () => {
    // Clear the stored timestamp so it shows again next visit
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
    close();
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  if (!training) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="popup-backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(2,8,16,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={close}
            aria-label="Close popup"
          />

          {/* ── Modal ────────────────────────────────────────────────────── */}
          <motion.div
            key="popup-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden pointer-events-auto"
              style={{
                background: 'linear-gradient(145deg, #0d1630 0%, #050b18 100%)',
                border: '1px solid rgba(212,175,55,0.4)',
                boxShadow:
                  '0 0 0 1px rgba(212,175,55,0.1), 0 30px 80px rgba(0,0,0,0.7), 0 0 40px rgba(212,175,55,0.1)',
              }}
            >
              {/* ── Gold top accent bar ───────────────────────────────────── */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #d4af37, #f0c040, #d4af37, transparent)',
                }}
              />

              {/* ── Close button ──────────────────────────────────────────── */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.6)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#f0c040';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ── Banner image ──────────────────────────────────────────── */}
              {training.banner_url ? (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={training.banner_url}
                    alt={training.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(2,8,16,0.15) 0%, rgba(2,8,16,0.65) 100%)',
                    }}
                  />
                  {/* Category chip on image */}
                  <div className="absolute bottom-3 left-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: 'rgba(212,175,55,0.2)',
                        border: '1px solid rgba(212,175,55,0.45)',
                        color: '#f0c040',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {training.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="h-20 flex items-end px-4 pb-3"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(13,22,48,0.9) 0%, rgba(5,11,24,0.9) 100%)',
                  }}
                >
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                    style={{
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.35)',
                      color: '#f0c040',
                    }}
                  >
                    {training.category}
                  </span>
                </div>
              )}

              {/* ── Content ───────────────────────────────────────────────── */}
              <div className="px-5 pt-5 pb-6">
                {/* Label */}
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: '#d4af37' }}
                >
                  🎯 Don't Miss Out — Limited Seats
                </p>

                {/* Title */}
                <h2
                  id="popup-title"
                  className="text-xl font-bold leading-snug text-white mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  {training.title}
                </h2>

                {/* Info rows */}
                <div className="flex flex-col gap-2 mb-5">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d4af37' }} />
                    <span>{formatDate(training.start_date)}</span>
                    {training.session_time && (
                      <>
                        <Clock className="w-3.5 h-3.5 flex-shrink-0 ml-1" style={{ color: '#d4af37' }} />
                        <span>{training.session_time}</span>
                      </>
                    )}
                  </div>
                  {training.location && (
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d4af37' }} />
                      <span>{training.location}</span>
                    </div>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Investment
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: 'Cormorant Garamond, Georgia, serif',
                        background:
                          training.price === 0
                            ? '#4ade80'
                            : 'linear-gradient(135deg, #d4af37, #f0c040)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {formatPrice(training.price)}
                    </p>
                  </div>

                  <motion.button
                    onClick={handleRegister}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-semibold"
                    style={{
                      background:
                        'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                      color: '#020810',
                      boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.6)' }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Register Now
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Remind me later */}
                <div className="text-center">
                  <button
                    onClick={handleRemindLater}
                    className="text-xs underline underline-offset-2 transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Remind me later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
