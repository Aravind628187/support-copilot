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
import { ProfilePage } from './pages/Profile';

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
const CustomersListPage = lazy(() =>
  import('./pages/customers/CustomersList').then((m) => ({ default: m.CustomersListPage })),
);
const CustomerProfilePage = lazy(() =>
  import('./pages/customers/CustomerProfile').then((m) => ({ default: m.CustomerProfilePage })),
);
const AssistantPage = lazy(() => import('./pages/AI').then((m) => ({ default: m.AIPage })));
const AssistantChatPage = lazy(() => import('./pages/assistant/Chat').then((m) => ({ default: m.AssistantChatPage })));
const AnalyticsPage = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('./pages/Reports').then((m) => ({ default: m.ReportsPage })));
const CalendarPage = lazy(() => import('./pages/Calendar').then((m) => ({ default: m.CalendarPage })));
const NotificationsPage = lazy(() => import('./pages/Notifications').then((m) => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then((m) => ({ default: m.SettingsPage })));
const IntegrationsPage = lazy(() => import('./pages/Integrations').then((m) => ({ default: m.IntegrationsPage })));
const KBListPage = lazy(() => import('./pages/kb/KBList').then((m) => ({ default: m.KBListPage })));
const KBArticlePage = lazy(() => import('./pages/kb/KBArticle').then((m) => ({ default: m.KBArticlePage })));
const CustomerCreatePage = lazy(() => import('./pages/customers/CustomerCreate').then((m) => ({ default: m.CustomerCreatePage })));
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
              <Route path="/customers" element={<CustomersListPage />} />
              <Route path="/customers/new" element={<CustomerCreatePage />} />
              <Route path="/customers/:id" element={<CustomerProfilePage />} />
              <Route path="/kb" element={<KBListPage />} />
              <Route path="/kb/:id" element={<KBArticlePage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/assistant/chat" element={<AssistantChatPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

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
