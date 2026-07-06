'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Image as ImageIcon, MessageSquare, Plus, Pencil, Trash2,
  X, Check, Loader2, Star, Upload, Eye, EyeOff, AlertTriangle,
  LayoutDashboard, Lock, Mail, CheckCheck
} from 'lucide-react';
import { supabase, type GalleryImage, type Testimonial, type ContactEnquiry } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

type Tab = 'gallery' | 'testimonials' | 'enquiries';

/* ─── AUTH SECTION ─────────────────────────────────────────── */
function AuthForm({ onAuth }: { onAuth: (session: Session) => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) onAuth(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) onAuth(data.session);
        else setError('Account created! You can now sign in.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #050b18 0%, #0a0f1e 60%, #0d1630 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <Lock className="w-6 h-6 text-gold-500" />
            </div>
          </div>
          <h1 className="heading-display text-3xl text-white mb-1">Admin Portal</h1>
          <p className="text-white/50 text-sm">RealTalks_Prashanth</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-300 capitalize ${
                  mode === m
                    ? 'text-navy-900 rounded-xl'
                    : 'text-white/50 hover:text-white/70'
                }`}
                style={mode === m ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' } : {}}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-navy-900 transition-all duration-300 hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── STAR PICKER ───────────────────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              n <= (hover || value) ? 'fill-gold-500 text-gold-500' : 'text-white/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── FILE UPLOAD BUTTON ────────────────────────────────────── */
function FileUploadButton({
  bucket,
  onUploaded,
  accept = 'image/*',
  label = 'Upload Image',
}: {
  bucket: string;
  onUploaded: (url: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch (err: unknown) {
      setErr(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm hover:border-gold-500/40 hover:text-gold-400 transition-all disabled:opacity-50"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading...' : label}
      </button>
      {err && <p className="text-red-400 text-xs">{err}</p>}
    </div>
  );
}

/* ─── GALLERY MANAGEMENT ────────────────────────────────────── */
function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState({ image_url: '', alt_text: 'Training Image', display_order: 0 });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ image_url: '', alt_text: 'Training Image', display_order: images.length });
    setError('');
    setShowForm(true);
  };

  const openEdit = (img: GalleryImage) => {
    setEditItem(img);
    setForm({ image_url: img.image_url, alt_text: img.alt_text, display_order: img.display_order });
    setError('');
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url.trim()) { setError('Image URL is required'); return; }
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        const { error } = await supabase
          .from('gallery_images')
          .update({ image_url: form.image_url, alt_text: form.alt_text, display_order: form.display_order })
          .eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gallery_images')
          .insert({ image_url: form.image_url, alt_text: form.alt_text, display_order: form.display_order });
        if (error) throw error;
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this image from the gallery?')) return;
    setDeleting(id);
    await supabase.from('gallery_images').delete().eq('id', id);
    setDeleting(null);
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-xl">Gallery Images</h2>
          <p className="text-white/50 text-sm mt-0.5">{images.length} image{images.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-navy-900 font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-white/10 text-center"
        >
          <ImageIcon className="w-10 h-10 text-white/20" />
          <p className="text-white/40">No gallery images yet. Add your first image!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
              </div>
              <div
                className="p-3"
                style={{ background: 'rgba(10,15,30,0.95)' }}
              >
                <p className="text-white/70 text-xs truncate">{img.alt_text}</p>
                <p className="text-white/40 text-xs">Order: {img.display_order}</p>
              </div>
              {/* Action overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(img)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-navy-900/90 border border-white/15 hover:border-gold-500/50 hover:text-gold-400 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(img.id)}
                  disabled={deleting === img.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-navy-900/90 border border-white/15 hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  {deleting === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: '#0d1630', border: '1px solid rgba(212,175,55,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{editItem ? 'Edit Image' : 'Add Gallery Image'}</h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={save} className="flex flex-col gap-4">
                {/* Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-sm">Upload Image</label>
                  <FileUploadButton
                    bucket="gallery"
                    onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
                    label="Upload from device"
                  />
                  <div className="text-white/30 text-xs text-center">— or paste URL below —</div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm">Image URL *</label>
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                  {form.image_url && (
                    <div className="relative h-32 rounded-xl overflow-hidden mt-1">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm">Alt Text</label>
                  <input
                    value={form.alt_text}
                    onChange={(e) => setForm((f) => ({ ...f, alt_text: e.target.value }))}
                    placeholder="Describe the image"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm">Display Order (0 = first)</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/15 text-white/70 text-sm hover:border-white/30 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-navy-900 font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Image'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TESTIMONIALS MANAGEMENT ───────────────────────────────── */
function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    name: '', designation: '', company: '', photo_url: '', review: '', rating: 5,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const blankForm = () => ({ name: '', designation: '', company: '', photo_url: '', review: '', rating: 5 });

  const openAdd = () => {
    setEditItem(null);
    setForm(blankForm());
    setError('');
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditItem(t);
    setForm({ name: t.name, designation: t.designation, company: t.company, photo_url: t.photo_url, review: t.review, rating: t.rating });
    setError('');
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) { setError('Name and review are required'); return; }
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        const { error } = await supabase.from('testimonials').update(form).eq('id', editItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert(form);
        if (error) throw error;
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setDeleting(id);
    await supabase.from('testimonials').delete().eq('id', id);
    setDeleting(null);
    await load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-xl">Testimonials</h2>
          <p className="text-white/50 text-sm mt-0.5">{items.length} testimonial{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-navy-900 font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-white/10 text-center">
          <MessageSquare className="w-10 h-10 text-white/20" />
          <p className="text-white/40">No testimonials yet. Add your first testimonial!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Photo */}
              {t.photo_url ? (
                <img src={t.photo_url} alt={t.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-gold-500/20" />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.1)' }}
                >
                  <span className="text-gold-400 font-bold text-lg">{t.name.charAt(0)}</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold">{t.name}</span>
                  {t.designation && <span className="text-gold-500 text-sm">{t.designation}</span>}
                  {t.company && <span className="text-white/40 text-sm">· {t.company}</span>}
                </div>
                <div className="flex gap-0.5 my-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-gold-500 text-gold-500' : 'text-white/15'}`} />
                  ))}
                </div>
                <p className="text-white/55 text-sm line-clamp-2">{t.review}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(t)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 border border-white/10 hover:border-gold-500/50 hover:text-gold-400 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(t.id)}
                  disabled={deleting === t.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  {deleting === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 my-auto"
              style={{ background: '#0d1630', border: '1px solid rgba(212,175,55,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{editItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={save} className="flex flex-col gap-4">
                {/* Photo upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-sm">Client Photo</label>
                  <div className="flex items-center gap-4">
                    {form.photo_url && (
                      <img src={form.photo_url} alt="Preview" className="w-14 h-14 rounded-full object-cover ring-2 ring-gold-500/30" />
                    )}
                    <div className="flex flex-col gap-2">
                      <FileUploadButton
                        bucket="testimonial-photos"
                        onUploaded={(url) => setForm((f) => ({ ...f, photo_url: url }))}
                        accept="image/*"
                        label="Upload Photo"
                      />
                      <div className="text-white/30 text-xs">— or paste URL —</div>
                      <input
                        value={form.photo_url}
                        onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
                        placeholder="https://..."
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-gold-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-white/60 text-sm">Full Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      placeholder="Client name"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-sm">Designation</label>
                    <input
                      value={form.designation}
                      onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                      placeholder="Job Title"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-sm">Company</label>
                    <input
                      value={form.company}
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="Company name"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm">Review *</label>
                  <textarea
                    value={form.review}
                    onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                    required
                    rows={3}
                    placeholder="Client testimonial..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-sm">Rating</label>
                  <StarPicker value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/15 text-white/70 text-sm hover:border-white/30 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-navy-900 font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── ENQUIRIES MANAGEMENT ──────────────────────────────────── */
function EnquiriesManager() {
  const [items, setItems] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('contact_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (id: string, current: boolean) => {
    setMarking(id);
    await supabase.from('contact_enquiries').update({ is_read: !current }).eq('id', id);
    setMarking(null);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    setDeleting(id);
    await supabase.from('contact_enquiries').delete().eq('id', id);
    setDeleting(null);
    await load();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-white font-semibold text-xl">Contact Enquiries</h2>
        <p className="text-white/50 text-sm mt-0.5">{items.filter(i => !i.is_read).length} unread · {items.length} total</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-white/10 text-center">
          <Mail className="w-10 h-10 text-white/20" />
          <p className="text-white/40">No enquiries yet. Form submissions will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((e) => (
            <div
              key={e.id}
              className={`p-5 rounded-2xl ${e.is_read ? '' : 'ring-1 ring-gold-500/20'}`}
              style={{
                background: e.is_read ? 'rgba(255,255,255,0.03)' : 'rgba(212,175,55,0.04)',
                border: e.is_read ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(212,175,55,0.15)'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold">{e.name}</span>
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="text-gold-400 text-sm hover:underline">{e.phone}</a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className="text-brand-purple-light text-sm hover:underline">{e.email}</a>
                    )}
                  </div>
                  {e.company && (
                    <p className="text-white/40 text-xs mb-2">{e.company}</p>
                  )}
                  <p className="text-white/70 text-sm whitespace-pre-wrap">{e.message}</p>
                  <p className="text-white/30 text-xs mt-3">{formatDate(e.created_at)}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(e.id, e.is_read)}
                    disabled={marking === e.id}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                      e.is_read
                        ? 'border-white/10 text-white/50 hover:border-gold-500/50 hover:text-gold-400'
                        : 'border-gold-500/30 text-gold-400 hover:bg-gold-500/10'
                    }`}
                    title={e.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {marking === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => remove(e.id)}
                    disabled={deleting === e.id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    {deleting === e.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ADMIN PAGE ───────────────────────────────────────── */
export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('gallery');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#050b18' }}
      >
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthForm onAuth={setSession} />;
  }

  const tabs: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'enquiries', label: 'Enquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)' }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.12)' }}
            >
              <LayoutDashboard className="w-4 h-4 text-gold-500" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm">Admin Dashboard</span>
              <span className="text-white/40 text-xs block">RealTalks_Prashanth</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-white/50 hover:text-white/80 text-xs transition-colors hidden sm:block"
            >
              View Site →
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white border border-white/10 hover:border-white/25 text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab Navigation */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-8 w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === id ? 'text-navy-900' : 'text-white/50 hover:text-white/80'
              }`}
              style={activeTab === id ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'testimonials' && <TestimonialsManager />}
            {activeTab === 'enquiries' && <EnquiriesManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
