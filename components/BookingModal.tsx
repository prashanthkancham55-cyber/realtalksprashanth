'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, User, Briefcase, AlertCircle } from 'lucide-react';

/* ── Context ───────────────────────────────────────────────────── */
interface BookingModalCtx {
  openModal: () => void;
}

const BookingModalContext = createContext<BookingModalCtx>({ openModal: () => {} });

export const useBookingModal = () => useContext(BookingModalContext);

/* ── Constants ─────────────────────────────────────────────────── */
const INDUSTRIES = [
  'Real Estate',
  'Insurance',
  'Education',
  'Marketing & Sales',
  'Others',
];

const WA_NUMBER = '918143062777';

/* ── Provider + Modal ──────────────────────────────────────────── */
export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; industry?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => {
    setName('');
    setPhone('');
    setIndustry('');
    setErrors({});
    setSubmitted(false);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!phone.trim()) e.phone = 'Mobile number is required.';
    else if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!industry) e.industry = 'Please select an industry.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = [
      'Hello Prashanth,',
      '',
      'I would like to book a Discovery Call.',
      '',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Industry: ${industry}`,
      '',
      'Please contact me.',
    ].join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal();
  };

  return (
    <BookingModalContext.Provider value={{ openModal }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(3,14,31,0.85)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0b1e3a 0%, #061326 100%)',
                border: '1px solid rgba(224,192,64,0.22)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(224,192,64,0.06)',
              }}
            >
              {/* Gold top accent */}
              <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #E0C040, transparent)' }} />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 pt-7">
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(224,192,64,0.1)', border: '1px solid rgba(224,192,64,0.25)' }}
                  >
                    <Phone className="w-6 h-6" style={{ color: '#E0C040' }} />
                  </div>
                  <h2 className="heading-display text-2xl text-white mb-1">Book Your Discovery Call</h2>
                  <p className="text-white/45 text-sm">Fill in your details and we'll connect on WhatsApp</p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.name ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.10)',
                        }}
                        onFocus={(e) => { if (!errors.name) e.currentTarget.style.border = '1px solid rgba(224,192,64,0.4)'; }}
                        onBlur={(e) => { if (!errors.name) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)'; }}
                      />
                      {errors.name && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
                          <AlertCircle className="w-3 h-3" />{errors.name}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Mobile Number
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(val);
                          if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: errors.phone ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.10)',
                        }}
                        onFocus={(e) => { if (!errors.phone) e.currentTarget.style.border = '1px solid rgba(224,192,64,0.4)'; }}
                        onBlur={(e) => { if (!errors.phone) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)'; }}
                      />
                      {errors.phone && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
                          <AlertCircle className="w-3 h-3" />{errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Industry */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-3 h-3" /> Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => { setIndustry(e.target.value); if (errors.industry) setErrors((p) => ({ ...p, industry: undefined })); }}
                        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-200 appearance-none cursor-pointer"
                        style={{
                          background: 'rgba(11,30,58,0.9)',
                          border: errors.industry ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.10)',
                          color: industry ? 'white' : 'rgba(255,255,255,0.25)',
                        }}
                        onFocus={(e) => { if (!errors.industry) e.currentTarget.style.border = '1px solid rgba(224,192,64,0.4)'; }}
                        onBlur={(e) => { if (!errors.industry) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)'; }}
                      >
                        <option value="" disabled style={{ color: 'rgba(255,255,255,0.3)' }}>Select your industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind} style={{ background: '#0b1e3a', color: 'white' }}>{ind}</option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p className="text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
                          <AlertCircle className="w-3 h-3" />{errors.industry}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold mt-1 flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor">
                        <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.634 4.59 1.74 6.503L2.667 29.333l6.98-1.716A13.285 13.285 0 0016.003 29.333c7.364 0 13.33-5.97 13.33-13.333 0-7.364-5.966-13.333-13.33-13.333zm5.847 18.677c-.32-.16-1.89-.933-2.183-1.04-.294-.107-.507-.16-.72.16-.214.32-.827 1.04-.813 1.254.013.213-.107.32-.32.426-.214.107-1.895.933-3.614-.24-1.32-.87-2.293-2.027-2.64-2.347-.346-.32-.04-.493.14-.653.16-.16.32-.4.48-.6.16-.2.213-.347.32-.56.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.267-.613-.54-.533-.72-.547-.187-.013-.4-.013-.614-.013-.213 0-.56.08-.853.4-.294.32-1.12 1.093-1.12 2.666s1.147 3.094 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.507 1.813.653.76.24 1.454.2 2 .12.614-.093 1.89-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.294-.213-.614-.373z"/>
                      </svg>
                      Submit Enquiry
                    </button>

                    <p className="text-center text-white/30 text-xs">
                      Opens WhatsApp with your message ready to send
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-5 py-6 text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}
                    >
                      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="#25D366">
                        <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.634 4.59 1.74 6.503L2.667 29.333l6.98-1.716A13.285 13.285 0 0016.003 29.333c7.364 0 13.33-5.97 13.33-13.333 0-7.364-5.966-13.333-13.33-13.333zm5.847 18.677c-.32-.16-1.89-.933-2.183-1.04-.294-.107-.507-.16-.72.16-.214.32-.827 1.04-.813 1.254.013.213-.107.32-.32.426-.214.107-1.895.933-3.614-.24-1.32-.87-2.293-2.027-2.64-2.347-.346-.32-.04-.493.14-.653.16-.16.32-.4.48-.6.16-.2.213-.347.32-.56.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.267-.613-.54-.533-.72-.547-.187-.013-.4-.013-.614-.013-.213 0-.56.08-.853.4-.294.32-1.12 1.093-1.12 2.666s1.147 3.094 1.307 3.307c.16.213 2.24 3.413 5.44 4.787.76.32 1.347.507 1.813.653.76.24 1.454.2 2 .12.614-.093 1.89-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.294-.213-.614-.373z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-display text-xl text-white mb-2">WhatsApp Opened!</h3>
                      <p className="text-white/50 text-sm">Your enquiry message has been pre-filled.<br />Just hit send in WhatsApp.</p>
                    </div>
                    <button onClick={closeModal} className="btn-outline-gold px-8 py-2.5 rounded-full text-sm">
                      Close
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingModalContext.Provider>
  );
}
