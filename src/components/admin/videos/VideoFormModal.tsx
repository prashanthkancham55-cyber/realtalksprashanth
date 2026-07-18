import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, RefreshCw, AlertCircle, Star, Globe, Eye } from 'lucide-react';
import type { Video, VideoFormData } from '../../../types/video';
import { EMPTY_FORM, CATEGORY_OPTIONS, STATUS_OPTIONS, extractYouTubeId, buildThumbnailUrl } from '../../../types/video';
import { createVideo, updateVideo, validateVideoForm } from '../../../lib/videoService';
import { Button } from '../../ds/Button';

interface Props {
  video?: Video | null;
  onClose: () => void;
  onSaved: () => void;
}

const OVERLAY = { background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(8px)' };
const PANEL   = { background: '#070e1e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' };

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_STYLE = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  color: 'rgba(255,255,255,0.85)',
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
};

export default function VideoFormModal({ video, onClose, onSaved }: Props) {
  const isEdit = !!video;
  const [form, setForm] = useState<VideoFormData>(
    video
      ? {
          title: video.title, youtube_url: video.youtube_url, youtube_id: video.youtube_id,
          thumbnail_url: video.thumbnail_url, category: video.category, description: video.description,
          featured: video.featured, show_on_homepage: video.show_on_homepage,
          display_order: video.display_order, status: video.status,
        }
      : { ...EMPTY_FORM },
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [thumbPreview, setThumbPreview] = useState(video?.thumbnail_url ?? '');

  // Auto-derive youtube_id + thumbnail whenever URL changes
  useEffect(() => {
    const id = extractYouTubeId(form.youtube_url);
    if (id && id !== form.youtube_id) {
      const thumb = buildThumbnailUrl(id);
      setForm(f => ({ ...f, youtube_id: id, thumbnail_url: thumb }));
      setThumbPreview(thumb);
    }
  }, [form.youtube_url]);

  function set<K extends keyof VideoFormData>(k: K, v: VideoFormData[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const refreshThumb = () => {
    const id = extractYouTubeId(form.youtube_url);
    if (!id) return;
    const url = buildThumbnailUrl(id);
    set('thumbnail_url', url);
    setThumbPreview(url);
  };

  const handleSave = async () => {
    const err = validateVideoForm(form);
    if (err) { setError(err); return; }
    setSaving(true);
    setError('');
    try {
      if (isEdit) await updateVideo(video!.id, form);
      else        await createVideo(form);
      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={OVERLAY}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl flex flex-col"
          style={PANEL}
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Youtube className="w-4.5 h-4.5" style={{ color: '#d4af37' }} />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {isEdit ? 'Edit Video' : 'Add New Video'}
                </h2>
                <p className="text-white/35 text-xs">Fill in the details below</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-5 px-7 py-6">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <Field label="Video Title" required>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="e.g. Sales Mastery Bootcamp Highlights"
                style={INPUT_STYLE}
              />
            </Field>

            <Field label="YouTube URL" required>
              <input
                value={form.youtube_url}
                onChange={e => set('youtube_url', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={INPUT_STYLE}
              />
              {form.youtube_id && (
                <p className="text-[11px] text-emerald-400 mt-0.5">Video ID detected: {form.youtube_id}</p>
              )}
            </Field>

            {/* Thumbnail preview */}
            <Field label="Thumbnail">
              <div className="flex gap-3 items-start">
                <input
                  value={form.thumbnail_url}
                  onChange={e => { set('thumbnail_url', e.target.value); setThumbPreview(e.target.value); }}
                  placeholder="Auto-fetched from YouTube"
                  style={{ ...INPUT_STYLE, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={refreshThumb}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', whiteSpace: 'nowrap' }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>
              {thumbPreview && (
                <div className="mt-2 rounded-xl overflow-hidden aspect-video w-full max-w-xs">
                  <img src={thumbPreview} alt="thumbnail" className="w-full h-full object-cover"
                    onError={() => setThumbPreview(`https://img.youtube.com/vi/${form.youtube_id}/hqdefault.jpg`)} />
                </div>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <select value={form.category} onChange={e => set('category', e.target.value as VideoFormData['category'])} style={INPUT_STYLE}>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={e => set('status', e.target.value as VideoFormData['status'])} style={INPUT_STYLE}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Short Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Brief description of this video..."
                style={{ ...INPUT_STYLE, resize: 'none' }}
              />
            </Field>

            <Field label="Display Order">
              <input
                type="number"
                min={0}
                value={form.display_order}
                onChange={e => set('display_order', Number(e.target.value))}
                style={INPUT_STYLE}
              />
            </Field>

            {/* Toggle flags */}
            <div className="flex flex-col gap-3">
              {[
                { key: 'featured' as const,         icon: Star,  label: 'Featured Video',    sub: 'Highlighted at the top of the videos section' },
                { key: 'show_on_homepage' as const,  icon: Globe, label: 'Show on Homepage',  sub: 'Display in the public homepage videos section' },
              ].map(({ key, icon: Icon, label, sub }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(key, !form[key])}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: form[key] ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${form[key] ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: form[key] ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.06)' }}>
                    <Icon className="w-4 h-4" style={{ color: form[key] ? '#d4af37' : 'rgba(255,255,255,0.3)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: form[key] ? '#d4af37' : 'rgba(255,255,255,0.7)' }}>{label}</p>
                    <p className="text-xs text-white/30 mt-0.5">{sub}</p>
                  </div>
                  <div className="w-10 h-5.5 rounded-full flex-shrink-0 transition-colors relative" style={{ background: form[key] ? '#d4af37' : 'rgba(255,255,255,0.12)' }}>
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: form[key] ? 'calc(100% - 18px)' : 2 }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-7 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810', border: 'none' }}
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Video'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
