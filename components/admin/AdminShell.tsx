'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AuthForm from './AuthForm';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileDrawer from './MobileDrawer';

const PAGE_TITLES: Record<string, string> = {
  '/admin':            'Dashboard',
  '/admin/gallery':    'Gallery',
  '/admin/testimonials':'Testimonials',
  '/admin/enquiries':  'Enquiries',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? 'Admin';
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020810' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
          >
            <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
          </div>
          <p className="text-white/30 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthForm onAuth={setSession} />;
  }

  const pageTitle = getPageTitle(pathname);
  const userEmail = session.user.email ?? '';

  return (
    <div className="min-h-screen flex" style={{ background: '#020810' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 fixed left-0 top-0 bottom-0 z-30"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Sidebar userEmail={userEmail} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Main area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Topbar
          pageTitle={pageTitle}
          userEmail={userEmail}
          onMenuClick={() => setDrawerOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t text-center" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="text-white/20 text-xs">RealTalks Prashanth Admin &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
