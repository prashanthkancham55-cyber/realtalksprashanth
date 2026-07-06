'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, ArrowRight, Sparkles } from 'lucide-react';

export default function BookCall() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-32 sm:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Rich background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #050b18 0%, #0d1630 40%, #111d3c 70%, #0a0f1e 100%)'
      }} />

      {/* Gold radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)' }} />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-500"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              opacity: 0.2 + (i % 4) * 0.1,
            }}
            animate={{ y: [-8, 8, -8], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />
      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30"
            style={{ background: 'rgba(212,175,55,0.08)' }}>
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="section-label text-xs">FREE DISCOVERY CALL</span>
            <Sparkles className="w-4 h-4 text-gold-500" />
          </div>

          <h2 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Ready To Transform
            <br />
            <span className="gold-text">Your Team?</span>
          </h2>

          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Let&apos;s discuss how I can help your team achieve extraordinary business growth.
            No obligation, just a genuine conversation about your goals.
          </p>

          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-3 px-10 py-5 rounded-full text-lg font-semibold shadow-gold-lg"
          >
            <Phone className="w-5 h-5" />
            Book a Free Discovery Call
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <p className="text-white/40 text-sm">
            100% Free • No commitment • Available online & in-person
          </p>
        </motion.div>
      </div>
    </section>
  );
}
