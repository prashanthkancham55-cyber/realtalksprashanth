'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, ChevronDown, ArrowRight } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { Clock, Users, BookOpen } from 'lucide-react';

const stats = [
  { icon: Clock,    value: 9,     suffix: '+', label: 'Years Experience' },
  { icon: Users,    value: 25000, suffix: '+', label: 'People Trained' },
  { icon: BookOpen, value: 500,   suffix: '+', label: 'Training Sessions' },
];

const roles = [
  'Corporate Trainer',
  'Sales Trainer',
  'Leadership Coach',
  'Motivational Speaker',
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.2 + i * 0.14, duration: 0.75, ease: 'easeOut' as const },
  }),
};

export default function Hero() {
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #030e1f 0%, #061326 55%, #0B1E3A 100%)' }}
    >
      {/* ── Atmospheric glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-12"
          style={{ background: 'radial-gradient(circle, rgba(224,192,64,0.35) 0%, transparent 70%)' }} />
      </div>

      {/* ── Grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(224,192,64,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(224,192,64,0.8) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 2 === 0 ? '4px' : '2px',
              height: i % 2 === 0 ? '4px' : '2px',
              background: i % 3 === 0 ? '#7C3AED' : '#E0C040',
              left: `${5 + i * 11}%`,
              top: `${15 + (i % 5) * 15}%`,
              opacity: 0.4,
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
          />
        ))}
      </div>

      {/* ── Speaker image — full-height right panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 1.0, ease: 'easeOut' }}
        className="absolute right-0 top-0 bottom-0 hidden lg:block"
        style={{ width: '48%' }}
      >
        {/* Soft purple+gold glow behind the speaker */}
        <div
          className="absolute inset-0 blur-3xl opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 70% at 55% 50%, rgba(124,58,237,0.45) 0%, rgba(224,192,64,0.15) 55%, transparent 100%)',
          }}
        />

        {/* Speaker image */}
        <div className="relative w-full h-full">
          <Image
            src="/images/Untitled_design_20260705_122855_0000 copy copy.png"
            alt="Prashanth — Corporate Trainer & Keynote Speaker"
            fill
            className="object-cover object-top"
            priority
            quality={95}
            sizes="48vw"
          />

          {/* Left-edge gradient — blends image into background */}
          <div
            className="absolute inset-y-0 left-0 w-48 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #061326 0%, rgba(6,19,38,0.7) 40%, transparent 100%)' }}
          />
          {/* Bottom-edge gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: 'linear-gradient(0deg, #030e1f 0%, rgba(3,14,31,0.5) 50%, transparent 100%)' }}
          />
        </div>

        {/* Floating badge — 9+ Years */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-4 top-1/3 glass-card-gold rounded-xl px-4 py-3 shadow-gold z-10"
        >
          <div className="text-xl font-bold gold-text heading-display">9+</div>
          <div className="text-xs text-white/70 whitespace-nowrap">Years Expert</div>
        </motion.div>

        {/* Floating badge — 25K+ */}
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute right-8 top-2/3 glass-card rounded-xl px-4 py-3 z-10"
          style={{ border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <div className="text-xl font-bold text-white heading-display">25K+</div>
          <div className="text-xs text-white/60 whitespace-nowrap">Trained</div>
        </motion.div>
      </motion.div>

      {/* ── Left content ── */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 lg:pt-24 pb-16">
          <div className="lg:max-w-[52%]">

            {/* Badge row */}
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #7C3AED, #E0C040)' }} />
              <span className="section-label tracking-[0.25em]">SPEAK • INSPIRE • TRANSFORM</span>
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, #E0C040, #7C3AED)' }} />
            </motion.div>

            {/* Main heading */}
            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="heading-hero text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] text-white mb-5 leading-[1.08]"
            >
              Transform Your{' '}
              <span className="gold-text">Team.</span>
              <br />
              Transform Your{' '}
              <span className="gold-text">Business.</span>
            </motion.h1>

            {/* Role badges */}
            <motion.div
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-wrap gap-2 mb-6"
            >
              {roles.map((role, i) => (
                <span
                  key={role}
                  className="px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    background: i % 2 === 0 ? 'rgba(224,192,64,0.08)' : 'rgba(124,58,237,0.08)',
                    border: `1px solid ${i % 2 === 0 ? 'rgba(224,192,64,0.3)' : 'rgba(124,58,237,0.3)'}`,
                    color: i % 2 === 0 ? '#E0C040' : '#a78bfa',
                  }}
                >
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Description — updated text */}
            <motion.p
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="text-base lg:text-lg leading-relaxed mb-8 max-w-[520px]"
              style={{ color: '#C8D0DC' }}
            >
              Helping organizations, entrepreneurs, and professionals build high-performing teams,
              increase sales, and develop exceptional leaders through practical, results-driven training.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-gold flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold"
              >
                <Phone className="w-5 h-5" />
                Book a Free Discovery Call
              </button>
              <button
                onClick={() => scrollTo('#programs')}
                className="btn-outline-gold flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold"
              >
                View Programs
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: 'easeOut' }}
              className="grid grid-cols-3 gap-3 max-w-sm"
            >
              {stats.map(({ icon: Icon, value, suffix, label }) => (
                <div key={label} className="stat-card flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                  >
                    <Icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
                  </div>
                  <div className="heading-hero text-xl sm:text-2xl font-bold gold-text">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-xs font-medium text-center leading-tight" style={{ color: '#8a95a6' }}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Mobile speaker image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="lg:hidden mt-10 relative rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(224,192,64,0.2)' }}
            >
              <Image
                src="/images/Untitled_design_20260705_122855_0000 copy copy.png"
                alt="Prashanth — Corporate Trainer & Keynote Speaker"
                width={600}
                height={500}
                className="w-full h-auto object-cover object-top"
                quality={90}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(0deg, rgba(6,19,38,0.6) 0%, transparent 60%)' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'rgba(224,192,64,0.5)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
