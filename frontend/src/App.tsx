import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AppShell } from './components/layout/AppShell';
import { RequireAuth, RequireAdmin } from './components/auth/RequireAuth';
import { LoginPage } from './pages/auth/Login';
import { SignupPage } from './pages/auth/Signup';
import { ForgotPasswordPage } from './pages/auth/ForgotPassword';
import { ResetPasswordPage } from './pages/auth/ResetPassword';
import { VerifyEmailPage } from './pages/auth/VerifyEmail';
import { NotFoundPage } from './pages/NotFound';

// Route-level code splitting: the dashboard (recharts) and ticket detail
// (message thread + AI drafting) are the heaviest screens, so they ship in
// their own chunks instead of bloating the initial bundle every visitor pays
// for just to reach the login screen.
const DashboardPage = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })));
const TicketsListPage = lazy(() =>
  import('./pages/tickets/TicketsList').then((m) => ({ default: m.TicketsListPage })),
);
const TicketDetailPage = lazy(() =>
  import('./pages/tickets/TicketDetail').then((m) => ({ default: m.TicketDetailPage })),
);
const KBListPage = lazy(() => import('./pages/kb/KBList').then((m) => ({ default: m.KBListPage })));
const KBArticlePage = lazy(() => import('./pages/kb/KBArticle').then((m) => ({ default: m.KBArticlePage })));
const TeamPage = lazy(() => import('./pages/Team').then((m) => ({ default: m.TeamPage })));
const AuditLogPage = lazy(() => import('./pages/AuditLog').then((m) => ({ default: m.AuditLogPage })));

function RouteFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-ink-400" aria-label="Loading page" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tickets" element={<TicketsListPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/kb" element={<KBListPage />} />
              <Route path="/kb/:id" element={<KBArticlePage />} />

              <Route element={<RequireAdmin />}>
                <Route path="/team" element={<TeamPage />} />
                <Route path="/audit" element={<AuditLogPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
