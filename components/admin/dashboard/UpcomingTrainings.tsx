'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Monitor, Users, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TrainingRow {
  id:              string;
  title:           string;
  start_date:      string;
  mode:            'Online' | 'Offline' | 'Hybrid';
  total_seats:     number;
  available_seats: number;
  status:          string;
  location:        string;
}

const STATUS_META: Record<string, { color: string; bg: string; border: string }> = {
  Active:    { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.2)' },
  Upcoming:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.2)' },
  Completed: { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)',  border: 'rgba(148,163,184,0.15)' },
  Draft:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)',  border: 'rgba(148,163,184,0.15)' },
};

const MODE_META = {
  Online:  { icon: Monitor, color: '#38bdf8' },
  Offline: { icon: MapPin,  color: '#fb923c' },
  Hybrid:  { icon: Users,   color: '#a78bfa' },
};

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function UpcomingTrainings() {
  const [rows, setRows]       = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error: err } = await supabase
        .from('trainings')
        .select('id, title, start_date, mode, total_seats, available_seats, status, location')
        .gte('start_date', today)
        .in('status', ['Active', 'Upcoming', 'Draft'])
        .order('start_date', { ascending: true })
        .limit(5);
      if (err) throw new Error(err.message);
      setRows((data ?? []) as TrainingRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trainings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filled  = (row: TrainingRow) => row.total_seats - row.available_seats;
  const seatsLabel = (row: TrainingRow) =>
    row.total_seats > 0 ? `${filled(row)} / ${row.total_seats}` : '—';

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Upcoming Trainings
          </h3>
          <p className="text-white/30 text-xs mt-0.5">
            {loading ? 'Loading…' : rows.length > 0 ? `${rows.length} program${rows.length !== 1 ? 's' : ''} scheduled` : 'No upcoming programs'}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
        >
          <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-4 py-3 mb-4 text-sm"
          style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }}
        >
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-12 rounded-2xl gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.07)' }}
        >
          <CalendarClock className="w-8 h-8 text-white/15" />
          <p className="text-white/30 text-sm">No upcoming trainings scheduled</p>
          <p className="text-white/20 text-xs">Create a training with an upcoming date to see it here</p>
        </div>
      )}

      {/* Table — desktop */}
      {!loading && rows.length > 0 && (
        <>
          <div
            className="hidden md:block rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
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
            {rows.map((row, i) => {
              const sm = STATUS_META[row.status] ?? STATUS_META.Draft;
              const mm = MODE_META[row.mode]     ?? MODE_META.Offline;
              const ModeIcon = mm.icon;
              const isLast   = i === rows.length - 1;

              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  className={`grid grid-cols-[1fr_140px_110px_100px_100px] items-center px-5 py-4 group hover:bg-white/[0.02] transition-colors duration-150 ${!isLast ? 'border-b' : ''}`}
                  style={{ borderColor: 'rgba(255,255,255,0.045)' }}
                >
                  <div>
                    <p className="text-white/75 text-sm font-medium leading-snug group-hover:text-white/90 transition-colors">{row.title}</p>
                    {row.location && (
                      <p className="text-white/30 text-[10px] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />{row.location}
                      </p>
                    )}
                  </div>
                  <span className="text-white/45 text-sm">{formatDate(row.start_date)}</span>
                  <div className="flex items-center gap-1.5">
                    <ModeIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: mm.color }} />
                    <span className="text-sm" style={{ color: `${mm.color}99` }}>{row.mode}</span>
                  </div>
                  <span className="text-white/40 text-sm font-mono">{seatsLabel(row)}</span>
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
            {rows.map((row, i) => {
              const sm = STATUS_META[row.status] ?? STATUS_META.Draft;
              const mm = MODE_META[row.mode]     ?? MODE_META.Offline;
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
                    <span className="text-white/40 text-xs">{formatDate(row.start_date)}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: `${mm.color}80` }}>
                      <ModeIcon className="w-3 h-3" />{row.mode}
                    </span>
                    <span className="text-white/35 text-xs font-mono">{seatsLabel(row)} seats</span>
                    {row.location && <span className="text-white/30 text-xs">{row.location}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
