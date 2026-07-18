'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sun, Sunset, Moon, BookOpen, Users, Image as ImageIcon,
  ArrowUpRight, Sparkles, Activity,
} from 'lucide-react';

interface Props {
  userEmail: string;
  galleryCount: number;
  testimonialCount: number;
  enquiryCount: number;
}

function getGreeting(): { text: string; icon: typeof Sun; color: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good Morning', icon: Sun, color: '#f0c040' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', icon: Sunset, color: '#fb923c' };
  return { text: 'Good Evening', icon: Moon, color: '#93c5fd' };
}

const QUICK_ACTIONS = [
  {
    label: 'Add Training',
    href: '/admin/trainings',
    icon: BookOpen,
    color: '#60a5fa',
    border: 'rgba(96,165,250,0.25)',
    bg: 'rgba(96,165,250,0.10)',
  },
  {
    label: 'View Registrations',
    href: '/admin/registrations',
    icon: Users,
    color: '#34d399',
    border: 'rgba(52,211,153,0.25)',
    bg: 'rgba(52,211,153,0.10)',
  },
  {
    label: 'Manage Gallery',
    href: '/admin/gallery',
    icon: ImageIcon,
    color: '#d4af37',
    border: 'rgba(212,175,55,0.25)',
    bg: 'rgba(212,175,55,0.10)',
  },
];

const MOTIVATIONAL = [
  'Every great journey starts with a single step. Keep building.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'Your training is transforming lives. Keep leading with purpose.',
  'Excellence is not a destination — it\'s a continuous journey.',
];

// Lightweight animated counter
function Counter({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let start = 0;
    const step = Math.ceil(to / 28);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 32);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}</>;
}

export default function WelcomeHero({ userEmail, galleryCount, testimonialCount, enquiryCount }: Props) {
  const { text: greeting, icon: GreetIcon, color: greetColor } = getGreeting();
  const [quote] = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      );
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const stats = [
    { label: 'Gallery',   value: galleryCount,     color: '#38bdf8' },
    { label: 'Reviews',   value: testimonialCount,  color: '#4ade80' },
    { label: 'Enquiries', value: enquiryCount,      color: '#fb923c' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(140deg, #0a1628 0%, #070e1e 55%, #0d1a30 100%)',
        border: '1px solid rgba(212,175,55,0.14)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold radial — top right */}
        <div
          className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, transparent 62%)', filter: 'blur(2px)' }}
        />
        {/* Navy radial — bottom left */}
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.18) 0%, transparent 65%)' }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Gold shimmer top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.55) 50%, transparent 95%)' }}
        />
        {/* Bottom edge divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.12) 50%, transparent 95%)' }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10">

        {/* ── TOP STRIP ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">

          {/* LEFT: Identity block */}
          <div className="flex-1 min-w-0">

            {/* Greeting pill */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{
                background: `${greetColor}10`,
                border: `1px solid ${greetColor}30`,
              }}
            >
              <GreetIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: greetColor }} />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: greetColor }}>
                {greeting}
              </span>
              {currentTime && (
                <span className="text-white/25 text-xs tabular-nums">{currentTime}</span>
              )}
            </motion.div>

            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              <p className="text-white/40 text-sm font-medium tracking-wide mb-1.5 uppercase tracking-[0.12em]">
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
                    fontSize: '0.62em',
                    letterSpacing: '0.02em',
                  }}
                >
                  RealTalks Platform
                </span>
              </h1>
            </motion.div>

            {/* Motivational quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.6 }}
              className="text-white/35 text-sm leading-[1.75] max-w-[38ch] mb-7"
            >
              {quote}
            </motion.p>

            {/* Date row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.46 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-4 h-px"
                style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }}
              />
              <span className="text-white/25 text-[11px] tracking-wide">{today}</span>
            </motion.div>
          </div>

          {/* RIGHT: Stats + live badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 lg:items-end w-full lg:w-auto"
          >
            {/* Platform live badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl self-start lg:self-auto"
              style={{
                background: 'rgba(52,211,153,0.07)',
                border: '1px solid rgba(52,211,153,0.18)',
              }}
            >
              <div className="relative w-2 h-2 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">Platform Live</span>
            </div>

            {/* Featured stat cards — glassmorphism */}
            <div className="flex gap-3">
              {stats.map((s, i) => (
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
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    minWidth: 76,
                  }}
                >
                  <span
                    className="text-3xl font-bold leading-none tabular-nums"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: s.color }}
                  >
                    <Counter to={s.value} />
                  </span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] mt-2"
                    style={{ color: `${s.color}90` }}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* View Live Site CTA */}
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

        {/* ── DIVIDER ── */}
        <div
          className="my-8"
          style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(212,175,55,0.15) 70%, transparent)' }}
        />

        {/* ── QUICK ACTIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.18em] mb-4">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                  whileHover={{ y: -2, transition: { duration: 0.16 } }}
                >
                  <Link
                    href={action.href}
                    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: action.bg,
                      border: `1px solid ${action.border}`,
                      color: action.color,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      boxShadow: `0 4px 16px ${action.color}12`,
                    }}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    {action.label}
                    <ArrowUpRight
                      className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── BOTTOM PHASE STRIP ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="flex items-center justify-between mt-8 pt-5 flex-wrap gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { label: 'Gallery',      done: true },
              { label: 'Testimonials', done: true },
              { label: 'Enquiries',    done: true },
              { label: 'Trainings',    done: true },
              { label: 'Payments',     done: false },
              { label: 'Blogs',        done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: item.done ? '#34d399' : 'rgba(255,255,255,0.12)' }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: item.done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }}
            />
            <span className="text-[10px] text-white/20 hidden sm:block tracking-wide">Phase 1 complete</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
