import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Play, ExternalLink, Filter } from 'lucide-react';
import { getPublishedVideos } from '../../lib/videoService';
import type { Video } from '../../types/video';
import { CATEGORY_OPTIONS, buildEmbedUrl } from '../../types/video';

const CAT_COLOR: Record<string, string> = {
  Training:    '#60a5fa',
  Testimonial: '#4ade80',
  Motivation:  '#f0c040',
  Podcast:     '#a78bfa',
  Interview:   '#fb923c',
  Other:       '#94a3b8',
};

function PlayOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      style={{ background: 'rgba(2,8,16,0.6)' }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.9)', boxShadow: '0 8px 32px rgba(212,175,55,0.5)' }}>
        <Play className="w-6 h-6 ml-0.5" style={{ color: '#020810' }} />
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }: { video: Video; onPlay: (v: Video) => void }) {
  const catColor = CAT_COLOR[video.category] ?? '#94a3b8';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="relative aspect-video cursor-pointer flex-shrink-0" onClick={() => onPlay(video)}>
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#000' }}>
            <Youtube className="w-10 h-10 text-white/20" />
          </div>
        )}
        <PlayOverlay />
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
          style={{ background: `${catColor}20`, border: `1px solid ${catColor}35`, color: catColor, backdropFilter: 'blur(8px)' }}>
          {video.category}
        </span>
        {video.featured && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
            style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.35)', color: '#d4af37', backdropFilter: 'blur(8px)' }}>
            ★ Featured
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">{video.title}</h3>
        {video.description && (
          <p className="text-white/45 text-xs leading-relaxed line-clamp-2">{video.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <a href={video.youtube_url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-80"
            style={{ color: '#d4af37' }}>
            <ExternalLink className="w-3 h-3" /> Watch on YouTube
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function EmbedModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,16,0.92)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-3xl"
        initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base line-clamp-1 mr-4">{video.title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white/40 hover:text-white hover:bg-white/8 transition-all">
            ✕
          </button>
        </div>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: '#000' }}>
          <iframe
            src={buildEmbedUrl(video.youtube_id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function VideosPage() {
  const [videos,     setVideos]     = useState<Video[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [catFilter,  setCatFilter]  = useState('All');
  const [playing,    setPlaying]    = useState<Video | null>(null);

  useEffect(() => {
    getPublishedVideos().then(data => { setVideos(data); setLoading(false); });
  }, []);

  const filtered = catFilter === 'All' ? videos : videos.filter(v => v.category === catFilter);
  const featured = videos.find(v => v.featured);

  const usedCats = Array.from(new Set(videos.map(v => v.category)));

  return (
    <div className="min-h-screen" style={{ background: '#020810' }}>
      {/* Hero */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg,#070e1e 0%,#020810 100%)' }}>
        <div className="container-max text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">VIDEO LIBRARY</span>
            <h1 className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-4">
              Watch & <span className="gold-text">Learn</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Trainings, testimonials, podcasts, and inspiration — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured video */}
      {featured && (
        <section className="section-padding pt-0" style={{ background: '#020810' }}>
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(212,175,55,0.4),transparent)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#d4af37' }}>★ Featured Video</span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.4))' }} />
              </div>
              <div
                className="grid lg:grid-cols-[1fr_400px] gap-8 items-center rounded-3xl p-6 md:p-8"
                style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
              >
                <div
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setPlaying(featured)}
                >
                  {featured.thumbnail_url && (
                    <img src={featured.thumbnail_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <PlayOverlay />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: CAT_COLOR[featured.category] ?? '#94a3b8' }}>
                    {featured.category}
                  </span>
                  <h2 className="heading-display text-3xl text-white">{featured.title}</h2>
                  {featured.description && <p className="text-white/55 text-sm leading-relaxed">{featured.description}</p>}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setPlaying(featured)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810' }}
                    >
                      <Play className="w-4 h-4" /> Watch Now
                    </button>
                    <a href={featured.youtube_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                      <ExternalLink className="w-4 h-4" /> YouTube
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category filter + grid */}
      <section className="section-padding" style={{ background: '#020810' }}>
        <div className="container-max">
          {/* Filter tabs */}
          {usedCats.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-8">
              {['All', ...usedCats].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: catFilter === cat ? 'linear-gradient(135deg,#f0c040,#d4af37)' : 'rgba(255,255,255,0.04)',
                    border: catFilter === cat ? 'none' : '1px solid rgba(255,255,255,0.09)',
                    color: catFilter === cat ? '#020810' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="aspect-video animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '75%' }} />
                    <div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Youtube className="w-12 h-12 text-white/15" />
              <p className="text-white/40 text-sm">No videos in this category yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(v => (
                <VideoCard key={v.id} video={v} onPlay={setPlaying} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Embed modal */}
      {playing && <EmbedModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
