'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import PageHeader         from '@/components/admin/PageHeader';
import TrainingKPIs       from '@/components/admin/trainings/TrainingKPIs';
import TrainingFiltersBar from '@/components/admin/trainings/TrainingFiltersBar';
import TrainingTable      from '@/components/admin/trainings/TrainingTable';
import TrainingCards      from '@/components/admin/trainings/TrainingCards';
import TrainingViewModal  from '@/components/admin/trainings/TrainingViewModal';
import TrainingFormModal  from '@/components/admin/trainings/TrainingFormModal';
import {
  Button, EmptyState, Pagination, SectionHeader,
  ConfirmDialog, ToastContainer, createToast,
  TableSkeleton, StatsGridSkeleton,
  type ToastItem,
} from '@/components/ds';
import { deleteTraining, fetchTrainings } from '@/lib/trainingService';
import { PER_PAGE, type Training } from '@/components/admin/trainings/data';

type ViewMode = 'table' | 'cards';

export default function TrainingsPage() {
  // ── Data ─────────────────────────────────────────────────────────────────────
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading,   setLoading]   = useState(true);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [category, setCategory] = useState('');
  const [mode,     setMode]     = useState('');
  const [page,     setPage]     = useState(1);
  const [view,     setView]     = useState<ViewMode>('table');

  // ── Modals ───────────────────────────────────────────────────────────────────
  const [viewTarget,   setViewTarget]   = useState<Training | null>(null);
  const [editTarget,   setEditTarget]   = useState<Training | null>(null);
  const [formOpen,     setFormOpen]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Training | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  // ── Toasts ───────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimeout = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addToast = useCallback((t: ToastItem) => {
    setToasts((prev) => [...prev, t]);
    const id = setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4500);
    toastTimeout.current.push(id);
  }, []);

  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const notifySuccess = (msg: string) => addToast(createToast('success', msg));
  const notifyError   = (msg: string) => addToast(createToast('error', 'Error', msg));

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const loadTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTrainings();
      setTrainings(data);
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : 'Failed to load trainings.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { loadTrainings(); }, [loadTrainings]);

  // ── Filtered / paginated ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return trainings.filter((t) => {
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q)        ||
        t.trainer_name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)     ||
        t.category.toLowerCase().includes(q);
      const matchStatus   = !status   || t.status   === status;
      const matchCategory = !category || t.category === category;
      const matchMode     = !mode     || t.mode     === mode;
      return matchSearch && matchStatus && matchCategory && matchMode;
    });
  }, [trainings, search, status, category, mode]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = !!(search || status || category || mode);

  const resetFilters = () => { setSearch(''); setStatus(''); setCategory(''); setMode(''); setPage(1); };
  const applyFilter  = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  // ── CRUD handlers ─────────────────────────────────────────────────────────────
  const handleAddClick = () => { setEditTarget(null); setFormOpen(true); };
  const handleEdit     = (t: Training) => { setEditTarget(t); setFormOpen(true); };
  const handleView     = (t: Training) => setViewTarget(t);
  const handleDelete   = (t: Training) => setDeleteTarget(t);

  const handleFormSaved = (msg: string) => {
    notifySuccess(msg);
    loadTrainings();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTraining(deleteTarget.id);
      notifySuccess(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      loadTrainings();
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-6">

      {/* Toast portal */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Page header */}
      <PageHeader
        icon={BookOpen}
        iconColor="#60a5fa"
        iconBg="rgba(96,165,250,0.1)"
        title="Training Management"
        description="Create and manage all corporate training programs."
        breadcrumbs={[{ label: 'Training Management' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleAddClick}>
            Add Training
          </Button>
        }
      />

      {/* KPI cards */}
      {loading ? <StatsGridSkeleton cols={4} count={4} /> : <TrainingKPIs trainings={trainings} />}

      {/* Filters bar */}
      <TrainingFiltersBar
        search={search}
        status={status}
        category={category}
        mode={mode}
        onSearch={applyFilter(setSearch)}
        onStatus={applyFilter(setStatus)}
        onCategory={applyFilter(setCategory)}
        onMode={applyFilter(setMode)}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />

      {/* Results section */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <SectionHeader
            title={hasFilters ? 'Filtered Results' : 'All Trainings'}
            description={loading ? 'Loading…' : `${filtered.length} program${filtered.length !== 1 ? 's' : ''} found`}
            className="mb-0 flex-1"
          />

          {/* View toggle */}
          <div
            className="flex rounded-xl overflow-hidden p-1 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {(['table', 'cards'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-2 rounded-lg transition-all duration-200 ${view === v ? 'text-navy-900' : 'text-white/35 hover:text-white/60'}`}
                style={view === v ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' } : {}}
              >
                {v === 'table'
                  ? <LayoutList className="w-3.5 h-3.5" />
                  : <LayoutGrid className="w-3.5 h-3.5" />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            iconColor="#60a5fa"
            title={hasFilters ? 'No trainings match your filters' : 'No trainings yet'}
            description={hasFilters
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Click "Add Training" to create your first training program.'
            }
            action={hasFilters
              ? <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
              : <Button variant="primary" icon={Plus} onClick={handleAddClick}>Add Training</Button>
            }
          />
        ) : view === 'table' ? (
          <>
            <div className="hidden md:block">
              <TrainingTable
                trainings={paginated}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="md:hidden">
              <TrainingCards
                trainings={paginated}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </>
        ) : (
          <TrainingCards
            trainings={paginated}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        {!loading && filtered.length > PER_PAGE && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={setPage}
            total={filtered.length}
            perPage={PER_PAGE}
            showInfo
          />
        )}
      </div>

      {/* Create / Edit form modal */}
      <TrainingFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSaved={handleFormSaved}
        onError={notifyError}
        editData={editTarget}
      />

      {/* View detail modal */}
      <TrainingViewModal
        training={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete training?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently removed from your database. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
