import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Monitor,
  Wifi,
  CheckCircle,
  ChevronLeft,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ArrowRight,
  Briefcase,
  BookOpen,
  Star,
  User,
  Layers,
} from 'lucide-react';
import type { Training } from '../../types/training';
import { formatDate, formatPrice } from '../../types/training';
import { getTrainingBySlug, getRelatedTrainings } from '../../lib/trainingService';

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const sectionVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD  = '#d4af37';
const GOLD2 = '#f0c040';
const NAV   = '#020810';
const CARD_BG = 'rgba(13,22,48,0.85)';
const BORDER  = 'rgba(212,175,55,0.18)';

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(234,179,8,0.12)',
        border: `1px solid ${isActive ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`,
        color: isActive ? '#4ade80' : '#facc15',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: isActive ? '#4ade80' : '#facc15' }}
      />
      {status}
    </span>
  );
}

// ── Mode badge ────────────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: string }) {
  const cfg: Record<string, { icon: ReactNode; color: string; bg: string }> = {
    Online:  { icon: <Wifi    className="w-3 h-3" />, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
    Offline: { icon: <Users   className="w-3 h-3" />, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    Hybrid:  { icon: <Monitor className="w-3 h-3" />, color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  };
  const c = cfg[mode] ?? cfg.Offline;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}44` }}
    >
      {c.icon}
      {mode}
    </span>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{
        background: 'rgba(212,175,55,0.12)',
        border: `1px solid rgba(212,175,55,0.35)`,
        color: GOLD,
      }}
    >
      {category}
    </span>
  );
}

// ── Gold gradient text ────────────────────────────────────────────────────────
function GoldText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
        style={{ background: 'rgba(212,175,55,0.12)', border: `1px solid ${BORDER}` }}
      >
        <span style={{ color: GOLD }}>{icon}</span>
      </div>
      <h2
        className="text-xl font-bold text-white"
        style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${BORDER}, transparent)` }} />
    </div>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────
function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: GOLD }}
          />
          <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ── Quick info bar ────────────────────────────────────────────────────────────
