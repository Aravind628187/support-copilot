import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, BookOpen, Users, ShieldCheck } from 'lucide-react';
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
      className="hidden w-56 shrink-0 flex-col gap-1 border-r border-ink-100 bg-white p-3 dark:border-ink-800 dark:bg-ink-900 sm:flex"
    >
      <div className="flex items-center gap-2 px-2 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-accent-500 text-sm font-semibold text-white">
          S
        </div>
        <span className="font-semibold">SupportCopilot</span>
      </div>

      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-micro',
              isActive
                ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
                : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
            )
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}

      {user?.role === 'ADMIN' && (
        <>
          <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Admin</p>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-micro',
                isActive
                  ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
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
                'flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-micro',
                isActive
                  ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
              )
            }
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Audit Log
          </NavLink>
        </>
      )}
    </nav>
  );
}
