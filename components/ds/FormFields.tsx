'use client';

import { forwardRef } from 'react';
import { Search, ChevronDown, type LucideIcon } from 'lucide-react';

// ─── Shared field wrapper ─────────────────────────────────────────────────────
interface FieldWrapperProps {
  label?:   string;
  error?:   string;
  hint?:    string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-white/50 text-[10px] font-semibold uppercase tracking-widest">
          {label}{required && <span className="text-gold-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {hint && !error && <p className="text-white/25 text-[10px]">{hint}</p>}
    </div>
  );
}

// ─── Shared input base styles ─────────────────────────────────────────────────
const BASE_INPUT =
  'w-full bg-white/[0.04] border border-white/[0.09] rounded-xl text-white placeholder:text-white/22 text-sm ' +
  'focus:outline-none focus:border-gold-500/45 focus:bg-white/[0.055] transition-all duration-200';

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
  icon?:     LucideIcon;
  iconSide?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon: Icon, iconSide = 'left', className = '', required, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        {Icon && iconSide === 'left' && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={`${BASE_INPUT} py-2.5 ${Icon && iconSide === 'left' ? 'pl-10 pr-4' : 'px-4'} ${error ? 'border-red-400/40' : ''} ${className}`}
          {...rest}
        />
        {Icon && iconSide === 'right' && (
          <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        )}
      </div>
    </FieldWrapper>
  )
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:  string;
  error?:  string;
  hint?:   string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', required, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        className={`${BASE_INPUT} px-4 py-3 resize-none leading-relaxed ${error ? 'border-red-400/40' : ''} ${className}`}
        {...rest}
      />
    </FieldWrapper>
  )
);
Textarea.displayName = 'Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectOption { value: string; label: string }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  options:  SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', required, ...rest }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <select
          ref={ref}
          className={`${BASE_INPUT} px-4 py-2.5 pr-10 appearance-none cursor-pointer ${error ? 'border-red-400/40' : ''} ${className}`}
          style={{ background: 'rgba(255,255,255,0.04)' }}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: '#0a1325', color: '#fff' }}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      </div>
    </FieldWrapper>
  )
);
Select.displayName = 'Select';

// ─── Search Input ─────────────────────────────────────────────────────────────
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export function SearchInput({ className = '', onClear, value, ...rest }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
      <input
        type="search"
        value={value}
        className={`${BASE_INPUT} pl-10 pr-4 py-2.5 ${className}`}
        {...rest}
      />
    </div>
  );
}
