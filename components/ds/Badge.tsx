import type { LucideIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type BadgeVariant =
  | 'active' | 'inactive' | 'upcoming' | 'completed' | 'draft'
  | 'success' | 'warning' | 'error' | 'info' | 'gold' | 'soon';

export type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  icon?:     LucideIcon;
  children:  React.ReactNode;
  dot?:      boolean;
  className?: string;
}

// ─── Style map ────────────────────────────────────────────────────────────────
const VARIANTS: Record<BadgeVariant, { color: string; bg: string; border: string; dotColor: string }> = {
  active:    { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.22)',   dotColor: '#4ade80' },
  inactive:  { color: '#94a3b8', bg: 'rgba(148,163,184,0.07)', border: 'rgba(148,163,184,0.18)',  dotColor: '#94a3b8' },
  upcoming:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.22)',   dotColor: '#60a5fa' },
  completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.06)',   border: 'rgba(74,222,128,0.18)',   dotColor: '#4ade80' },
  draft:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.14)',  dotColor: '#94a3b8' },
  success:   { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.22)',   dotColor: '#4ade80' },
  warning:   { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.22)',   dotColor: '#fb923c' },
  error:     { color: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.22)',  dotColor: '#f87171' },
  info:      { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.22)',   dotColor: '#60a5fa' },
  gold:      { color: '#d4af37', bg: 'rgba(212,175,55,0.09)',   border: 'rgba(212,175,55,0.25)',   dotColor: '#d4af37' },
  soon:      { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', dotColor: 'rgba(255,255,255,0.3)' },
};

const SIZES: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[9px] gap-1 rounded-md',
  sm: 'px-2   py-0.5 text-[10px] gap-1.5 rounded-lg',
  md: 'px-2.5 py-1   text-xs gap-1.5 rounded-lg',
};

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'info', size = 'sm', icon: Icon, children, dot = false, className = '' }: BadgeProps) {
  const v = VARIANTS[variant];

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider flex-shrink-0 ${SIZES[size]} ${className}`}
      style={{ color: v.color, background: v.bg, border: `1px solid ${v.border}` }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: v.dotColor, boxShadow: `0 0 4px ${v.dotColor}66` }}
        />
      )}
      {Icon && <Icon className="w-2.5 h-2.5 flex-shrink-0" />}
      {children}
    </span>
  );
}

// ─── Convenience exports ──────────────────────────────────────────────────────
export const ActiveBadge    = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="active"    dot {...p}>Active</Badge>;
export const InactiveBadge  = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="inactive"  dot {...p}>Inactive</Badge>;
export const UpcomingBadge  = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="upcoming"  dot {...p}>Upcoming</Badge>;
export const CompletedBadge = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="completed" dot {...p}>Completed</Badge>;
export const DraftBadge     = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="draft"     dot {...p}>Draft</Badge>;
export const SoonBadge      = (p: Omit<BadgeProps, 'variant' | 'children'>) => <Badge variant="soon"          {...p}>Soon</Badge>;
