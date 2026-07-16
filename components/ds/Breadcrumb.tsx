import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items:      BreadcrumbItem[];
  homeHref?:  string;
  className?: string;
}

export function Breadcrumb({ items, homeHref = '/admin', className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-[11px] ${className}`}>
      <Link href={homeHref} className="text-white/30 hover:text-white/55 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-white/18 flex-shrink-0" />
            {!isLast && item.href ? (
              <Link href={item.href} className="text-white/30 hover:text-white/55 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-white/55 font-medium' : 'text-white/30'}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
