'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ImageOff } from 'lucide-react';
import { supabase, type GalleryImage } from '@/lib/supabase';

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) setImages(data);
      setLoading(false);
    }
    fetchImages();
  }, []);

  const spanClass = (i: number) => {
    if (i === 0) return 'col-span-2 row-span-2';
    if (i === 5) return 'col-span-2 row-span-1';
    return 'col-span-1 row-span-1';
  };

  return (
    <section id="gallery" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)' }}>
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
            <span className="section-label">GALLERY</span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">
            Moments of{' '}
            <span className="gold-text">Transformation</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            A glimpse into the energy, engagement and impact created in every training room.
          </p>
        </motion.div>

        {/* Gallery Content */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl ${spanClass(i)} animate-pulse`}
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border border-dashed border-white/10"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <ImageOff className="w-7 h-7 text-gold-500/60" />
            </div>
            <p className="text-white/40 text-base">No gallery images yet.</p>
            <p className="text-white/25 text-sm">Add images from the Admin Dashboard.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${spanClass(i)}`}
                onClick={() => setLightbox(img.image_url)}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all duration-400 flex items-center justify-center">
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(212,175,55,0.9)' }}
                  >
                    <ZoomIn className="w-5 h-5 text-navy-900" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold-500/40 transition-colors duration-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/95 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox} alt="Gallery" className="w-full max-h-[85vh] object-contain" />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-navy-900/90 border border-white/10 text-white hover:text-gold-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
