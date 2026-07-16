import { motion } from 'framer-motion';
import {
  X,
  Edit2,
  Calendar,
  MapPin,
  Monitor,
  Users,
  DollarSign,
  Globe,
  Clock,
  Tag,
  Star,
  Zap,
  Bell,
  CheckCircle,
  User,
  LayoutList,
} from 'lucide-react';
import type { Training } from '../../../types/training';
import { formatDate, formatPrice } from '../../../types/training';
import { Button } from '../../ds/Button';

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Draft:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  Active:    { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  Upcoming:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)' },
  Completed: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
};

const MODE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Online:  { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)' },
  Offline: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)' },
  Hybrid:  { color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.2)' },
};

function Badge({ label, style }: { label: string; style: { color: string; bg: string; border: string } }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}
    >
      {label}
    </span>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium tracking-wider uppercase mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </div>
        <div className="text-sm text-white/80 break-words">{value || <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-base font-semibold text-white mb-3 mt-6 first:mt-0"
      style={{ fontFamily: 'Cormorant Garamond, serif', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}
    >
      {children}
    </h3>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>None listed.</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#d4af37' }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function IndicatorBadge({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
      style={{
        background: active ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
        color: active ? '#d4af37' : 'rgba(255,255,255,0.3)',
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

/* ── Props ───────────────────────────────────────────────────────────────────── */
interface TrainingViewModalProps {
  training: Training;
  onClose:  () => void;
  onEdit:   () => void;
}

/* ── TrainingViewModal ───────────────────────────────────────────────────────── */
export default function TrainingViewModal({ training, onClose, onEdit }: TrainingViewModalProps) {
  const statusStyle = STATUS_STYLE[training.status] ?? STATUS_STYLE.Draft;
  const modeStyle   = MODE_STYLE[training.mode]     ?? MODE_STYLE.Online;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: '#0d1630',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            maxHeight: '92vh',
          }}
        >
          {/* ── Header ── */}
          <div className="flex-shrink-0">
            {training.banner_url && (
              <div className="relative h-36 overflow-hidden">
                <img
                  src={training.banner_url}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d1630 0%, transparent 60%)' }} />
              </div>
            )}
            <div
              className="flex items-start justify-between px-6 py-4"
              style={training.banner_url ? { marginTop: -32 } : { borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge label={training.status} style={statusStyle} />
                  <Badge label={training.mode}   style={modeStyle} />
                  {training.category && (
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: '#c4b5fd', background: 'rgba(196,181,253,0.1)', border: '1px solid rgba(196,181,253,0.2)' }}
                    >
                      {training.category}
                    </span>
                  )}
                </div>
                <h2
                  className="text-xl font-semibold text-white leading-snug"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {training.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  /{training.slug}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-6 pb-6">

            {/* Display indicators */}
            <div className="flex flex-wrap gap-2 mb-5">
              <IndicatorBadge icon={Star} label="Featured"     active={training.featured} />
              <IndicatorBadge icon={Zap}  label="Hero Banner"  active={training.show_in_hero} />
              <IndicatorBadge icon={Bell} label="Popup"        active={training.show_as_popup} />
            </div>

            {/* Core details */}
            <div className="divide-y" style={{ borderColor: 'transparent' }}>
              <Row icon={User}         label="Trainer"        value={training.trainer_name} />
              <Row icon={Calendar}     label="Start Date"     value={formatDate(training.start_date)} />
              <Row icon={Calendar}     label="End Date"       value={formatDate(training.end_date)} />
              <Row icon={Clock}        label="Session Time"   value={training.session_time} />
              <Row icon={Clock}        label="Duration"       value={training.duration} />
              <Row icon={MapPin}       label="Location"       value={training.location || (training.mode === 'Online' ? 'Online' : '—')} />
              <Row icon={Globe}        label="Language"       value={training.language} />
              <Row icon={DollarSign}   label="Price"          value={formatPrice(training.price)} />
              <Row
                icon={Users}
                label="Seats"
                value={
                  training.total_seats
                    ? `${training.available_seats} available of ${training.total_seats} total`
                    : '—'
                }
              />
              <Row icon={Monitor}      label="Display Order"  value={training.display_order} />
              <Row
                icon={Tag}
                label="Tags"
                value={
                  training.tags.length
                    ? <div className="flex flex-wrap gap-1.5 mt-1">
                        {training.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    : null
                }
              />
            </div>

            {/* Descriptions */}
            {(training.short_description || training.description || training.full_description) && (
              <>
                <SectionTitle>Descriptions</SectionTitle>
                {training.short_description && (
                  <div className="mb-3">
                    <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Short Description</div>
                    <p className="text-sm text-white/70">{training.short_description}</p>
                  </div>
                )}
                {training.description && (
                  <div className="mb-3">
                    <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Summary</div>
                    <p className="text-sm text-white/70 whitespace-pre-wrap">{training.description}</p>
                  </div>
                )}
                {training.full_description && (
                  <div className="mb-3">
                    <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Full Description</div>
                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{training.full_description}</p>
                  </div>
                )}
              </>
            )}

            {/* Benefits */}
            {training.benefits.length > 0 && (
              <>
                <SectionTitle>Benefits</SectionTitle>
                <BulletList items={training.benefits} />
              </>
            )}

            {/* Who Should Attend */}
            {training.who_should_attend.length > 0 && (
              <>
                <SectionTitle>Who Should Attend</SectionTitle>
                <BulletList items={training.who_should_attend} />
              </>
            )}

            {/* What You Will Learn */}
            {training.what_you_will_learn.length > 0 && (
              <>
                <SectionTitle>What You Will Learn</SectionTitle>
                <BulletList items={training.what_you_will_learn} />
              </>
            )}

            {/* Agenda */}
            {training.agenda.length > 0 && (
              <>
                <SectionTitle>Agenda</SectionTitle>
                <div className="space-y-0">
                  {training.agenda.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
                        >
                          {i + 1}
                        </div>
                        {i < training.agenda.length - 1 && (
                          <div className="flex-1 w-px my-1" style={{ background: 'rgba(212,175,55,0.15)', minHeight: 24 }} />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-5">
                        {item.time && (
                          <div
                            className="inline-flex items-center gap-1 text-[11px] font-semibold mb-1 px-2 py-0.5 rounded-md"
                            style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}
                          >
                            <LayoutList className="w-3 h-3" />
                            {item.time}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-white">{item.topic}</div>
                        {item.description && (
                          <div className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Timestamps */}
            <div
              className="mt-6 pt-4 flex flex-wrap gap-x-6 gap-y-1"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Created: {formatDate(training.created_at)}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Updated: {formatDate(training.updated_at)}
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" size="md" icon={Edit2} onClick={onEdit}>
              Edit Training
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
