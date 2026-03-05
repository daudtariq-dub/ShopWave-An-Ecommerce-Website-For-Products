import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, Users, Settings, ChevronsLeft } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import { ROUTES } from '../../utils/constants';

const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Products',  to: ROUTES.PRODUCTS,  icon: <Package className="w-5 h-5" /> },
  { label: 'Orders',    to: '/orders',         icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Users',     to: '/users',          icon: <Users className="w-5 h-5" /> },
  { label: 'Settings',  to: '/settings',       icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const { collapsed, toggleSidebar } = useSidebar();

  const sidebarContent = (
    <div
      className={[
        'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64',
      ].join(' ')}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-200 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        {!collapsed && <span className="font-bold text-lg text-indigo-600 tracking-tight">ShopWave</span>}
        {collapsed  && <span className="font-bold text-lg text-indigo-600">E</span>}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    collapsed ? 'justify-center' : '',
                  ].filter(Boolean).join(' ')
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={toggleSidebar}
          className={[
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium',
            'text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150',
            collapsed ? 'justify-center' : '',
          ].join(' ')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronsLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-shrink-0">{sidebarContent}</aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onMobileClose} />
          <aside className="relative z-50 flex flex-shrink-0">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
