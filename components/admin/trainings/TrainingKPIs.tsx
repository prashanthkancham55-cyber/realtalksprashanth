import { motion } from 'framer-motion';
import { BookOpen, Zap, CalendarClock, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Training } from './data';

interface Props {
  trainings: Training[];
}

export default function TrainingKPIs({ trainings }: Props) {
  const total     = trainings.length;
  const active    = trainings.filter((t) => t.status === 'Active').length;
  const upcoming  = trainings.filter((t) => t.status === 'Upcoming').length;
  const completed = trainings.filter((t) => t.status === 'Completed').length;

  const kpis = [
    {
      label:     'Total Trainings',
      value:     String(total),
      sub:       'All programs',
      icon:      BookOpen,
      iconColor: '#60a5fa',
      iconBg:    'rgba(96,165,250,0.1)',
      trendUp:   total > 0,
      trendLabel: 'Programs registered',
    },
    {
      label:     'Active',
      value:     String(active),
      sub:       'Currently running',
      icon:      Zap,
      iconColor: '#4ade80',
      iconBg:    'rgba(74,222,128,0.1)',
      trendUp:   active > 0,
      trendLabel: 'In progress now',
    },
    {
      label:     'Upcoming',
      value:     String(upcoming),
      sub:       'Scheduled ahead',
      icon:      CalendarClock,
      iconColor: '#d4af37',
      iconBg:    'rgba(212,175,55,0.1)',
      trendUp:   upcoming > 0,
      trendLabel: 'In the pipeline',
    },
    {
      label:     'Completed',
      value:     String(completed),
      sub:       'Successfully delivered',
      icon:      CheckCircle2,
      iconColor: '#fb923c',
      iconBg:    'rgba(251,146,60,0.1)',
      trendUp:   completed > 0,
      trendLabel: 'All time',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.18 } }}
            className="relative rounded-2xl p-5 group overflow-hidden cursor-default"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 20% 20%, ${kpi.iconBg} 0%, transparent 65%)` }}
            />
            <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${kpi.iconColor}55, transparent)` }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: kpi.iconBg, border: `1px solid ${kpi.iconColor}22`, boxShadow: `0 4px 12px ${kpi.iconColor}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.iconColor }} />
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
                  style={kpi.trendUp
                    ? { color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }
                    : { color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  <TrendingUp className="w-2.5 h-2.5" />
                  {kpi.value}
                </div>
              </div>

              <p
                className="text-white font-bold leading-none tracking-tight mb-1.5"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
              >
                {kpi.value}
              </p>
              <p className="text-white/40 text-xs font-medium">{kpi.label}</p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-white/25 text-[10px]">{kpi.sub}</span>
                <span className="text-[10px] font-medium" style={{ color: `${kpi.iconColor}99` }}>{kpi.trendLabel}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
