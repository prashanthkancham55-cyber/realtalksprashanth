'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, Search, ChevronDown, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getRegistrations, getRegistrationCounts,
  type StudentRegistration, type RegistrationFilters,
} from '@/lib/registrationService';
import type { Training } from '@/components/admin/trainings/data';
import RegistrationKPIs          from '@/components/admin/registrations/RegistrationKPIs';
import RegistrationTable         from '@/components/admin/registrations/RegistrationTable';
import RegistrationViewModal     from '@/components/admin/registrations/RegistrationViewModal';
import RegistrationEditModal     from '@/components/admin/registrations/RegistrationEditModal';
import RegistrationDeleteDialog  from '@/components/admin/registrations/RegistrationDeleteDialog';

type Modal = { kind: 'view' | 'edit' | 'delete'; reg: StudentRegistration } | null;

const STATUS_OPTS = [
  { value: '',          label: 'All Status' },
  { value: 'Pending',   label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const inputCls = `
  bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-white/80 text-sm
  placeholder:text-white/25 outline-none transition-all duration-200
  focus:border-gold-400/40 focus:bg-white/[0.06]
`.trim();

const selectCls = `${inputCls} appearance-none cursor-pointer pr-8`;

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />
        ))}
      </div>
      <div className="h-96 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />
    </div>
  );
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [trainings, setTrainings]   = useState<Training[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState<Modal>(null);

  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [trainingId, setTrainingId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const filters: Partial<RegistrationFilters> = { search, status, trainingId };
      const [regs, counts] = await Promise.all([
        getRegistrations(filters),
        getRegistrationCounts(),
      ]);
      setRegistrations(regs);
      setCounts(counts);
    } finally {
      setLoading(false);
    }
  }, [search, status, trainingId]);

  // Fetch training list for filter dropdown (once)
  useEffect(() => {
    supabase
      .from('trainings')
      .select('id, title')
      .order('start_date', { ascending: false })
      .then(({ data }) => setTrainings((data ?? []) as Training[]));
  }, []);

  // Re-fetch when filters change (debounced for search)
  useEffect(() => {
    const t = setTimeout(load, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const handleSaved = () => {
    setModal(null);
    load();
  };

  const handleDeleted = () => {
    setModal(null);
    load();
  };

  return (
    <>
      <div className="flex flex-col gap-8 pb-6">

        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Users className="w-5 h-5" style={{ color: '#fb923c' }} />
            </div>
            <div className="min-w-0">
              <h1
                className="text-white text-2xl font-bold tracking-tight truncate"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Student Registrations
              </h1>
              <p className="text-white/45 text-sm mt-0.5 truncate">
                Manage and review all training program registrations.
              </p>
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? <Skeleton /> : (
          <>
            {/* ── KPIs ──────────────────────────────────────────────────── */}
            <RegistrationKPIs
              total={counts.total}
              pending={counts.pending}
              confirmed={counts.confirmed}
              cancelled={counts.cancelled}
            />

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div
              className="p-4 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-nowrap">
                {/* Search */}
                <div className="flex-1 min-w-0 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="text"
                    placeholder="Search by name, email, mobile or registration ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputCls} pl-10 w-full`}
                  />
                </div>

                {/* Status filter */}
                <div className="w-full sm:w-36 lg:w-32 flex-shrink-0">
                  <SelectWrap>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`${selectCls} w-full`}
                    >
                      {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </SelectWrap>
                </div>

                {/* Training filter */}
                <div className="w-full sm:w-52 lg:w-48 flex-shrink-0">
                  <SelectWrap>
                    <select
                      value={trainingId}
                      onChange={(e) => setTrainingId(e.target.value)}
                      className={`${selectCls} w-full`}
                    >
                      <option value="">All Trainings</option>
                      {trainings.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </SelectWrap>
                </div>

                {/* Clear */}
                {(search || status || trainingId) && (
                  <button
                    onClick={() => { setSearch(''); setStatus(''); setTrainingId(''); }}
                    className="text-white/35 text-xs hover:text-white/60 transition-colors px-2 whitespace-nowrap flex-shrink-0 self-center"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Result count */}
              <p className="text-white/25 text-xs">
                {registrations.length} {registrations.length === 1 ? 'registration' : 'registrations'} found
              </p>
            </div>

            {/* ── Table ─────────────────────────────────────────────────── */}
            <RegistrationTable
              registrations={registrations}
              onView={(r)   => setModal({ kind: 'view',   reg: r })}
              onEdit={(r)   => setModal({ kind: 'edit',   reg: r })}
              onDelete={(r) => setModal({ kind: 'delete', reg: r })}
            />
          </>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal?.kind === 'view' && (
        <RegistrationViewModal
          registration={modal.reg}
          onClose={() => setModal(null)}
          onEdit={(r) => setModal({ kind: 'edit', reg: r })}
        />
      )}
      {modal?.kind === 'edit' && (
        <RegistrationEditModal
          registration={modal.reg}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.kind === 'delete' && (
        <RegistrationDeleteDialog
          registration={modal.reg}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
