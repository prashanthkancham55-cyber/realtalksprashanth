'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2, AlertCircle, Upload, X } from 'lucide-react';
import {
  Modal, Button, Input, Textarea, Select,
  FieldWrapper,
} from '@/components/ds';
import { supabase } from '@/lib/supabase';
import { createTraining, updateTraining, validateTrainingForm } from '@/lib/trainingService';
import {
  EMPTY_FORM, CATEGORY_FORM_OPTIONS, MODE_FORM_OPTIONS, STATUS_FORM_OPTIONS, slugify,
  type Training, type TrainingFormData,
} from './data';

interface Props {
  open:      boolean;
  onClose:   () => void;
  onSaved:   (msg: string) => void;
  onError:   (msg: string) => void;
  editData?: Training | null;
}

function BannerUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('Please select an image file.'); return; }
    setErr('');
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `banners/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('training-banners').upload(path, file, { upsert: true });
    if (upErr) { setErr(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from('training-banners').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <FieldWrapper label="Banner Image">
      <div className="flex flex-col gap-2">
        <label
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer text-sm transition-all duration-200 w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload Banner'}
          <input type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={uploading} />
        </label>
        {err && <p className="text-red-400 text-xs">{err}</p>}
        {value && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={value} alt="Banner preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        {!value && (
          <p className="text-white/25 text-xs">Recommended: 16:9, at least 800×450 px</p>
        )}
      </div>
    </FieldWrapper>
  );
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <FieldWrapper label="Tags" hint="Press Enter to add each tag">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
        placeholder="e.g. Sales, B2B, Closing"
        className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl text-white placeholder:text-white/22 text-sm px-4 py-2.5 focus:outline-none focus:border-gold-500/45 transition-all duration-200"
      />
    </FieldWrapper>
  );
}

export default function TrainingFormModal({ open, onClose, onSaved, onError, editData }: Props) {
  const isEdit = !!editData;
  const [form, setForm] = useState<TrainingFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [validationErr, setValidationErr] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editData) {
        const { id: _id, created_at: _c, updated_at: _u, ...rest } = editData;
        setForm({ ...rest, tags: Array.isArray(rest.tags) ? rest.tags : [] });
      } else {
        setForm(EMPTY_FORM);
      }
      setValidationErr('');
    }
  }, [open, editData]);

  const set = <K extends keyof TrainingFormData>(key: K, val: TrainingFormData[K]) =>
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === 'title' && !isEdit) next.slug = slugify(val as string);
      if (key === 'start_date' && !next.end_date) next.end_date = val as string;
      if (key === 'total_seats') next.available_seats = Math.min(next.available_seats, val as number);
      return next;
    });

  const handleSave = async () => {
    const err = validateTrainingForm(form);
    if (err) { setValidationErr(err); return; }
    setValidationErr('');
    setSaving(true);

    try {
      if (isEdit && editData) {
        await updateTraining(editData.id, form);
        onSaved('Training updated successfully!');
      } else {
        await createTraining(form);
        onSaved('Training created successfully!');
      }
      onClose();
    } catch (e: unknown) {
      onError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const inputProps = (key: keyof TrainingFormData, label: string, required = false) => ({
    label,
    required,
    value: String(form[key] ?? ''),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key, (typeof form[key] === 'number' ? Number(e.target.value) : e.target.value) as TrainingFormData[typeof key]),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Edit Training' : 'Add New Training'}
      description={isEdit ? `Editing "${editData?.title}"` : 'Fill in the details to create a new training program.'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="primary" icon={BookOpen} onClick={handleSave} loading={saving}>
            {saving ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Training')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">

        {/* Validation error */}
        <AnimatePresence>
          {validationErr && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {validationErr}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section: Core Details */}
        <div>
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">Core Details</p>
          <div className="flex flex-col gap-4">
            <Input {...inputProps('title', 'Training Title', true)} placeholder="e.g. Sales Excellence Bootcamp" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input {...inputProps('trainer_name', 'Trainer Name', true)} placeholder="e.g. Prashanth Kumar" />
              <Select
                label="Category"
                required
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                options={CATEGORY_FORM_OPTIONS}
              />
            </div>
            <Textarea
              label="Description"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what participants will learn and achieve…"
            />
          </div>
        </div>

        {/* Section: Schedule */}
        <div>
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">Schedule & Delivery</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              required
              type="date"
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
            />
            <Input
              label="End Date"
              required
              type="date"
              value={form.end_date}
              min={form.start_date}
              onChange={(e) => set('end_date', e.target.value)}
            />
            <Select
              label="Delivery Mode"
              required
              value={form.mode}
              onChange={(e) => set('mode', e.target.value as TrainingFormData['mode'])}
              options={MODE_FORM_OPTIONS}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder={form.mode === 'Online' ? 'Virtual' : 'e.g. Bangalore, Mumbai'}
            />
            <Input
              label="Duration"
              value={form.duration}
              onChange={(e) => set('duration', e.target.value)}
              placeholder="e.g. 2 days, 8 hours"
            />
          </div>
        </div>

        {/* Section: Pricing & Seats */}
        <div>
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">Pricing & Seats</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              min="0"
              value={String(form.price)}
              onChange={(e) => set('price', Number(e.target.value))}
              placeholder="0"
            />
            <Input
              label="Total Seats"
              type="number"
              min="0"
              value={String(form.total_seats)}
              onChange={(e) => {
                const n = Number(e.target.value);
                set('total_seats', n);
              }}
              placeholder="0"
            />
            <Input
              label="Available Seats"
              type="number"
              min="0"
              max={String(form.total_seats)}
              value={String(form.available_seats)}
              onChange={(e) => set('available_seats', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        {/* Section: Status & Visibility */}
        <div>
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-3">Status & Visibility</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => set('status', e.target.value as TrainingFormData['status'])}
              options={STATUS_FORM_OPTIONS}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">
                Featured on website
              </label>
              <button
                type="button"
                onClick={() => set('featured', !form.featured)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-fit"
                style={form.featured
                  ? { background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.4)' }
                }
              >
                <span
                  className="w-8 h-4 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: form.featured ? '#d4af37' : 'rgba(255,255,255,0.12)' }}
                >
                  <span
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200"
                    style={{ left: form.featured ? '17px' : '2px' }}
                  />
                </span>
                {form.featured ? 'Featured' : 'Not featured'}
              </button>
            </div>
            <Input
              label="Slug (auto-generated)"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="auto-generated from title"
              hint="URL-friendly identifier. Leave blank to auto-generate."
            />
          </div>
        </div>

        {/* Banner */}
        <BannerUpload value={form.banner_url} onChange={(url) => set('banner_url', url)} />

        {/* Tags */}
        <TagsInput value={form.tags} onChange={(tags) => set('tags', tags)} />

      </div>
    </Modal>
  );
}
