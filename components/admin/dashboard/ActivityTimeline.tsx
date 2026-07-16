'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, MessageSquare, Mail, Settings, User, Zap } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: typeof ImageIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

const DUMMY_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    icon: Zap,
    iconColor: '#d4af37',
    iconBg: 'rgba(212,175,55,0.1)',
    title: 'Dashboard initialized',
    description: 'Admin dashboard is live and ready.',
    time: 'Just now',
    type: 'success',
  },
  {
    id: '2',
    icon: ImageIcon,
    iconColor: '#38bdf8',
    iconBg: 'rgba(56,189,248,0.1)',
    title: 'Gallery module ready',
    description: 'Upload and manage training photos.',
    time: 'Phase 1',
    type: 'info',
  },
  {
    id: '3',
    icon: MessageSquare,
    iconColor: '#4ade80',
    iconBg: 'rgba(74,222,128,0.1)',
    title: 'Testimonials module ready',
    description: 'Collect and showcase client reviews.',
    time: 'Phase 1',
    type: 'success',
  },
  {
    id: '4',
    icon: Mail,
    iconColor: '#fb923c',
    iconBg: 'rgba(251,146,60,0.1)',
    title: 'Enquiries module ready',
    description: 'Track all contact form submissions.',
    time: 'Phase 1',
    type: 'info',
  },
  {
    id: '5',
    icon: User,
    iconColor: '#a78bfa',
    iconBg: 'rgba(167,139,250,0.1)',
    title: 'Training Management',
    description: 'Coming soon in the next phase.',
    time: 'Phase 2',
    type: 'warning',
  },
  {
    id: '6',
    icon: Settings,
    iconColor: '#60a5fa',
    iconBg: 'rgba(96,165,250,0.1)',
    title: 'Payments & Registrations',
    description: 'Advanced modules planned for Phase 2.',
    time: 'Phase 2',
    type: 'warning',
  },
];

export default function ActivityTimeline() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Recent Activity</h3>
        <span className="text-white/25 text-xs">Dashboard roadmap</span>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {DUMMY_ACTIVITY.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
              className={`flex items-start gap-4 px-5 py-4 relative ${
                i < DUMMY_ACTIVITY.length - 1 ? 'border-b' : ''
              }`}
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              {/* Timeline line */}
              {i < DUMMY_ACTIVITY.length - 1 && (
                <div
                  className="absolute left-[2.1rem] top-12 bottom-0 w-px"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                style={{ background: item.iconBg, border: `1px solid ${item.iconColor}22` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: item.iconColor }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white/80 text-sm font-medium leading-snug">{item.title}</p>
                  <span className="text-white/25 text-xs flex-shrink-0 pt-0.5">{item.time}</span>
                </div>
                <p className="text-white/35 text-xs mt-0.5 leading-relaxed">{item.description}</p>
              </div>

              {/* Status dot */}
              <div className="flex-shrink-0 pt-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: item.type === 'success' ? '#4ade80' : item.type === 'warning' ? '#fb923c' : '#60a5fa',
                    boxShadow: `0 0 6px ${item.type === 'success' ? '#4ade80' : item.type === 'warning' ? '#fb923c' : '#60a5fa'}66`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
