import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Image,
  MessageSquare,
  Mail,
  Youtube,
  Settings,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',             to: '/admin',               icon: LayoutDashboard },
  { label: 'Training Management',   to: '/admin/trainings',     icon: BookOpen },
  { label: 'Student Registrations', to: '/admin/registrations', icon: Users },
  { label: 'Gallery',               to: '/admin/gallery',       icon: Image },
  { label: 'Testimonials',          to: '/admin/testimonials',  icon: MessageSquare },
  { label: 'Enquiries',             to: '/admin/enquiries',     icon: Mail },
  { label: 'YouTube Videos',        to: '/admin/videos',        icon: Youtube },
  { label: 'Website Settings',      to: '/admin/settings',      icon: Settings },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  return (
    <aside
      className="flex flex-col h-full w-[280px] flex-shrink-0"
      style={{ background: '#050b18', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-4 relative"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-xl font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810', boxShadow: '0 4px 14px rgba(212,175,55,0.35)' }}
        >
          RT
        </div>
        <div>
          <div className="font-bold text-sm leading-none" style={{ color: '#f0c040', letterSpacing: '0.02em' }}>
            RealTalks
          </div>
          <div className="text-[10px] text-white/35 mt-0.5 font-medium tracking-wider uppercase">
            Admin Panel
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/8 transition-all lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-white/25 px-3 mb-1.5">
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-3 rounded-xl text-[13px] font-medium transition-all duration-200 group',
                isActive ? 'text-[#020810]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(135deg,#f0c040,#d4af37)', boxShadow: '0 2px 12px rgba(212,175,55,0.25)', color: '#020810', height: '48px', display: 'flex', alignItems: 'center' }
                : { height: '44px', display: 'flex', alignItems: 'center' }
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={[
                    'flex-shrink-0 transition-colors w-5 h-5',
                    isActive ? 'text-[#020810]' : 'text-white/35 group-hover:text-white/60',
                  ].join(' ')}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
