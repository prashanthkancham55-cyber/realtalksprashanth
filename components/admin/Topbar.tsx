'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, ExternalLink, LogOut, User, ChevronDown } from 'lucide-react';

interface Props {
  pageTitle: string;
  userEmail: string;
  onMenuClick: () => void;
  onSignOut: () => void;
}

export default function Topbar({ pageTitle, userEmail, onMenuClick, onSignOut }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <header
      className="h-16 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-20"
      style={{
        background: 'rgba(4,9,22,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h2 className="text-white font-semibold text-base truncate">{pageTitle}</h2>
      </div>

      {/* Search bar — UI only */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm w-52 lg:w-64 cursor-text"
        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <Search className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
        <span className="text-white/25 text-xs">Search...</span>
        <kbd className="ml-auto text-[9px] text-white/20 font-mono border border-white/10 rounded px-1">⌘K</kbd>
      </div>

      {/* Notifications — UI only */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border text-white/40 hover:text-white/70 hover:bg-white/5 transition-all flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Bell className="w-4 h-4" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold-400" />
      </button>

      {/* View site */}
      <Link
        href="/"
        target="_blank"
        className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-xs flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        <span>View Site</span>
      </Link>

      {/* Profile dropdown */}
      <div className="relative flex-shrink-0" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border transition-all hover:bg-white/5"
          style={{ borderColor: profileOpen ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #d4af37, #f0c040)' }}
          >
            <span className="text-navy-900 text-xs font-bold">{initials}</span>
          </div>
          <span className="hidden sm:block text-white/65 text-xs max-w-[120px] truncate">{userEmail}</span>
          <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(8,14,30,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-white/80 text-xs font-medium truncate">{userEmail}</p>
              <p className="text-white/35 text-[10px] mt-0.5">Administrator</p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-white/45 text-sm hover:bg-white/5 hover:text-white/60 transition-all cursor-not-allowed opacity-50"
              >
                <User className="w-4 h-4" />
                Profile Settings
              </button>
              <div className="my-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              <button
                onClick={() => { setProfileOpen(false); onSignOut(); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-white/45 text-sm hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
