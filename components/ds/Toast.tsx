'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id:       string;
  variant:  ToastVariant;
  title:    string;
  message?: string;
}

interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void;
}

interface ToastContainerProps {
  toasts:    ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

// ─── Style maps ───────────────────────────────────────────────────────────────
const VARIANT_META = {
  success: { icon: CheckCircle2,  iconColor: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.22)',   barColor: '#4ade80' },
  error:   { icon: XCircle,       iconColor: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.22)',  barColor: '#f87171' },
  warning: { icon: AlertTriangle, iconColor: '#fb923c', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.22)',   barColor: '#fb923c' },
  info:    { icon: Info,          iconColor: '#60a5fa', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.22)',   barColor: '#60a5fa' },
};

const POSITION_CLASSES = {
  'top-right':     'top-4 right-4',
  'top-center':    'top-4 left-1/2 -translate-x-1/2',
  'bottom-right':  'bottom-4 right-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

// ─── Single Toast ─────────────────────────────────────────────────────────────
function Toast({ id, variant, title, message, onDismiss }: ToastProps) {
  const meta = VARIANT_META[variant];
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: -8 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="relative w-80 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(7,13,28,0.96)',
        border: `1px solid ${meta.border}`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: meta.barColor }}
      />

      <div className="flex items-start gap-3 px-4 py-4 pl-5">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: meta.bg }}
        >
          <Icon className="w-4 h-4" style={{ color: meta.iconColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white/85 text-sm font-semibold leading-snug">{title}</p>
          {message && <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{message}</p>}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(id)}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-all flex-shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss, position = 'top-right' }: ToastContainerProps) {
  return (
    <div className={`fixed z-[100] flex flex-col gap-2.5 ${POSITION_CLASSES[position]}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── useToast hook (design-only state manager) ────────────────────────────────
export function createToast(variant: ToastVariant, title: string, message?: string): ToastItem {
  return { id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`, variant, title, message };
}
