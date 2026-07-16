'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Star, Pencil, X, Check } from 'lucide-react';
import { supabase, type Testimonial } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import FileUploadButton from '@/components/admin/shared/FileUploadButton';
import StarPicker from '@/components/admin/shared/StarPicker';
import {
  Button, IconButton, Input, Textarea, Card,
  EmptyState, ListSkeleton, SectionHeader, ConfirmDialog, Badge,
} from '@/components/ds';

const EMPTY_FORM = { name: '', designation: '', company: '', photo_url: '', review: '', rating: 5 };

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [flash, setFlash] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setTestimonials(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const notify = (msg: string, ok = true) => {
    setFlash({ msg, ok });
    setTimeout(() => setFlash(null), 3500);
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.review.trim()) return notify('Name and review are required.', false);
    setSaving(true);
    const payload = {
      name: form.name.trim(), designation: form.designation.trim(),
      company: form.company.trim(), photo_url: form.photo_url,
      review: form.review.trim(), rating: form.rating,
    };
    const { error } = editId
      ? await supabase.from('testimonials').update(payload).eq('id', editId)
      : await supabase.from('testimonials').insert(payload);
    if (error) notify(error.message, false);
    else { notify(editId ? 'Testimonial updated!' : 'Testimonial added!'); resetForm(); fetchTestimonials(); }
    setSaving(false);
  };

  const handleEdit = (t: Testimonial) => {
    setForm({ name: t.name, designation: t.designation, company: t.company, photo_url: t.photo_url, review: t.review, rating: t.rating });
    setEditId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from('testimonials').delete().eq('id', deleteTarget.id);
    if (deleteTarget.photo_url) {
      const path = deleteTarget.photo_url.split('/storage/v1/object/public/testimonial-photos/')[1];
      if (path) await supabase.storage.from('testimonial-photos').remove([path]);
    }
    setDeleteTarget(null);
    setDeleting(false);
    notify('Testimonial deleted.');
    fetchTestimonials();
  };

  const fieldProps = (key: keyof typeof form) => ({
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
          <Button
            variant={showForm ? 'ghost' : 'primary'}
            icon={showForm ? X : Plus}
            onClick={() => { resetForm(); setShowForm((v) => !v); }}
          >
            {showForm ? 'Cancel' : 'Add Testimonial'}
          </Button>
        }
      />

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={flash.ok
              ? { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#86efac' }
              : { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }
            }
          >
            {flash.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <Card>
              <h3 className="text-white font-semibold mb-5">{editId ? 'Edit Testimonial' : 'New Testimonial'}</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input label="Full Name" required placeholder="e.g. Rajesh Kumar" {...fieldProps('name')} />
                <Input label="Designation" placeholder="e.g. Sales Manager" {...fieldProps('designation')} />
                <Input label="Company" placeholder="e.g. XYZ Corp" {...fieldProps('company')} />

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Photo</label>
                  <div className="flex items-center gap-3">
                    <FileUploadButton bucket="testimonial-photos" onUploaded={(url) => setForm((f) => ({ ...f, photo_url: url }))} label="Upload Photo" />
                    {form.photo_url && (
                      <img src={form.photo_url} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-white/15" />
                    )}
                  </div>
                </div>
              </div>

              <Textarea label="Review" required rows={4} placeholder="What did the client say about the training?" {...fieldProps('review')} />

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">Rating</label>
                <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="primary" icon={Check} onClick={handleSave} loading={saving}>
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Testimonial'}
                </Button>
                <Button variant="ghost" onClick={resetForm}>Cancel</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      <div>
        <SectionHeader
          title="All Testimonials"
          description={loading ? 'Loading...' : `${testimonials.length} review${testimonials.length !== 1 ? 's' : ''}`}
        />

        {loading ? (
          <ListSkeleton rows={4} />
        ) : testimonials.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            iconColor="#4ade80"
            title="No testimonials yet"
            description='Click "Add Testimonial" above to get started.'
          />
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
                  <p className="text-white/55 text-sm leading-relaxed line-clamp-4 flex-1">"{t.review}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                        <span className="text-gold-400 text-sm font-bold">{t.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-white/35 text-xs truncate">{[t.designation, t.company].filter(Boolean).join(' · ')}</p>
                    </div>
                    <Badge variant="active" size="xs">Live</Badge>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton icon={Pencil} variant="default" size="sm" onClick={() => handleEdit(t)} label="Edit" />
                    <IconButton icon={Trash2} variant="danger" size="sm" onClick={() => setDeleteTarget(t)} label="Delete" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete testimonial?"
        description={`This will permanently remove ${deleteTarget?.name ?? 'this'}'s review. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
