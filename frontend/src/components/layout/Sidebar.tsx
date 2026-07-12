import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, BookOpen, Users, ShieldCheck, UserRound } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/kb', label: 'Knowledge Base', icon: BookOpen },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-64 shrink-0 flex-col gap-2 border-r border-ink-100 bg-white/80 p-3 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80 sm:flex"
    >
      <div className="rounded-2xl border border-ink-100/80 bg-gradient-to-br from-accent-500/10 via-white to-violet-500/10 p-3 dark:border-ink-800 dark:from-accent-500/15 dark:via-ink-900 dark:to-violet-500/15">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-600 text-sm font-semibold text-white shadow-lg shadow-accent-600/20">
            S
          </div>
          <div>
            <p className="text-sm font-semibold">SupportCopilot</p>
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink-500 dark:text-ink-400">Ops HQ</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-sm text-ink-600 dark:border-ink-700/70 dark:bg-ink-950/40 dark:text-ink-400">
          Premium support workflows, built for modern teams.
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-50 text-accent-700 shadow-sm dark:bg-accent-500/10 dark:text-accent-400'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </div>

      {user?.role === 'ADMIN' && (
        <>
          <p className="mt-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-400">Admin</p>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-50 text-accent-700 shadow-sm dark:bg-accent-500/10 dark:text-accent-400'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
              )
            }
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Team
          </NavLink>
          <NavLink
            to="/audit"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-accent-50 text-accent-700 shadow-sm dark:bg-accent-500/10 dark:text-accent-400'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
              )
            }
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Audit Log
          </NavLink>
        </>
      )}

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'mt-auto flex items-center gap-2.5 rounded-xl border border-ink-100/80 px-3 py-2.5 text-sm font-medium transition-all duration-200 dark:border-ink-800',
            isActive
              ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
              : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
          )
        }
      >
        <UserRound className="h-4 w-4" aria-hidden="true" />
        Profile
      </NavLink>
    </nav>
  );
}
