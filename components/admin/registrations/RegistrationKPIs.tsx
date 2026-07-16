'use client';

import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  total:     number;
  pending:   number;
  confirmed: number;
  cancelled: number;
}

export default function RegistrationKPIs({ total, pending, confirmed, cancelled }: Props) {
  const cards = [
    {
      label:     'Total Registrations',
      value:     total,
      icon:      Users,
      iconColor: '#60a5fa',
      iconBg:    'rgba(96,165,250,0.1)',
    },
    {
      label:     'Pending',
      value:     pending,
      icon:      Clock,
      iconColor: '#fbbf24',
      iconBg:    'rgba(251,191,36,0.1)',
    },
    {
      label:     'Confirmed',
      value:     confirmed,
      icon:      CheckCircle2,
      iconColor: '#4ade80',
      iconBg:    'rgba(74,222,128,0.1)',
    },
    {
      label:     'Cancelled',
      value:     cancelled,
      icon:      XCircle,
      iconColor: '#f87171',
      iconBg:    'rgba(248,113,113,0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl p-5 group overflow-hidden cursor-default"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.iconBg, border: `1px solid ${card.iconColor}22` }}
              >
                <Icon className="w-4 h-4" style={{ color: card.iconColor }} />
              </div>
            </div>
            <p
              className="text-white font-bold leading-none tracking-tight mb-1"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem' }}
            >
              {card.value}
            </p>
            <p className="text-white/40 text-xs font-medium">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
