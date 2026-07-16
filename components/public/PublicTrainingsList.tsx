'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, Tag, ArrowRight, Clock, Wifi, Building2, Blend,
} from 'lucide-react';
import type { Training } from '@/components/admin/trainings/data';
import { formatDate } from '@/components/admin/trainings/data';

interface Props {
  trainings: Training[];
}

const MODE_ICON = { Online: Wifi, Offline: Building2, Hybrid: Blend };
const MODE_COLOR = { Online: '#60a5fa', Offline: '#4ade80', Hybrid: '#d4af37' };

const STATUS_STYLE = {
  Active:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)',  dot: '#4ade80' },
  Upcoming: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)',  dot: '#fbbf24' },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function PublicTrainingsList({ trainings }: Props) {
  if (trainings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <Calendar className="w-9 h-9" style={{ color: '#d4af37' }} />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          No programs scheduled yet
        </h3>
        <p className="text-white/40 text-sm max-w-sm">
          New training programs will appear here as soon as they are announced. Check back soon!
        </p>
        <Link
          href="/#contact"
          className="mt-8 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, #f0c040, #d4af37)',
            color: '#020810',
          }}
        >
          Get Notified
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {trainings.map((t) => {
        const ModeIcon = MODE_ICON[t.mode] ?? Building2;
        const modeColor = MODE_COLOR[t.mode] ?? '#d4af37';
        const statusStyle = STATUS_STYLE[t.status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.Upcoming;
        const seatsLeft = t.available_seats;
        const seatsPct = t.total_seats > 0 ? Math.round(((t.total_seats - seatsLeft) / t.total_seats) * 100) : 0;

        return (
          <motion.div
            key={t.id}
            variants={cardVariants}
            className="group flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
          >
            {/* Banner */}
            <div className="relative h-44 overflow-hidden flex-shrink-0">
              {t.banner_url ? (
                <img
                  src={t.banner_url}
                  alt={t.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, rgba(212,175,55,0.08), rgba(96,165,250,0.05))` }}
                >
                  <span className="text-white/15 text-5xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {t.title.charAt(0)}
                  </span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,8,16,0.7) 0%, transparent 60%)' }} />

              {/* Status badge */}
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
                {t.status}
              </div>

              {/* Mode badge */}
              <div
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${modeColor}33`, color: modeColor, backdropFilter: 'blur(8px)' }}
              >
                <ModeIcon className="w-3 h-3" />
                {t.mode}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-4">
              {/* Category */}
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3" style={{ color: '#d4af37' }} />
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#d4af37' }}>
                  {t.category}
                </span>
              </div>

              {/* Title */}
              <div>
                <h2
                  className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-gold-300 transition-colors"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {t.title}
                </h2>
                <p className="text-white/40 text-xs mt-1 font-medium">by {t.trainer_name}</p>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  <span className="text-white/45 text-xs truncate">{formatDate(t.start_date)}</span>
                </div>
                {t.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    <span className="text-white/45 text-xs truncate">{t.location}</span>
                  </div>
                )}
                {t.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    <span className="text-white/45 text-xs">{t.duration}</span>
                  </div>
                )}
                {t.total_seats > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    <span className="text-white/45 text-xs">{seatsLeft} seats left</span>
                  </div>
                )}
              </div>

              {/* Seats progress */}
              {t.total_seats > 0 && (
                <div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${seatsPct}%`,
                        background: seatsPct > 80
                          ? 'linear-gradient(90deg, #f87171, #ef4444)'
                          : 'linear-gradient(90deg, #f0c040, #d4af37)',
                      }}
                    />
                  </div>
                  <p className="text-white/25 text-[10px] mt-1">{seatsPct}% filled</p>
                </div>
              )}

              {/* Price + CTA */}
              <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div>
                  {t.price > 0 ? (
                    <>
                      <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        ₹{t.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-white/30 text-[10px]">per participant</p>
                    </>
                  ) : (
                    <p className="text-green-400 font-semibold text-sm">Free</p>
                  )}
                </div>

                <Link
                  href={`/trainings/${t.id}/register`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] flex-shrink-0"
                  style={{
                    background: seatsLeft === 0 ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #f0c040, #d4af37)',
                    color: seatsLeft === 0 ? 'rgba(255,255,255,0.35)' : '#020810',
                    pointerEvents: seatsLeft === 0 ? 'none' : 'auto',
                  }}
                >
                  {seatsLeft === 0 ? 'Full' : 'Register Now'}
                  {seatsLeft !== 0 && <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
