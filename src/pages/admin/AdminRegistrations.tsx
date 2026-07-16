import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  X,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Hash,
} from 'lucide-react';
import type { StudentRegistration, RegistrationStatus } from '../../types/registration';
import { STATUS_BADGE } from '../../types/registration';
import {
  getRegistrations,
  getRegistrationCounts,
  updateRegistration,
  deleteRegistration,
  formatRegistrationDate,
} from '../../lib/registrationService';
import { getAllTrainings } from '../../lib/trainingService';
import type { Training } from '../../types/training';
import { Button, IconButton } from '../../components/ds/Button';

/* ── Constants ───────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;
const STATUS_OPTIONS: RegistrationStatus[] = ['Pending', 'Confirmed', 'Cancelled'];

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

function StatusBadge({ status }: { status: RegistrationStatus }) {
  const s = STATUS_BADGE[status];
  return (
    <span
      className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {status}
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
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  loading?: boolean;
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
        {loading ? (
          <div className="w-12 h-6 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
        ) : (
          <div
            className="text-2xl font-semibold text-white leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {value}
          </div>
        )}
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Filter Select ───────────────────────────────────────────────────────────── */
function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  allLabel: string;
}) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-3.5 py-2.5 pr-8 rounded-xl text-sm text-white outline-none transition-all cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      >
        <option value="" style={{ background: '#0d1630' }}>{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#0d1630' }}>{o.label}</option>
        ))}
      </select>
      <div
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

