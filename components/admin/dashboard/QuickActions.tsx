'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, MessageSquare, ExternalLink, BookOpen, Mail } from 'lucide-react';

interface Action {
  label: string;
  description: string;
  href: string;
  icon: typeof Plus;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  external?: boolean;
  disabled?: boolean;
}

const ACTIONS: Action[] = [
  {
    label: 'Create Training',
    description: 'Add a new training program',
    href: '/admin/trainings/new',
    icon: BookOpen,
    iconColor: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.1)',
    borderColor: 'rgba(96,165,250,0.15)',
    disabled: true,
  },
  {
    label: 'Open Gallery',
    description: 'Manage your photo gallery',
    href: '/admin/gallery',
    icon: ImageIcon,
    iconColor: '#38bdf8',
    iconBg: 'rgba(56,189,248,0.1)',
    borderColor: 'rgba(56,189,248,0.15)',
  },
  {
    label: 'Manage Testimonials',
    description: 'Add and edit client reviews',
    href: '/admin/testimonials',
    icon: MessageSquare,
    iconColor: '#4ade80',
    iconBg: 'rgba(74,222,128,0.1)',
    borderColor: 'rgba(74,222,128,0.15)',
  },
  {
    label: 'View Enquiries',
    description: 'Check contact form submissions',
    href: '/admin/enquiries',
    icon: Mail,
    iconColor: '#fb923c',
    iconBg: 'rgba(251,146,60,0.1)',
    borderColor: 'rgba(251,146,60,0.15)',
  },
  {
    label: 'View Website',
    description: 'Open the live public site',
    href: '/',
    icon: ExternalLink,
    iconColor: '#d4af37',
    iconBg: 'rgba(212,175,55,0.1)',
    borderColor: 'rgba(212,175,55,0.15)',
    external: true,
  },
];

export default function QuickActions() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          const content = (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all duration-300 group ${
                action.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg cursor-pointer'
              }`}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${action.disabled ? 'rgba(255,255,255,0.06)' : action.borderColor}`,
              }}
            >
              {action.disabled && (
                <span
                  className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
                >
                  Soon
                </span>
              )}

              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ background: action.iconBg, border: `1px solid ${action.iconColor}22` }}
              >
                <Icon className="w-5 h-5" style={{ color: action.iconColor }} />
              </div>

              <div>
                <p className="text-white/80 text-sm font-semibold leading-tight">{action.label}</p>
                <p className="text-white/35 text-xs mt-1 leading-snug">{action.description}</p>
              </div>
            </motion.div>
          );

          if (action.disabled) return <div key={action.label}>{content}</div>;

          return (
            <Link key={action.label} href={action.href} target={action.external ? '_blank' : undefined}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
