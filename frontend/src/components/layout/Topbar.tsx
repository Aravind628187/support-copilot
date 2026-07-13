import { useState, useRef, useEffect } from 'react';
import { Search, Moon, Sun, LogOut, ChevronDown, Bell, UserRound } from 'lucide-react';
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
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-ink-200/80 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85 sm:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onOpenPalette}
          className="flex h-12 w-full max-w-2xl items-center gap-3 rounded-3xl border border-ink-200/80 bg-ink-50/90 px-4 text-sm text-ink-500 transition hover:border-accent-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/20 dark:border-ink-800 dark:bg-ink-900/75 dark:text-ink-300 dark:hover:border-accent-500/40"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 text-left text-sm">Search workflows, tickets, customers, or analytics…</span>
          <kbd className="rounded-xl border border-ink-200 px-2 py-1 text-[11px] font-medium text-ink-500 dark:border-ink-700 dark:text-ink-400">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-ink-200/80 bg-ink-50/90 text-ink-600 transition hover:border-accent-300 hover:bg-white dark:border-ink-800 dark:bg-ink-900/75 dark:text-ink-300 dark:hover:border-accent-500/40"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-ink-200/80 bg-ink-50/90 text-ink-600 transition hover:border-accent-300 hover:bg-white dark:border-ink-800 dark:bg-ink-900/75 dark:text-ink-300 dark:hover:border-accent-500/40"
          aria-label="View notifications"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5 rounded-full bg-danger-500 ring-2 ring-white dark:ring-ink-950" />
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex items-center gap-3 rounded-3xl border border-ink-200/80 bg-ink-50/90 px-3 py-2 text-sm text-ink-700 transition hover:border-accent-300 hover:bg-white dark:border-ink-800 dark:bg-ink-900/75 dark:text-ink-200 dark:hover:border-accent-500/40"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-accent-100 text-sm font-semibold text-accent-700 dark:bg-accent-500/20 dark:text-accent-200">
                {initials(user.name)}
              </div>
              <div className="hidden flex-col text-left sm:flex">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-ink-500 dark:text-ink-400">{user.role === 'ADMIN' ? 'Administrator' : 'Agent'}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-ink-400" />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-2xl dark:border-ink-800 dark:bg-ink-950"
              >
                <button
                  role="menuitem"
                  onClick={() => navigate('/profile')}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => void logout().then(() => navigate('/login'))}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
