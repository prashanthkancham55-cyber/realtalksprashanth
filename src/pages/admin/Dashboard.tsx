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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-semibold text-white"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Welcome back — here's an overview of your platform.
        </p>
      </div>

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
