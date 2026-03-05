import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Store, Users, Tag,
  ChevronsLeft, Menu, LogOut, ChevronDown, Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSidebar';

const SUPER_ADMIN_NAV = [
  { label: 'Dashboard',  to: '/super-admin',            icon: LayoutDashboard, end: true },
  { label: 'Stores',     to: '/super-admin/stores',     icon: Store },
  { label: 'Users',      to: '/super-admin/users',      icon: Users },
  { label: 'Categories', to: '/super-admin/categories', icon: Tag },
];

function SuperAdminSidebar({ mobileOpen, onMobileClose }) {
  const { collapsed, toggleSidebar } = useSidebar();

  const sidebar = (
    <div className={`
      flex flex-col h-full transition-all duration-300 ease-in-out
      border-r border-white/5
      ${collapsed ? 'w-[68px]' : 'w-60'}
    `}
      style={{ background: 'linear-gradient(180deg, #1e0a33 0%, #160728 100%)' }}
    >
      {/* Brand */}
      <div className={`flex items-center h-16 border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-5 gap-3'}`}>
        <div className="w-8 h-8 bg-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/40">
          <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-white text-sm tracking-tight">ShopWave</span>
            <span className="block text-[10px] font-semibold text-violet-400 uppercase tracking-widest leading-none mt-0.5">Super Admin</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <p className="px-5 mb-2 text-[10px] font-bold text-violet-900/60 uppercase tracking-widest" style={{ color: 'rgba(216,180,254,0.3)' }}>Menu</p>
        )}
        <ul className="flex flex-col gap-0.5 px-2">
          {SUPER_ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                    ${isActive
                      ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/25'
                      : 'text-violet-200/50 hover:bg-white/5 hover:text-violet-100'
                    }
                    ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-violet-300' : 'text-violet-400/40 group-hover:text-violet-200'}`}
                        strokeWidth={isActive ? 2.5 : 1.75}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-2 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-violet-400/50 hover:bg-white/5 hover:text-violet-200 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <ChevronsLeft className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-shrink-0">{sidebar}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={onMobileClose} />
          <aside className="relative z-50 flex flex-shrink-0">{sidebar}</aside>
        </div>
      )}
    </>
  );
}

function SuperAdminTopbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <button onClick={onMenuClick} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      {/* Badge */}
      <div className="hidden lg:flex items-center gap-2 ml-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-xs font-bold text-violet-600">
          <Shield className="w-3 h-3" /> Super Admin
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3 relative">
        <button
          onClick={() => setAccountOpen((v) => !v)}
          onBlur={() => setTimeout(() => setAccountOpen(false), 150)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'S'}
            </span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name ?? user?.email}</p>
            <p className="text-[11px] text-violet-500 font-semibold mt-0.5">Super Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>

        {accountOpen && (
          <div className="absolute right-0 top-14 w-52 rounded-xl border border-gray-200 bg-white shadow-xl z-30 py-1.5 overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-800">{user?.name ?? user?.email}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <div className="px-3.5 py-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" /> Super Admin
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SuperAdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <SuperAdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
