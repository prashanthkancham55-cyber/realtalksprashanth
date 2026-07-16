import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Training } from '@/components/admin/trainings/data';
import PublicTrainingsList from '@/components/public/PublicTrainingsList';

export const metadata: Metadata = {
  title: 'Training Programs | RealTalks Prashanth',
  description: 'Browse and register for upcoming corporate training programs by Prashanth Kumar.',
};

// Revalidate every 60 seconds so new trainings appear without a full deploy
export const revalidate = 60;

async function fetchPublicTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .in('status', ['Active', 'Upcoming'])
    .order('start_date', { ascending: true });
  if (error) return [];
  return (data ?? []) as Training[];
}

export default async function TrainingsPage() {
  const trainings = await fetchPublicTrainings();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #020810 0%, #0d1630 100%)' }}>
      {/* Top nav bar */}
      <header
        className="sticky top-0 z-30 px-4 py-4"
        style={{ background: 'rgba(2,8,16,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <span className="text-gold-400 font-bold text-xs">RT</span>
            </div>
            <span className="text-white/60 text-sm font-medium">RealTalks Prashanth</span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#d4af37', letterSpacing: '0.2em' }}
            >
              Upcoming Programs
            </span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
          </div>
          <h1
            className="text-white font-bold text-4xl sm:text-5xl mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Training{' '}
            <span style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Programs
            </span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Enrol in expert-led training programs designed to accelerate your career and unlock your full potential.
          </p>
        </div>

        <Suspense fallback={<TrainingsSkeleton />}>
          <PublicTrainingsList trainings={trainings} />
        </Suspense>
      </div>
    </div>
  );
}

function TrainingsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl h-72 animate-pulse"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        />
      ))}
    </div>
  );
}