function QuickInfoBar({ training }: { training: Training }) {
  const items = [
    { icon: <Calendar className="w-4 h-4" />, label: 'Date',     value: formatDate(training.start_date) },
    { icon: <Clock    className="w-4 h-4" />, label: 'Time',     value: training.session_time || '—'     },
    { icon: <Briefcase className="w-4 h-4"/>, label: 'Duration', value: training.duration     || '—'     },
    { icon: <MapPin   className="w-4 h-4" />, label: 'Location', value: training.location     || 'Online' },
    { icon: <Globe    className="w-4 h-4" />, label: 'Language', value: training.language     || '—'     },
    { icon: <Monitor  className="w-4 h-4" />, label: 'Mode',     value: training.mode                    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-2xl mb-8"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
    >
      {items.map(({ icon, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: 'rgba(212,175,55,0.1)', color: GOLD }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {label}
            </p>
            <p className="text-sm font-semibold text-white mt-0.5 leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Agenda timeline ───────────────────────────────────────────────────────────
function AgendaTimeline({ items }: { items: Training['agenda'] }) {
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => (
        <li key={i} className="relative pl-12 pb-8 last:pb-0">
          {/* vertical line */}
          {i < items.length - 1 && (
            <div
              className="absolute left-4 top-9 bottom-0 w-px"
              style={{ background: BORDER }}
            />
          )}
          {/* number circle */}
          <div
            className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
              color: NAV,
              boxShadow: `0 0 12px rgba(212,175,55,0.4)`,
            }}
          >
            {i + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ background: 'rgba(212,175,55,0.1)', color: GOLD }}
              >
                {item.time}
              </span>
            </div>
            <h4 className="text-base font-semibold text-white mb-1">{item.topic}</h4>
            {item.description && (
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Share buttons ─────────────────────────────────────────────────────────────
function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Share:
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{ background: 'rgba(29,161,242,0.12)', color: '#1da1f2', border: '1px solid rgba(29,161,242,0.25)' }}
        title="Share on Twitter"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{ background: 'rgba(0,119,181,0.12)', color: '#0077b5', border: '1px solid rgba(0,119,181,0.25)' }}
        title="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>
      <button
        onClick={copyLink}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{
          background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.05)',
          color: copied ? '#4ade80' : 'rgba(255,255,255,0.5)',
          border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
        }}
        title="Copy link"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ── Content card wrapper ──────────────────────────────────────────────────────
function ContentCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={`p-6 rounded-2xl mb-6 ${className}`}
      style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
    >
      {children}
    </motion.div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonLoader() {
  const pulse = { background: 'rgba(255,255,255,0.06)', borderRadius: '8px' };
  return (
    <div className="animate-pulse min-h-screen" style={{ background: NAV }}>
      {/* hero */}
      <div className="h-80 md:h-96" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div style={{ ...pulse, height: 24, width: '40%' }} />
            <div style={{ ...pulse, height: 48, width: '75%' }} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ ...pulse, height: 56 }} />
              ))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ ...pulse, height: 160 }} />
            ))}
          </div>
          <div className="space-y-4">
            <div style={{ ...pulse, height: 360 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 404 state ─────────────────────────────────────────────────────────────────
function NotFound({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: NAV }}
    >
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid ${BORDER}` }}
        >
          <BookOpen className="w-9 h-9" style={{ color: GOLD }} />
        </div>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          Training Not Found
        </h1>
        <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          The training program you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={() => navigate('/trainings')}
            className="px-6 py-3 rounded-full text-sm font-semibold"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              color: NAV,
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(212,175,55,0.45)' }}
            whileTap={{ scale: 0.97 }}
          >
            Browse All Programs
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full text-sm font-semibold"
            style={{ border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.7)' }}
            whileHover={{ borderColor: GOLD, color: GOLD }}
            whileTap={{ scale: 0.97 }}
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Related training mini card ────────────────────────────────────────────────
function RelatedCard({ training }: { training: Training }) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="flex gap-4 p-4 rounded-2xl cursor-pointer group"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      whileHover={{ y: -2, borderColor: BORDER.replace('0.18', '0.35') }}
      onClick={() => navigate(`/training/${training.slug}`)}
    >
      <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
        {training.banner_url ? (
          <img
            src={training.banner_url}
            alt={training.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'rgba(212,175,55,0.1)' }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-1"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          {training.title}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {formatDate(training.start_date)}
        </p>
        <p
          className="text-sm font-bold mt-1"
          style={{ color: training.price === 0 ? '#4ade80' : GOLD }}
        >
          {formatPrice(training.price)}
        </p>
      </div>
    </motion.div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ training, navigate }: { training: Training; navigate: ReturnType<typeof useNavigate> }) {
  const url = window.location.href;

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
      >
        {/* Banner thumbnail */}
        {training.banner_url && (
          <div className="h-40 overflow-hidden">
            <img
              src={training.banner_url}
              alt={training.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5">
          <h3
            className="text-lg font-bold text-white leading-snug mb-1"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            {training.title}
          </h3>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            by {training.trainer_name}
          </p>

          {/* Price */}
          <div className="mb-5">
            {training.price === 0 ? (
              <span className="text-3xl font-bold" style={{ color: '#4ade80', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                Free
              </span>
            ) : (
              <span
                className="text-3xl font-bold"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatPrice(training.price)}
              </span>
            )}
          </div>

          {/* Register button */}
          <motion.button
            onClick={() => navigate(`/register/${training.slug}`)}
            className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-5"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              color: NAV,
              boxShadow: '0 0 20px rgba(212,175,55,0.3)',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(212,175,55,0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            Register Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Meta info */}
          <div className="space-y-2.5 border-t pt-4" style={{ borderColor: BORDER }}>
            {[
              { icon: <Users    className="w-3.5 h-3.5" />, label: 'Seats Left', value: `${training.available_seats} / ${training.total_seats}` },
              { icon: <Clock    className="w-3.5 h-3.5" />, label: 'Duration',   value: training.duration || '—' },
              { icon: <Monitor  className="w-3.5 h-3.5" />, label: 'Mode',       value: training.mode        },
              { icon: <Globe    className="w-3.5 h-3.5" />, label: 'Language',   value: training.language || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: GOLD }}>{icon}</span>
                  {label}
                </span>
                <span className="font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share section */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4" style={{ color: GOLD }} />
          <span className="text-sm font-semibold text-white">Share this program</span>
        </div>
        <ShareButtons url={url} title={training.title} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrainingDetail() {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();

  const [training,         setTraining]         = useState<Training | null>(null);
  const [related,          setRelated]          = useState<Training[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [notFound,         setNotFound]         = useState(false);
  const [showStickyBar,    setShowStickyBar]    = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  // ── Fetch training ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    setLoading(true);
    getTrainingBySlug(slug)
      .then((data) => {
        if (!data) { setNotFound(true); return; }
        setTraining(data);

        // SEO
        document.title = `${data.title} | RealTalks Training`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.short_description || data.description || '');
        } else {
          const m = document.createElement('meta');
          m.name    = 'description';
          m.content = data.short_description || data.description || '';
          document.head.appendChild(m);
        }

        // Fetch related
        return getRelatedTrainings(data.category, data.id).then(setRelated);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    return () => {
      document.title = 'RealTalks | Prashanth Kumar';
    };
  }, [slug]);

  // ── Sticky register bar on scroll ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Early returns ───────────────────────────────────────────────────────────
  if (loading)  return <SkeletonLoader />;
  if (notFound || !training) return <NotFound navigate={navigate} />;

  const pageUrl = window.location.href;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ background: NAV, minHeight: '100vh' }}
    >
      {/* ── Sticky register bar ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y: -64, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-14"
            style={{
              background: 'rgba(2,8,16,0.95)',
              borderBottom: `1px solid ${BORDER}`,
              backdropFilter: 'blur(16px)',
            }}
          >
            <span
              className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              {training.title}
            </span>
            <motion.button
              onClick={() => navigate(`/register/${training.slug}`)}
              className="ml-4 flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
                color: NAV,
              }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(212,175,55,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              Register Now
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-72 md:h-96 lg:h-[28rem] overflow-hidden">
        {training.banner_url ? (
          <img
            src={training.banner_url}
            alt={training.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0d1630 0%, #050b18 100%)' }}
          />
        )}

        {/* Dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(2,8,16,0.35) 0%, rgba(2,8,16,0.75) 60%, rgba(2,8,16,0.97) 100%)',
          }}
        />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <motion.button
            onClick={() => navigate('/trainings')}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(2,8,16,0.7)',
              border: `1px solid ${BORDER}`,
              color: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={{ color: GOLD, borderColor: GOLD }}
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge   status={training.status}     />
              <ModeBadge     mode={training.mode}         />
              <CategoryBadge category={training.category} />
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              {training.title}
            </h1>

            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              by {training.trainer_name}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left: content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Quick info bar */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible">
              <QuickInfoBar training={training} />
            </motion.div>

            {/* Short description */}
            {training.short_description && (
              <ContentCard>
                <p className="text-base leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {training.short_description}
                </p>
              </ContentCard>
            )}

            {/* Full description */}
            {training.full_description && (
              <ContentCard>
                <SectionHeading icon={<BookOpen className="w-4 h-4" />} title="About This Program" />
                <div
                  className="text-sm leading-relaxed space-y-3 whitespace-pre-wrap"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  {training.full_description}
                </div>
              </ContentCard>
            )}

            {/* What You Will Learn */}
            {training.what_you_will_learn.length > 0 && (
              <ContentCard>
                <SectionHeading icon={<Star className="w-4 h-4" />} title="What You Will Learn" />
                <Checklist items={training.what_you_will_learn} />
              </ContentCard>
            )}

            {/* Benefits */}
            {training.benefits.length > 0 && (
              <ContentCard>
                <SectionHeading icon={<CheckCircle className="w-4 h-4" />} title="Program Benefits" />
                <Checklist items={training.benefits} />
              </ContentCard>
            )}

            {/* Who Should Attend */}
            {training.who_should_attend.length > 0 && (
              <ContentCard>
                <SectionHeading icon={<User className="w-4 h-4" />} title="Who Should Attend" />
                <Checklist items={training.who_should_attend} />
              </ContentCard>
            )}

            {/* Agenda */}
            {training.agenda.length > 0 && (
              <ContentCard>
                <SectionHeading icon={<Layers className="w-4 h-4" />} title="Program Agenda" />
                <AgendaTimeline items={training.agenda} />
              </ContentCard>
            )}
          </div>

          {/* ── Right: sticky sidebar ──────────────────────────────────────── */}
          <div className="lg:sticky lg:top-20">
            <Sidebar training={training} navigate={navigate} />
          </div>
        </div>

        {/* ── Related Trainings ──────────────────────────────────────────────── */}
        {related.length > 0 && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-16"
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${BORDER})` }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.25em] px-4"
                style={{ color: GOLD }}
              >
                Related Programs
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BORDER}, transparent)` }} />
            </div>

            <h2
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(r => (
                <RelatedCard key={r.id} training={r} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,22,48,0.9) 50%, rgba(212,175,55,0.08) 100%)',
            border: `1px solid ${BORDER}`,
          }}
        >
          <h3
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            Ready to{' '}
            <GoldText>Transform Your Skills?</GoldText>
          </h3>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {training.available_seats > 0
              ? `Only ${training.available_seats} seats remaining. Secure yours today.`
              : 'Contact us to join the waitlist for the next batch.'}
          </p>
          <motion.button
            onClick={() => navigate(`/register/${training.slug}`)}
            className="px-8 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              color: NAV,
              boxShadow: '0 0 24px rgba(212,175,55,0.35)',
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.55)' }}
            whileTap={{ scale: 0.97 }}
          >
            Register Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
