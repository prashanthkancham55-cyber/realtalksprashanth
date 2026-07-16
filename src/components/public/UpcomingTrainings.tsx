import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Monitor,
  Users,
  Briefcase,
  Clock,
  ChevronRight,
  ArrowRight,
  CalendarX,
  Wifi,
} from 'lucide-react';
import type { Training } from '../../types/training';
import { formatDate, formatPrice } from '../../types/training';

// ── Animation helpers ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Category → fallback gradient ─────────────────────────────────────────────
const CATEGORY_GRADIENTS: Record<string, string> = {
  Sales:         'linear-gradient(135deg, #1a0a00 0%, #3d1f00 100%)',
  Leadership:    'linear-gradient(135deg, #000d1a 0%, #003366 100%)',
  Communication: 'linear-gradient(135deg, #0a001a 0%, #2d0057 100%)',
  'Real Estate': 'linear-gradient(135deg, #001a00 0%, #004d00 100%)',
  Corporate:     'linear-gradient(135deg, #001a2e 0%, #003366 100%)',
  Mindset:       'linear-gradient(135deg, #1a001a 0%, #4d0033 100%)',
  _default:      'linear-gradient(135deg, #0d1630 0%, #050b18 100%)',
};

function categoryGradient(cat: string): string {
  return CATEGORY_GRADIENTS[cat] ?? CATEGORY_GRADIENTS._default;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)',
        border: `1px solid ${isActive ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`,
        color: isActive ? '#4ade80' : '#facc15',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: isActive ? '#4ade80' : '#facc15' }}
      />
      {status}
    </span>
  );
}

// ── Mode badge ────────────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: string }) {
  const cfg: Record<string, { icon: ReactNode; color: string; bg: string }> = {
    Online:  { icon: <Wifi     className="w-3 h-3" />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
    Offline: { icon: <Users    className="w-3 h-3" />, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    Hybrid:  { icon: <Monitor  className="w-3 h-3" />, color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  };
  const c = cfg[mode] ?? cfg.Offline;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}44` }}
    >
      {c.icon}
      {mode}
    </span>
  );
}

// ── Seats progress bar ────────────────────────────────────────────────────────
function SeatsBar({ total, available }: { total: number; available: number }) {
  if (total <= 0) return null;
  const filled  = Math.max(0, total - available);
  const pct     = Math.min(100, (filled / total) * 100);
  const isAlmost = available <= Math.ceil(total * 0.2) && available > 0;
  const isFull   = available === 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Seats
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: isFull ? '#f87171' : isAlmost ? '#facc15' : '#4ade80' }}
        >
          {isFull ? 'Full' : `${available} left`}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isFull
              ? '#f87171'
              : isAlmost
              ? 'linear-gradient(90deg, #f59e0b, #facc15)'
              : 'linear-gradient(90deg, #22c55e, #4ade80)',
          }}
        />
      </div>
    </div>
  );
}

// ── Training Card ─────────────────────────────────────────────────────────────
function TrainingCard({ training }: { training: Training }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col rounded-3xl overflow-hidden group"
      style={{
        background: 'rgba(13,22,48,0.7)',
        border: '1px solid rgba(212,175,55,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.35)',
      }}
    >
      {/* Banner image */}
      <div className="relative h-48 overflow-hidden">
        {training.banner_url ? (
          <img
            src={training.banner_url}
            alt={training.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: categoryGradient(training.category) }}
          />
        )}

        {/* Gold gradient overlay on image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(2,8,16,0.1) 0%, rgba(2,8,16,0.6) 100%)',
          }}
        />

        {/* Featured badge */}
        {training.featured && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #d4af37, #f0c040)',
                color: '#020810',
                boxShadow: '0 0 12px rgba(212,175,55,0.5)',
              }}
            >
              ★ Featured
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={training.status} />
        </div>

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              background: training.price === 0
                ? '#4ade80'
                : 'linear-gradient(135deg, #d4af37, #f0c040)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8))',
            }}
          >
            {formatPrice(training.price)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category tag */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            {training.category}
          </span>
          <ModeBadge mode={training.mode} />
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold leading-snug mb-1 text-white line-clamp-2"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          {training.title}
        </h3>

        {/* Trainer */}
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
          by {training.trainer_name}
        </p>

        {/* Date + Location */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d4af37' }} />
            <span>{formatDate(training.start_date)}</span>
            {training.session_time && (
              <>
                <Clock className="w-3.5 h-3.5 flex-shrink-0 ml-1" style={{ color: '#d4af37' }} />
                <span>{training.session_time}</span>
              </>
            )}
          </div>
          {training.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d4af37' }} />
              <span className="truncate">{training.location}</span>
            </div>
          )}
        </div>

        {/* Seats bar */}
        <SeatsBar total={training.total_seats} available={training.available_seats} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            onClick={() => navigate(`/training/${training.slug}`)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid rgba(212,175,55,0.35)',
              color: 'rgba(255,255,255,0.75)',
            }}
            whileHover={{ borderColor: '#f0c040', color: '#f0c040' }}
            whileTap={{ scale: 0.97 }}
          >
            View Details
          </motion.button>

          <motion.button
            onClick={() => navigate(`/register/${training.slug}`)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
              color: '#020810',
            }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(212,175,55,0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            Register
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
      >
        <CalendarX className="w-7 h-7" style={{ color: '#d4af37' }} />
      </div>
      <h3
        className="text-xl font-semibold"
        style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: 'rgba(255,255,255,0.6)' }}
      >
        No upcoming programs scheduled
      </h3>
      <p className="text-sm text-center max-w-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
        New batches are announced regularly. Check back soon or contact us to be notified.
      </p>
    </div>
  );
}

// ── Section header divider ────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div className="text-center mb-14">
      {/* Label with gold lines */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div
          className="h-px flex-1 max-w-[80px]"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: '#d4af37' }}
        >
          UPCOMING PROGRAMS
        </span>
        <div
          className="h-px flex-1 max-w-[80px]"
          style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }}
        />
      </div>

      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
        style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
      >
        Register for Our{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Next Batch
        </span>
      </h2>

      <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Secure your seat in our professionally designed training programs led by
        Prashanth Kumar — master trainer and corporate excellence coach.
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface UpcomingTrainingsProps {
  trainings: Training[];
}

export default function UpcomingTrainings({ trainings }: UpcomingTrainingsProps) {
  if (trainings.length === 0) {
    return (
      <section
        id="upcoming"
        className="py-20 px-4"
        style={{ background: 'linear-gradient(180deg, #050b18 0%, #020810 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader />
          <div className="grid">
            <EmptyState />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="upcoming"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #050b18 0%, #020810 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {trainings.map(training => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </motion.div>

        {/* View all CTA */}
        {trainings.length >= 6 && (
          <div className="mt-12 text-center">
            <motion.a
              href="/trainings"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold"
              style={{
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#d4af37',
              }}
              whileHover={{
                borderColor: '#f0c040',
                color: '#f0c040',
                boxShadow: '0 0 20px rgba(212,175,55,0.2)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              View All Programs
              <ChevronRight className="w-4 h-4" />
            </motion.a>
          </div>
        )}
      </div>
    </section>
  );
}
