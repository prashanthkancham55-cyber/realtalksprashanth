import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ─── Base Card ────────────────────────────────────────────────────────────────
interface CardProps {
  children:   React.ReactNode;
  className?: string;
  style?:     React.CSSProperties;
  hover?:     boolean;
  padding?:   'none' | 'sm' | 'md' | 'lg';
  as?:        'div' | 'section' | 'article';
}

const PAD = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6 md:p-8' };

export function Card({ children, className = '', style, hover = false, padding = 'md', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl ${PAD[padding]} ${hover ? 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass' : ''} ${className}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// ─── Glass Card ───────────────────────────────────────────────────────────────
interface GlassCardProps {
  children:     React.ReactNode;
  className?:   string;
  style?:       React.CSSProperties;
  goldBorder?:  boolean;
  padding?:     'none' | 'sm' | 'md' | 'lg';
}

export function GlassCard({ children, className = '', style, goldBorder = false, padding = 'md' }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl ${PAD[padding]} ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: goldBorder ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Statistics Card ──────────────────────────────────────────────────────────
interface StatCardTrend {
  value:     string;
  direction: 'up' | 'down' | 'flat';
  label:     string;
}

interface StatCardProps {
  label:       string;
  value:       string;
  sub?:        string;
  icon:        LucideIcon;
  iconColor:   string;
  iconBg:      string;
  trend?:      StatCardTrend;
  className?:  string;
  glowOnHover?: boolean;
}

const TREND_COLORS = {
  up:   { color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.2)' },
  down: { color: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)' },
  flat: { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
};

export function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg, trend, className = '', glowOnHover = true }: StatCardProps) {
  const tc = trend ? TREND_COLORS[trend.direction] : null;

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`relative rounded-2xl p-5 group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {glowOnHover && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 20% 20%, ${iconBg} 0%, transparent 65%)` }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: iconBg, border: `1px solid ${iconColor}22`, boxShadow: `0 4px 12px ${iconColor}18` }}
          >
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
          {tc && trend && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0"
              style={{ color: tc.color, background: tc.bg, border: `1px solid ${tc.border}` }}
            >
              <TrendIcon className="w-2.5 h-2.5" />
              {trend.value}
            </div>
          )}
        </div>

        <p
          className="text-white font-bold leading-none tracking-tight mb-1.5"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          {value}
        </p>
        <p className="text-white/40 text-xs font-medium">{label}</p>

        {(sub || trend?.label) && (
          <div
            className="flex items-center justify-between mt-3 pt-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {sub && <span className="text-white/25 text-[10px]">{sub}</span>}
            {trend?.label && <span className="text-[10px] font-medium" style={{ color: tc ? `${tc.color}99` : 'rgba(255,255,255,0.3)' }}>{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
