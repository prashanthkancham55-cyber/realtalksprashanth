'use client';

import { type LucideIcon } from 'lucide-react';
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';

interface Props {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export default function PageHeader({ icon: Icon, iconColor, iconBg, title, description, breadcrumbs, actions }: Props) {
  return (
    <div className="flex flex-col gap-3 mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg ?? 'rgba(212,175,55,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Icon className="w-5 h-5" style={{ color: iconColor ?? '#d4af37' }} />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {title}
            </h1>
            {description && <p className="text-white/45 text-sm mt-0.5">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
