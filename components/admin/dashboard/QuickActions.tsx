'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, MessageSquare, ExternalLink, BookOpen, Mail, ArrowRight, Users } from 'lucide-react';

interface Action {
  label: string;
  description: string;
  href: string;
  icon: typeof Plus;
  iconColor: string;
  gradient: string;
  borderColor: string;
  external?: boolean;
  disabled?: boolean;
  badge?: string;
}

const ACTIONS: Action[] = [
  {
    label: 'Create Training',
    description: 'Launch a new training program',
    href: '/admin/trainings/new',
    icon: BookOpen,
    iconColor: '#60a5fa',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(96,165,250,0.04))',
    borderColor: 'rgba(96,165,250,0.18)',
    disabled: true,
    badge: 'Phase 2',
  },
  {
    label: 'Open Gallery',
    description: 'Upload & arrange training photos',
    href: '/admin/gallery',
    icon: ImageIcon,
    iconColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.04))',
    borderColor: 'rgba(56,189,248,0.2)',
  },
  {
    label: 'Manage Testimonials',
    description: 'Add and curate client reviews',
    href: '/admin/testimonials',
    icon: MessageSquare,
    iconColor: '#4ade80',
    gradient: 'linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.04))',
    borderColor: 'rgba(74,222,128,0.2)',
  },
  {
    label: 'Student Registrations',
    description: 'Manage training sign-ups',
    href: '/admin/registrations',
    icon: Users,
    iconColor: '#fb923c',
    gradient: 'linear-gradient(135deg, rgba(251,146,60,0.12), rgba(251,146,60,0.04))',
    borderColor: 'rgba(251,146,60,0.2)',
  },
  {
    label: 'View Website',
    description: 'Open the live public site',
    href: '/',
    icon: ExternalLink,
    iconColor: '#d4af37',
    gradient: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))',
    borderColor: 'rgba(212,175,55,0.2)',
    external: true,
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className="text-white font-bold text-xl leading-snug"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Quick Actions
          </h3>
          <p className="text-white/30 text-xs mt-0.5">Jump straight into what matters</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;

          const card = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={action.disabled ? {} : { y: -4, transition: { duration: 0.2 } }}
              className={`relative flex flex-col gap-3.5 p-5 rounded-2xl h-full transition-all duration-300 group overflow-hidden ${
                action.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{
                background: action.disabled ? 'rgba(255,255,255,0.02)' : action.gradient,
                border: `1px solid ${action.disabled ? 'rgba(255,255,255,0.06)' : action.borderColor}`,
                boxShadow: action.disabled ? 'none' : '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              {/* Hover shimmer */}
              {!action.disabled && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 30% 20%, ${action.borderColor}, transparent 60%)` }}
                />
              )}

              {/* Badge */}
              {action.badge && (
                <span
                  className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                >
                  {action.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                style={{
                  background: `${action.iconColor}15`,
                  border: `1px solid ${action.iconColor}25`,
                  boxShadow: action.disabled ? 'none' : `0 4px 16px ${action.iconColor}20`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: action.iconColor }} />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-white/85 text-sm font-semibold leading-tight mb-1">{action.label}</p>
                <p className="text-white/35 text-xs leading-relaxed">{action.description}</p>
              </div>

              {/* Arrow */}
              {!action.disabled && (
                <div className="flex items-center justify-end">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0"
                    style={{ background: `${action.iconColor}18` }}
                  >
                    <ArrowRight className="w-3 h-3" style={{ color: action.iconColor }} />
                  </div>
                </div>
              )}
            </motion.div>
          );

          if (action.disabled) return <div key={action.label} className="h-full">{card}</div>;

          return (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              className="h-full"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
