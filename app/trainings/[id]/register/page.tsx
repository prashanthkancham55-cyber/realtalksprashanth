import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Training } from '@/components/admin/trainings/data';
import RegistrationForm from '@/components/public/RegistrationForm';

interface PageProps {
  params: { id: string };
}

export const revalidate = 60;

async function fetchTraining(id: string): Promise<Training | null> {
  const { data } = await supabase
    .from('trainings')
    .select('*')
    .eq('id', id)
    .in('status', ['Active', 'Upcoming'])
    .maybeSingle();
  return data as Training | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const training = await fetchTraining(params.id);
  if (!training) return { title: 'Not Found' };
  return {
    title: `Register — ${training.title} | RealTalks Prashanth`,
    description: `Register for ${training.title} by ${training.trainer_name}.`,
  };
}

export default async function RegisterPage({ params }: PageProps) {
  const training = await fetchTraining(params.id);
  if (!training) notFound();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #020810 0%, #0d1630 100%)' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-30 px-4 py-4"
        style={{ background: 'rgba(2,8,16,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/trainings"
            className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <span className="text-gold-400 font-bold text-xs">RT</span>
            </div>
            <span className="text-white/60 text-sm font-medium hidden sm:block">RealTalks Prashanth</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <RegistrationForm training={training} />
      </div>
    </div>
  );
}
