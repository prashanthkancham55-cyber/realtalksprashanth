import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Star,
  Zap,
  Bell,
  ChevronDown,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { Training, TrainingFormData, AgendaItem } from '../../../types/training';
import {
  EMPTY_TRAINING,
  slugify,
  STATUS_OPTIONS,
  MODE_OPTIONS,
  CATEGORY_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../../../types/training';
import { createTraining, updateTraining, validateTrainingForm } from '../../../lib/trainingService';
import { Button } from '../../ds/Button';

/* ── Shared input primitives ─────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
      {children}
      {required && <span className="ml-0.5" style={{ color: '#f0c040' }}>*</span>}
    </label>
  );
}

const inputBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border:     '1px solid rgba(255,255,255,0.08)',
};
const inputFocusBorder = 'rgba(212,175,55,0.4)';

function FInput({
  label,
  required,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div className={className}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        {...props}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
        style={inputBase}
        onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      />
    </div>
  );
}

function FTextarea({
  label,
  required,
  rows = 3,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean }) {
  return (
    <div className={className}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        {...props}
        rows={rows}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
        style={inputBase}
        onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      />
    </div>
  );
}

function FSelect({
  label,
  required,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  options: readonly string[];
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          {...props}
          required={required}
          className="w-full px-4 py-2.5 pr-9 rounded-xl text-sm text-white outline-none appearance-none transition-all"
          style={{ ...inputBase, cursor: 'pointer' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          {options.map((o) => (
            <option key={o} value={o} style={{ background: '#0d1630' }}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        />
      </div>
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2 pb-3 mb-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-base font-semibold text-white"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        {children}
      </h3>
    </div>
  );
}

/* ── Array field (add/remove text items) ─────────────────────────────────────── */
function ArrayField({
  label,
  items,
  placeholder,
  onChange,
}: {
  label: string;
  items: string[];
  placeholder?: string;
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  function add() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex-1 px-3 py-2 rounded-xl text-sm text-white/80"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {item}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
            placeholder={placeholder ?? `Add ${label.toLowerCase()}…`}
            className="flex-1 px-4 py-2 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
            style={inputBase}
            onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          />
          <button
            type="button"
            onClick={add}
            className="px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Agenda section ──────────────────────────────────────────────────────────── */
function AgendaField({
  items,
  onChange,
}: {
  items: AgendaItem[];
  onChange: (items: AgendaItem[]) => void;
}) {
  const EMPTY_ITEM: AgendaItem = { time: '', topic: '', description: '' };

  function update(i: number, key: keyof AgendaItem, value: string) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { ...EMPTY_ITEM }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FieldLabel>Agenda Items</FieldLabel>
        <button
          type="button"
          onClick={add}
          className="text-xs font-medium flex items-center gap-1 transition-all px-2.5 py-1.5 rounded-lg"
          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}
        >
          <Plus className="w-3 h-3" />
          Add Item
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#d4af37' }}>
                Item {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Time</FieldLabel>
                <input
                  value={item.time}
                  onChange={(e) => update(i, 'time', e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={inputBase}
                  onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>
              <div>
                <FieldLabel>Topic</FieldLabel>
                <input
                  value={item.topic}
                  onChange={(e) => update(i, 'topic', e.target.value)}
                  placeholder="Session topic"
                  className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={inputBase}
                  onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <input
                value={item.description}
                onChange={(e) => update(i, 'description', e.target.value)}
                placeholder="Brief description of this session"
                className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={inputBase}
                onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div
            className="rounded-xl py-6 text-center text-sm"
            style={{ border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}
          >
            No agenda items yet. Click "Add Item" to begin.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Checkbox row ────────────────────────────────────────────────────────────── */
function CheckboxRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  warning,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  warning?: string;
}) {
  return (
    <div>
      <label
        className="flex items-start gap-3 rounded-xl p-3.5 cursor-pointer transition-all"
        style={{
          background: checked ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${checked ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white">{label}</div>
          {description && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {description}
            </div>
          )}
          {warning && checked && (
            <div
              className="text-xs mt-1.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {warning}
            </div>
          )}
        </div>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 mt-1 accent-yellow-400 flex-shrink-0"
        />
      </label>
    </div>
  );
}

/* ── Props ───────────────────────────────────────────────────────────────────── */
interface TrainingFormModalProps {
  mode:      'add' | 'edit';
  training?: Training;
  onClose:   () => void;
  onSaved:   (t: Training) => void;
}

/* ── TrainingFormModal ───────────────────────────────────────────────────────── */
export default function TrainingFormModal({ mode, training, onClose, onSaved }: TrainingFormModalProps) {
  const [form, setForm]       = useState<TrainingFormData>(
    mode === 'edit' && training
      ? {
          title:               training.title,
          slug:                training.slug,
          category:            training.category,
          trainer_name:        training.trainer_name,
          description:         training.description,
          short_description:   training.short_description,
          full_description:    training.full_description,
          mode:                training.mode,
          location:            training.location,
          start_date:          training.start_date,
          end_date:            training.end_date,
          session_time:        training.session_time,
          duration:            training.duration,
          language:            training.language,
          price:               training.price,
          total_seats:         training.total_seats,
          available_seats:     training.available_seats,
          banner_url:          training.banner_url,
          status:              training.status,
          featured:            training.featured,
          show_in_hero:        training.show_in_hero,
          show_as_popup:       training.show_as_popup,
          display_order:       training.display_order,
          tags:                training.tags,
          benefits:            training.benefits,
          who_should_attend:   training.who_should_attend,
          what_you_will_learn: training.what_you_will_learn,
          agenda:              training.agenda,
        }
      : { ...EMPTY_TRAINING }
  );
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [slugEdited, setSlugEdited] = useState(mode === 'edit');

  /* Auto-generate slug from title */
  useEffect(() => {
    if (!slugEdited && mode === 'add') {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, slugEdited, mode]);

  function set<K extends keyof TrainingFormData>(key: K, value: TrainingFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateTrainingForm(form);
    if (err) { setError(err); return; }
    try {
      setSaving(true);
      setError('');
      const saved =
        mode === 'edit' && training
          ? await updateTraining(training.id, form)
          : await createTraining(form);
      onSaved(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save training.');
    } finally {
      setSaving(false);
    }
  }

  /* Tag helpers */
  const tagsString = form.tags.join(', ');

  function handleTagsChange(raw: string) {
    const tags = raw.split(',').map((t) => t.trim()).filter(Boolean);
    set('tags', tags);
  }

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
        className="relative w-full max-w-3xl flex flex-col"
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
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div>
              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {mode === 'edit' ? 'Edit Training' : 'Add New Training'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {mode === 'edit' ? 'Update training details below.' : 'Fill in the details to create a new training.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8">

              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* ── Basic Info ── */}
              <section>
                <SectionHeading>Basic Info</SectionHeading>
                <div className="space-y-4">
                  <FInput
                    label="Training Title"
                    required
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="e.g. Advanced Sales Mastery"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Slug</FieldLabel>
                      <input
                        value={form.slug}
                        onChange={(e) => { setSlugEdited(true); set('slug', e.target.value); }}
                        placeholder="auto-generated-slug"
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all font-mono"
                        style={inputBase}
                        onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                        onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                      />
                      <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Auto-generated from title. Editable.
                      </p>
                    </div>
                    <FSelect
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={form.status}
                      onChange={(e) => set('status', e.target.value as TrainingFormData['status'])}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FSelect
                      label="Category"
                      required
                      options={CATEGORY_OPTIONS}
                      value={form.category}
                      onChange={(e) => set('category', e.target.value)}
                    />
                    <FInput
                      label="Trainer Name"
                      required
                      value={form.trainer_name}
                      onChange={(e) => set('trainer_name', e.target.value)}
                      placeholder="e.g. Prashanth Kumar"
                    />
                  </div>
                  <FInput
                    label="Banner URL"
                    type="url"
                    value={form.banner_url}
                    onChange={(e) => set('banner_url', e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {form.banner_url && (
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div
                        className="text-[10px] tracking-wider uppercase px-3 py-1.5 font-medium"
                        style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)' }}
                      >
                        Banner Preview
                      </div>
                      <img
                        src={form.banner_url}
                        alt="Banner preview"
                        className="w-full h-28 object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div>
                    <FieldLabel>Tags</FieldLabel>
                    <input
                      value={tagsString}
                      onChange={(e) => handleTagsChange(e.target.value)}
                      placeholder="sales, leadership, communication (comma-separated)"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                      style={inputBase}
                      onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                    <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Separate multiple tags with commas.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── Description ── */}
              <section>
                <SectionHeading>Description</SectionHeading>
                <div className="space-y-4">
                  <FTextarea
                    label="Short Description"
                    rows={2}
                    value={form.short_description}
                    onChange={(e) => set('short_description', e.target.value)}
                    placeholder="A brief one-liner shown in cards and listings."
                  />
                  <FTextarea
                    label="Description / Summary"
                    rows={3}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Overview shown on the training listing page."
                  />
                  <FTextarea
                    label="Full Description"
                    rows={5}
                    value={form.full_description}
                    onChange={(e) => set('full_description', e.target.value)}
                    placeholder="Detailed description shown on the training detail page."
                  />
                </div>
              </section>

              {/* ── Schedule ── */}
              <section>
                <SectionHeading>Schedule</SectionHeading>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Start Date"
                      required
                      type="date"
                      value={form.start_date}
                      onChange={(e) => set('start_date', e.target.value)}
                    />
                    <FInput
                      label="End Date"
                      required
                      type="date"
                      value={form.end_date}
                      onChange={(e) => set('end_date', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FInput
                      label="Session Time"
                      value={form.session_time}
                      onChange={(e) => set('session_time', e.target.value)}
                      placeholder="10:00 AM – 6:00 PM"
                    />
                    <FInput
                      label="Duration"
                      value={form.duration}
                      onChange={(e) => set('duration', e.target.value)}
                      placeholder="2 Days"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FSelect
                      label="Mode"
                      required
                      options={MODE_OPTIONS}
                      value={form.mode}
                      onChange={(e) => set('mode', e.target.value as TrainingFormData['mode'])}
                    />
                    <FSelect
                      label="Language"
                      options={LANGUAGE_OPTIONS}
                      value={form.language}
                      onChange={(e) => set('language', e.target.value)}
                    />
                  </div>
                  <FInput
                    label="Location"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder="e.g. Hyderabad, Telangana (leave blank for Online)"
                  />
                </div>
              </section>

              {/* ── Pricing & Seats ── */}
              <section>
                <SectionHeading>Pricing &amp; Seats</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel>Price (₹)</FieldLabel>
                    <input
                      type="number"
                      min={0}
                      value={form.price}
                      onChange={(e) => set('price', Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                      style={inputBase}
                      onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                    <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>0 = Free</p>
                  </div>
                  <div>
                    <FieldLabel>Total Seats</FieldLabel>
                    <input
                      type="number"
                      min={0}
                      value={form.total_seats}
                      onChange={(e) => set('total_seats', Number(e.target.value))}
                      placeholder="50"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                      style={inputBase}
                      onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>
                  <div>
                    <FieldLabel>Available Seats</FieldLabel>
                    <input
                      type="number"
                      min={0}
                      value={form.available_seats}
                      onChange={(e) => set('available_seats', Number(e.target.value))}
                      placeholder="50"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                      style={inputBase}
                      onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>
                </div>
              </section>

              {/* ── Display Settings ── */}
              <section>
                <SectionHeading>Display Settings</SectionHeading>
                <div className="space-y-3 mb-4">
                  <CheckboxRow
                    icon={Star}
                    label="Featured Training"
                    description="Highlighted prominently on the trainings listing page."
                    checked={form.featured}
                    onChange={(v) => set('featured', v)}
                  />
                  <CheckboxRow
                    icon={Zap}
                    label="Show in Hero Banner"
                    description="Displayed as the main hero on the trainings landing page."
                    checked={form.show_in_hero}
                    onChange={(v) => set('show_in_hero', v)}
                    warning="Only one training can be in the Hero banner at a time. Enabling this will replace the current hero."
                  />
                  <CheckboxRow
                    icon={Bell}
                    label="Show as Popup"
                    description="Appears as a promotional popup for site visitors."
                    checked={form.show_as_popup}
                    onChange={(v) => set('show_as_popup', v)}
                  />
                </div>
                <div style={{ maxWidth: 200 }}>
                  <FieldLabel>Display Order</FieldLabel>
                  <input
                    type="number"
                    min={0}
                    value={form.display_order}
                    onChange={(e) => set('display_order', Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                    style={inputBase}
                    onFocus={(e) => { e.currentTarget.style.borderColor = inputFocusBorder; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Lower number = appears first.
                  </p>
                </div>
              </section>

              {/* ── Content Arrays ── */}
              <section>
                <SectionHeading>Content</SectionHeading>
                <div className="space-y-6">
                  <ArrayField
                    label="Benefits"
                    items={form.benefits}
                    placeholder="Add a benefit…"
                    onChange={(v) => set('benefits', v)}
                  />
                  <ArrayField
                    label="Who Should Attend"
                    items={form.who_should_attend}
                    placeholder="Add a target audience…"
                    onChange={(v) => set('who_should_attend', v)}
                  />
                  <ArrayField
                    label="What You Will Learn"
                    items={form.what_you_will_learn}
                    placeholder="Add a learning outcome…"
                    onChange={(v) => set('what_you_will_learn', v)}
                  />
                </div>
              </section>

              {/* ── Agenda ── */}
              <section>
                <SectionHeading>Agenda</SectionHeading>
                <AgendaField
                  items={form.agenda}
                  onChange={(v) => set('agenda', v)}
                />
              </section>

            </div>

            {/* ── Footer ── */}
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Button variant="secondary" size="md" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" loading={saving}>
                {saving
                  ? mode === 'edit' ? 'Saving…' : 'Creating…'
                  : mode === 'edit' ? 'Save Changes' : 'Create Training'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
