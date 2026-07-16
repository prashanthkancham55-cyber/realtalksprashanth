'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import TrainingKPIs       from '@/components/admin/trainings/TrainingKPIs';
import TrainingFiltersBar from '@/components/admin/trainings/TrainingFiltersBar';
import TrainingTable      from '@/components/admin/trainings/TrainingTable';
import TrainingCards      from '@/components/admin/trainings/TrainingCards';
import TrainingViewModal  from '@/components/admin/trainings/TrainingViewModal';
import {
  Button, IconButton, EmptyState, Pagination,
  SectionHeader, ConfirmDialog,
} from '@/components/ds';
import { SAMPLE_TRAININGS, PER_PAGE, type Training } from '@/components/admin/trainings/data';

type ViewMode = 'table' | 'cards';

export default function TrainingsPage() {
  // ── Filters ──────────────────────────────────────────────────────────────────
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [category, setCategory] = useState('');
  const [mode,     setMode]     = useState('');
  const [page,     setPage]     = useState(1);
  const [view,     setView]     = useState<ViewMode>('table');

  // ── Modals ───────────────────────────────────────────────────────────────────
  const [viewTarget,   setViewTarget]   = useState<Training | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Training | null>(null);

  // ── Derived data ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SAMPLE_TRAININGS.filter((t) => {
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q)     ||
        t.trainer.toLowerCase().includes(q)  ||
        t.location.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchStatus   = !status   || t.status   === status;
      const matchCategory = !category || t.category === category;
      const matchMode     = !mode     || t.mode     === mode;
      return matchSearch && matchStatus && matchCategory && matchMode;
    });
  }, [search, status, category, mode]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasFilters = !!(search || status || category || mode);

  const resetFilters = () => {
    setSearch(''); setStatus(''); setCategory(''); setMode(''); setPage(1);
  };

  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  // ── Handlers (UI-only — no actual CRUD) ──────────────────────────────────────
  const handleView   = (t: Training) => setViewTarget(t);
  const handleEdit   = (_t: Training) => { /* UI-only: would open edit form in Phase 2 */ };
  const handleDelete = (t: Training) => setDeleteTarget(t);

  return (
    <div className="flex flex-col gap-8 pb-6">

      {/* Page header */}
      <PageHeader
        icon={BookOpen}
        iconColor="#60a5fa"
        iconBg="rgba(96,165,250,0.1)"
        title="Training Management"
        description="Create and manage all corporate training programs."
        breadcrumbs={[{ label: 'Training Management' }]}
        actions={
          <Button variant="primary" icon={Plus}>
            Add Training
          </Button>
        }
      />

      {/* KPI cards */}
      <TrainingKPIs trainings={SAMPLE_TRAININGS} />

      {/* Filters bar */}
      <TrainingFiltersBar
        search={search}
        status={status}
        category={category}
        mode={mode}
        onSearch={handleFilter(setSearch)}
        onStatus={handleFilter(setStatus)}
        onCategory={handleFilter(setCategory)}
        onMode={handleFilter(setMode)}
        onReset={resetFilters}
        hasFilters={hasFilters}
      />

      {/* Results section */}
      <div>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <SectionHeader
            title={hasFilters ? `Filtered Results` : 'All Trainings'}
            description={`${filtered.length} program${filtered.length !== 1 ? 's' : ''} found`}
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
        {paginated.length === 0 ? (
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
              : <Button variant="primary" icon={Plus}>Add Training</Button>
            }
          />
        ) : view === 'table' ? (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <TrainingTable
                trainings={paginated}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            {/* Mobile cards */}
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
        {filtered.length > PER_PAGE && (
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

      {/* View modal */}
      <TrainingViewModal
        training={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {/* Delete confirmation (UI-only) */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="Delete training?"
        description={`"${deleteTarget?.name ?? ''}" will be permanently removed. This is a UI preview — no data will be deleted.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
