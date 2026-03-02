import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import { ROUTES } from '../../utils/constants';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Products',
    to: ROUTES.PRODUCTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    to: '/orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: 'Users',
    to: '/users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
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
        {!collapsed && (
          <span className="font-bold text-lg text-indigo-600 tracking-tight">ShopWave</span>
        )}
        {collapsed && (
          <span className="font-bold text-lg text-indigo-600">E</span>
        )}
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
                  ]
                    .filter(Boolean)
                    .join(' ')
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
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50"
            onClick={onMobileClose}
          />
          <aside className="relative z-50 flex flex-shrink-0">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
