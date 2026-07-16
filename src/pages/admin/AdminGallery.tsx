import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Trash2, Plus, GripVertical, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ds/Button';
import { IconButton } from '../../components/ds/Button';

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface GalleryImage {
  id:            string;
  url:           string;
  alt_text:      string;
  display_order: number;
  created_at:    string;
}

interface AddForm {
  url:           string;
  alt_text:      string;
  display_order: number;
}

const EMPTY_FORM: AddForm = { url: '', alt_text: '', display_order: 0 };

/* ── Skeleton ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)', ...style }}
    />
  );
}

/* ── Input ───────────────────────────────────────────────────────────────────── */
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-xs text-white/50 font-medium mb-1.5">{label}</label>
      <input
        ref={ref}
        {...props}
        className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; }}
        onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      />
    </div>
  );
}

/* ── Delete Confirm Modal ─────────────────────────────────────────────────────── */
function DeleteModal({
  image,
  onConfirm,
  onCancel,
  loading,
}: {
  image: GalleryImage;
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
        style={{ background: 'rgba(2,8,16,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#0d1630', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Delete Image?</h3>
        <p className="text-sm text-white/50 mb-6">
          "{image.alt_text || 'This image'}" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" fullWidth loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Gallery Image Card ──────────────────────────────────────────────────────── */
function GalleryCard({
  image,
  onDelete,
}: {
  image: GalleryImage;
  onDelete: (image: GalleryImage) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,22,48,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-white/[0.03]">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Image className="w-8 h-8 text-white/20" />
            <span className="text-xs text-white/30">Image unavailable</span>
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.alt_text}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Delete overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <IconButton
            icon={Trash2}
            variant="danger"
            size="md"
            label="Delete image"
            onClick={() => onDelete(image)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 group-hover:scale-100"
          />
        </div>
      </div>

      {/* Meta */}
      <div className="px-3.5 py-3 flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white/80 truncate font-medium">
            {image.alt_text || <span className="text-white/30 italic">No alt text</span>}
          </div>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0 font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
        >
          #{image.display_order}
        </div>
      </div>
    </motion.div>
  );
}

/* ── AdminGallery ─────────────────────────────────────────────────────────────── */
export default function AdminGallery() {
  const [images, setImages]             = useState<GalleryImage[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [form, setForm]                 = useState<AddForm>(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [previewError, setPreviewError] = useState(false);

  async function fetchImages() {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (err) throw new Error(err.message);
      setImages(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchImages(); }, []);

  function handleFormChange(key: keyof AddForm, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError('');
    if (key === 'url') setPreviewError(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url.trim()) { setFormError('Image URL is required.'); return; }
    try {
      setSaving(true);
      setFormError('');
      const { error: err } = await supabase.from('gallery_images').insert({
        url:           form.url.trim(),
        alt_text:      form.alt_text.trim(),
        display_order: Number(form.display_order) || 0,
      });
      if (err) throw new Error(err.message);
      setForm(EMPTY_FORM);
      setPreviewError(false);
      await fetchImages();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to add image.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const { error: err } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', deleteTarget.id);
      if (err) throw new Error(err.message);
      setImages((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete image.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Gallery Management
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Add and manage images shown in the public gallery.
        </p>
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

      {/* Add Image Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <h2
          className="text-lg font-semibold text-white mb-5 flex items-center gap-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          <Plus className="w-5 h-5" style={{ color: '#d4af37' }} />
          Add New Image
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Image URL *"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                required
              />
            </div>
            <Input
              label="Alt Text"
              type="text"
              placeholder="Descriptive text for accessibility"
              value={form.alt_text}
              onChange={(e) => handleFormChange('alt_text', e.target.value)}
            />
            <Input
              label="Display Order"
              type="number"
              min={0}
              placeholder="0"
              value={form.display_order}
              onChange={(e) => handleFormChange('display_order', Number(e.target.value))}
            />
          </div>

          {/* URL Preview */}
          {form.url && !previewError && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-[10px] text-white/30 px-3 py-1.5 font-medium tracking-wider uppercase"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                Preview
              </div>
              <img
                src={form.url}
                alt="Preview"
                onError={() => setPreviewError(true)}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          {formError && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              {formError}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Plus}
              loading={saving}
            >
              Add Image
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Images Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Gallery Images
          </h2>
          <span className="text-sm text-white/35">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <Skeleton className="aspect-video" style={{ borderRadius: 0 }} />
                <div className="p-3">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: 'rgba(13,22,48,0.5)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <Image className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <div className="text-white/30 text-sm">No images yet. Add your first one above.</div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {images.map((img) => (
                <GalleryCard
                  key={img.id}
                  image={img}
                  onDelete={setDeleteTarget}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            image={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
