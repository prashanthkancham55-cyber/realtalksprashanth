import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Layers,
  X,
} from 'lucide-react';
import type { Training } from '../../types/training';
import { formatDate, formatPrice, STATUS_OPTIONS, CATEGORY_OPTIONS, MODE_OPTIONS } from '../../types/training';
import { getAllTrainings, deleteTraining } from '../../lib/trainingService';
import { Button, IconButton } from '../../components/ds/Button';
import TrainingFormModal from '../../components/admin/trainings/TrainingFormModal';
import TrainingViewModal from '../../components/admin/trainings/TrainingViewModal';

/* ── Constants ───────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

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

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const s = MODE_STYLE[mode] ?? MODE_STYLE.Online;
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {mode}
    </span>
  );
}

/* ── KPI Card ────────────────────────────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl px-5 py-4 flex items-center gap-4"
      style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div
          className="text-2xl font-semibold text-white leading-none"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {value}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Delete Confirm Dialog ───────────────────────────────────────────────────── */
function DeleteDialog({
  training,
  onConfirm,
  onCancel,
  loading,
}: {
  training: Training;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#0d1630', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Delete Training?</h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          This action is permanent and cannot be undone.
        </p>
        <p
          className="text-sm font-medium mb-6 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          "{training.title}"
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" fullWidth loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Filter pill select ──────────────────────────────────────────────────────── */
function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  allLabel: string;
}) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-3.5 py-2.5 pr-8 rounded-xl text-sm text-white outline-none transition-all cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <option value="" style={{ background: '#0d1630' }}>{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: '#0d1630' }}>{o}</option>
        ))}
      </select>
      <div
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── Modal mode ──────────────────────────────────────────────────────────────── */
type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit';   training: Training }
  | { type: 'view';   training: Training }
  | { type: 'delete'; training: Training };

