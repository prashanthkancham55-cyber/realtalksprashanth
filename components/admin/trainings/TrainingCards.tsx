'use client';

import { motion } from 'framer-motion';
import { MapPin, Monitor, Users, Eye, Pencil, Trash2, Calendar, IndianRupee } from 'lucide-react';
import { Badge, IconButton } from '@/components/ds';
import type { Training, TrainingStatus } from './data';
import { formatDate } from './data';
import type { BadgeVariant } from '@/components/ds';

interface Props {
  trainings: Training[];
  onView:    (t: Training) => void;
  onEdit:    (t: Training) => void;
  onDelete:  (t: Training) => void;
}

const STATUS_VARIANT: Record<TrainingStatus, BadgeVariant> = {
  Draft:     'draft',
  Active:    'active',
  Upcoming:  'upcoming',
  Completed: 'completed',
};

const MODE_META = {
  Online:  { icon: Monitor, color: '#38bdf8' },
  Offline: { icon: MapPin,  color: '#fb923c' },
  Hybrid:  { icon: Users,   color: '#a78bfa' },
};

const FALLBACK_BANNER = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function TrainingCards({ trainings, onView, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {trainings.map((t, i) => {
        const mm = MODE_META[t.mode] ?? MODE_META.Offline;
        const ModeIcon = mm.icon;
        const filled = t.total_seats - t.available_seats;
        const pct = t.total_seats > 0 ? Math.round((filled / t.total_seats) * 100) : 0;
        const seatColor = pct >= 100 ? '#f87171' : pct >= 70 ? '#fb923c' : '#4ade80';
        const banner = t.banner_url || FALLBACK_BANNER;

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex flex-col rounded-2xl overflow-hidden group"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            {/* Banner */}
            <div className="relative h-36 overflow-hidden flex-shrink-0">
              <img
                src={banner}
                alt={t.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,9,22,0.85) 0%, rgba(4,9,22,0.2) 50%, transparent 100%)' }} />

              <div className="absolute top-3 left-3">
                <Badge variant={STATUS_VARIANT[t.status]} size="sm" dot>{t.status}</Badge>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-lg"
                  style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}
                >
                  {t.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ModeIcon className="w-3 h-3" style={{ color: mm.color }} />
                  <span className="text-xs font-medium" style={{ color: `${mm.color}dd` }}>{t.mode}</span>
                  {t.location && t.location !== 'Virtual' && (
                    <span className="text-white/40 text-xs">· {t.location}</span>
                  )}
                </div>
                <span className="text-white/50 text-xs font-mono font-semibold">₹{t.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-4 flex-1">
              <div>
                <h4 className="text-white/90 text-sm font-semibold leading-snug">{t.title}</h4>
                <p className="text-white/35 text-xs mt-0.5 leading-snug line-clamp-2">{t.description}</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{formatDate(t.start_date)}
                </span>
                {t.duration && (
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />{t.duration}
                  </span>
                )}
              </div>

              {/* Seat bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-[10px]">Seats filled</span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: seatColor }}>
                    {filled}/{t.total_seats} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(pct, 100)}%`, background: seatColor }}
                  />
                </div>
              </div>

              {/* Trainer + actions */}
              <div className="flex items-center justify-between pt-2 border-t mt-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    {t.trainer_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/45 text-xs truncate max-w-[120px]">{t.trainer_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton icon={Eye}    variant="default" size="sm" onClick={() => onView(t)}   label="View" />
                  <IconButton icon={Pencil} variant="default" size="sm" onClick={() => onEdit(t)}   label="Edit" />
                  <IconButton icon={Trash2} variant="danger"  size="sm" onClick={() => onDelete(t)} label="Delete" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
