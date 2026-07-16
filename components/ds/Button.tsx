'use client';

import { forwardRef } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Style maps ───────────────────────────────────────────────────────────────
const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties & { className: string }> = {
  primary: {
    className: 'text-navy-900 font-semibold hover:opacity-90 active:scale-[0.97]',
    background: 'linear-gradient(135deg, #f0c040, #d4af37)',
    boxShadow:  '0 4px 16px rgba(212,175,55,0.25)',
  },
  secondary: {
    className: 'text-white/80 font-medium hover:text-white hover:bg-white/[0.07] active:scale-[0.97]',
    background: 'rgba(255,255,255,0.045)',
    border:     '1px solid rgba(255,255,255,0.1)',
  },
  outline: {
    className: 'text-gold-400 font-medium hover:bg-gold-400/8 active:scale-[0.97]',
    background: 'transparent',
    border:     '1px solid rgba(212,175,55,0.35)',
  },
  ghost: {
    className: 'text-white/50 font-medium hover:text-white/80 hover:bg-white/[0.04] active:scale-[0.97]',
    background: 'transparent',
  },
  danger: {
    className: 'text-red-400 font-semibold hover:bg-red-500/15 active:scale-[0.97]',
    background: 'rgba(239,68,68,0.08)',
    border:     '1px solid rgba(239,68,68,0.2)',
  },
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-[11px] rounded-lg  gap-1.5',
  sm: 'px-3.5  py-2   text-xs    rounded-xl  gap-1.5',
  md: 'px-4.5  py-2.5 text-sm    rounded-xl  gap-2',
  lg: 'px-6    py-3   text-sm    rounded-2xl gap-2.5',
};

const ICON_SIZES: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
};

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      disabled,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const vs = VARIANT_STYLES[variant];
    const sizeClass = SIZE_CLASSES[size];
    const iconClass = ICON_SIZES[size];
    const isDisabled = disabled || loading;

    const { className: variantCls, ...variantStyle } = vs;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none outline-none focus-visible:ring-2 focus-visible:ring-gold-400/40',
          sizeClass,
          variantCls,
          fullWidth ? 'w-full' : '',
          className,
        ].filter(Boolean).join(' ')}
        style={{ ...variantStyle, ...style }}
        {...rest}
      >
        {loading && <Loader2 className={`${iconClass} animate-spin flex-shrink-0`} />}
        {!loading && Icon && iconPosition === 'left' && (
          <Icon className={`${iconClass} flex-shrink-0`} />
        )}
        {children}
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className={`${iconClass} flex-shrink-0`} />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── IconButton ───────────────────────────────────────────────────────────────
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon:     LucideIcon;
  variant?: 'default' | 'danger' | 'gold';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
  label?:   string;
}

const IB_SIZES = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-9 h-9' };
const IB_ICONS = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-4.5 h-4.5' };

const IB_VARIANTS: Record<string, React.CSSProperties & { cls: string }> = {
  default: { cls: 'text-white/40 hover:text-white/70 hover:bg-white/8',  background: 'transparent', border: '1px solid rgba(255,255,255,0.09)' },
  danger:  { cls: 'text-red-400 hover:bg-red-500/20',                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' },
  gold:    { cls: 'text-gold-400 hover:bg-gold-400/12',                  background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'default', size = 'md', loading = false, label, disabled, className = '', style, ...rest }, ref) => {
    const iv = IB_VARIANTS[variant];
    const { cls, ...ivStyle } = iv;
    return (
      <button
        ref={ref}
        aria-label={label}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 flex-shrink-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          IB_SIZES[size],
          cls,
          className,
        ].filter(Boolean).join(' ')}
        style={{ ...ivStyle, ...style }}
        {...rest}
      >
        {loading
          ? <Loader2 className={`${IB_ICONS[size]} animate-spin`} />
          : <Icon className={IB_ICONS[size]} />
        }
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
