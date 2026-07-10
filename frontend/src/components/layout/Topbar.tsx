import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../lib/utils';

export function Topbar({
  onOpenPalette,
  theme,
  onToggleTheme,
}: {
  onOpenPalette: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-ink-100 bg-white px-4 dark:border-ink-800 dark:bg-ink-900">
      <button
        onClick={onOpenPalette}
        className="flex h-9 w-full max-w-xs items-center gap-2 rounded-sm border border-ink-200 px-3 text-sm text-ink-400 transition-colors duration-micro hover:border-ink-300 dark:border-ink-800"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="rounded border border-ink-200 px-1.5 py-0.5 font-mono text-[10px] dark:border-ink-700">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="flex h-9 w-9 items-center justify-center rounded-sm text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-pill bg-accent-100 text-xs font-semibold text-accent-700 dark:bg-accent-500/20 dark:text-accent-400">
                {initials(user.name)}
              </div>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1 w-44 rounded-sm border border-ink-100 bg-white py-1 shadow-lg dark:border-ink-800 dark:bg-ink-900"
              >
                <button
                  role="menuitem"
                  onClick={() => void logout().then(() => navigate('/login'))}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
