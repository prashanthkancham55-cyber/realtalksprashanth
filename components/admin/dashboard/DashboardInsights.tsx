'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, IndianRupee, BarChart3, Lock } from 'lucide-react';

interface InsightBar {
  label: string;
  sublabel: string;
  value: number;
  displayValue: string;
  target: string;
  color: string;
  trackColor: string;
  icon: typeof TrendingUp;
  note: string;
}

const INSIGHTS: InsightBar[] = [
  {
    label: 'Monthly Growth',
    sublabel: 'Trainings this month vs last',
    value: 0,
    displayValue: '0%',
    target: '100% target',
    color: 'linear-gradient(90deg, #60a5fa, #38bdf8)',
    trackColor: 'rgba(96,165,250,0.1)',
    icon: TrendingUp,
    note: 'Will populate when trainings are active',
  },
  {
    label: 'Registration Progress',
    sublabel: 'Seats filled across open trainings',
    value: 0,
    displayValue: '0 / 0',
    target: '0 seats available',
    color: 'linear-gradient(90deg, #4ade80, #34d399)',
    trackColor: 'rgba(74,222,128,0.1)',
    icon: Users,
    note: 'Launches with Training Management in Phase 2',
  },
  {
    label: 'Revenue Progress',
    sublabel: 'Monthly target achievement',
    value: 0,
    displayValue: '₹0',
    target: '₹0 collected',
    color: 'linear-gradient(90deg, #d4af37, #f0c040)',
    trackColor: 'rgba(212,175,55,0.1)',
    icon: IndianRupee,
    note: 'Activates with Payment Gateway in Phase 2',
  },
];

function AnimatedBar({ value, color, delay = 0 }: { value: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const timeout = setTimeout(() => setWidth(value), delay + 200);
      return () => clearTimeout(timeout);
    }
  }, [value, delay]);

  return (
    <div
      className="relative h-2.5 w-full rounded-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    >
      {/* Track shimmer */}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${Math.max(width, 2)}%`, background: color }}
      />
      {/* Gloss */}
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${Math.max(width, 2)}%`, background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)' }}
      />
    </div>
  );
}

export default function DashboardInsights() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-bold text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Dashboard Insights
          </h3>
          <p className="text-white/30 text-xs mt-0.5">Performance metrics &amp; growth indicators</p>
        </div>
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-white/20" />
          <span className="text-white/20 text-[10px] font-medium uppercase tracking-wider">Sample Data</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {INSIGHTS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-5 overflow-hidden group"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              {/* Background track glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 10% 80%, ${item.trackColor} 0%, transparent 65%)` }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/70 text-sm font-semibold">{item.label}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{item.sublabel}</p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.trackColor }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white/40" />
                  </div>
                </div>

                {/* Value */}
                <div className="mb-4">
                  <p
                    className="text-white font-bold text-2xl leading-none"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {item.displayValue}
                  </p>
                  <p className="text-white/25 text-[10px] mt-1">{item.target}</p>
                </div>

                {/* Progress bar */}
                <AnimatedBar value={item.value} color={item.color} delay={i * 100} />

                {/* Percentage */}
                <div className="flex items-center justify-between mt-2.5">
                  <p className="text-white/20 text-[10px] leading-snug">{item.note}</p>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <Lock className="w-2.5 h-2.5 text-white/20" />
                    <span className="text-white/20 text-[9px] font-semibold">Phase 2</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
