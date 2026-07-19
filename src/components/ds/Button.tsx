import { forwardRef } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?:      ButtonVariant;
  size?:         ButtonSize;
  loading?:      boolean;
  icon?:         LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?:    boolean;
}

export type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS: Record<ButtonVariant, React.CSSProperties & { cls: string }> = {
  primary:   { cls: 'text-navy-950 font-semibold hover:opacity-90 active:scale-[0.97]', background: 'linear-gradient(135deg,#f0c040,#d4af37)', boxShadow: '0 4px 16px rgba(212,175,55,0.25)' },
  secondary: { cls: 'text-white/80 font-medium hover:text-white hover:bg-white/[0.07] active:scale-[0.97]', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)' },
  outline:   { cls: 'text-gold-400 font-medium hover:bg-gold-400/8 active:scale-[0.97]', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)' },
  ghost:     { cls: 'text-white/50 font-medium hover:text-white/80 hover:bg-white/[0.04] active:scale-[0.97]', background: 'transparent' },
  danger:    { cls: 'text-red-400 font-semibold hover:bg-red-500/15 active:scale-[0.97]', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' },
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-[11px] rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-2xl gap-2.5',
};

const ICON_SIZES: Record<ButtonSize, string> = {
  xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-4.5 h-4.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon: Icon, iconPosition = 'left',
     fullWidth, children, disabled, className = '', style, ...rest }, ref) => {
    const v = VARIANTS[variant];
    const { cls, ...vStyle } = v;
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center transition-all duration-200 select-none outline-none',
          'focus-visible:ring-2 focus-visible:ring-gold-400/40',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          SIZES[size], cls, fullWidth ? 'w-full' : '', className,
        ].filter(Boolean).join(' ')}
        style={{ ...vStyle, ...style }}
        {...rest}
      >
        {loading && <Loader2 className={`${ICON_SIZES[size]} animate-spin flex-shrink-0`} />}
        {!loading && Icon && iconPosition === 'left' && <Icon className={`${ICON_SIZES[size]} flex-shrink-0`} />}
        {children}
        {!loading && Icon && iconPosition === 'right' && <Icon className={`${ICON_SIZES[size]} flex-shrink-0`} />}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ── IconButton ────────────────────────────────────────────────────────────────
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  label?: string;
}

const IB_SIZES = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-9 h-9' };
const IB_ICONS = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-4.5 h-4.5' };
const IB_VARS: Record<string, React.CSSProperties & { cls: string }> = {
  default: { cls: 'text-white/40 hover:text-white/70 hover:bg-white/8',  background: 'transparent', border: '1px solid rgba(255,255,255,0.09)' },
  danger:  { cls: 'text-red-400 hover:bg-red-500/20',                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' },
  gold:    { cls: 'text-gold-400 hover:bg-gold-400/12',                  background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'default', size = 'md', loading, label, disabled, className = '', style, ...rest }, ref) => {
    const v = IB_VARS[variant];
    const { cls, ...vStyle } = v;
    return (
      <button
        ref={ref}
        aria-label={label}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          IB_SIZES[size], cls, className,
        ].filter(Boolean).join(' ')}
        style={{ ...vStyle, ...style }}
        {...rest}
      >
        {loading ? <Loader2 className={`${IB_ICONS[size]} animate-spin`} /> : <Icon className={IB_ICONS[size]} />}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
