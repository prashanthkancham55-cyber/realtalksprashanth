import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AdminSidebar from './AdminSidebar';
import { Button } from '../../ds/Button';

const PAGE_TITLES: Record<string, string> = {
  '/admin':               'Dashboard',
  '/admin/trainings':     'Training Management',
  '/admin/registrations': 'Student Registrations',
  '/admin/gallery':       'Gallery',
  '/admin/testimonials':  'Testimonials',
  '/admin/enquiries':     'Enquiries',
};

function getPageTitle(pathname: string): string {
  // exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // prefix match for deeper routes
  const match = Object.keys(PAGE_TITLES)
    .filter((k) => k !== '/admin' && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : 'Admin';
}

interface AdminShellProps {
  children: React.ReactNode;
}

/* ── Login Form ──────────────────────────────────────────────────────────────── */
function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg,#020810 0%,#050b18 50%,#0d1630 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(212,175,55,0.07) 0%,transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(13,22,48,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg,#f0c040,#d4af37)',
                color: '#020810',
                boxShadow: '0 4px 14px rgba(212,175,55,0.35)',
              }}
            >
              RT
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: '#f0c040' }}>RealTalks</div>
              <div className="text-[10px] text-white/35 font-medium tracking-wider uppercase">Admin Panel</div>
            </div>
          </div>

          <h1
            className="text-2xl font-semibold text-white mb-1"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Admin Login
          </h1>
          <p className="text-sm text-white/40 mb-6">Sign in to manage your platform.</p>

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm mb-5"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@realtalks.in"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 font-medium mb-1.5">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ── AdminShell ──────────────────────────────────────────────────────────────── */
export default function AdminShell({ children }: AdminShellProps) {
  const [session, setSession]       = useState<Session | null | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setDrawerOpen(false);
  }

  // Loading state while we check auth
  if (session === undefined) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#020810' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810' }}
          >
            RT
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#d4af37' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const userEmail = session.user?.email ?? '';

  return (
    <div className="flex min-h-screen" style={{ background: '#020810' }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:z-40">
        <AdminSidebar userEmail={userEmail} onSignOut={handleSignOut} />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(2,8,16,0.75)', backdropFilter: 'blur(4px)' }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <AdminSidebar
                userEmail={userEmail}
                onSignOut={handleSignOut}
                onClose={() => setDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-8 py-4"
          style={{
            background: 'rgba(2,8,16,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-2 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/6 transition-all"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <h1
            className="text-lg font-semibold text-white flex-1"
            style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.01em' }}
          >
            {pageTitle}
          </h1>

          {/* User email (desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div
              className="text-xs text-white/40 truncate max-w-[180px]"
            >
              {userEmail}
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Sign out (desktop) */}
          <button
            onClick={handleSignOut}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
