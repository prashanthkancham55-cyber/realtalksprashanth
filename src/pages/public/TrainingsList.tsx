import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Search,
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  Monitor,
  Wifi,
  CalendarX,
  ArrowRight,
  ChevronRight,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import type { Training }           from '../../types/training';
import { formatDate, formatPrice, CATEGORY_OPTIONS } from '../../types/training';
import { getPublicTrainings }      from '../../lib/trainingService';

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD  = '#d4af37';
const GOLD2 = '#f0c040';
const NAV   = '#020810';
const CARD_BG = 'rgba(13,22,48,0.75)';
const BORDER  = 'rgba(212,175,55,0.15)';

// ── Category gradient map ─────────────────────────────────────────────────────
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

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

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
    Online:  { icon: <Wifi    className="w-3 h-3" />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'   },
    Offline: { icon: <Users   className="w-3 h-3" />, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)'  },
    Hybrid:  { icon: <Monitor className="w-3 h-3" />, color: '#34d399', bg: 'rgba(52,211,153,0.1)'   },
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

// ── Seats bar ─────────────────────────────────────────────────────────────────
function SeatsBar({ total, available }: { total: number; available: number }) {
  if (total <= 0) return null;
  const filled   = Math.max(0, total - available);
  const pct      = Math.min(100, (filled / total) * 100);
  const isAlmost = available <= Math.ceil(total * 0.2) && available > 0;
  const isFull   = available === 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Seats</span>
        <span className="text-xs font-semibold" style={{ color: isFull ? '#f87171' : isAlmost ? '#facc15' : '#4ade80' }}>
          {isFull ? 'Full' : `${available} left`}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
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

// ── Training card ─────────────────────────────────────────────────────────────
function TrainingCard({ training }: { training: Training }) {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col rounded-3xl overflow-hidden group"
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.35)',
      }}
      transition={{ type: 'tween', duration: 0.25 }}
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        {training.banner_url ? (
          <img
            src={training.banner_url}
            alt={training.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full" style={{ background: categoryGradient(training.category) }} />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(2,8,16,0.1) 0%, rgba(2,8,16,0.6) 100%)' }}
        />

        {/* Featured badge */}
        {training.featured && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                color: NAV,
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

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-xl font-bold"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              background: training.price === 0
                ? '#4ade80'
                : `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
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
        {/* Category + mode row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD, border: '1px solid rgba(212,175,55,0.2)' }}
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
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
            <span>{formatDate(training.start_date)}</span>
            {training.session_time && (
              <>
                <Clock className="w-3.5 h-3.5 flex-shrink-0 ml-1" style={{ color: GOLD }} />
                <span>{training.session_time}</span>
              </>
            )}
          </div>
          {training.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
              <span className="truncate">{training.location}</span>
            </div>
          )}
        </div>

        {/* Seats bar */}
        <SeatsBar total={training.total_seats} available={training.available_seats} />

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            onClick={() => navigate(`/training/${training.slug}`)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ background: 'transparent', border: `1px solid rgba(212,175,55,0.35)`, color: 'rgba(255,255,255,0.75)' }}
            whileHover={{ borderColor: GOLD2, color: GOLD2 }}
            whileTap={{ scale: 0.97 }}
          >
            View Details
          </motion.button>

          <motion.button
            onClick={() => navigate(`/register/${training.slug}`)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              color: NAV,
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
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${BORDER}` }}
      >
        <CalendarX className="w-7 h-7" style={{ color: GOLD }} />
      </div>
      <h3
        className="text-xl font-semibold"
        style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', color: 'rgba(255,255,255,0.6)' }}
      >
        {filtered ? 'No programs match your filters' : 'No programs scheduled yet'}
      </h3>
      <p className="text-sm text-center max-w-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {filtered
          ? 'Try adjusting your search or filter criteria.'
          : 'New batches are announced regularly. Check back soon.'}
      </p>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden animate-pulse"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <div style={{ height: 192, background: 'rgba(255,255,255,0.06)' }} />
      <div className="p-5 space-y-3">
        <div style={{ height: 16, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 6 }} />
        <div style={{ height: 24, width: '80%', background: 'rgba(255,255,255,0.06)', borderRadius: 6 }} />
        <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
        <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
        <div className="flex gap-2">
          <div style={{ flex: 1, height: 40, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />
          <div style={{ flex: 1, height: 40, background: 'rgba(212,175,55,0.1)', borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        background: active
          ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`
          : 'rgba(255,255,255,0.05)',
        color: active ? NAV : 'rgba(255,255,255,0.6)',
        border: active ? 'none' : `1px solid rgba(255,255,255,0.1)`,
        boxShadow: active ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
      }}
      whileHover={active ? {} : { borderColor: GOLD, color: GOLD }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrainingsList() {
  const navigate = useNavigate();

  const [trainings,      setTrainings]      = useState<Training[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters,    setShowFilters]    = useState(false);

  // ── Fetch trainings ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = 'Training Programs | RealTalks';
    setLoading(true);
    getPublicTrainings()
      .then(setTrainings)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load programs'))
      .finally(() => setLoading(false));

    return () => { document.title = 'RealTalks | Prashanth Kumar'; };
  }, []);

  // ── Filter logic ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return trainings.filter(t => {
      const matchSearch =
        !search.trim() ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.trainer_name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.location?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [trainings, search, statusFilter, categoryFilter]);

  const isFiltered = search.trim() !== '' || statusFilter !== 'All' || categoryFilter !== 'All';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ background: NAV, minHeight: '100vh' }}
    >
      {/* ── Navigation header ────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{
          background: 'rgba(2,8,16,0.92)',
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Back arrow */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:block">Home</span>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
              color: NAV,
              boxShadow: '0 0 14px rgba(212,175,55,0.35)',
            }}
          >
            RT
          </div>
          <span
            className="text-sm font-bold text-white hidden sm:block"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            RealTalks
          </span>
        </Link>

        <div className="w-20" />
      </div>

      {/* ── Hero section ─────────────────────────────────────────────────── */}
      <div
        className="py-14 px-4 sm:px-6 lg:px-8 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(13,22,48,0.7) 0%, transparent 100%)',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {/* Gold accent label */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
          <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
            ALL PROGRAMS
          </span>
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          Training{' '}
          <span
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Programs
          </span>
        </h1>

        <p className="text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Professionally designed training programs by Prashanth Kumar — master trainer and corporate excellence coach.
          {!loading && (
            <span className="ml-2 font-semibold" style={{ color: GOLD }}>
              {trainings.length} program{trainings.length !== 1 ? 's' : ''} available
            </span>
          )}
        </p>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div
        className="sticky top-14 z-30 px-4 sm:px-6 lg:px-8 py-4"
        style={{
          background: 'rgba(2,8,16,0.88)',
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Search + toggle row */}
          <div className="flex gap-3 items-center mb-3">
            {/* Search input */}
            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              />
              <input
                type="text"
                placeholder="Search programs, trainers, categories…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${search ? GOLD : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: search ? `0 0 0 3px rgba(212,175,55,0.1)` : 'none',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium sm:hidden"
              style={{
                background: showFilters ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showFilters ? GOLD : 'rgba(255,255,255,0.1)'}`,
                color: showFilters ? GOLD : 'rgba(255,255,255,0.6)',
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Clear filters */}
            {isFiltered && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  color: '#f87171',
                }}
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </motion.button>
            )}
          </div>

          {/* Filter chips — visible on md+, collapsible on mobile */}
          {/* Desktop: always visible filter chips */}
          <div className="hidden sm:flex flex-wrap gap-2 pt-1">
            <div className="flex gap-2 flex-wrap">
              {['All', 'Active', 'Upcoming'].map(s => (
                <FilterChip
                  key={s}
                  label={s === 'All' ? 'All Status' : s}
                  active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                />
              ))}
            </div>

            <div className="w-px h-6 self-center" style={{ background: BORDER }} />

            <div className="flex gap-2 flex-wrap">
              <FilterChip
                label="All Categories"
                active={categoryFilter === 'All'}
                onClick={() => setCategoryFilter('All')}
              />
              {CATEGORY_OPTIONS.map(c => (
                <FilterChip
                  key={c}
                  label={c}
                  active={categoryFilter === c}
                  onClick={() => setCategoryFilter(c)}
                />
              ))}
            </div>
          </div>

          {/* Mobile: collapsible filter chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden sm:hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex gap-2 flex-wrap">
                    {['All', 'Active', 'Upcoming'].map(s => (
                      <FilterChip
                        key={s}
                        label={s === 'All' ? 'All Status' : s}
                        active={statusFilter === s}
                        onClick={() => setStatusFilter(s)}
                      />
                    ))}
                  </div>

                  <div className="w-px h-6 self-center" style={{ background: BORDER }} />

                  <div className="flex gap-2 flex-wrap">
                    <FilterChip
                      label="All Categories"
                      active={categoryFilter === 'All'}
                      onClick={() => setCategoryFilter('All')}
                    />
                    {CATEGORY_OPTIONS.map(c => (
                      <FilterChip
                        key={c}
                        label={c}
                        active={categoryFilter === c}
                        onClick={() => setCategoryFilter(c)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Trainings grid ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Error state */}
        {error && (
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-8"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}
          >
            <span className="text-sm" style={{ color: '#f87171' }}>{error}</span>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                getPublicTrainings()
                  .then(setTrainings)
                  .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
                  .finally(() => setLoading(false));
              }}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Results count (when filtered) */}
        {!loading && isFiltered && (
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Showing <span className="font-semibold text-white">{filtered.length}</span> result
            {filtered.length !== 1 ? 's' : ''}
            {search && (
              <span>
                {' '}for "<span style={{ color: GOLD }}>{search}</span>"
              </span>
            )}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Cards grid */}
        {!loading && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.length > 0
              ? filtered.map(t => <TrainingCard key={t.id} training={t} />)
              : <EmptyState filtered={isFiltered} />
            }
          </motion.div>
        )}

        {/* Footer hint */}
        {!loading && filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs mt-10"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Showing all {filtered.length} program{filtered.length !== 1 ? 's' : ''}.
            Can't find what you're looking for?{' '}
            <a href="/#contact" style={{ color: GOLD }}>Contact us</a>.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
