'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquareOff } from 'lucide-react';
import { supabase, type Testimonial } from '@/lib/supabase';

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < count ? 'fill-gold-500 text-gold-500' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setTestimonials(data);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  const go = (dir: number) => {
    if (testimonials.length === 0) return;
    setDirection(dir);
    setActive((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[active];

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1630 50%, #0a0f1e 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-96 h-96 rounded-full blur-3xl opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)' }}
        />
      </div>

      <div className="container-max" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="section-label">TESTIMONIALS</span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">
            Words from Those{' '}
            <span className="gold-text">Transformed</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Real stories from real professionals who experienced the RealTalks difference.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-2xl animate-pulse"
              style={{ height: '280px', background: 'rgba(255,255,255,0.04)' }}
            />
          </div>
        ) : testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border border-dashed border-white/10"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <MessageSquareOff className="w-7 h-7 text-gold-500/60" />
            </div>
            <p className="text-white/50 text-base font-medium">Be the first to review.</p>
            <p className="text-white/25 text-sm">Share your experience with RealTalks Prashanth.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="testimonial-card relative overflow-hidden">
              <Quote className="absolute top-6 right-8 w-16 h-16 text-gold-500/10" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 60 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex flex-col gap-6"
                >
                  <p className="text-white/80 text-lg leading-relaxed relative z-10 italic">
                    &ldquo;{current.review}&rdquo;
                  </p>

                  <StarRating count={current.rating} />

                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    {current.photo_url ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold-500/30 flex-shrink-0">
                        <img
                          src={current.photo_url}
                          alt={current.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center ring-2 ring-gold-500/30 flex-shrink-0"
                        style={{ background: 'rgba(212,175,55,0.12)' }}
                      >
                        <span className="text-gold-400 text-xl font-bold heading-display">
                          {current.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold text-base">{current.name}</div>
                      {current.designation && (
                        <div className="text-gold-500 text-sm">{current.designation}</div>
                      )}
                      {current.company && (
                        <div className="text-white/50 text-sm">{current.company}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className={`transition-all duration-300 rounded-full ${
                      i === active ? 'w-8 h-2 bg-gold-500' : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => go(-1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 text-white/70 hover:text-gold-400 hover:border-gold-500/50 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/15 text-white/70 hover:text-gold-400 hover:border-gold-500/50 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center gap-4 mt-10 flex-wrap">
                {testimonials.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className={`transition-all duration-300 ring-2 rounded-full ${
                      i === active ? 'ring-gold-500 scale-110' : 'ring-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(212,175,55,0.12)' }}
                      >
                        <span className="text-gold-400 font-bold">{t.name.charAt(0)}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
