import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CalendarClock,
  Users,
  Image,
  Star,
  Mail,
  ArrowRight,
  Sun, Sunset, Moon,
  ArrowUpRight, Activity, Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatRegistrationDate } from '../../lib/registrationService';
import type { StudentRegistration } from '../../types/registration';
import { STATUS_BADGE } from '../../types/registration';

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface DashboardStats {
  totalTrainings:       number;
  upcomingTrainings:    number;
  studentRegistrations: number;
  galleryImages:        number;
  testimonials:         number;
  enquiries:            number;
}

interface KpiCard {
  label:   string;
  key:     keyof DashboardStats;
  icon:    React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent:  string;
  bgGlow:  string;
  link:    string;
}

const KPI_CARDS: KpiCard[] = [
  {
    label:  'Total Trainings',
    key:    'totalTrainings',
    icon:   BookOpen,
    accent: '#60a5fa',
    bgGlow: 'rgba(96,165,250,0.08)',
    link:   '/admin/trainings',
  },
  {
    label:  'Upcoming Trainings',
    key:    'upcomingTrainings',
    icon:   CalendarClock,
    accent: '#f0c040',
    bgGlow: 'rgba(240,192,64,0.08)',
    link:   '/admin/trainings',
  },
  {
    label:  'Student Registrations',
    key:    'studentRegistrations',
    icon:   Users,
    accent: '#fb923c',
    bgGlow: 'rgba(251,146,60,0.08)',
    link:   '/admin/registrations',
  },
  {
    label:  'Gallery Images',
    key:    'galleryImages',
    icon:   Image,
    accent: '#a78bfa',
    bgGlow: 'rgba(167,139,250,0.08)',
    link:   '/admin/gallery',
  },
  {
    label:  'Testimonials',
    key:    'testimonials',
    icon:   Star,
    accent: '#4ade80',
    bgGlow: 'rgba(74,222,128,0.08)',
    link:   '/admin/testimonials',
  },
  {
    label:  'Enquiries',
    key:    'enquiries',
    icon:   Mail,
    accent: '#f472b6',
    bgGlow: 'rgba(244,114,182,0.08)',
    link:   '/admin/enquiries',
  },
];

const QUICK_ACTIONS = [
  { label: 'Training Management',   desc: 'Add, edit, and manage trainings',           link: '/admin/trainings',     icon: BookOpen,   accent: '#60a5fa' },
  { label: 'Registrations',         desc: 'View and manage student registrations',     link: '/admin/registrations', icon: Users,      accent: '#fb923c' },
  { label: 'Gallery',               desc: 'Upload and manage gallery images',          link: '/admin/gallery',       icon: Image,      accent: '#a78bfa' },
  { label: 'Testimonials',          desc: 'Manage client testimonials',                link: '/admin/testimonials',  icon: Star,       accent: '#4ade80' },
  { label: 'Enquiries',             desc: 'View and respond to contact enquiries',     link: '/admin/enquiries',     icon: Mail,       accent: '#f472b6' },
];

