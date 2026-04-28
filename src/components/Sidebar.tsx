import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cartoes', label: 'Cartões', icon: CreditCard },
  { path: '/dividas', label: 'Dívidas', icon: Receipt },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <>
      {/* Mobile hamburger */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl lg:hidden
          bg-white dark:bg-dark-card shadow-lg border border-gray-200 dark:border-dark-border"
      >
        <LayoutDashboard size={20} className="text-primary-600" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDark
            ? 'bg-dark-surface border-r border-dark-border'
            : 'bg-white border-r border-gray-100'
          }
          shadow-xl lg:shadow-md
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-6 border-b
          ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
            flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
            <Wallet size={22} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className={`text-lg font-bold tracking-tight
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Finanças<span className="text-primary-500">Pro</span>
              </h1>
              <p className={`text-[10px] font-medium tracking-widest uppercase
                ${isDark ? 'text-dark-muted' : 'text-gray-400'}`}>
                Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-${item.path.replace('/', '') || 'dashboard'}`}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                  transition-all duration-200 group relative
                  ${collapsed ? 'justify-center px-3' : ''}
                  ${isActive
                    ? isDark
                      ? 'bg-primary-600/15 text-primary-400'
                      : 'bg-primary-50 text-primary-600'
                    : isDark
                      ? 'text-dark-muted hover:bg-dark-card hover:text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-500" />
                )}
                <Icon size={20} className={`flex-shrink-0 transition-transform duration-200
                  ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                {!collapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-1.5 rounded-lg text-xs font-medium
                    bg-gray-900 text-white opacity-0 invisible group-hover:opacity-100 
                    group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className={`px-3 py-4 border-t hidden lg:block
          ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
          <button
            id="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200
              ${collapsed ? 'justify-center px-3' : ''}
              ${isDark
                ? 'text-dark-muted hover:bg-dark-card hover:text-white'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }
            `}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>

        {/* User */}
        <div className={`px-4 py-4 border-t
          ${isDark ? 'border-dark-border' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600
              flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
              D
            </div>
            {!collapsed && (
              <div className="animate-fade-in min-w-0">
                <p className={`text-sm font-semibold truncate
                  ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Diego
                </p>
                <p className={`text-xs truncate
                  ${isDark ? 'text-dark-muted' : 'text-gray-400'}`}>
                  Conta Pessoal
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
