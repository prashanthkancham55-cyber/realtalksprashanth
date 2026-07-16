'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityTimeline from '@/components/admin/dashboard/ActivityTimeline';

export default function DashboardPage() {
  const [galleryCount, setGalleryCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: gc }, { count: tc }] = await Promise.all([
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      ]);
      setGalleryCount(gc ?? 0);
      setTestimonialCount(tc ?? 0);
      setLoadingCounts(false);
    };
    fetchCounts();
  }, []);

  const now = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={LayoutDashboard}
        iconColor="#d4af37"
        iconBg="rgba(212,175,55,0.1)"
        title="Dashboard"
        description={`Welcome back — ${now}`}
      />

      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden px-6 py-5 md:px-8 md:py-7"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 50%, rgba(30,58,110,0.15) 100%)',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-56 h-56 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 opacity-6 pointer-events-none" style={{ background: 'radial-gradient(circle, #1e3a6e 0%, transparent 70%)' }} />

        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-xs font-semibold uppercase tracking-widest">Phase 1 — Foundation</span>
            </div>
            <h2 className="text-white text-xl md:text-2xl font-bold leading-snug" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              RealTalks Prashanth
            </h2>
            <p className="text-white/50 text-sm mt-1 max-w-lg">
              Your admin dashboard is live. Gallery, Testimonials, and Enquiries are ready to manage. Training, Payments, and more are coming in Phase 2.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white font-bold text-lg leading-none">{loadingCounts ? '—' : galleryCount}</p>
              <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">Gallery</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white font-bold text-lg leading-none">{loadingCounts ? '—' : testimonialCount}</p>
              <p className="text-white/40 text-[10px] mt-1 uppercase tracking-wider">Reviews</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {!loadingCounts && (
        <StatsGrid galleryCount={galleryCount} testimonialCount={testimonialCount} />
      )}
      {loadingCounts && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity Timeline */}
      <ActivityTimeline />
    </div>
  );
}
