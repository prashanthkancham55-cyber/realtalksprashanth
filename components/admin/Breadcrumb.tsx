'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs">
      <Link href="/admin" className="text-white/35 hover:text-white/60 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
      </Link>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-white/20" />
          {item.href && i < items.length - 1 ? (
            <Link href={item.href} className="text-white/35 hover:text-white/60 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white/60 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
