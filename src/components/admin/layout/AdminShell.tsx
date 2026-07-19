import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.background = '#020810';
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: '#020810' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] lg:z-40">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px]">
            <AdminSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px]">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30" style={{ background: 'rgba(5,11,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm" style={{ color: '#f0c040' }}>RealTalks Admin</span>
          <div className="w-9" />
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
