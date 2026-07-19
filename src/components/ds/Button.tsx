import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const ICON_SIZES: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
};

const VARIANTS: Record<ButtonVariant, React.CSSProperties & { cls: string }> = {
  primary:   { cls: 'text-white', background: 'linear-gradient(135deg,#f0c040,#d4af37)', border: 'none', color: '#020810' },
  secondary: { cls: 'text-white/80', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' },
  outline:   { cls: 'text-white/70', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' },
  ghost:     { cls: 'text-white/50 hover:text-white/80', background: 'transparent', border: 'none' },
  danger:    { cls: 'text-red-400', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon: Icon, iconPosition = 'left', fullWidth, className = '', style, children, disabled, ...rest }, ref) => {
    const v = VARIANTS[variant];
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          SIZES[size], v.cls, fullWidth ? 'w-full' : '', className,
        ].filter(Boolean).join(' ')}
        style={{ ...v, ...style }}
        {...rest}
      >
        {loading && <Loader2 className={`${ICON_SIZES[size]} animate-spin`} />}
        {!loading && Icon && iconPosition === 'left' && <Icon className={ICON_SIZES[size]} />}
        {children}
        {!loading && Icon && iconPosition === 'right' && <Icon className={ICON_SIZES[size]} />}
      </button>
    );
  },
);
Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'gold' | 'danger';
  size?: ButtonSize;
  loading?: boolean;
  label?: string;
}

const IB_SIZES: Record<ButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
};

const IB_ICONS: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
};

const IB_VARS: Record<string, React.CSSProperties & { cls: string }> = {
  default: { cls: 'text-white/40 hover:text-white/70 hover:bg-white/8', background: 'transparent', border: '1px solid rgba(255,255,255,0.09)' },
  gold:    { cls: 'text-gold-400 hover:bg-gold-400/12', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' },
  danger:  { cls: 'text-red-400 hover:bg-red-500/20', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'default', size = 'md', loading, label, disabled, className = '', style, ...rest }, ref) => {
    const v = IB_VARS[variant];
    return (
      <button
        ref={ref}
        aria-label={label}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          IB_SIZES[size], v.cls, className,
        ].filter(Boolean).join(' ')}
        style={{ ...v, ...style }}
        {...rest}
      >
        {loading ? <Loader2 className={`${IB_ICONS[size]} animate-spin`} /> : <Icon className={IB_ICONS[size]} />}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';
