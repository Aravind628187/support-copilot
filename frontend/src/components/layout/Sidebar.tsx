import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  BookOpen,
  Users,
  ShieldCheck,
  UserRound,
  BarChart3,
  Sparkles,
  FileText,
  CalendarCheck,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const primaryNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/kb', label: 'Knowledge Base', icon: BookOpen },
];

const secondaryNavItems = [
  { to: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/calendar', label: 'Calendar', icon: CalendarCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { to: '/team', label: 'Team', icon: Users },
  { to: '/audit', label: 'Audit Log', icon: ShieldCheck },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-72 shrink-0 flex-col gap-3 border-r border-ink-100 bg-white/80 p-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80 sm:flex"
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

      <div className="mt-3 flex flex-col gap-1">
        {primaryNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-accent-50 text-accent-700 shadow-sm shadow-accent-500/10 dark:bg-accent-500/10 dark:text-accent-300'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
              )
            }
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-50 text-ink-700 dark:bg-ink-900 dark:text-ink-300">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-ink-100/80 bg-ink-50/70 p-4 text-sm dark:border-ink-800 dark:bg-ink-950/70">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-400 dark:text-ink-500">
          Operations
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {secondaryNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all duration-200',
                  isActive
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                    : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
                )
              }
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-100 text-ink-600 dark:bg-ink-900 dark:text-ink-400">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div className="mt-4 rounded-3xl border border-ink-100/80 bg-ink-50/70 p-4 text-sm dark:border-ink-800 dark:bg-ink-950/70">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-400 dark:text-ink-500">Admin</p>
          <div className="mt-3 flex flex-col gap-1">
            {adminNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
                  )
                }
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-100 text-ink-600 dark:bg-ink-900 dark:text-ink-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto rounded-3xl border border-ink-100/80 bg-ink-50/70 p-4 text-sm dark:border-ink-800 dark:bg-ink-950/70">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-500 dark:text-ink-400">
          Enterprise workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-400">
          Access workspace controls, user settings, and support intelligence from one polished console.
        </p>
      </div>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'mt-4 flex items-center gap-2.5 rounded-2xl border border-ink-100/80 bg-white/95 px-3 py-3 text-sm font-medium shadow-sm transition-all duration-200 dark:border-ink-800 dark:bg-ink-900/95',
            isActive
              ? 'text-accent-700 dark:text-accent-300'
              : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800',
          )
        }
      >
        <UserRound className="h-5 w-5" aria-hidden="true" />
        Profile
      </NavLink>
    </nav>
  );
}
