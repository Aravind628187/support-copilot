import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, LogOut, ChevronDown, UserRound } from 'lucide-react';
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
    <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
      <button
        onClick={onOpenPalette}
        className="flex h-10 w-full max-w-xl items-center gap-2 rounded-2xl border border-ink-200/80 bg-ink-50/80 px-3 text-sm text-ink-400 transition-all duration-200 hover:border-accent-300 hover:bg-white dark:border-ink-800 dark:bg-ink-950/70 dark:hover:border-accent-500/40"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="rounded-lg border border-ink-200 px-1.5 py-0.5 font-mono text-[10px] dark:border-ink-700">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="flex h-10 w-10 items-center justify-center rounded-2xl text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-2xl px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800"
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
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-ink-100 bg-white p-2 shadow-xl dark:border-ink-800 dark:bg-ink-900"
              >
                <button
                  role="menuitem"
                  onClick={() => navigate('/profile')}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => void logout().then(() => navigate('/login'))}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
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
