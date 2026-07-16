'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Trash2, Plus, GripVertical, Loader2 } from 'lucide-react';
import { supabase, type GalleryImage } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import FileUploadButton from '@/components/admin/shared/FileUploadButton';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [altText, setAltText] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const flash = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') setSuccess(msg);
    else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3500);
  };

  const handleAdd = async () => {
    if (!previewUrl) return flash('Please upload an image first.', 'error');
    setSaving(true);
    const { error } = await supabase.from('gallery_images').insert({
      image_url: previewUrl,
      alt_text: altText.trim() || 'Training Image',
      display_order: images.length,
    });
    if (error) flash(error.message, 'error');
    else {
      flash('Image added to gallery!', 'success');
      setPreviewUrl('');
      setAltText('');
      fetchImages();
    }
    setSaving(false);
  };

  const handleDelete = async (img: GalleryImage) => {
    setDeletingId(img.id);
    await supabase.from('gallery_images').delete().eq('id', img.id);
    const path = img.image_url.split('/storage/v1/object/public/gallery/')[1];
    if (path) await supabase.storage.from('gallery').remove([path]);
    flash('Image deleted.', 'success');
    fetchImages();
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={ImageIcon}
        iconColor="#38bdf8"
        iconBg="rgba(56,189,248,0.1)"
        title="Gallery"
        description="Upload and manage photos displayed on the website."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      {/* Notifications */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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

      {/* Upload card */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-4 h-4 text-gold-400" />
          <h3 className="text-white font-semibold">Add New Image</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Upload */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <FileUploadButton
              bucket="gallery"
              onUploaded={(url) => setPreviewUrl(url)}
              label="Upload Photo"
            />
            {previewUrl && (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={previewUrl}
                alt="Preview"
                className="w-36 h-36 object-cover rounded-xl border"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              />
            )}
          </div>

          {/* Alt text + save */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/45 text-xs uppercase tracking-wider font-medium">Alt Text</label>
              <input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. Sales training session in Mumbai"
                className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold-500/40 transition-all"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!previewUrl || saving}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-900 transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Add to Gallery'}
            </button>
          </div>
        </div>
      </div>

      {/* Images grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Gallery Images <span className="text-white/30 text-base font-normal ml-1">({images.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <ImageIcon className="w-10 h-10 text-white/15 mb-3" />
            <p className="text-white/35 text-sm">No gallery images yet.</p>
            <p className="text-white/20 text-xs mt-1">Upload your first photo above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative group aspect-square rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                  {/* Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}>
                    <div className="flex justify-end">
                      <GripVertical className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <p className="text-white/80 text-xs leading-snug line-clamp-2">{img.alt_text}</p>
                      <button
                        onClick={() => handleDelete(img)}
                        disabled={deletingId === img.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all flex-shrink-0"
                      >
                        {deletingId === img.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
