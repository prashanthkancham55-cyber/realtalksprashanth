'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Monitor, Users, Eye, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { TableHead, Th, Badge, IconButton } from '@/components/ds';
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

// ── Seat progress bar ─────────────────────────────────────────────────────────
function SeatBar({ filled, total }: { filled: number; total: number }) {
  const pct   = total > 0 ? Math.round(((total - filled) / total) * 100) : 0;
  const used  = total - filled;
  const color = pct <= 10 ? '#f87171' : pct <= 30 ? '#fb923c' : '#4ade80';
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div className="flex items-center justify-between">
        <span className="text-white/55 text-xs font-mono">{used}/{total}</span>
        <span className="text-[10px]" style={{ color: `${color}aa` }}>{pct}% left</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100 - pct, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── 3-dot mobile menu ─────────────────────────────────────────────────────────
interface MobileMenuProps {
  onView:   () => void;
  onEdit:   () => void;
  onDelete: () => void;
}

function MobileActionMenu({ onView, onEdit, onDelete }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const menuItem = (
    label: string,
    Icon: React.ElementType,
    color: string,
    hoverBg: string,
    action: () => void,
  ) => (
    <button
      key={label}
      onClick={() => { setOpen(false); action(); }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 text-left"
      style={{ color, background: 'transparent' }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <IconButton
        icon={MoreVertical}
        variant="default"
        size="sm"
        label="More actions"
        onClick={() => setOpen((v) => !v)}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-8 z-50 min-w-[130px] p-1.5 rounded-xl flex flex-col"
            style={{
              background:    'rgba(10,19,37,0.97)',
              border:        '1px solid rgba(255,255,255,0.1)',
              boxShadow:     '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter:'blur(16px)',
            }}
          >
            {menuItem('View',   Eye,    'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.06)', onView)}
            {menuItem('Edit',   Pencil, 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.06)', onEdit)}
            {menuItem('Delete', Trash2, '#f87171',               'rgba(239,68,68,0.1)',    onDelete)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sticky header cell style ──────────────────────────────────────────────────
const STICKY_TH: React.CSSProperties = {
  position:   'sticky',
  right:       0,
  background: 'rgba(255,255,255,0.025)',
  boxShadow:  '-4px 0 10px rgba(0,0,0,0.3)',
  zIndex:      2,
};

// ── Sticky body cell style — matches table row hover bg ───────────────────────
const STICKY_TD: React.CSSProperties = {
  position:   'sticky',
  right:       0,
  background: 'rgba(6,12,24,0.98)',
  boxShadow:  '-4px 0 10px rgba(0,0,0,0.3)',
  zIndex:      1,
};

// ── Table ─────────────────────────────────────────────────────────────────────
export default function TrainingTable({ trainings, onView, onEdit, onDelete }: Props) {
  return (
    /*
     * Custom container: rounded-2xl + overflow-x-auto at THIS level
     * so CSS sticky positioning works inside the scroll ancestor.
     * The DS TableContainer uses overflow-hidden which clips sticky children.
     */
    <div
      className="rounded-2xl overflow-x-auto"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border:     '1px solid rgba(255,255,255,0.07)',
        boxShadow:  '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      <table className="w-full border-collapse">
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
            {/* Sticky Actions header */}
            <Th className="text-right" style={STICKY_TH}>Actions</Th>
          </tr>
        </TableHead>

        <tbody>
          {trainings.map((t, i) => {
            const mm = MODE_META[t.mode] ?? MODE_META.Offline;
            const ModeIcon = mm.icon;
            const banner   = t.banner_url || FALLBACK_BANNER;

            return (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="border-b last:border-b-0 transition-colors duration-150 hover:bg-white/[0.018] group"
                style={{ borderColor: 'rgba(255,255,255,0.045)' }}
              >
                {/* Banner thumbnail */}
                <td className="px-4 py-3.5 w-16">
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <img
                      src={banner}
                      alt={t.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </td>

                {/* Title + description */}
                <td className="px-4 py-3.5 max-w-[220px]">
                  <p className="text-white/85 text-sm font-semibold leading-snug truncate">{t.title}</p>
                  <p className="text-white/35 text-xs mt-0.5 leading-snug line-clamp-1">{t.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5 xl:hidden">
                    <span className="flex items-center gap-0.5 text-[10px]" style={{ color: `${mm.color}99` }}>
                      <ModeIcon className="w-2.5 h-2.5" />{t.mode}
                    </span>
                    <span className="text-white/25 text-[10px]">·</span>
                    <span className="text-white/30 text-[10px]">{formatDate(t.start_date)}</span>
                  </div>
                </td>

                {/* Trainer */}
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))',
                        color:      '#d4af37',
                        border:     '1px solid rgba(212,175,55,0.2)',
                      }}
                    >
                      {t.trainer_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/65 text-sm whitespace-nowrap">{t.trainer_name}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <p className="text-white/65 text-sm whitespace-nowrap">{formatDate(t.start_date)}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{t.duration || '—'}</p>
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
                      {t.location && t.location !== 'Virtual' && (
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
                  <SeatBar filled={t.available_seats} total={t.total_seats} />
                </td>

                {/* Status badge */}
                <td className="px-5 py-3.5">
                  <Badge variant={STATUS_VARIANT[t.status]} size="sm" dot>{t.status}</Badge>
                </td>

                {/* ── Sticky Actions column ─────────────────────────────────── */}
                <td className="px-4 py-3.5" style={STICKY_TD}>
                  {/* Desktop: three icon buttons, always visible */}
                  <div className="hidden md:flex items-center justify-end gap-1.5">
                    <IconButton
                      icon={Eye}
                      variant="default"
                      size="sm"
                      onClick={() => onView(t)}
                      label="View training"
                    />
                    <IconButton
                      icon={Pencil}
                      variant="default"
                      size="sm"
                      onClick={() => onEdit(t)}
                      label="Edit training"
                    />
                    <IconButton
                      icon={Trash2}
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(t)}
                      label="Delete training"
                    />
                  </div>

                  {/* Mobile: 3-dot dropdown */}
                  <div className="md:hidden flex justify-end">
                    <MobileActionMenu
                      onView={() => onView(t)}
                      onEdit={() => onEdit(t)}
                      onDelete={() => onDelete(t)}
                    />
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
