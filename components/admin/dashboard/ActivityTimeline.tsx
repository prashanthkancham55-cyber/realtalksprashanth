'use client';

import { motion } from 'framer-motion';
import {
  Image as ImageIcon, MessageSquare, Mail, BookOpen, CreditCard,
  UserPlus, Settings, CheckCircle2, Clock,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: typeof ImageIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'pending';
  actor?: string;
}

const ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    icon: CheckCircle2,
    iconColor: '#4ade80',
    iconBg: 'rgba(74,222,128,0.08)',
    title: 'Admin dashboard deployed',
    description: 'Phase 1 foundation is live. Gallery, testimonials and enquiries are fully operational.',
    time: 'Today',
    type: 'success',
    actor: 'System',
  },
  {
    id: '2',
    icon: ImageIcon,
    iconColor: '#38bdf8',
    iconBg: 'rgba(56,189,248,0.08)',
    title: 'Gallery module activated',
    description: 'Supabase Storage buckets configured. Photo upload and management enabled.',
    time: 'Phase 1',
    type: 'success',
    actor: 'Admin',
  },
  {
    id: '3',
    icon: MessageSquare,
    iconColor: '#4ade80',
    iconBg: 'rgba(74,222,128,0.08)',
    title: 'Testimonials module live',
    description: 'Client review system with star ratings and photo uploads is active.',
    time: 'Phase 1',
    type: 'success',
    actor: 'Admin',
  },
  {
    id: '4',
    icon: Mail,
    iconColor: '#fb923c',
    iconBg: 'rgba(251,146,60,0.08)',
    title: 'Enquiries module ready',
    description: 'Contact form submissions are being tracked with read/unread filtering.',
    time: 'Phase 1',
    type: 'info',
    actor: 'System',
  },
  {
    id: '5',
    icon: BookOpen,
    iconColor: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.08)',
    title: 'Training Management — coming soon',
    description: 'Create and manage corporate training programs with seat and mode control.',
    time: 'Phase 2',
    type: 'pending',
    actor: 'Roadmap',
  },
  {
    id: '6',
    icon: UserPlus,
    iconColor: '#a78bfa',
    iconBg: 'rgba(167,139,250,0.08)',
    title: 'Student Registrations — planned',
    description: 'Online registration system with automated confirmations and waitlisting.',
    time: 'Phase 2',
    type: 'pending',
    actor: 'Roadmap',
  },
  {
    id: '7',
    icon: CreditCard,
    iconColor: '#d4af37',
    iconBg: 'rgba(212,175,55,0.08)',
    title: 'Payment Gateway — planned',
    description: 'Integrated payment processing with real-time revenue tracking.',
    time: 'Phase 2',
    type: 'warning',
    actor: 'Roadmap',
  },
  {
    id: '8',
    icon: Settings,
    iconColor: '#94a3b8',
    iconBg: 'rgba(148,163,184,0.08)',
    title: 'Website Settings panel — planned',
    description: 'Manage SEO, social links, and site-wide configuration from one place.',
    time: 'Phase 2',
    type: 'warning',
    actor: 'Roadmap',
  },
];

const TYPE_META = {
  success: { dot: '#4ade80', label: 'Done', labelColor: 'rgba(74,222,128,0.7)', labelBg: 'rgba(74,222,128,0.07)', labelBorder: 'rgba(74,222,128,0.18)' },
  info:    { dot: '#60a5fa', label: 'Active', labelColor: 'rgba(96,165,250,0.7)', labelBg: 'rgba(96,165,250,0.07)', labelBorder: 'rgba(96,165,250,0.18)' },
  warning: { dot: '#fb923c', label: 'Planned', labelColor: 'rgba(251,146,60,0.7)', labelBg: 'rgba(251,146,60,0.07)', labelBorder: 'rgba(251,146,60,0.18)' },
  pending: { dot: '#94a3b8', label: 'Upcoming', labelColor: 'rgba(148,163,184,0.6)', labelBg: 'rgba(148,163,184,0.06)', labelBorder: 'rgba(148,163,184,0.15)' },
};

export default function ActivityTimeline() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Recent Activity
          </h3>
          <p className="text-white/30 text-xs mt-0.5">Platform timeline & upcoming milestones</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Clock className="w-3 h-3 text-white/30" />
          <span className="text-white/30 text-[10px] font-medium">Live</span>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}
      >
        {ACTIVITY.map((item, i) => {
          const Icon = item.icon;
          const meta = TYPE_META[item.type];
          const isLast = i === ACTIVITY.length - 1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
              className={`relative flex items-start gap-4 px-5 py-4 group hover:bg-white/[0.015] transition-colors duration-200 ${!isLast ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.045)' }}
            >
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className="absolute left-[2.5rem] top-14 bottom-0 w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)' }}
                />
              )}

              {/* Icon bubble */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: item.iconBg,
                    border: `1px solid ${item.iconColor}22`,
                    boxShadow: `0 4px 12px ${item.iconColor}15`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.iconColor }} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1">
                  <p className="text-white/80 text-sm font-semibold leading-snug">{item.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Type badge */}
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: meta.labelColor, background: meta.labelBg, border: `1px solid ${meta.labelBorder}` }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-white/20 text-[10px]">{item.time}</span>
                  </div>
                </div>
                <p className="text-white/35 text-xs leading-relaxed">{item.description}</p>
                {item.actor && (
                  <p className="text-white/20 text-[10px] mt-1.5 font-medium uppercase tracking-wider">{item.actor}</p>
                )}
              </div>

              {/* Status dot */}
              <div className="flex-shrink-0 pt-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: meta.dot,
                    boxShadow: item.type === 'success' || item.type === 'info' ? `0 0 8px ${meta.dot}55` : 'none',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