/* ── AdminTrainings ──────────────────────────────────────────────────────────── */
export default function AdminTrainings() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modal, setModal]         = useState<ModalState>({ type: 'none' });
  const [deleting, setDeleting]   = useState(false);

  /* Filters */
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [category, setCategory] = useState('');
  const [mode,     setMode]     = useState('');

  /* Pagination */
  const [page, setPage] = useState(1);

  /* ── Fetch ── */
  async function fetchTrainings() {
    try {
      setLoading(true);
      setError('');
      const data = await getAllTrainings();
      setTrainings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load trainings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTrainings(); }, []);

  /* Reset page when filters change */
  useEffect(() => { setPage(1); }, [search, status, category, mode]);

  /* ── KPIs ── */
  const kpis = useMemo(() => ({
    total:     trainings.length,
    active:    trainings.filter((t) => t.status === 'Active').length,
    upcoming:  trainings.filter((t) => t.status === 'Upcoming').length,
    completed: trainings.filter((t) => t.status === 'Completed').length,
  }), [trainings]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trainings.filter((t) => {
      if (status   && t.status   !== status)   return false;
      if (category && t.category !== category) return false;
      if (mode     && t.mode     !== mode)     return false;
      if (q) {
        return (
          t.title.toLowerCase().includes(q) ||
          t.trainer_name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [trainings, search, status, category, mode]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePages  = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePages - 1) * PAGE_SIZE, safePages * PAGE_SIZE);

  /* ── Delete handler ── */
  async function handleDelete(t: Training) {
    try {
      setDeleting(true);
      await deleteTraining(t.id);
      setTrainings((prev) => prev.filter((x) => x.id !== t.id));
      setModal({ type: 'none' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete training.');
      setModal({ type: 'none' });
    } finally {
      setDeleting(false);
    }
  }

  /* ── Saved callback ── */
  function handleSaved(saved: Training) {
    setTrainings((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModal({ type: 'none' });
  }

  /* ── View → Edit transition ── */
  function handleEditFromView(t: Training) {
    setModal({ type: 'edit', training: t });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1
              className="text-3xl font-semibold text-white"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Training Management
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Create, edit, and manage all training programmes.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setModal({ type: 'add' })}
        >
          Add Training
        </Button>
      </div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
            <button onClick={() => setError('')}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Trainings"
          value={kpis.total}
          icon={BookOpen}
          iconColor="#d4af37"
          iconBg="rgba(212,175,55,0.12)"
        />
        <KpiCard
          label="Active"
          value={kpis.active}
          icon={CheckCircle}
          iconColor="#4ade80"
          iconBg="rgba(74,222,128,0.1)"
        />
        <KpiCard
          label="Upcoming"
          value={kpis.upcoming}
          icon={Clock}
          iconColor="#60a5fa"
          iconBg="rgba(96,165,250,0.1)"
        />
        <KpiCard
          label="Completed"
          value={kpis.completed}
          icon={Layers}
          iconColor="#a78bfa"
          iconBg="rgba(167,139,250,0.1)"
        />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainings…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
        </div>

        {/* Status filter */}
        <FilterSelect
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          allLabel="All Statuses"
        />

        {/* Category filter */}
        <FilterSelect
          value={category}
          onChange={setCategory}
          options={CATEGORY_OPTIONS}
          allLabel="All Categories"
        />

        {/* Mode filter */}
        <FilterSelect
          value={mode}
          onChange={setMode}
          options={MODE_OPTIONS}
          allLabel="All Modes"
        />

        {/* Clear filters */}
        {(search || status || category || mode) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setCategory(''); setMode(''); }}
            className="text-xs flex items-center gap-1 transition-colors flex-shrink-0 px-3 py-2.5 rounded-xl"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Column headers */}
        <div
          className="hidden lg:grid px-4 py-3 text-[11px] font-semibold tracking-wider uppercase"
          style={{
            gridTemplateColumns: '56px 2.5fr 1.2fr 1.3fr 90px 90px 110px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <span>Banner</span>
          <span>Training</span>
          <span>Trainer</span>
          <span>Date</span>
          <span>Mode</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          /* Skeleton rows */
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5">
                <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/5" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-16 h-6 rounded-full" />
                <Skeleton className="w-20 h-6 rounded-full" />
                <div className="flex gap-1.5">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.12)' }} />
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {search || status || category || mode
                ? 'No trainings match your filters.'
                : 'No trainings yet. Click "Add Training" to create one.'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 720 }}>
              <AnimatePresence initial={false}>
                {paginated.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.16 }}
                    className="grid items-center px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
                    style={{
                      gridTemplateColumns: '56px 2.5fr 1.2fr 1.3fr 90px 90px 110px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* Banner thumbnail */}
                    <div className="flex-shrink-0">
                      {t.banner_url ? (
                        <img
                          src={t.banner_url}
                          alt={t.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}
                        >
                          <BookOpen className="w-5 h-5" style={{ color: '#d4af37' }} />
                        </div>
                      )}
                    </div>

                    {/* Training info */}
                    <div className="min-w-0 pr-3">
                      <div className="text-sm font-semibold text-white truncate">{t.title}</div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {t.category}
                        {t.featured && (
                          <span className="ml-2 text-[10px] font-bold" style={{ color: '#d4af37' }}>★ Featured</span>
                        )}
                      </div>
                    </div>

                    {/* Trainer */}
                    <div className="text-sm truncate pr-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {t.trainer_name}
                    </div>

                    {/* Date */}
                    <div className="text-xs pr-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {formatDate(t.start_date)}
                      {t.start_date !== t.end_date && (
                        <div style={{ color: 'rgba(255,255,255,0.3)' }}>→ {formatDate(t.end_date)}</div>
                      )}
                    </div>

                    {/* Mode */}
                    <div>
                      <ModeBadge mode={t.mode} />
                    </div>

                    {/* Status */}
                    <div>
                      <StatusBadge status={t.status} />
                    </div>

                    {/* Actions — sticky-like via last column alignment */}
                    <div
                      className="flex items-center justify-end gap-1.5"
                      style={{ position: 'sticky', right: 0, background: 'rgba(4,9,22,0.97)' }}
                    >
                      <IconButton
                        icon={Eye}
                        variant="gold"
                        size="sm"
                        label="View training"
                        onClick={() => setModal({ type: 'view', training: t })}
                      />
                      <IconButton
                        icon={Edit2}
                        variant="default"
                        size="sm"
                        label="Edit training"
                        onClick={() => setModal({ type: 'edit', training: t })}
                      />
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        label="Delete training"
                        onClick={() => setModal({ type: 'delete', training: t })}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Showing {((safePages - 1) * PAGE_SIZE) + 1}–{Math.min(safePages * PAGE_SIZE, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePages <= 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}>
                {safePages} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePages >= totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Results count ── */}
      {!loading && trainings.length > 0 && (
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <BookOpen className="w-3.5 h-3.5" />
          {filtered.length} of {trainings.length} trainings
          {formatPrice(0) && null /* keep import alive */}
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal.type === 'add' && (
          <TrainingFormModal
            key="add"
            mode="add"
            onClose={() => setModal({ type: 'none' })}
            onSaved={handleSaved}
          />
        )}
        {modal.type === 'edit' && (
          <TrainingFormModal
            key={`edit-${modal.training.id}`}
            mode="edit"
            training={modal.training}
            onClose={() => setModal({ type: 'none' })}
            onSaved={handleSaved}
          />
        )}
        {modal.type === 'view' && (
          <TrainingViewModal
            key={`view-${modal.training.id}`}
            training={modal.training}
            onClose={() => setModal({ type: 'none' })}
            onEdit={() => handleEditFromView(modal.training)}
          />
        )}
        {modal.type === 'delete' && (
          <DeleteDialog
            key={`delete-${modal.training.id}`}
            training={modal.training}
            loading={deleting}
            onConfirm={() => handleDelete(modal.training)}
            onCancel={() => setModal({ type: 'none' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
