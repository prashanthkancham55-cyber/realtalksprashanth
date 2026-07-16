'use client';

import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Monitor, Users, Lock } from 'lucide-react';

interface TrainingRow {
  id: string;
  title: string;
  date: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  seats: string;
  status: 'Upcoming' | 'Open' | 'Full' | 'Draft';
  location?: string;
}

const PLACEHOLDER: TrainingRow[] = [
  { id: '1', title: 'Sales Excellence Bootcamp', date: 'Aug 12, 2026', mode: 'Offline', seats: '0 / 30', status: 'Upcoming', location: 'Hyderabad' },
  { id: '2', title: 'Leadership Masterclass',    date: 'Aug 20, 2026', mode: 'Online',  seats: '0 / 50', status: 'Open' },
  { id: '3', title: 'Corporate Communication',   date: 'Sep 05, 2026', mode: 'Hybrid',  seats: '0 / 25', status: 'Draft', location: 'Mumbai' },
  { id: '4', title: 'Real Estate Sales Training', date: 'Sep 18, 2026', mode: 'Offline', seats: '0 / 40', status: 'Upcoming', location: 'Bangalore' },
];

const STATUS_META = {
  Upcoming: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)' },
  Open:     { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.2)' },
  Full:     { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  Draft:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)' },
};

const MODE_META = {
  Online:  { icon: Monitor, color: '#38bdf8' },
  Offline: { icon: MapPin,  color: '#fb923c' },
  Hybrid:  { icon: Users,   color: '#a78bfa' },
};

export default function UpcomingTrainings() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Upcoming Trainings
          </h3>
          <p className="text-white/30 text-xs mt-0.5">Placeholder data — live when Phase 2 launches</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.15)', color: 'rgba(96,165,250,0.7)' }}
        >
          <Lock className="w-2.5 h-2.5" />
          Phase 2
        </div>
      </div>

      {/* Table — desktop */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[1fr_140px_110px_100px_100px] px-5 py-3 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          {['Training Program', 'Date', 'Mode', 'Seats', 'Status'].map((h) => (
            <span key={h} className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {PLACEHOLDER.map((row, i) => {
          const sm = STATUS_META[row.status];
          const mm = MODE_META[row.mode];
          const ModeIcon = mm.icon;
          const isLast = i === PLACEHOLDER.length - 1;

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`grid grid-cols-[1fr_140px_110px_100px_100px] items-center px-5 py-4 group hover:bg-white/[0.02] transition-colors duration-150 ${!isLast ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.045)' }}
            >
              {/* Training */}
              <div>
                <p className="text-white/75 text-sm font-medium leading-snug group-hover:text-white/90 transition-colors">{row.title}</p>
                {row.location && (
                  <p className="text-white/30 text-[10px] mt-0.5 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{row.location}
                  </p>
                )}
              </div>

              {/* Date */}
              <span className="text-white/45 text-sm">{row.date}</span>

              {/* Mode */}
              <div className="flex items-center gap-1.5">
                <ModeIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: mm.color }} />
                <span className="text-sm" style={{ color: `${mm.color}99` }}>{row.mode}</span>
              </div>

              {/* Seats */}
              <span className="text-white/40 text-sm font-mono">{row.seats}</span>

              {/* Status */}
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit"
                style={{ color: sm.color, background: sm.bg, border: `1px solid ${sm.border}` }}
              >
                {row.status}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {PLACEHOLDER.map((row, i) => {
          const sm = STATUS_META[row.status];
          const mm = MODE_META[row.mode];
          const ModeIcon = mm.icon;

          return (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-white/80 text-sm font-semibold">{row.title}</p>
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                  style={{ color: sm.color, background: sm.bg, border: `1px solid ${sm.border}` }}
                >
                  {row.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                <span className="text-white/40 text-xs">{row.date}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: `${mm.color}80` }}>
                  <ModeIcon className="w-3 h-3" />{row.mode}
                </span>
                <span className="text-white/35 text-xs font-mono">{row.seats} seats</span>
                {row.location && <span className="text-white/30 text-xs">{row.location}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Coming soon footer */}
      <div
        className="mt-3 flex items-center justify-center gap-2 py-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
      >
        <Lock className="w-3 h-3 text-white/20" />
        <span className="text-white/25 text-xs">Full training management unlocks in Phase 2</span>
      </div>
    </section>
  );
}
