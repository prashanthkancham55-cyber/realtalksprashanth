'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open:        boolean;
  onClose:     () => void;
  title?:      string;
  description?: string;
  children:    React.ReactNode;
  footer?:     React.ReactNode;
  size?:       'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  open, onClose, title, description, children, footer, size = 'md', closeOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative w-full ${SIZES[size]} max-h-[90vh] flex flex-col z-10 rounded-3xl overflow-hidden`}
            style={{
              background: 'rgba(7,13,28,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Header */}
            {(title || description) && (
              <div
                className="flex items-start justify-between gap-4 px-6 py-5 border-b flex-shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div>
                  {title && (
                    <h2 className="text-white font-bold text-lg leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {title}
                    </h2>
                  )}
                  {description && <p className="text-white/40 text-sm mt-0.5">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white/70 hover:bg-white/8 transition-all flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
