'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Star, Loader2, Pencil, X, Check } from 'lucide-react';
import { supabase, type Testimonial } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import FileUploadButton from '@/components/admin/shared/FileUploadButton';
import StarPicker from '@/components/admin/shared/StarPicker';

const EMPTY_FORM = { name: '', designation: '', company: '', photo_url: '', review: '', rating: 5 };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setTestimonials(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const flash = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') setSuccess(msg); else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3500);
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) return flash('Name and review are required.', 'error');
    setSaving(true);
    const payload = { name: form.name.trim(), designation: form.designation.trim(), company: form.company.trim(), photo_url: form.photo_url, review: form.review.trim(), rating: form.rating };
    if (editId) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editId);
      if (error) flash(error.message, 'error');
      else { flash('Testimonial updated!', 'success'); resetForm(); fetchTestimonials(); }
    } else {
      const { error } = await supabase.from('testimonials').insert(payload);
      if (error) flash(error.message, 'error');
      else { flash('Testimonial added!', 'success'); resetForm(); fetchTestimonials(); }
    }
    setSaving(false);
  };

  const handleEdit = (t: Testimonial) => {
    setForm({ name: t.name, designation: t.designation, company: t.company, photo_url: t.photo_url, review: t.review, rating: t.rating });
    setEditId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (t: Testimonial) => {
    setDeletingId(t.id);
    await supabase.from('testimonials').delete().eq('id', t.id);
    if (t.photo_url) {
      const path = t.photo_url.split('/storage/v1/object/public/testimonial-photos/')[1];
      if (path) await supabase.storage.from('testimonial-photos').remove([path]);
    }
    flash('Testimonial deleted.', 'success');
    fetchTestimonials();
    setDeletingId(null);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={MessageSquare}
        iconColor="#4ade80"
        iconBg="rgba(74,222,128,0.1)"
        title="Testimonials"
        description="Add and manage client reviews displayed on the website."
        breadcrumbs={[{ label: 'Testimonials' }]}
        actions={
          <button
            onClick={() => { resetForm(); setShowForm((v) => !v); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-navy-900"
            style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Add Testimonial'}
          </button>
        }
      />

      {/* Flash */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={success
              ? { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#86efac' }
              : { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }
            }
          >
            {success || error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="text-white font-semibold mb-5">{editId ? 'Edit Testimonial' : 'New Testimonial'}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name *', key: 'name' as const, placeholder: 'e.g. Rajesh Kumar' },
                { label: 'Designation', key: 'designation' as const, placeholder: 'e.g. Sales Manager' },
                { label: 'Company', key: 'company' as const, placeholder: 'e.g. XYZ Corp' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-white/45 text-xs uppercase tracking-wider font-medium">{label}</label>
                  <input
                    {...field(key)}
                    placeholder={placeholder}
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold-500/40 transition-all"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-white/45 text-xs uppercase tracking-wider font-medium">Photo</label>
                <div className="flex items-center gap-3">
                  <FileUploadButton bucket="testimonial-photos" onUploaded={(url) => setForm((f) => ({ ...f, photo_url: url }))} label="Upload Photo" />
                  {form.photo_url && (
                    <img src={form.photo_url} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-white/15" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-white/45 text-xs uppercase tracking-wider font-medium">Review *</label>
              <textarea
                value={form.review}
                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                rows={4}
                placeholder="What did the client say about the training?"
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold-500/40 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-white/45 text-xs uppercase tracking-wider font-medium">Rating</label>
              <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-900 disabled:opacity-60 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Testimonial'}
              </button>
              <button onClick={resetForm} className="px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/70 border border-white/10 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <MessageSquare className="w-10 h-10 text-white/15 mb-3" />
          <p className="text-white/35 text-sm">No testimonials yet.</p>
          <p className="text-white/20 text-xs mt-1">Click "Add Testimonial" to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex flex-col gap-4 p-5 rounded-2xl group"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={`w-3.5 h-3.5 ${n <= t.rating ? 'fill-gold-500 text-gold-500' : 'text-white/15'}`} />
                  ))}
                </div>

                {/* Review */}
                <p className="text-white/60 text-sm leading-relaxed line-clamp-4 flex-1">"{t.review}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                      <span className="text-gold-400 text-sm font-bold">{t.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-semibold truncate">{t.name}</p>
                    <p className="text-white/35 text-xs truncate">{[t.designation, t.company].filter(Boolean).join(' · ')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/8 hover:bg-white/12 text-white/50 hover:text-white/80 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t)} disabled={deletingId === t.id} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                    {deletingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
