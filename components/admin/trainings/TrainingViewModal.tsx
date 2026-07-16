'use client';

import { MapPin, Monitor, Users, Calendar, Clock, IndianRupee, Tag } from 'lucide-react';
import { Modal, Badge } from '@/components/ds';
import type { Training, TrainingStatus } from './data';
import type { BadgeVariant } from '@/components/ds';

interface Props {
  training: Training | null;
  onClose:  () => void;
}

const STATUS_VARIANT: Record<TrainingStatus, BadgeVariant> = {
  Active:    'active',
  Upcoming:  'upcoming',
  Completed: 'completed',
  Draft:     'draft',
};

const MODE_META = {
  Online:  { icon: Monitor, color: '#38bdf8' },
  Offline: { icon: MapPin,  color: '#fb923c' },
  Hybrid:  { icon: Users,   color: '#a78bfa' },
};

export default function TrainingViewModal({ training, onClose }: Props) {
  if (!training) return null;

  const mm = MODE_META[training.mode];
  const ModeIcon = mm.icon;
  const pct = training.seatsTotal > 0 ? Math.round((training.seatsFilled / training.seatsTotal) * 100) : 0;
  const seatColor = pct >= 100 ? '#f87171' : pct >= 70 ? '#fb923c' : '#4ade80';

  return (
    <Modal open={!!training} onClose={onClose} size="lg">
      {/* Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-6 -mx-0">
        <img src={training.banner} alt={training.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,9,22,0.9) 0%, rgba(4,9,22,0.3) 60%, transparent 100%)' }} />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-white font-bold text-xl leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {training.name}
              </h2>
              <p className="text-white/55 text-sm mt-0.5">{training.description}</p>
            </div>
            <Badge variant={STATUS_VARIANT[training.status]} dot>{training.status}</Badge>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {training.tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)', color: '#d4af37' }}
          >
            <Tag className="w-2.5 h-2.5" />{tag}
          </span>
        ))}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Calendar, label: 'Date', value: `${training.date}${training.endDate !== training.date ? ` – ${training.endDate}` : ''}`, color: '#60a5fa' },
          { icon: Clock,    label: 'Duration', value: training.duration, color: '#4ade80' },
          { icon: ModeIcon, label: 'Mode', value: training.mode, color: mm.color },
          { icon: MapPin,   label: 'Location', value: training.location, color: '#fb923c' },
          { icon: IndianRupee, label: 'Price', value: `₹${training.price.toLocaleString('en-IN')}`, color: '#d4af37' },
          { icon: Tag,      label: 'Category', value: training.category, color: '#a78bfa' },
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col gap-1.5 p-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-1.5">
                <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.color }} />
                <span className="text-white/35 text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
              <span className="text-white/80 text-sm font-medium">{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Trainer */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl mb-5"
        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #d4af37, #f0c040)', color: '#0a1325' }}
        >
          P
        </div>
        <div>
          <p className="text-white/80 text-sm font-semibold">{training.trainer}</p>
          <p className="text-white/35 text-xs">Lead Trainer · RealTalks Prashanth</p>
        </div>
      </div>

      {/* Seat occupancy */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/45 text-xs font-medium">Seat Occupancy</span>
          <span className="text-xs font-bold font-mono" style={{ color: seatColor }}>{training.seatsFilled}/{training.seatsTotal} seats ({pct}%)</span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%`, background: seatColor, boxShadow: `0 0 8px ${seatColor}44` }}
          />
        </div>
        <p className="text-white/25 text-[10px] mt-1.5">{training.seatsTotal - training.seatsFilled} seats remaining</p>
      </div>
    </Modal>
  );
}
