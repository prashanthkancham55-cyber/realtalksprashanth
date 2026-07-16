'use client';

import { motion } from 'framer-motion';
import {
  BookOpen, CalendarClock, Users, IndianRupee,
  Clock, Image as ImageIcon, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: typeof BookOpen;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  trend: { value: string; direction: 'up' | 'down' | 'flat'; label: string };
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
      sub: 'Programs created',
      icon: BookOpen,
      iconColor: '#60a5fa',
      iconBg: 'rgba(96,165,250,0.08)',
      accentColor: 'rgba(96,165,250,0.12)',
      trend: { value: '—', direction: 'flat', label: 'No data yet' },
    },
    {
      label: 'Upcoming Trainings',
      value: '0',
      sub: 'Scheduled programs',
      icon: CalendarClock,
      iconColor: '#34d399',
      iconBg: 'rgba(52,211,153,0.08)',
      accentColor: 'rgba(52,211,153,0.12)',
      trend: { value: '—', direction: 'flat', label: 'None scheduled' },
    },
    {
      label: 'Total Students',
      value: '0',
      sub: 'Registered learners',
      icon: Users,
      iconColor: '#fb923c',
      iconBg: 'rgba(251,146,60,0.08)',
      accentColor: 'rgba(251,146,60,0.12)',
      trend: { value: '—', direction: 'flat', label: 'Awaiting Phase 2' },
    },
    {
      label: 'Revenue',
      value: '₹0',
      sub: 'Total collected',
      icon: IndianRupee,
      iconColor: '#d4af37',
      iconBg: 'rgba(212,175,55,0.08)',
      accentColor: 'rgba(212,175,55,0.12)',
      trend: { value: '—', direction: 'flat', label: 'No payments yet' },
    },
    {
      label: 'Pending Payments',
      value: '₹0',
      sub: 'Outstanding balance',
      icon: Clock,
      iconColor: '#f87171',
      iconBg: 'rgba(248,113,113,0.08)',
      accentColor: 'rgba(248,113,113,0.12)',
      trend: { value: 'Clear', direction: 'up', label: 'All settled' },
    },
    {
      label: 'Gallery Images',
      value: String(galleryCount),
      sub: galleryCount === 1 ? '1 image live' : `${galleryCount} images live`,
      icon: ImageIcon,
      iconColor: '#38bdf8',
      iconBg: 'rgba(56,189,248,0.08)',
      accentColor: 'rgba(56,189,248,0.12)',
      trend: { value: galleryCount > 0 ? `+${galleryCount}` : '—', direction: galleryCount > 0 ? 'up' : 'flat', label: 'Published photos' },
    },
  ];

  const TrendIcon = ({ dir }: { dir: 'up' | 'down' | 'flat' }) => {
    if (dir === 'up') return <TrendingUp className="w-3 h-3" />;
    if (dir === 'down') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const trendColor = (dir: 'up' | 'down' | 'flat') => {
    if (dir === 'up') return { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' };
    if (dir === 'down') return { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' };
    return { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const tc = trendColor(card.trend.direction);

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative rounded-2xl p-5 group overflow-hidden cursor-default"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* Hover glow overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 20% 20%, ${card.accentColor} 0%, transparent 65%)` }}
            />

            {/* Top accent line */}
            <div
              className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${card.iconColor}60, transparent)` }}
            />

            <div className="relative z-10">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: card.iconBg,
                    border: `1px solid ${card.iconColor}22`,
                    boxShadow: `0 4px 12px ${card.iconColor}15`,
                  }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: card.iconColor }} />
                </div>

                {/* Trend badge */}
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                  style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}
                >
                  <TrendIcon dir={card.trend.direction} />
                  <span>{card.trend.value}</span>
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <p
                  className="text-white font-bold leading-none tracking-tight mb-1.5"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
                >
                  {card.value}
                </p>
                <p className="text-white/40 text-xs font-medium">{card.label}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-white/25 text-[10px]">{card.sub}</span>
                <span className="text-[10px] font-medium" style={{ color: `${tc.color}99` }}>{card.trend.label}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
