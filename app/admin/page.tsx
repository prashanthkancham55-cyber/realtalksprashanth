'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getRegistrationTotalCount } from '@/lib/registrationService';
import WelcomeHero       from '@/components/admin/dashboard/WelcomeHero';
import StatsGrid         from '@/components/admin/dashboard/StatsGrid';
import QuickActions      from '@/components/admin/dashboard/QuickActions';
import ActivityTimeline  from '@/components/admin/dashboard/ActivityTimeline';
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

interface DashboardStats {
  galleryCount:     number;
  testimonialCount: number;
  enquiryCount:     number;
  trainingCount:    number;
  upcomingCount:    number;
  totalRevenue:     number;
  studentCount:     number;
  userEmail:        string;
}

const EMPTY_STATS: DashboardStats = {
  galleryCount:     0,
  testimonialCount: 0,
  enquiryCount:     0,
  trainingCount:    0,
  upcomingCount:    0,
  totalRevenue:     0,
  studentCount:     0,
  userEmail:        '',
};

export default function DashboardPage() {
  const [stats,   setStats]   = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const today = new Date().toISOString().slice(0, 10);

      const [
        { count: gc },
        { count: tc },
        { count: ec },
        { count: trainingTotal },
        { count: upcomingTotal },
        { data: trainingData },
        { data: { session } },
        studentTotal,
      ] = await Promise.all([
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('trainings').select('*', { count: 'exact', head: true }),
        supabase
          .from('trainings')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', today)
          .in('status', ['Active', 'Upcoming']),
        // Fetch price × (total_seats - available_seats) to compute revenue
        supabase
          .from('trainings')
          .select('price, total_seats, available_seats')
          .eq('status', 'Completed'),
        supabase.auth.getSession(),
        getRegistrationTotalCount(),
      ]);

      // Revenue = sum of (price × seats_filled) for completed trainings
      const totalRevenue = (trainingData ?? []).reduce(
        (sum, t) => sum + (t.price * (t.total_seats - t.available_seats)),
        0,
      );

      setStats({
        galleryCount:     gc ?? 0,
        testimonialCount: tc ?? 0,
        enquiryCount:     ec ?? 0,
        trainingCount:    trainingTotal ?? 0,
        upcomingCount:    upcomingTotal ?? 0,
        totalRevenue,
        studentCount:     studentTotal,
        userEmail:        session?.user?.email ?? 'Admin',
      });
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-6">

      {/* 1. Welcome Hero */}
      {loading ? <HeroSkeleton /> : (
        <WelcomeHero
          userEmail={stats.userEmail}
          galleryCount={stats.galleryCount}
          testimonialCount={stats.testimonialCount}
          enquiryCount={stats.enquiryCount}
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
          <StatsGrid
            galleryCount={stats.galleryCount}
            testimonialCount={stats.testimonialCount}
            trainingCount={stats.trainingCount}
            upcomingCount={stats.upcomingCount}
            totalRevenue={stats.totalRevenue}
            studentCount={stats.studentCount}
          />
        )}
      </section>

      {/* 3. Quick Actions */}
      <QuickActions />

      {/* 4 + 5. Two-column layout on large screens */}
      <div className="grid xl:grid-cols-[1fr_420px] gap-10">
        {/* Upcoming Trainings — self-fetches live data */}
        <UpcomingTrainings />
        {/* Activity Timeline */}
        <ActivityTimeline />
      </div>

      {/* 6. Dashboard Insights */}
      <DashboardInsights />
    </div>
  );
}
