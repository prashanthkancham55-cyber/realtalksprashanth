'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Trash2, Plus, GripVertical } from 'lucide-react';
import { supabase, type GalleryImage } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import FileUploadButton from '@/components/admin/shared/FileUploadButton';
import { Button, IconButton, Input, Card, EmptyState, ImageGridSkeleton, SectionHeader, ConfirmDialog } from '@/components/ds';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [altText, setAltText] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [flash, setFlash] = useState<{ msg: string; ok: boolean } | null>(null);

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

  const notify = (msg: string, ok = true) => {
    setFlash({ msg, ok });
    setTimeout(() => setFlash(null), 3500);
  };

  const handleAdd = async () => {
    if (!previewUrl) return notify('Please upload an image first.', false);
    setSaving(true);
    const { error } = await supabase.from('gallery_images').insert({
      image_url: previewUrl,
      alt_text: altText.trim() || 'Training Image',
      display_order: images.length,
    });
    if (error) notify(error.message, false);
    else {
      notify('Image added to gallery!');
      setPreviewUrl('');
      setAltText('');
      fetchImages();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from('gallery_images').delete().eq('id', deleteTarget.id);
    const path = deleteTarget.image_url.split('/storage/v1/object/public/gallery/')[1];
    if (path) await supabase.storage.from('gallery').remove([path]);
    setDeleteTarget(null);
    setDeleting(false);
    notify('Image deleted.');
    fetchImages();
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

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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

      {/* Upload card */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Plus className="w-4 h-4 text-gold-400" />
          <h3 className="text-white font-semibold">Add New Image</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className="flex flex-col gap-3 flex-shrink-0">
            <FileUploadButton bucket="gallery" onUploaded={(url) => setPreviewUrl(url)} label="Upload Photo" />
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

          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <Input
              label="Alt Text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="e.g. Sales training session in Mumbai"
              hint="Describes the image for accessibility and SEO"
            />
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleAdd}
              disabled={!previewUrl}
              loading={saving}
              className="self-start"
            >
              {saving ? 'Saving...' : 'Add to Gallery'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Images grid */}
      <div>
        <SectionHeader
          title={`Gallery Images`}
          description={loading ? 'Loading...' : `${images.length} image${images.length !== 1 ? 's' : ''} published`}
        />

        {loading ? (
          <ImageGridSkeleton count={8} />
        ) : images.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            iconColor="#38bdf8"
            title="No images yet"
            description="Upload your first photo using the form above."
          />
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
                  <img
                    src={img.image_url}
                    alt={img.alt_text}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
                  >
                    <div className="flex justify-end">
                      <GripVertical className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <p className="text-white/80 text-xs leading-snug line-clamp-2">{img.alt_text}</p>
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(img)}
                        label="Delete image"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this image?"
        description="This will permanently remove the image from your gallery and storage. This action cannot be undone."
        confirmLabel="Delete Image"
        variant="danger"
      />
    </div>
  );
}
