'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #050b18 0%, #0a0f1e 60%, #0d1630 100%)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative w-24 h-24">
              <Image
                src="/images/ChatGPT_Image_Jul_5,_2026,_07_56_41_AM.png"
                alt="RealTalks Prashanth"
                fill
                className="object-contain rounded-2xl"
              />
            </div>

            <div className="text-center">
              <p className="section-label mb-2">SPEAK • INSPIRE • TRANSFORM</p>
              <h1 className="heading-display text-2xl text-white">RealTalks_Prashanth</h1>
            </div>

            <div className="relative w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
