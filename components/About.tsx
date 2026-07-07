'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Award, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useBookingModal } from './BookingModal';

const highlights = [
  { icon: Award, label: '9+ Years of Excellence' },
  { icon: Users, label: '20,000+ Professionals Trained' },
  { icon: TrendingUp, label: '100+ Career Transformations' },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { openModal } = useBookingModal();

  return (
    <section id="about" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)' }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(13,22,48,0.8) 0%, transparent 70%)' }}
      />

      <div className="container-max" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 rounded-3xl border border-gold-500/20" />
              <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-gold-500/50 rounded-tl-2xl" />
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-gold-500/50 rounded-br-2xl" />

              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] w-full max-w-md mx-auto">
                <Image
                  src="/images/WhatsApp_Image_2026-07-05_at_7.53.03_AM_(3).jpeg"
                  alt="Prashanth - Corporate Trainer & Leadership Coach"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 10%' }}
                  quality={90}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(0deg, rgba(5,11,24,0.4) 0%, transparent 50%)'
                }} />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 top-1/3 glass-card-gold rounded-2xl px-5 py-4 shadow-gold"
              >
                <div className="text-2xl font-bold gold-text font-display heading-display">9+</div>
                <div className="text-xs text-white/70">Years Expert</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Section label */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="section-label">ABOUT PRASHANTH</span>
            </div>

            {/* Arena heading */}
            <p className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-1"
              style={{ color: 'rgba(224,192,64,0.80)' }}>
              A Trainer Who Has Been In The Arena
            </p>

            {/* Main heading */}
            <h2 className="heading-display text-4xl sm:text-5xl text-white leading-tight">
              Passion.
              <br />
              <span className="gold-text">Purpose.</span>
              <br />
              People.
            </h2>

            <div className="divider-gold" />

            <p className="text-white/70 text-lg leading-relaxed">
              Prashanth is a motivational speaker, corporate trainer and sales coach with over{' '}
              <span className="text-gold-400 font-semibold">9 years of experience</span>. He has trained more than{' '}
              <span className="text-gold-400 font-semibold">20,000 professionals</span> and transformed{' '}
              <span className="text-gold-400 font-semibold">100+ careers</span> through practical learning,
              leadership development and sales excellence.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-3">
              {highlights.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                    <Icon className="w-4 h-4 text-gold-500" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">{label}</span>
                </motion.div>
              ))}
            </div>

            <div className="divider-gold" />

            <button
              onClick={openModal}
              className="btn-gold self-start flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold"
            >
              Book a Discovery Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
