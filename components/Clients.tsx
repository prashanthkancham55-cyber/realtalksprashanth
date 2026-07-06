'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const clients = [
  { name: 'BBG',                  initials: 'BBG',  category: 'Business Group' },
  { name: 'Aduri Group',          initials: 'AG',   category: 'Corporate' },
  { name: 'Sunrise Infra',        initials: 'SI',   category: 'Infrastructure' },
  { name: 'Eeshanya',             initials: 'ESH',  category: 'Enterprise' },
  { name: 'Akhanda Properties',   initials: 'AP',   category: 'Real Estate' },
  { name: 'Safe Shop',            initials: 'SS',   category: 'Retail' },
  { name: 'Mugdha',               initials: 'MG',   category: 'Corporate' },
  { name: 'Sai Priya Construction', initials: 'SPC', category: 'Construction' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function Clients() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)' }}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(224,192,64,0.25) 0%, transparent 70%)' }}
      />

      <div className="container-max" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #E0C040)' }} />
            <span className="section-label">OUR CLIENTS</span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #E0C040, transparent)' }} />
          </div>
          <h2 className="heading-display text-3xl sm:text-4xl text-white mb-3">
            Trusted By{' '}
            <span className="gold-text">Leading Organizations</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Partnering with forward-thinking companies to build teams that excel and businesses that grow.
          </p>
        </motion.div>

        {/* Client logo grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {clients.map(({ name, initials, category }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              className="group relative rounded-2xl p-6 flex flex-col items-center gap-3 cursor-default transition-all duration-400"
              style={{
                background: 'rgba(11,30,58,0.55)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(224,192,64,0.06) 0%, rgba(124,58,237,0.04) 100%)' }}
              />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: '0 0 30px rgba(224,192,64,0.10)', border: '1px solid rgba(224,192,64,0.18)' }}
              />

              {/* Monogram circle — grayscale default, gold on hover */}
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                }}
              >
                <span
                  className="font-bold text-sm tracking-wider transition-colors duration-400"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {initials}
                </span>
                {/* Gold version on hover via pseudo — use a sibling trick */}
                <span
                  className="absolute inset-0 rounded-full flex items-center justify-center font-bold text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-400"
                  style={{ color: '#E0C040', background: 'rgba(224,192,64,0.08)', border: '1.5px solid rgba(224,192,64,0.3)' }}
                >
                  {initials}
                </span>
              </div>

              {/* Company name */}
              <div className="text-center relative z-10">
                <p
                  className="font-semibold text-sm leading-tight transition-colors duration-400"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <span className="group-hover:hidden">{name}</span>
                  <span className="hidden group-hover:inline" style={{ color: 'rgba(255,255,255,0.90)' }}>{name}</span>
                </p>
                <p className="text-xs mt-0.5 transition-colors duration-400"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <span className="group-hover:hidden">{category}</span>
                  <span className="hidden group-hover:inline" style={{ color: 'rgba(224,192,64,0.65)' }}>{category}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-center text-white/30 text-sm mt-10 tracking-widest uppercase"
        >
          And many more growing organizations across India
        </motion.p>
      </div>
    </section>
  );
}
