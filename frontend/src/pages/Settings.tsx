import { useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const navigate = useNavigate();
  const sections = useMemo(
    () => [
      { title: 'Workspace', description: 'Workspace name, branding, and default behavior.' },
      { title: 'SMTP', description: 'Email settings for notifications and customer replies.' },
      { title: 'Gemini AI', description: 'Configure AI drafting and knowledge retrieval.' },
      { title: 'Branding', description: 'Logo, colors, and customer-facing styling.' },
      { title: 'Permissions', description: 'Admin, agent, and role-based access controls.' },
      { title: 'Security', description: 'Password policy, MFA, and active sessions.' },
      { title: 'API Keys', description: 'Manage API access for integrations and automations.' },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Settings" description="Manage workspace, security, and integrations." />

      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-accent-600 via-indigo-600 to-violet-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(54,84,209,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-100">Settings</p>
            <h1 className="text-3xl font-semibold">Workspace controls</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Configure your support platform for enterprise scale, security, and AI-driven workflows.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/profile')}>Review settings</Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-accent-600" />
                <h2 className="text-sm font-semibold">{section.title}</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <p className="text-sm text-ink-500 dark:text-ink-400">{section.description}</p>
              <Button size="sm" variant="secondary" onClick={() => navigate(settingsDestination(section.title))}>Open</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function settingsDestination(section: string) {
  const destinations: Record<string, string> = {
    Workspace: '/profile',
    SMTP: '/notifications',
    'Gemini AI': '/assistant',
    Branding: '/profile',
    Permissions: '/team',
    Security: '/profile',
    'API Keys': '/integrations',
  };
  return destinations[section] ?? '/profile';
}
