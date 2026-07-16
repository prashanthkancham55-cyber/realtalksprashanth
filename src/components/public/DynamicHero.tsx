import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Monitor,
  Users,
  Briefcase,
  Clock,
  ChevronRight,
  ArrowRight,
  Star,
} from 'lucide-react';
import type { Training } from '../../types/training';
import { formatDate, formatPrice } from '../../types/training';

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

// ── Mode icon helper ──────────────────────────────────────────────────────────
function ModeIcon({ mode }: { mode: string }) {
  if (mode === 'Online')  return <Monitor  className="w-3.5 h-3.5" />;
  if (mode === 'Offline') return <Users    className="w-3.5 h-3.5" />;
  return                         <Briefcase className="w-3.5 h-3.5" />;
}

// ── Floating stat badge ───────────────────────────────────────────────────────
interface StatBadgeProps {
  value: string;
  label: string;
  icon: ReactNode;
  delay: number;
  className?: string;
}

function StatBadge({ value, label, icon, delay, className = '' }: StatBadgeProps) {
  return (
    <motion.div
      className={`absolute flex items-center gap-2.5 px-4 py-3 rounded-2xl ${className}`}
      style={{
        background: 'rgba(13,22,48,0.85)',
        border: '1px solid rgba(212,175,55,0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: 'backOut' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(212,175,55,0.15)', color: '#f0c040' }}
      >
        {icon}
      </div>
      <div className="leading-none">
        <p
          className="text-lg font-bold"
          style={{
            background: 'linear-gradient(135deg, #d4af37, #f0c040)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
      </div>
    </motion.div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface DynamicHeroProps {
  heroTraining: Training | null;
}

export default function DynamicHero({ heroTraining }: DynamicHeroProps) {
  return heroTraining
    ? <TrainingHero training={heroTraining} />
    : <FallbackHero />;
}

// ═════════════════════════════════════════════════════════════════════════════
// Training Hero (when a training is marked show_in_hero=true)
// ═════════════════════════════════════════════════════════════════════════════
function TrainingHero({ training }: { training: Training }) {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      {training.banner_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${training.banner_url})` }}
        />
      )}

      {/* Dark overlay layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(2,8,16,0.88) 0%, rgba(5,11,24,0.75) 50%, rgba(2,8,16,0.88) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 60% 50%, rgba(212,175,55,0.06) 0%, transparent 65%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Category badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-6"
        >
          <span
            className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#f0c040',
            }}
          >
            <Star className="w-3 h-3 inline-block mr-1.5 mb-0.5" />
            {training.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <p
            className="text-lg sm:text-xl font-medium mb-2 tracking-wide"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Next Batch:
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0c040 60%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {training.title}
          </h1>
        </motion.div>

        {/* Info badges row */}
        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <span
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
            style={{
              background: 'rgba(13,22,48,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: '#f0c040' }} />
            {formatDate(training.start_date)}
          </span>

          {training.location && (
            <span
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
              style={{
                background: 'rgba(13,22,48,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <MapPin className="w-4 h-4" style={{ color: '#f0c040' }} />
              {training.location}
            </span>
          )}

          <span
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
            style={{
              background: 'rgba(13,22,48,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <ModeIcon mode={training.mode} />
            {training.mode}
          </span>

          {training.session_time && (
            <span
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
              style={{
                background: 'rgba(13,22,48,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Clock className="w-4 h-4" style={{ color: '#f0c040' }} />
              {training.session_time}
            </span>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => navigate(`/register/${training.slug}`)}
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold tracking-wide w-full sm:w-auto justify-center"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
              color: '#020810',
              boxShadow: '0 0 30px rgba(212,175,55,0.45)',
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.65)' }}
            whileTap={{ scale: 0.97 }}
          >
            Register Now
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => navigate(`/training/${training.slug}`)}
            className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold tracking-wide w-full sm:w-auto justify-center transition-colors"
            style={{
              background: 'transparent',
              border: '2px solid rgba(212,175,55,0.5)',
              color: 'rgba(255,255,255,0.85)',
            }}
            whileHover={{
              borderColor: '#f0c040',
              color: '#f0c040',
              scale: 1.04,
            }}
            whileTap={{ scale: 0.97 }}
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* ── Animated gold shimmer line at bottom ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #d4af37 40%, #f0c040 50%, #d4af37 60%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Fallback Static Hero
// ═════════════════════════════════════════════════════════════════════════════
function FallbackHero() {
  const navigate = useNavigate();

  const scrollToPrograms = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openConsultation = () => {
    window.location.href = 'mailto:prashanth@realtalks.in?subject=Book a Consultation';
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020810 0%, #050b18 50%, #0d1630 100%)' }}
    >
      {/* Radial glow accents */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(13,22,48,0.8) 0%, transparent 70%)',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Text content ────────────────────────────────────────── */}
          <div>
            {/* Label badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 mb-6"
            >
              <span
                className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
                style={{
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  color: '#f0c040',
                }}
              >
                🏆 India's #1 Corporate Trainer
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              <span className="text-white">Transform Your Career with</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Expert Training
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={0.2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Prashanth Kumar brings 15+ years of real-world corporate expertise to help
              you master sales, leadership, and communication skills that drive results.
              Join thousands of professionals who have already transformed their careers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={scrollToPrograms}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold tracking-wide justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0c040 50%, #d4af37 100%)',
                  color: '#020810',
                  boxShadow: '0 0 28px rgba(212,175,55,0.4)',
                }}
                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.6)' }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Programs
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={openConsultation}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold tracking-wide justify-center transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(212,175,55,0.4)',
                  color: 'rgba(255,255,255,0.85)',
                }}
                whileHover={{
                  borderColor: '#f0c040',
                  color: '#f0c040',
                  scale: 1.04,
                }}
                whileTap={{ scale: 0.97 }}
              >
                Book a Consultation
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* ── Right: Hero image + floating stat badges ──────────────────── */}
          <div className="relative hidden lg:block">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                boxShadow:
                  '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.15)',
              }}
            >
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Corporate training session by Prashanth Kumar"
                className="w-full h-[480px] object-cover"
              />
              {/* Gold shimmer overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%)',
                }}
              />
            </motion.div>

            {/* Floating badges */}
            <StatBadge
              value="500+"
              label="Students Trained"
              icon={<Users className="w-5 h-5" />}
              delay={0.5}
              className="-left-10 top-10"
            />
            <StatBadge
              value="50+"
              label="Corporate Clients"
              icon={<Briefcase className="w-5 h-5" />}
              delay={0.65}
              className="-right-8 top-24"
            />
            <StatBadge
              value="15+"
              label="Years Experience"
              icon={<Star className="w-5 h-5" />}
              delay={0.8}
              className="-left-8 bottom-16"
            />
          </div>
        </div>

        {/* ── Mobile stat row ───────────────────────────────────────────── */}
        <motion.div
          custom={0.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:hidden mt-12 grid grid-cols-3 gap-3"
        >
          {[
            { value: '500+', label: 'Students' },
            { value: '50+',  label: 'Corporates' },
            { value: '15+',  label: 'Yrs Exp.' },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center py-4 rounded-2xl"
              style={{
                background: 'rgba(13,22,48,0.7)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #f0c040)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Animated gold shimmer line at bottom ─────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #d4af37 40%, #f0c040 50%, #d4af37 60%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
