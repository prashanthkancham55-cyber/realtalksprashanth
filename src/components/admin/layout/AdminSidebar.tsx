import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Image,
  MessageSquare,
  Mail,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '../../ds/Button';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',             to: '/admin',               icon: LayoutDashboard },
  { label: 'Training Management',   to: '/admin/trainings',     icon: BookOpen },
  { label: 'Student Registrations', to: '/admin/registrations', icon: Users },
  { label: 'Gallery',               to: '/admin/gallery',       icon: Image },
  { label: 'Testimonials',          to: '/admin/testimonials',  icon: MessageSquare },
  { label: 'Enquiries',             to: '/admin/enquiries',     icon: Mail },
];

const DISABLED_ITEMS = [
  { label: 'Payments',  icon: CreditCard },
  { label: 'Blogs',     icon: FileText },
  { label: 'Settings',  icon: Settings },
];

interface AdminSidebarProps {
  userEmail: string;
  onSignOut: () => void;
  onClose?: () => void;
}

export default function AdminSidebar({ userEmail, onSignOut, onClose }: AdminSidebarProps) {
  return (
    <aside
      className="flex flex-col h-full w-[280px] flex-shrink-0"
      style={{ background: '#050b18', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo area */}
      <div
        className="flex items-center gap-3 px-5 py-4 relative"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-xl font-bold text-sm flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg,#f0c040,#d4af37)',
            color: '#020810',
            boxShadow: '0 4px 14px rgba(212,175,55,0.35)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          RT
        </div>
        <div>
          <div
            className="font-bold text-sm leading-none"
            style={{ color: '#f0c040', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
          >
            RealTalks
          </div>
          <div className="text-[10px] text-white/35 mt-0.5 font-medium tracking-wider uppercase">
            Admin Panel
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/8 transition-all lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation — flex-1 with overflow so profile stays anchored */}
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
                isActive
                  ? 'text-[#020810]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg,#f0c040,#d4af37)',
                    boxShadow: '0 2px 12px rgba(212,175,55,0.25)',
                    color: '#020810',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                  }
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

        {/* Divider */}
        <div className="my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

        <div className="text-[10px] font-semibold tracking-widest uppercase text-white/25 px-3 mb-1.5">
          Coming Soon
        </div>

        {DISABLED_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 px-3 rounded-xl text-[13px] font-medium opacity-30 cursor-not-allowed select-none"
            style={{ height: '44px' }}
          >
            <item.icon className="flex-shrink-0 text-white/30 w-5 h-5" />
            <span className="text-white/40">{item.label}</span>
            <span
              className="ml-auto text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
            >
              Soon
            </span>
          </div>
        ))}
      </nav>

      {/* Profile / sign-out — pulled up with less padding so it's visible without scrolling */}
      <div
        className="px-4 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 mb-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-white/60 truncate">{userEmail}</div>
            <div className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
              Administrator
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={LogOut}
          fullWidth
          onClick={onSignOut}
          className="justify-start text-white/50 hover:text-red-400 hover:bg-red-500/8"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
