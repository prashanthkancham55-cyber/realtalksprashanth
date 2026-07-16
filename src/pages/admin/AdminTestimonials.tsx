import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Edit2, Trash2, X, AlertCircle, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ds/Button';
import { IconButton } from '../../components/ds/Button';

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface Testimonial {
  id:          string;
  name:        string;
  designation: string;
  company:     string;
  photo_url:   string;
  review:      string;
  rating:      number;
  created_at:  string;
}

interface TestimonialFormData {
  name:        string;
  designation: string;
  company:     string;
  photo_url:   string;
  review:      string;
  rating:      number;
}

const EMPTY_FORM: TestimonialFormData = {
  name: '', designation: '', company: '', photo_url: '', review: '', rating: 5,
};

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Skeleton ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

/* ── Star Rating Selector ─────────────────────────────────────────────────────── */
function StarRatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className="w-6 h-6 transition-colors"
            style={{
              color: star <= (hovered || value) ? '#f0c040' : 'rgba(255,255,255,0.15)',
              fill:  star <= (hovered || value) ? '#f0c040' : 'transparent',
            }}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-white/50 self-center">{value}/5</span>
    </div>
  );
}

/* ── Star Display ─────────────────────────────────────────────────────────────── */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          style={{
            color: s <= rating ? '#f0c040' : 'rgba(255,255,255,0.15)',
            fill:  s <= rating ? '#f0c040' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

/* ── Input/Textarea helpers ───────────────────────────────────────────────────── */
const fieldStyle: React.CSSProperties = {
  background:  'rgba(255,255,255,0.04)',
  border:      '1px solid rgba(255,255,255,0.08)',
};
const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(212,175,55,0.4)';
};
const fieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
};

function FieldInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 font-medium mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
        style={fieldStyle}
        onFocus={fieldFocus}
        onBlur={fieldBlur}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 font-medium mb-1.5">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
        style={fieldStyle}
        onFocus={fieldFocus}
        onBlur={fieldBlur}
      />
    </div>
  );
}

/* ── Add/Edit Modal ───────────────────────────────────────────────────────────── */
function TestimonialModal({
  editing,
  form,
  onChange,
  onSave,
  onClose,
  saving,
  error,
}: {
  editing: Testimonial | null;
  form: TestimonialFormData;
  onChange: (key: keyof TestimonialFormData, value: string | number) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
  error: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(2,8,16,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="relative w-full max-w-lg my-auto"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#0d1630', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3
              className="text-lg font-semibold text-white"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {editing ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <IconButton icon={X} variant="default" size="sm" label="Close" onClick={onClose} />
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FieldInput
                  label="Full Name *"
                  value={form.name}
                  onChange={(e) => onChange('name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <FieldInput
                label="Designation"
                value={form.designation}
                onChange={(e) => onChange('designation', e.target.value)}
                placeholder="Sales Director"
              />
              <FieldInput
                label="Company"
                value={form.company}
                onChange={(e) => onChange('company', e.target.value)}
                placeholder="Acme Corp"
              />
              <div className="col-span-2">
                <FieldInput
                  label="Photo URL"
                  type="url"
                  value={form.photo_url}
                  onChange={(e) => onChange('photo_url', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="col-span-2">
                <FieldTextarea
                  label="Review *"
                  value={form.review}
                  onChange={(e) => onChange('review', e.target.value)}
                  placeholder="Share the testimonial text…"
                  rows={4}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-white/50 font-medium mb-2">Rating</label>
                <StarRatingSelector value={form.rating} onChange={(v) => onChange('rating', v)} />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={onSave}>
              {editing ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── AdminTestimonials ────────────────────────────────────────────────────────── */
export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Testimonial | null>(null);
  const [form, setForm]                 = useState<TestimonialFormData>(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [deleting, setDeleting]         = useState(false);

  async function fetchTestimonials() {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw new Error(err.message);
      setTestimonials(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTestimonials(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      name:        t.name,
      designation: t.designation,
      company:     t.company,
      photo_url:   t.photo_url,
      review:      t.review,
      rating:      t.rating,
    });
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function handleChange(key: keyof TestimonialFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError('');
  }

  async function handleSave() {
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    if (!form.review.trim()) { setFormError('Review text is required.'); return; }

    try {
      setSaving(true);
      setFormError('');

      const payload = {
        name:        form.name.trim(),
        designation: form.designation.trim(),
        company:     form.company.trim(),
        photo_url:   form.photo_url.trim(),
        review:      form.review.trim(),
        rating:      Number(form.rating),
      };

      if (editing) {
        const { error: err } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editing.id);
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await supabase.from('testimonials').insert(payload);
        if (err) throw new Error(err.message);
      }

      closeModal();
      await fetchTestimonials();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeleting(true);
      const { error: err } = await supabase.from('testimonials').delete().eq('id', id);
      if (err) throw new Error(err.message);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setDeleteId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete.');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Testimonials
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Manage client testimonials displayed on the website.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={openAdd}>
          Add Testimonial
        </Button>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Table Header */}
        <div
          className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_2fr_auto] gap-4 px-5 py-3 text-[11px] font-semibold tracking-wider uppercase text-white/30"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span>Person</span>
          <span>Company</span>
          <span>Rating</span>
          <span>Review</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-16 text-center">
            <MessageSquare className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <div className="text-white/30 text-sm">No testimonials yet.</div>
            <button
              onClick={openAdd}
              className="mt-3 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: '#d4af37' }}
            >
              Add your first testimonial
            </button>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <AnimatePresence initial={false}>
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_2fr_auto] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                >
                  {/* Person */}
                  <div className="flex items-center gap-3 min-w-0">
                    {t.photo_url ? (
                      <img
                        src={t.photo_url}
                        alt={t.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}
                      >
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{t.name}</div>
                      <div className="text-xs text-white/40 truncate">{t.designation || '—'}</div>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="text-sm text-white/60 truncate">{t.company || '—'}</div>

                  {/* Rating */}
                  <div>
                    <StarDisplay rating={t.rating} />
                    <div className="text-xs text-white/35 mt-0.5">{formatDate(t.created_at)}</div>
                  </div>

                  {/* Review excerpt */}
                  <div
                    className="text-xs text-white/50 line-clamp-2 leading-relaxed"
                    title={t.review}
                  >
                    {t.review}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={Edit2}
                      variant="gold"
                      size="sm"
                      label="Edit"
                      onClick={() => openEdit(t)}
                    />
                    {deleteId === t.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          className="text-[11px] text-white/40 hover:text-white/70 px-2 py-1 rounded-lg transition-colors"
                          onClick={() => setDeleteId(null)}
                        >
                          Cancel
                        </button>
                        <Button
                          variant="danger"
                          size="xs"
                          loading={deleting}
                          onClick={() => handleDelete(t.id)}
                        >
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        label="Delete"
                        onClick={() => setDeleteId(t.id)}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <TestimonialModal
            editing={editing}
            form={form}
            onChange={handleChange}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
            error={formError}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
