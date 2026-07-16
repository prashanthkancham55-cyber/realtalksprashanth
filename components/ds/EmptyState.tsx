import { type LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?:        LucideIcon;
  iconColor?:   string;
  title:        string;
  description?: string;
  action?:      React.ReactNode;
  compact?:     boolean;
}

export function EmptyState({
  icon: Icon = Inbox,
  iconColor = 'rgba(255,255,255,0.18)',
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-2xl ${compact ? 'py-12 px-6' : 'py-20 px-8'}`}
      style={{ background: 'rgba(255,255,255,0.018)', border: '1px dashed rgba(255,255,255,0.08)' }}
    >
      <div
        className={`rounded-2xl flex items-center justify-center mb-4 ${compact ? 'w-12 h-12' : 'w-14 h-14'}`}
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} style={{ color: iconColor }} />
      </div>

      <p className={`text-white/45 font-medium mb-1 ${compact ? 'text-sm' : 'text-base'}`}>{title}</p>

      {description && (
        <p className={`text-white/25 leading-relaxed max-w-xs ${compact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
