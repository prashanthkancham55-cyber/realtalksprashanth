'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, type LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open:          boolean;
  onClose:       () => void;
  onConfirm:     () => void;
  title?:        string;
  description?:  string;
  confirmLabel?: string;
  cancelLabel?:  string;
  variant?:      'danger' | 'warning' | 'info';
  icon?:         LucideIcon;
  loading?:      boolean;
}

const VARIANT_META = {
  danger:  { icon: Trash2,         iconColor: '#f87171', iconBg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.2)' },
  warning: { icon: AlertTriangle,  iconColor: '#fb923c', iconBg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.2)' },
  info:    { icon: AlertTriangle,  iconColor: '#60a5fa', iconBg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.2)' },
};

export function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon,
  loading = false,
}: ConfirmDialogProps) {
  const meta = VARIANT_META[variant];
  const Icon = icon ?? meta.icon;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(7,13,28,0.99)',
              border: `1px solid ${meta.border}`,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            }}
          >
            <div className="p-7 text-center">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: meta.iconBg, border: `1px solid ${meta.border}` }}
              >
                <Icon className="w-6 h-6" style={{ color: meta.iconColor }} />
              </div>

              <h3
                className="text-white font-bold text-xl mb-2 leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">{description}</p>
            </div>

            <div
              className="flex gap-3 px-6 pb-6"
            >
              <Button
                variant="ghost"
                onClick={onClose}
                fullWidth
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                loading={loading}
                fullWidth
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