/* ── Skeleton ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

/* ── KPI Card ─────────────────────────────────────────────────────────────────── */
function KpiCardComponent({
  card,
  value,
  loading,
  index,
}: {
  card: KpiCard;
  value: number;
  loading: boolean;
  index: number;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={card.link} className="block group">
        <div
          className="rounded-2xl p-5 h-full transition-all duration-300 group-hover:scale-[1.02]"
          style={{
            background: 'rgba(13,22,48,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 0 60px ${card.bgGlow}`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}25` }}
            >
              <Icon className="w-5 h-5" style={{ color: card.accent }} />
            </div>
            <ArrowRight
              className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors"
            />
          </div>

          {loading ? (
            <Skeleton className="h-9 w-16 mb-1.5" />
          ) : (
            <div
              className="text-4xl font-bold text-white leading-none mb-1.5"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {value.toLocaleString()}
            </div>
          )}

          <div className="text-sm text-white/45 font-medium">{card.label}</div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Registration Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_BADGE[status as keyof typeof STATUS_BADGE] ?? {
    color: '#fff',
    bg: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.15)',
  };
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  );
}

/* ── Dashboard ───────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [stats, setStats]           = useState<DashboardStats>({
    totalTrainings: 0, upcomingTrainings: 0, studentRegistrations: 0,
    galleryImages: 0,  testimonials: 0,      enquiries: 0,
  });
  const [recentRegs, setRecentRegs] = useState<StudentRegistration[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);

        const [
          { count: totalTrainings },
          { count: upcomingTrainings },
          { count: studentRegistrations },
          { count: galleryImages },
          { count: testimonials },
          { count: enquiries },
          { data: regData },
        ] = await Promise.all([
          supabase.from('trainings').select('*', { count: 'exact', head: true }),
          supabase.from('trainings').select('*', { count: 'exact', head: true }).in('status', ['Upcoming', 'Active']),
          supabase.from('student_registrations').select('*', { count: 'exact', head: true }),
          supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
          supabase
            .from('student_registrations')
            .select('*, trainings(title, start_date, mode)')
            .order('registered_at', { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalTrainings:       totalTrainings ?? 0,
          upcomingTrainings:    upcomingTrainings ?? 0,
          studentRegistrations: studentRegistrations ?? 0,
          galleryImages:        galleryImages ?? 0,
          testimonials:         testimonials ?? 0,
          enquiries:            enquiries ?? 0,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: StudentRegistration[] = ((regData ?? []) as any[]).map((row) => ({
          ...row,
          training_title: row.trainings?.title,
          training_start: row.trainings?.start_date,
          training_mode:  row.trainings?.mode,
        }));
        setRecentRegs(mapped);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  /* ── Hero helpers ─────────────────────────────────────────────────────── */
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12 ? { text: 'Good Morning',   Icon: Sun,    color: '#f0c040' } :
    hour >= 12 && hour < 17 ? { text: 'Good Afternoon', Icon: Sunset, color: '#fb923c' } :
                               { text: 'Good Evening',   Icon: Moon,   color: '#93c5fd' };

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const heroStats = [
    { label: 'Trainings',     value: stats.totalTrainings,       color: '#60a5fa' },
    { label: 'Students',      value: stats.studentRegistrations,  color: '#34d399' },
    { label: 'Enquiries',     value: stats.enquiries,             color: '#fb923c' },
  ];

  const heroActions = [
    { label: 'Add Training',        href: '/admin/trainings',     Icon: BookOpen,  color: '#60a5fa', border: 'rgba(96,165,250,0.25)',  bg: 'rgba(96,165,250,0.10)'  },
    { label: 'View Registrations',  href: '/admin/registrations', Icon: Users,     color: '#34d399', border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.10)'  },
    { label: 'Manage Gallery',      href: '/admin/gallery',       Icon: Image,     color: '#d4af37', border: 'rgba(212,175,55,0.25)',  bg: 'rgba(212,175,55,0.10)'  },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:  'linear-gradient(140deg, #0a1628 0%, #070e1e 55%, #0d1a30 100%)',
          border:      '1px solid rgba(212,175,55,0.14)',
          boxShadow:   '0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Atmosphere layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, transparent 62%)', filter: 'blur(2px)' }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.18) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.55) 50%, transparent 95%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.12) 50%, transparent 95%)' }} />
        </div>

        <div className="relative z-10 p-6 md:p-8 lg:p-10">

          {/* Top: identity + live stats */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

            {/* LEFT */}
            <div className="flex-1 min-w-0">

              {/* Greeting pill */}
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                style={{ background: `${greeting.color}10`, border: `1px solid ${greeting.color}30` }}
              >
                <greeting.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: greeting.color }} />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: greeting.color }}>
                  {greeting.text}
                </span>
              </motion.div>

              {/* Name heading */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mb-4"
              >
                <p className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5">
                  Welcome back
                </p>
                <h1
                  className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] tracking-tight"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  Prashanth
                  <span
                    className="block mt-1"
                    style={{
                      background: 'linear-gradient(130deg, #f5d060 0%, #d4af37 45%, #b8962e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: '0.58em',
                      letterSpacing: '0.02em',
                    }}
                  >
                    RealTalks Platform
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34, duration: 0.6 }}
                className="text-white/35 text-sm leading-[1.8] max-w-[38ch] mb-7"
              >
                Your training is transforming lives. Keep leading with purpose.
              </motion.p>

              {/* Date */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.44 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-4 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }} />
                <span className="text-white/25 text-[11px] tracking-wide">{today}</span>
              </motion.div>
            </div>

            {/* RIGHT: live badge + glassmorphism stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 lg:items-end w-full lg:w-auto"
            >
              {/* Platform live */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl self-start lg:self-auto"
                style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)' }}
              >
                <div className="relative w-2 h-2 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 text-xs font-semibold tracking-wide">Platform Live</span>
              </div>

              {/* Stat cards */}
              <div className="flex gap-3">
                {heroStats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -3, transition: { duration: 0.18 } }}
                    className="flex flex-col items-center px-5 py-4 rounded-2xl cursor-default"
                    style={{
                      background: 'rgba(255,255,255,0.035)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                      minWidth: 76,
                    }}
                  >
                    {loading ? (
                      <div className="w-8 h-7 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    ) : (
                      <span
                        className="text-3xl font-bold leading-none tabular-nums"
                        style={{ fontFamily: 'Cormorant Garamond, serif', color: s.color }}
                      >
                        {s.value}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] mt-2" style={{ color: `${s.color}90` }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* View live site */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 hover:opacity-90 self-start lg:self-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.06))',
                  border: '1px solid rgba(212,175,55,0.22)',
                  color: '#d4af37',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                View Live Site
                <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="my-8" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.15) 70%, transparent)' }} />

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.18em] mb-4">Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              {heroActions.map((action, i) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                  whileHover={{ y: -2, transition: { duration: 0.16 } }}
                >
                  <Link
                    to={action.href}
                    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: action.bg,
                      border: `1px solid ${action.border}`,
                      color: action.color,
                      backdropFilter: 'blur(8px)',
                      boxShadow: `0 4px 16px ${action.color}12`,
                    }}
                  >
                    <action.Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    {action.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Phase progress strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex items-center justify-between mt-8 pt-5 flex-wrap gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-5 flex-wrap">
              {[
                { label: 'Gallery',       done: true  },
                { label: 'Testimonials',  done: true  },
                { label: 'Enquiries',     done: true  },
                { label: 'Trainings',     done: true  },
                { label: 'Payments',      done: false },
                { label: 'Blogs',         done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: item.done ? '#34d399' : 'rgba(255,255,255,0.12)' }} />
                  <span className="text-[10px] font-medium"
                    style={{ color: item.done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-5 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
              <span className="text-[10px] text-white/20 tracking-wide">Phase 1 complete</span>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {KPI_CARDS.map((card, i) => (
          <KpiCardComponent
            key={card.key}
            card={card}
            value={stats[card.key]}
            loading={loading}
            index={i}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h2
          className="text-xl font-semibold text-white mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.link} to={action.link} className="block group">
                <div
                  className="rounded-2xl p-4 h-full transition-all duration-300 group-hover:scale-[1.03]"
                  style={{
                    background: 'rgba(13,22,48,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${action.accent}18` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: action.accent }} />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">{action.label}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{action.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* Recent Registrations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Recent Registrations
          </h2>
          <Link
            to="/admin/registrations"
            className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: '#d4af37' }}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-6 rounded-full" />
                </div>
              ))}
            </div>
          ) : recentRegs.length === 0 ? (
            <div className="p-12 text-center text-white/30 text-sm">
              No registrations yet.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {recentRegs.map((reg) => (
                <div
                  key={reg.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}
                  >
                    {reg.full_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + training */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{reg.full_name}</div>
                    <div className="text-xs text-white/40 truncate mt-0.5">
                      {reg.training_title ?? '—'}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-white/35 flex-shrink-0 hidden sm:block">
                    {formatRegistrationDate(reg.registered_at)}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <StatusBadge status={reg.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
