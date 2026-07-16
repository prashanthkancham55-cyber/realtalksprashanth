'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import WelcomeHero from '@/components/admin/dashboard/WelcomeHero';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityTimeline from '@/components/admin/dashboard/ActivityTimeline';
import UpcomingTrainings from '@/components/admin/dashboard/UpcomingTrainings';
import DashboardInsights from '@/components/admin/dashboard/DashboardInsights';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-2xl animate-pulse"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
        />
      ))}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div
      className="rounded-3xl h-64 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    />
  );
}

export default function DashboardPage() {
  const [galleryCount, setGalleryCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const [
        { count: gc },
        { count: tc },
        { count: ec },
        { data: { session } },
      ] = await Promise.all([
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
        supabase.auth.getSession(),
      ]);
      setGalleryCount(gc ?? 0);
      setTestimonialCount(tc ?? 0);
      setEnquiryCount(ec ?? 0);
      setUserEmail(session?.user?.email ?? 'Admin');
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-6">

      {/* 1. Welcome Hero */}
      {loading ? <HeroSkeleton /> : (
        <WelcomeHero
          userEmail={userEmail}
          galleryCount={galleryCount}
          testimonialCount={testimonialCount}
          enquiryCount={enquiryCount}
        />
      )}

      {/* 2. Statistics Cards */}
      <section>
        <div className="mb-5">
          <h3
            className="text-white font-bold text-xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Platform Overview
          </h3>
          <p className="text-white/30 text-xs mt-0.5">Live metrics across your platform</p>
        </div>
        {loading ? <StatsSkeleton /> : (
          <StatsGrid galleryCount={galleryCount} testimonialCount={testimonialCount} />
        )}
      </section>

      {/* 3. Quick Actions */}
      <QuickActions />

      {/* 4 + 5. Two-column layout on large screens */}
      <div className="grid xl:grid-cols-[1fr_420px] gap-10">
        {/* Upcoming Trainings */}
        <UpcomingTrainings />
        {/* Activity Timeline */}
        <ActivityTimeline />
      </div>

      {/* 6. Dashboard Insights */}
      <DashboardInsights />
    </div>
  );
}
