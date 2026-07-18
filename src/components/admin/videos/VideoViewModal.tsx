import { motion, AnimatePresence } from 'framer-motion';
import { X, Youtube, ExternalLink, Copy, Star, Globe, Calendar, Tag, AlignLeft } from 'lucide-react';
import type { Video } from '../../../types/video';
import { buildEmbedUrl } from '../../../types/video';

interface Props {
  video: Video;
  onClose: () => void;
  onEdit: () => void;
}

const OVERLAY = { background: 'rgba(2,8,16,0.88)', backdropFilter: 'blur(10px)' };
const PANEL   = { background: '#070e1e', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 40px 120px rgba(0,0,0,0.7)' };

const CAT_COLOR: Record<string, string> = {
  Training:    '#60a5fa',
  Testimonial: '#4ade80',
  Motivation:  '#f0c040',
  Podcast:     '#a78bfa',
  Interview:   '#fb923c',
  Other:       '#94a3b8',
};

export default function VideoViewModal({ video, onClose, onEdit }: Props) {
  const catColor = CAT_COLOR[video.category] ?? '#94a3b8';
  const embedUrl = buildEmbedUrl(video.youtube_id);

  const copy = () => navigator.clipboard.writeText(video.youtube_url).catch(() => null);

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
                <h2 className="text-white font-semibold text-base line-clamp-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {video.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: catColor, background: `${catColor}15`, border: `1px solid ${catColor}30` }}>
                    {video.category}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      color: video.status === 'Published' ? '#4ade80' : '#94a3b8',
                      background: video.status === 'Published' ? 'rgba(74,222,128,0.1)' : 'rgba(148,163,184,0.1)',
                      border: `1px solid ${video.status === 'Published' ? 'rgba(74,222,128,0.25)' : 'rgba(148,163,184,0.2)'}`,
                    }}>
                    {video.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Embed player */}
          <div className="px-7 pt-5">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: '#000' }}>
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 px-7 py-5">
            {video.description && (
              <div className="flex gap-3">
                <AlignLeft className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                <p className="text-white/60 text-sm leading-relaxed">{video.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Tag,      label: 'Category',     value: video.category },
                { icon: Calendar, label: 'Added',         value: new Date(video.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                    <p className="text-white/70 text-xs font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {video.featured && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
              {video.show_on_homepage && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>
                  <Globe className="w-3 h-3" /> On Homepage
                </span>
              )}
            </div>

            {/* URL row */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Youtube className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <span className="text-white/50 text-xs truncate flex-1">{video.youtube_url}</span>
              <button onClick={copy} className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:text-white/80 flex-shrink-0" style={{ color: '#d4af37' }}>
                <Copy className="w-3 h-3" /> Copy
              </button>
              <a href={video.youtube_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] font-semibold transition-colors hover:text-white/80 flex-shrink-0" style={{ color: '#60a5fa' }}>
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-7 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/70 transition-colors">Close</button>
            <button
              onClick={onEdit}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810' }}
            >
              Edit Video
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
