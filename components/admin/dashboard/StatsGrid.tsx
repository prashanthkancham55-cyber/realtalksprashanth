'use client';

import { motion } from 'framer-motion';
import {
  BookOpen, CalendarClock, CheckCircle2, Users,
  IndianRupee, Clock, Image as ImageIcon, MessageSquare, TrendingUp,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  sub?: string;
  icon: typeof BookOpen;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; up: boolean };
  span?: 'normal' | 'wide';
}

interface Props {
  galleryCount: number;
  testimonialCount: number;
}

export default function StatsGrid({ galleryCount, testimonialCount }: Props) {
  const cards: StatCard[] = [
    {
      label: 'Total Trainings',
      value: '0',
      sub: 'No trainings added',
      icon: BookOpen,
      iconColor: '#60a5fa',
      iconBg: 'rgba(96,165,250,0.1)',
    },
    {
      label: 'Upcoming Trainings',
      value: '0',
      sub: 'None scheduled',
      icon: CalendarClock,
      iconColor: '#34d399',
      iconBg: 'rgba(52,211,153,0.1)',
    },
    {
      label: 'Completed Trainings',
      value: '0',
      sub: 'No history yet',
      icon: CheckCircle2,
      iconColor: '#a78bfa',
      iconBg: 'rgba(167,139,250,0.1)',
    },
    {
      label: 'Total Students',
      value: '0',
      sub: 'No registrations',
      icon: Users,
      iconColor: '#fb923c',
      iconBg: 'rgba(251,146,60,0.1)',
    },
    {
      label: 'Revenue',
      value: '₹0',
      sub: 'No payments yet',
      icon: IndianRupee,
      iconColor: '#d4af37',
      iconBg: 'rgba(212,175,55,0.1)',
    },
    {
      label: 'Pending Payments',
      value: '₹0',
      sub: 'All clear',
      icon: Clock,
      iconColor: '#f87171',
      iconBg: 'rgba(248,113,113,0.1)',
    },
    {
      label: 'Gallery Images',
      value: String(galleryCount),
      sub: galleryCount === 0 ? 'No images yet' : `${galleryCount} image${galleryCount !== 1 ? 's' : ''} published`,
      icon: ImageIcon,
      iconColor: '#38bdf8',
      iconBg: 'rgba(56,189,248,0.1)',
    },
    {
      label: 'Testimonials',
      value: String(testimonialCount),
      sub: testimonialCount === 0 ? 'No testimonials yet' : `${testimonialCount} review${testimonialCount !== 1 ? 's' : ''}`,
      icon: MessageSquare,
      iconColor: '#4ade80',
      iconBg: 'rgba(74,222,128,0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
            className="relative rounded-2xl p-5 group overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 30% 30%, ${card.iconBg} 0%, transparent 70%)` }}
            />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: card.iconBg, border: `1px solid ${card.iconColor}22` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.iconColor }} />
                </div>
                <TrendingUp className="w-3 h-3 text-white/15" />
              </div>

              <div>
                <p className="text-white/40 text-xs font-medium mb-1">{card.label}</p>
                <p
                  className="text-white font-bold text-2xl leading-none tracking-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {card.value}
                </p>
                {card.sub && (
                  <p className="text-white/30 text-xs mt-1.5 leading-snug">{card.sub}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
