'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const clients = [
  { name: 'BBG',                    initials: 'BBG',  accent: '#E0C040' },
  { name: 'Aduri Group',            initials: 'AG',   accent: '#a78bfa' },
  { name: 'Sunrise Infra',          initials: 'SI',   accent: '#E0C040' },
  { name: 'Eeshanya',               initials: 'ESH',  accent: '#a78bfa' },
  { name: 'Akhanda Properties',     initials: 'AP',   accent: '#E0C040' },
  { name: 'Safe Shop',              initials: 'SS',   accent: '#a78bfa' },
  { name: 'Mugdha',                 initials: 'MG',   accent: '#E0C040' },
  { name: 'Sai Priya Construction', initials: 'SPC',  accent: '#a78bfa' },
];

function ClientCard({ name, initials, accent }: { name: string; initials: string; accent: string }) {
  return (
    <div
      className="group flex-shrink-0 flex flex-col items-center justify-center gap-3 px-7 py-5 rounded-2xl cursor-default transition-all duration-400 select-none"
      style={{
        width: '190px',
        background: 'rgba(11,30,58,0.55)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Monogram circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-400"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1.5px solid rgba(255,255,255,0.10)',
        }}
      >
        {/* Greyscale state */}
        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs tracking-wider text-white/30 group-hover:opacity-0 transition-opacity duration-400">
          {initials}
        </span>
        {/* Colour state */}
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-400"
          style={{ color: accent }}
        >
          {initials}
        </span>
      </div>

      {/* Name */}
      <p className="text-center text-xs font-semibold leading-tight transition-colors duration-400 text-white/30 group-hover:text-white/90">
        {name}
      </p>

      {/* Bottom accent line */}
      <div
        className="h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
    </div>
  );
}

export default function Clients() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-80px' });

  const doubled = [...clients, ...clients];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)', paddingTop: '5rem', paddingBottom: '5rem' }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse, rgba(224,192,64,0.6) 0%, transparent 70%)' }}
      />

      {/* Section header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #E0C040)' }} />
            <span className="section-label">OUR CLIENTS</span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #E0C040, transparent)' }} />
          </div>
          <h2 className="heading-display text-3xl sm:text-4xl text-white mb-2">
            Trusted By{' '}
            <span className="gold-text">Leading Organizations</span>
          </h2>
          <p className="text-white/45 text-sm max-w-lg mx-auto">
            Partnering with forward-thinking companies to build teams that excel.
          </p>
        </motion.div>
      </div>

      {/* Infinite carousel track */}
      <div className="relative">
        {/* Edge fades */}
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #050b18 0%, transparent 100%)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #050b18 100%)' }}
        />

        <div className="overflow-hidden">
          <div className="marquee-track flex gap-4 w-max">
            {doubled.map(({ name, initials, accent }, i) => (
              <ClientCard key={`${name}-${i}`} name={name} initials={initials} accent={accent} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="text-center text-white/25 text-xs mt-10 tracking-widest uppercase"
      >
        And many more growing organizations across India
      </motion.p>
    </section>
  );
}