/* ── Detail row (for modals) ─────────────────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37' }}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {label}
        </div>
        <div className="text-sm text-white/75 break-words">
          {value || <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
        </div>
      </div>
    </div>
  );
}

/* ── Modal shared backdrop/panel ─────────────────────────────────────────────── */
function ModalShell({
  onClose,
  maxWidth,
  children,
}: {
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full flex flex-col"
        style={{ maxWidth: maxWidth ?? '36rem', maxHeight: '92vh' }}
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
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div>
        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          {title}
        </h2>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── View Registration Modal ─────────────────────────────────────────────────── */
function ViewModal({
  reg,
  onClose,
  onEdit,
}: {
  reg: StudentRegistration;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <ModalHeader
        title="Registration Details"
        subtitle={`ID: ${reg.registration_id}`}
        onClose={onClose}
      />
      <div className="overflow-y-auto flex-1 px-6 py-5">

        {/* Status + Training */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <StatusBadge status={reg.status} />
          {reg.training_title && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              {reg.training_title}
            </span>
          )}
        </div>

        {/* Student Details */}
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Student Details</h3>
        <div className="divide-y" style={{ borderColor: 'transparent' }}>
          <DetailRow icon={User}     label="Full Name"  value={reg.full_name} />
          <DetailRow icon={Phone}    label="Mobile"     value={reg.mobile} />
          <DetailRow icon={Mail}     label="Email"      value={reg.email} />
          <DetailRow icon={MapPin}   label="City"       value={`${reg.city}${reg.state ? `, ${reg.state}` : ''}`} />
          <DetailRow icon={Briefcase} label="Company"   value={reg.company ?? undefined} />
          <DetailRow icon={Briefcase} label="Designation" value={reg.designation ?? undefined} />
          <DetailRow icon={Users}    label="Experience" value={reg.experience} />
          <DetailRow icon={Briefcase} label="Industry"  value={reg.industry} />
          <DetailRow icon={User}     label="Gender"     value={reg.gender} />
          <DetailRow icon={Calendar} label="Date of Birth" value={reg.date_of_birth ?? undefined} />
          <DetailRow icon={Phone}    label="Emergency Contact" value={reg.emergency_contact ?? undefined} />
          <DetailRow icon={MapPin}   label="Address"    value={reg.address ?? undefined} />
        </div>

        {/* Training Details */}
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mt-5 mb-3">Training Details</h3>
        <div className="divide-y" style={{ borderColor: 'transparent' }}>
          <DetailRow icon={FileText} label="Training"   value={reg.training_title} />
          <DetailRow icon={Calendar} label="Start Date" value={reg.training_start ? new Date(reg.training_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined} />
          <DetailRow icon={Users}    label="Mode"       value={reg.training_mode} />
          <DetailRow icon={Calendar} label="Registered" value={formatRegistrationDate(reg.registered_at)} />
        </div>

        {/* Notes */}
        {reg.notes && (
          <>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mt-5 mb-3">Admin Notes</h3>
            <div
              className="text-sm text-white/70 rounded-xl px-4 py-3 whitespace-pre-wrap"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {reg.notes}
            </div>
          </>
        )}
      </div>
      <div
        className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Button variant="secondary" size="md" onClick={onClose}>Close</Button>
        <Button variant="primary" size="md" icon={Edit2} onClick={onEdit}>Edit</Button>
      </div>
    </ModalShell>
  );
}

/* ── Edit Registration Modal ─────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border:     '1px solid rgba(255,255,255,0.08)',
};
const focusBorder = 'rgba(212,175,55,0.4)';

interface EditForm {
  status:            RegistrationStatus;
  full_name:         string;
  mobile:            string;
  email:             string;
  city:              string;
  state:             string;
  company:           string;
  designation:       string;
  notes:             string;
}

function EditModal({
  reg,
  onClose,
  onSaved,
}: {
  reg: StudentRegistration;
  onClose: () => void;
  onSaved: (updated: Partial<StudentRegistration>) => void;
}) {
  const [form, setForm] = useState<EditForm>({
    status:      reg.status,
    full_name:   reg.full_name,
    mobile:      reg.mobile,
    email:       reg.email,
    city:        reg.city,
    state:       reg.state,
    company:     reg.company ?? '',
    designation: reg.designation ?? '',
    notes:       reg.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function set<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    try {
      setSaving(true);
      const patch: Record<string, unknown> = {
        status:      form.status,
        full_name:   form.full_name.trim(),
        mobile:      form.mobile.trim(),
        email:       form.email.trim().toLowerCase(),
        city:        form.city.trim(),
        state:       form.state,
        company:     form.company.trim() || null,
        designation: form.designation.trim() || null,
        notes:       form.notes.trim() || null,
      };
      await updateRegistration(reg.id, patch);
      onSaved(patch as Partial<StudentRegistration>);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update registration.');
    } finally {
      setSaving(false);
    }
  }

  function FInput({ label, fieldKey, type = 'text', placeholder }: {
    label: string; fieldKey: keyof EditForm; type?: string; placeholder?: string;
  }) {
    return (
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</label>
        <input
          type={type}
          value={form[fieldKey] as string}
          onChange={(e) => set(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
          style={inputBase}
          onFocus={(e) => { e.currentTarget.style.borderColor = focusBorder; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <ModalHeader title="Edit Registration" subtitle={reg.registration_id} onClose={onClose} />
      <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((s) => {
                const style = STATUS_BADGE[s];
                const active = form.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      color:      active ? style.color : 'rgba(255,255,255,0.4)',
                      background: active ? style.bg    : 'rgba(255,255,255,0.03)',
                      border:     active ? `1px solid ${style.border}` : '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student fields */}
          <div className="grid grid-cols-2 gap-3">
            <FInput label="Full Name" fieldKey="full_name" placeholder="Full name" />
            <FInput label="Mobile" fieldKey="mobile" placeholder="Mobile number" />
          </div>
          <FInput label="Email" fieldKey="email" type="email" placeholder="Email address" />
          <div className="grid grid-cols-2 gap-3">
            <FInput label="City" fieldKey="city" placeholder="City" />
            <FInput label="State" fieldKey="state" placeholder="State" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FInput label="Company" fieldKey="company" placeholder="Company (optional)" />
            <FInput label="Designation" fieldKey="designation" placeholder="Designation (optional)" />
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder="Internal notes visible only to admins…"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
              style={inputBase}
              onFocus={(e) => { e.currentTarget.style.borderColor = focusBorder; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>
        </div>
        <div
          className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Button variant="secondary" size="md" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" type="submit" loading={saving}>Save Changes</Button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ── Delete Confirm Dialog ───────────────────────────────────────────────────── */
function DeleteDialog({
  reg,
  onConfirm,
  onCancel,
  loading,
}: {
  reg: StudentRegistration;
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
        <h3 className="text-lg font-semibold text-white mb-1">Delete Registration?</h3>
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          This will permanently remove the registration record.
        </p>
        <div
          className="text-sm font-medium mb-6 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span style={{ color: '#d4af37' }}>{reg.registration_id}</span> — {reg.full_name}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" fullWidth onClick={onCancel}>Cancel</Button>
          <Button variant="danger" size="sm" fullWidth loading={loading} onClick={onConfirm}>Delete</Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Modal state ─────────────────────────────────────────────────────────────── */
type ModalState =
  | { type: 'none' }
  | { type: 'view';   reg: StudentRegistration }
  | { type: 'edit';   reg: StudentRegistration }
  | { type: 'delete'; reg: StudentRegistration };

/* ── AdminRegistrations ──────────────────────────────────────────────────────── */
export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [trainings,     setTrainings]     = useState<Training[]>([]);
  const [counts,        setCounts]        = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [loading,       setLoading]       = useState(true);
  const [countsLoading, setCountsLoading] = useState(true);
  const [error,         setError]         = useState('');
  const [modal,         setModal]         = useState<ModalState>({ type: 'none' });
  const [deleting,      setDeleting]      = useState(false);

  /* Filters */
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [trainingId, setTrainingId] = useState('');

  /* Pagination */
  const [page, setPage] = useState(1);

  /* ── Fetch trainings for filter dropdown ── */
  useEffect(() => {
    getAllTrainings()
      .then(setTrainings)
      .catch(() => { /* non-critical */ });
  }, []);

  /* ── Fetch counts ── */
  const fetchCounts = useCallback(async () => {
    try {
      setCountsLoading(true);
      const c = await getRegistrationCounts();
      setCounts(c);
    } catch {
      /* non-critical */
    } finally {
      setCountsLoading(false);
    }
  }, []);

  /* ── Fetch registrations ── */
  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getRegistrations({
        search:     search || undefined,
        status:     status || undefined,
        trainingId: trainingId || undefined,
      });
      setRegistrations(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  }, [search, status, trainingId]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  /* Debounce search */
  useEffect(() => {
    setPage(1);
    const t = setTimeout(() => { fetchRegistrations(); }, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search, status, trainingId, fetchRegistrations]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(registrations.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = registrations.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  /* Training options for filter */
  const trainingOptions = useMemo(() =>
    trainings.map((t) => ({ label: t.title, value: t.id })),
    [trainings]
  );

  /* ── Delete handler ── */
  async function handleDelete(reg: StudentRegistration) {
    try {
      setDeleting(true);
      await deleteRegistration(reg.id);
      setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
      setCounts((prev) => ({
        ...prev,
        total:     Math.max(0, prev.total - 1),
        pending:   reg.status === 'Pending'   ? Math.max(0, prev.pending - 1)   : prev.pending,
        confirmed: reg.status === 'Confirmed' ? Math.max(0, prev.confirmed - 1) : prev.confirmed,
        cancelled: reg.status === 'Cancelled' ? Math.max(0, prev.cancelled - 1) : prev.cancelled,
      }));
      setModal({ type: 'none' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete registration.');
      setModal({ type: 'none' });
    } finally {
      setDeleting(false);
    }
  }

  /* ── Edit saved ── */
  function handleEditSaved(reg: StudentRegistration, patch: Partial<StudentRegistration>) {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === reg.id ? { ...r, ...patch } : r))
    );
    fetchCounts(); // Refresh counts after status change
    setModal({ type: 'none' });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}
        >
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1
            className="text-3xl font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Registrations
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage all student training registrations.
          </p>
        </div>
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
            <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Registrations"
          value={counts.total}
          icon={Users}
          iconColor="#d4af37"
          iconBg="rgba(212,175,55,0.12)"
          loading={countsLoading}
        />
        <KpiCard
          label="Pending"
          value={counts.pending}
          icon={Clock}
          iconColor="#fbbf24"
          iconBg="rgba(251,191,36,0.1)"
          loading={countsLoading}
        />
        <KpiCard
          label="Confirmed"
          value={counts.confirmed}
          icon={CheckCircle}
          iconColor="#4ade80"
          iconBg="rgba(74,222,128,0.1)"
          loading={countsLoading}
        />
        <KpiCard
          label="Cancelled"
          value={counts.cancelled}
          icon={XCircle}
          iconColor="#f87171"
          iconBg="rgba(248,113,113,0.1)"
          loading={countsLoading}
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
            placeholder="Search name, email, mobile, ID…"
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
          options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
          allLabel="All Statuses"
        />

        {/* Training filter */}
        <FilterSelect
          value={trainingId}
          onChange={setTrainingId}
          options={trainingOptions}
          allLabel="All Trainings"
        />

        {/* Clear */}
        {(search || status || trainingId) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setTrainingId(''); }}
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
            gridTemplateColumns: '120px 2fr 2fr 1.2fr 90px 100px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <span>Reg. ID</span>
          <span>Student</span>
          <span>Training</span>
          <span>Registered</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="w-24 h-5 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-28 h-3.5" />
                <Skeleton className="w-20 h-6 rounded-full" />
                <div className="flex gap-1.5">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.12)' }} />
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {search || status || trainingId
                ? 'No registrations match your filters.'
                : 'No registrations yet.'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 700 }}>
              <AnimatePresence initial={false}>
                {paginated.map((reg) => (
                  <motion.div
                    key={reg.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.16 }}
                    className="grid items-center px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
                    style={{
                      gridTemplateColumns: '120px 2fr 2fr 1.2fr 90px 100px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {/* Reg ID */}
                    <div>
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: '#d4af37' }}
                      >
                        <Hash className="w-3 h-3 inline mr-0.5" />
                        {reg.registration_id}
                      </span>
                    </div>

                    {/* Student */}
                    <div className="min-w-0 pr-3">
                      <div className="text-sm font-semibold text-white truncate">{reg.full_name}</div>
                      <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {reg.email}
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {reg.mobile}
                      </div>
                    </div>

                    {/* Training */}
                    <div className="min-w-0 pr-3">
                      <div className="text-sm text-white/70 truncate">{reg.training_title ?? '—'}</div>
                      {reg.training_start && (
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {new Date(reg.training_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    {/* Registered date */}
                    <div className="text-xs pr-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {formatRegistrationDate(reg.registered_at)}
                    </div>

                    {/* Status */}
                    <div>
                      <StatusBadge status={reg.status} />
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center justify-end gap-1.5"
                      style={{ position: 'sticky', right: 0, background: 'rgba(4,9,22,0.97)' }}
                    >
                      <IconButton
                        icon={Eye}
                        variant="gold"
                        size="sm"
                        label="View registration"
                        onClick={() => setModal({ type: 'view', reg })}
                      />
                      <IconButton
                        icon={Edit2}
                        variant="default"
                        size="sm"
                        label="Edit registration"
                        onClick={() => setModal({ type: 'edit', reg })}
                      />
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        label="Delete registration"
                        onClick={() => setModal({ type: 'delete', reg })}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && registrations.length > PAGE_SIZE && (
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Showing {((safePage - 1) * PAGE_SIZE) + 1}–{Math.min(safePage * PAGE_SIZE, registrations.length)} of {registrations.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
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
      {!loading && registrations.length > 0 && (
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Users className="w-3.5 h-3.5" />
          {registrations.length} registrations shown
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {modal.type === 'view' && (
          <ViewModal
            key={`view-${modal.reg.id}`}
            reg={modal.reg}
            onClose={() => setModal({ type: 'none' })}
            onEdit={() => setModal({ type: 'edit', reg: modal.reg })}
          />
        )}
        {modal.type === 'edit' && (
          <EditModal
            key={`edit-${modal.reg.id}`}
            reg={modal.reg}
            onClose={() => setModal({ type: 'none' })}
            onSaved={(patch) => handleEditSaved(modal.reg, patch)}
          />
        )}
        {modal.type === 'delete' && (
          <DeleteDialog
            key={`delete-${modal.reg.id}`}
            reg={modal.reg}
            loading={deleting}
            onConfirm={() => handleDelete(modal.reg)}
            onCancel={() => setModal({ type: 'none' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
