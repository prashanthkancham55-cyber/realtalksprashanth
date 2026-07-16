'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TabItem {
  id:       string;
  label:    string;
  icon?:    LucideIcon;
  badge?:   string | number;
  disabled?: boolean;
}

interface TabsProps {
  items:      TabItem[];
  active:     string;
  onChange:   (id: string) => void;
  variant?:   'pills' | 'underline' | 'segment';
  size?:      'sm' | 'md';
  className?: string;
}

// ─── Pills variant ─────────────────────────────────────────────────────────────
function PillsTabs({ items, active, onChange, size }: Omit<TabsProps, 'variant' | 'className'>) {
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => !item.disabled && onChange(item.id)}
            disabled={item.disabled}
            className={`relative flex items-center gap-1.5 rounded-xl font-semibold transition-all duration-200 ${pad} ${
              item.disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={isActive
              ? { background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.06))', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' }
            }
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            {item.label}
            {item.badge !== undefined && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={isActive
                  ? { background: 'rgba(212,175,55,0.2)', color: '#d4af37' }
                  : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Underline variant ─────────────────────────────────────────────────────────
function UnderlineTabs({ items, active, onChange, size }: Omit<TabsProps, 'variant' | 'className'>) {
  const pad = size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm';

  return (
    <div className="flex items-center border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => !item.disabled && onChange(item.id)}
            disabled={item.disabled}
            className={`relative flex items-center gap-2 font-medium transition-all duration-200 ${pad} ${
              item.disabled ? 'opacity-35 cursor-not-allowed text-white/30' : isActive ? 'text-gold-400' : 'text-white/40 hover:text-white/65'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            {item.label}
            {item.badge !== undefined && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center" style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                {item.badge}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="underlineTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                style={{ background: 'linear-gradient(90deg, #f0c040, #d4af37)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Segment variant ───────────────────────────────────────────────────────────
function SegmentTabs({ items, active, onChange, size }: Omit<TabsProps, 'variant' | 'className'>) {
  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <div
      className="inline-flex rounded-xl p-1 gap-0.5"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => !item.disabled && onChange(item.id)}
            disabled={item.disabled}
            className={`relative flex items-center gap-1.5 rounded-lg font-semibold transition-all duration-200 capitalize ${pad} ${
              item.disabled ? 'opacity-35 cursor-not-allowed text-white/30' : isActive ? 'text-navy-900' : 'text-white/40 hover:text-white/65'
            }`}
            style={isActive ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' } : {}}
          >
            {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ items, active, onChange, variant = 'pills', size = 'md', className = '' }: TabsProps) {
  const props = { items, active, onChange, size };
  return (
    <div className={className}>
      {variant === 'pills'     && <PillsTabs     {...props} />}
      {variant === 'underline' && <UnderlineTabs {...props} />}
      {variant === 'segment'   && <SegmentTabs   {...props} />}
    </div>
  );
}
