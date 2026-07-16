'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Users, CreditCard, Image as ImageIcon,
  MessageSquare, Mail, FileText, Megaphone, Layers, Youtube,
  Settings, LogOut, User, Zap,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  enabled: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',            href: '/admin',               icon: LayoutDashboard, enabled: true },
  { id: 'trainings',     label: 'Training Management',  href: '/admin/trainings',     icon: BookOpen,        enabled: true },
  { id: 'registrations', label: 'Student Registrations',href: '/admin/registrations', icon: Users,           enabled: false },
  { id: 'payments',      label: 'Payments',             href: '/admin/payments',      icon: CreditCard,      enabled: false },
  { id: 'gallery',       label: 'Gallery',              href: '/admin/gallery',       icon: ImageIcon,       enabled: true },
  { id: 'testimonials',  label: 'Testimonials',         href: '/admin/testimonials',  icon: MessageSquare,   enabled: true },
  { id: 'enquiries',     label: 'Enquiries',            href: '/admin/enquiries',     icon: Mail,            enabled: true },
  { id: 'blogs',         label: 'Blogs',                href: '/admin/blogs',         icon: FileText,        enabled: false },
  { id: 'banners',       label: 'Banner Management',    href: '/admin/banners',       icon: Megaphone,       enabled: false },
  { id: 'popups',        label: 'Popup Management',     href: '/admin/popups',        icon: Layers,          enabled: false },
  { id: 'youtube',       label: 'YouTube Videos',       href: '/admin/youtube',       icon: Youtube,         enabled: false },
  { id: 'settings',      label: 'Website Settings',     href: '/admin/settings',      icon: Settings,        enabled: false },
];

interface Props {
  userEmail: string;
  onSignOut: () => void;
  onClose?: () => void;
}

export default function Sidebar({ userEmail, onSignOut, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.id === 'dashboard') return pathname === '/admin';
    return pathname.startsWith(item.href);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'rgba(4,9,22,0.97)' }}>
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', border: '1px solid rgba(212,175,55,0.25)' }}
          >
            <Zap className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">RealTalks</p>
            <p className="text-white/35 text-xs mt-0.5">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
        {/* Section label */}
        <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-1">Navigation</p>

        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-not-allowed opacity-35"
              >
                <Icon className="w-4 h-4 text-white/40 flex-shrink-0" />
                <span className="text-white/40 text-sm flex-1 truncate">{item.label}</span>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
                >
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={active
                ? { background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.18)' }
                : { border: '1px solid transparent' }
              }
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #f0c040, #d4af37)' }} />
              )}
              <Icon
                className={`w-4 h-4 flex-shrink-0 relative z-10 transition-colors ${active ? 'text-gold-400' : 'text-white/40 group-hover:text-white/65'}`}
              />
              <span
                className={`text-sm flex-1 truncate relative z-10 transition-colors ${active ? 'text-gold-300 font-semibold' : 'text-white/50 group-hover:text-white/75'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t flex flex-col gap-0.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">Account</p>

          <Link
            href="/admin/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all opacity-35 cursor-not-allowed"
            style={{ border: '1px solid transparent' }}
          >
            <User className="w-4 h-4 text-white/40 flex-shrink-0" />
            <span className="text-white/40 text-sm flex-1">Profile</span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>Soon</span>
          </Link>

          <button
            onClick={onSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left w-full hover:bg-red-500/8"
            style={{ border: '1px solid transparent' }}
          >
            <LogOut className="w-4 h-4 text-white/35 group-hover:text-red-400 flex-shrink-0 transition-colors" />
            <span className="text-white/40 group-hover:text-red-400 text-sm transition-colors">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d4af37, #f0c040)' }}
          >
            <span className="text-navy-900 text-xs font-bold">{userEmail.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium truncate">{userEmail}</p>
            <p className="text-white/30 text-[10px]">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
