import { Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/cartoes': 'Meus Cartões',
  '/dividas': 'Minhas Dívidas',
};

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className={`
      sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4
      ${isDark
        ? 'bg-dark-bg/80 border-b border-dark-border'
        : 'bg-gray-50/80 border-b border-gray-100'
      }
      backdrop-blur-xl w-full
    `}>
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Title */}
        <div className="pl-14 lg:pl-0">
          <h2 className={`text-xl sm:text-2xl font-bold
            ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <p className={`text-xs sm:text-sm mt-0.5
            ${isDark ? 'text-dark-muted' : 'text-gray-500'}`}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl
            ${isDark
              ? 'bg-dark-card border border-dark-border'
              : 'bg-white border border-gray-200'
            }
            transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-500/20
            focus-within:border-primary-400
          `}>
            <Search size={16} className={isDark ? 'text-dark-muted' : 'text-gray-400'} />
            <input
              id="header-search"
              type="text"
              placeholder="Buscar transação, cartão..."
              className={`bg-transparent text-sm w-40 lg:w-56 outline-none
                placeholder:text-gray-400
                ${isDark ? 'text-white placeholder:text-dark-muted' : 'text-gray-900'}
              `}
            />
          </div>

          {/* Notifications */}
          <button
            id="notifications-btn"
            className={`relative p-2.5 rounded-xl transition-all duration-200
              ${isDark
                ? 'bg-dark-card border border-dark-border hover:bg-dark-border text-dark-muted hover:text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900'
              }
            `}
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full
              text-[9px] text-white font-bold flex items-center justify-center
              animate-pulse">
              3
            </span>
          </button>

          {/* Theme toggle */}
          <button
            id="theme-toggle"
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300
              ${isDark
                ? 'bg-dark-card border border-dark-border hover:bg-dark-border text-yellow-400 hover:text-yellow-300'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-amber-500'
              }
            `}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
