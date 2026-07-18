import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube, Plus, Search, Eye, Edit2, Trash2, Star, Globe,
  ChevronLeft, ChevronRight, Copy, GripVertical, X, Filter,
} from 'lucide-react';
import type { Video } from '../../types/video';
import { CATEGORY_OPTIONS } from '../../types/video';
import { getAllVideos, deleteVideo, reorderVideos } from '../../lib/videoService';
import { Button, IconButton } from '../../components/ds/Button';
import VideoFormModal from '../../components/admin/videos/VideoFormModal';
import VideoViewModal from '../../components/admin/videos/VideoViewModal';

const PAGE_SIZE = 10;

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-lg animate-pulse ${className ?? ''}`} style={{ background: 'rgba(255,255,255,0.06)' }} />;
}

const CAT_COLOR: Record<string, string> = {
  Training:    '#60a5fa',
  Testimonial: '#4ade80',
  Motivation:  '#f0c040',
  Podcast:     '#a78bfa',
  Interview:   '#fb923c',
  Other:       '#94a3b8',
};

const STATUS_STYLE = {
  Published: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  Draft:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
};

export default function AdminVideos() {
  const [videos,     setVideos]     = useState<Video[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('All');
  const [statFilter, setStatFilter] = useState('All');
  const [page,       setPage]       = useState(1);
  const [editVideo,  setEditVideo]  = useState<Video | null>(null);
  const [viewVideo,  setViewVideo]  = useState<Video | null>(null);
  const [showForm,   setShowForm]   = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState(false);
  const [dragIdx,    setDragIdx]    = useState<number | null>(null);
  const [dragOver,   setDragOver]   = useState<number | null>(null);
  const [ordered,    setOrdered]    = useState<Video[]>([]);
  const [reordering, setReordering] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllVideos();
      setVideos(data);
      setOrdered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Keep ordered in sync when data changes (no active drag)
  useEffect(() => {
    if (dragIdx === null) setOrdered(videos);
  }, [videos, dragIdx]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ordered.filter(v =>
      (catFilter === 'All' || v.category === catFilter) &&
      (statFilter === 'All' || v.status === statFilter) &&
      (v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)),
    );
  }, [ordered, search, catFilter, statFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSaved = () => { setShowForm(false); setEditVideo(null); load(); };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deleteVideo(deleteId); setDeleteId(null); load(); }
    finally { setDeleting(false); }
  };

  // Drag-and-drop reorder (display_order within full ordered list)
  const handleDragStart = (i: number) => setDragIdx(i);
  const handleDragEnter = (i: number) => setDragOver(i);
  const handleDragEnd   = async () => {
    if (dragIdx === null || dragOver === null || dragIdx === dragOver) {
      setDragIdx(null); setDragOver(null); return;
    }
    const next = [...ordered];
    const [item] = next.splice(dragIdx, 1);
    next.splice(dragOver, 0, item);
    const withOrder = next.map((v, i) => ({ ...v, display_order: i }));
    setOrdered(withOrder);
    setDragIdx(null); setDragOver(null);
    setReordering(true);
    try { await reorderVideos(withOrder.map(v => ({ id: v.id, display_order: v.display_order }))); }
    finally { setReordering(false); }
  };

  const copy = (url: string) => navigator.clipboard.writeText(url).catch(() => null);

  const published = videos.filter(v => v.status === 'Published').length;
  const featured  = videos.find(v => v.featured);
  const homepage  = videos.filter(v => v.show_on_homepage).length;

  return (
    <div className="flex flex-col gap-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Youtube className="w-5 h-5" style={{ color: '#d4af37' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>YouTube Videos</h1>
            <p className="text-white/35 text-xs mt-0.5">Manage and organise your video library</p>
          </div>
        </div>
        <Button
          icon={Plus}
          onClick={() => { setEditVideo(null); setShowForm(true); }}
          style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810', border: 'none' }}
        >
          Add Video
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Videos',    value: videos.length,     color: '#60a5fa' },
          { label: 'Published',       value: published,          color: '#4ade80' },
          { label: 'On Homepage',     value: homepage,           color: '#d4af37' },
          { label: 'Featured',        value: featured ? 1 : 0,   color: '#fb923c' },
        ].map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1 px-4 py-3.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-2xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif', color: k.color }}>
              {loading ? '—' : k.value}
            </span>
            <span className="text-white/35 text-[11px] font-medium">{k.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or description…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white/80 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={catFilter}
            onChange={e => { setCatFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl text-sm text-white/70 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statFilter}
            onChange={e => { setStatFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl text-sm text-white/70 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {reordering && (
        <p className="text-xs text-white/40 animate-pulse">Saving new order…</p>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Table head */}
        <div className="hidden sm:grid grid-cols-[28px_56px_1fr_110px_90px_90px_90px_120px] gap-4 px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span />
          <span>Thumb</span>
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Featured</span>
          <span>Homepage</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Youtube className="w-10 h-10 text-white/15" />
            <p className="text-white/35 text-sm">No videos found</p>
            <button onClick={() => { setShowForm(true); setEditVideo(null); }} className="text-xs font-semibold" style={{ color: '#d4af37' }}>+ Add your first video</button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {pageItems.map((v, idx) => {
              const absIdx = ordered.indexOf(v);
              const catColor = CAT_COLOR[v.category] ?? '#94a3b8';
              const ss = STATUS_STYLE[v.status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.Draft;

              return (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  draggable
                  onDragStart={() => handleDragStart(absIdx)}
                  onDragEnter={() => handleDragEnter(absIdx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className="grid grid-cols-[28px_56px_1fr] sm:grid-cols-[28px_56px_1fr_110px_90px_90px_90px_120px] gap-4 items-center px-4 py-3 transition-all cursor-grab active:cursor-grabbing"
                  style={{
                    borderBottom: idx < pageItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: dragOver === absIdx ? 'rgba(212,175,55,0.04)' : 'transparent',
                  }}
                >
                  <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />

                  {/* Thumbnail */}
                  <div className="w-14 aspect-video rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#000' }}>
                    {v.thumbnail_url
                      ? <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Youtube className="w-4 h-4 text-white/20" /></div>
                    }
                  </div>

                  {/* Title + URL */}
                  <div className="min-w-0">
                    <p className="text-white/85 text-sm font-medium truncate">{v.title}</p>
                    <p className="text-white/30 text-[11px] truncate mt-0.5">{v.youtube_url}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:block">
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full"
                      style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}25` }}>
                      {v.category}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                      {v.status}
                    </span>
                  </div>

                  {/* Featured */}
                  <div className="hidden sm:flex items-center">
                    {v.featured
                      ? <Star className="w-4 h-4" style={{ color: '#d4af37' }} />
                      : <span className="text-white/20 text-xs">—</span>}
                  </div>

                  {/* Homepage */}
                  <div className="hidden sm:flex items-center">
                    {v.show_on_homepage
                      ? <Globe className="w-4 h-4" style={{ color: '#60a5fa' }} />
                      : <span className="text-white/20 text-xs">—</span>}
                  </div>

                  {/* Actions */}
                  <div className="hidden sm:flex items-center justify-end gap-1">
                    <IconButton icon={Copy} size="sm" variant="default" onClick={() => copy(v.youtube_url)} title="Copy URL" />
                    <IconButton icon={Eye}   size="sm" variant="default" onClick={() => setViewVideo(v)} title="Preview" />
                    <IconButton icon={Edit2} size="sm" variant="default" onClick={() => { setEditVideo(v); setShowForm(true); }} title="Edit" />
                    <IconButton icon={Trash2} size="sm" variant="default" onClick={() => setDeleteId(v.id)} title="Delete"
                      className="hover:text-red-400 hover:bg-red-500/8" />
                  </div>

                  {/* Mobile action buttons below title row (full-width) */}
                  <div className="flex sm:hidden col-span-3 items-center gap-2 pt-1 pb-0.5">
                    <button onClick={() => setViewVideo(v)} className="text-xs text-white/40 hover:text-white/60 transition-colors">Preview</button>
                    <span className="text-white/15">·</span>
                    <button onClick={() => { setEditVideo(v); setShowForm(true); }} className="text-xs text-white/40 hover:text-white/60 transition-colors">Edit</button>
                    <span className="text-white/15">·</span>
                    <button onClick={() => setDeleteId(v.id)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Delete</button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">{filtered.length} video{filtered.length !== 1 ? 's' : ''}</p>
          <div className="flex items-center gap-2">
            <IconButton icon={ChevronLeft}  size="sm" variant="default" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
            <span className="text-white/50 text-xs tabular-nums">{page} / {totalPages}</span>
            <IconButton icon={ChevronRight} size="sm" variant="default" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(2,8,16,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl p-7"
              style={{ background: '#070e1e', border: '1px solid rgba(255,255,255,0.09)' }}
              initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-center mb-2">Delete Video?</h3>
              <p className="text-white/40 text-sm text-center mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form modal */}
      {showForm && (
        <VideoFormModal
          video={editVideo}
          onClose={() => { setShowForm(false); setEditVideo(null); }}
          onSaved={onSaved}
        />
      )}

      {/* View modal */}
      {viewVideo && (
        <VideoViewModal
          video={viewVideo}
          onClose={() => setViewVideo(null)}
          onEdit={() => { setEditVideo(viewVideo); setViewVideo(null); setShowForm(true); }}
        />
      )}
    </div>
  );
}
