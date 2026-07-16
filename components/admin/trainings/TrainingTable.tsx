'use client';

import { motion } from 'framer-motion';
import { MapPin, Monitor, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import {
  TableContainer, TableHead, Th, TableBody, Tr, Td,
  Badge, IconButton,
} from '@/components/ds';
import type { Training, TrainingStatus } from './data';

interface Props {
  trainings: Training[];
  onView:    (t: Training) => void;
  onEdit:    (t: Training) => void;
  onDelete:  (t: Training) => void;
}

const STATUS_VARIANT: Record<TrainingStatus, import('@/components/ds').BadgeVariant> = {
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

function SeatBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  const color = pct >= 100 ? '#f87171' : pct >= 70 ? '#fb923c' : '#4ade80';
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div className="flex items-center justify-between">
        <span className="text-white/55 text-xs font-mono">{filled}/{total}</span>
        <span className="text-[10px]" style={{ color: `${color}aa` }}>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function TrainingTable({ trainings, onView, onEdit, onDelete }: Props) {
  return (
    <TableContainer>
      <TableHead>
        <tr>
          <Th className="w-16">Banner</Th>
          <Th>Training</Th>
          <Th className="hidden md:table-cell">Trainer</Th>
          <Th className="hidden lg:table-cell">Date</Th>
          <Th className="hidden lg:table-cell">Mode</Th>
          <Th className="hidden xl:table-cell">Price</Th>
          <Th className="hidden xl:table-cell">Seats</Th>
          <Th>Status</Th>
          <Th className="text-right">Actions</Th>
        </tr>
      </TableHead>
      <TableBody>
        {trainings.map((t, i) => {
          const mm = MODE_META[t.mode];
          const ModeIcon = mm.icon;

          return (
            <motion.tr
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="border-b last:border-b-0 transition-colors duration-150 hover:bg-white/[0.018] group"
              style={{ borderColor: 'rgba(255,255,255,0.045)' }}
            >
              {/* Banner */}
              <td className="px-4 py-3.5 w-16">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img
                    src={t.banner}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </td>

              {/* Name + desc */}
              <td className="px-4 py-3.5 max-w-[220px]">
                <p className="text-white/85 text-sm font-semibold leading-snug truncate">{t.name}</p>
                <p className="text-white/35 text-xs mt-0.5 leading-snug line-clamp-1">{t.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5 xl:hidden">
                  {/* Inline metadata on smaller screens */}
                  <span className="flex items-center gap-0.5 text-[10px]" style={{ color: `${mm.color}99` }}>
                    <ModeIcon className="w-2.5 h-2.5" />{t.mode}
                  </span>
                  <span className="text-white/25 text-[10px]">·</span>
                  <span className="text-white/30 text-[10px]">{t.date}</span>
                </div>
              </td>

              {/* Trainer */}
              <Td className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                  >
                    P
                  </div>
                  <span className="text-white/65 text-sm whitespace-nowrap">{t.trainer}</span>
                </div>
              </Td>

              {/* Date */}
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <p className="text-white/65 text-sm whitespace-nowrap">{t.date}</p>
                <p className="text-white/30 text-[10px] mt-0.5">{t.duration}</p>
              </td>

              {/* Mode */}
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${mm.color}12`, border: `1px solid ${mm.color}22` }}
                  >
                    <ModeIcon className="w-3 h-3" style={{ color: mm.color }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: `${mm.color}cc` }}>{t.mode}</p>
                    {t.location !== 'Virtual' && (
                      <p className="text-white/30 text-[10px]">{t.location}</p>
                    )}
                  </div>
                </div>
              </td>

              {/* Price */}
              <td className="px-5 py-3.5 hidden xl:table-cell">
                <p className="text-white/75 text-sm font-semibold font-mono">
                  ₹{t.price.toLocaleString('en-IN')}
                </p>
                <p className="text-white/25 text-[10px] mt-0.5">per seat</p>
              </td>

              {/* Seats */}
              <td className="px-5 py-3.5 hidden xl:table-cell">
                <SeatBar filled={t.seatsFilled} total={t.seatsTotal} />
              </td>

              {/* Status */}
              <td className="px-5 py-3.5">
                <Badge variant={STATUS_VARIANT[t.status]} size="sm" dot>{t.status}</Badge>
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <IconButton icon={Eye}    variant="default" size="sm" onClick={() => onView(t)}   label="View training" />
                  <IconButton icon={Pencil} variant="default" size="sm" onClick={() => onEdit(t)}   label="Edit training" />
                  <IconButton icon={Trash2} variant="danger"  size="sm" onClick={() => onDelete(t)} label="Delete training" />
                </div>
              </td>
            </motion.tr>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}
