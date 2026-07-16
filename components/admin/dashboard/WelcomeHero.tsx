'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Sparkles, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  userEmail: string;
  galleryCount: number;
  testimonialCount: number;
  enquiryCount: number;
}

function getGreeting(): { text: string; icon: typeof Sun; color: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good Morning', icon: Sun, color: '#fbbf24' };
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', icon: Sunset, color: '#fb923c' };
  return { text: 'Good Evening', icon: Moon, color: '#a78bfa' };
}

const MOTIVATIONAL = [
  'Every great journey starts with a single step. Keep building.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'Your training is transforming lives. Keep leading with purpose.',
  'Excellence is not a destination — it\'s a continuous journey.',
];

export default function WelcomeHero({ userEmail, galleryCount, testimonialCount, enquiryCount }: Props) {
  const { text: greeting, icon: GreetIcon, color: greetColor } = getGreeting();
  const adminName = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const [quote] = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    tick();
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(13,22,45,0.98) 0%, rgba(8,14,32,0.98) 100%)',
        border: '1px solid rgba(212,175,55,0.12)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Layered background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold radial glow top-right */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 65%)' }}
        />
        {/* Blue glow bottom-left */}
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1e3a6e 0%, transparent 65%)' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Shimmer streak */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-40"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)' }}
        />
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left — greeting block */}
          <div className="flex-1">
            {/* Greeting pill */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
              style={{
                background: `${greetColor}12`,
                border: `1px solid ${greetColor}28`,
              }}
            >
              <GreetIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: greetColor }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: greetColor }}>
                {greeting}
              </span>
              <span className="text-white/30 text-xs ml-1">{currentTime}</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {adminName}
              <span
                className="block text-2xl md:text-3xl font-normal mt-0.5"
                style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37 60%, #c4a020)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                RealTalks Prashanth
              </span>
            </motion.h1>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-white/40 text-sm leading-relaxed max-w-md mb-6"
            >
              {quote}
            </motion.p>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-gold-400/60" />
              <span className="text-white/30 text-xs">{today}</span>
            </motion.div>
          </div>

          {/* Right — live metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row lg:flex-col gap-3 flex-wrap lg:flex-nowrap"
          >
            {/* Platform health badge */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
              style={{
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.15)',
              }}
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
              </div>
              <span className="text-emerald-300 text-xs font-semibold">Platform Live</span>
            </div>

            {/* Metric pills */}
            <div className="flex gap-2.5">
              {[
                { label: 'Gallery', value: galleryCount, color: '#38bdf8' },
                { label: 'Reviews', value: testimonialCount, color: '#4ade80' },
                { label: 'Enquiries', value: enquiryCount, color: '#fb923c' },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl min-w-[72px]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-2xl font-bold text-white leading-none" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {m.value}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider mt-1.5" style={{ color: `${m.color}99` }}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all hover:opacity-90 group"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06))',
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#d4af37',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Live Site
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Bottom strip — phase indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between mt-8 pt-6 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: 'Gallery', done: true },
              { label: 'Testimonials', done: true },
              { label: 'Enquiries', done: true },
              { label: 'Trainings', done: false },
              { label: 'Payments', done: false },
              { label: 'Blogs', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-white/15'}`} />
                <span className={`text-[10px] font-medium ${item.done ? 'text-white/50' : 'text-white/20'}`}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TrendingUp className="w-3 h-3 text-gold-400/60" />
            <span className="text-[10px] text-white/25 hidden sm:block">Phase 1 complete</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
