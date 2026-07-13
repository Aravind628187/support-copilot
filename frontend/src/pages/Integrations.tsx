import { Zap, Slack, Github, Gitlab, Globe2, Mail, Sparkles, Link2 } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const integrations = [
  { name: 'Slack', description: 'Real-time ticket updates and customer alerts.', status: 'Connected', icon: Slack },
  { name: 'Discord', description: 'Team collaboration and incident notifications.', status: 'Available', icon: Sparkles },
  { name: 'Microsoft Teams', description: 'Embed support alerts inside your Teams channels.', status: 'Available', icon: Link2 },
  { name: 'Gmail', description: 'Sync inbound customer emails to tickets automatically.', status: 'Connected', icon: Mail },
  { name: 'Outlook', description: 'Route Outlook threads into your support queue.', status: 'Available', icon: Mail },
  { name: 'GitHub', description: 'Link issues and deploy status to support tickets.', status: 'Connected', icon: Github },
  { name: 'GitLab', description: 'Sync GitLab issues and merge requests with customer cases.', status: 'Available', icon: Gitlab },
  { name: 'Jira', description: 'Create Jira stories directly from support escalations.', status: 'Available', icon: Globe2 },
  { name: 'Zapier', description: 'Automate workflows between SupportCopilot and 5,000+ apps.', status: 'Connected', icon: Zap },
  { name: 'Google Drive', description: 'Attach Drive files to tickets and knowledge articles.', status: 'Available', icon: Globe2 },
  { name: 'Dropbox', description: 'Access shared documents while responding to customers.', status: 'Available', icon: Globe2 },
  { name: 'OpenAI', description: 'Power AI replies with OpenAI models and prompt templates.', status: 'Connected', icon: Sparkles },
  { name: 'Gemini', description: 'Use Gemini for richer responses and context-aware suggestions.', status: 'Connected', icon: Sparkles },
  { name: 'Stripe', description: 'Sync invoices and payment activity with customer records.', status: 'Available', icon: Globe2 },
];

export function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Seo title="Integrations" description="Connect your support workspace with enterprise tools." />
      <div className="rounded-[16px] border border-ink-200/80 bg-gradient-to-br from-accent-600 via-violet-600 to-purple-700 p-5 text-white shadow-[0_24px_72px_-30px_rgba(54,84,209,0.85)] dark:border-ink-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent-100">Integrations</p>
            <h1 className="text-3xl font-semibold">Connect your stack</h1>
            <p className="max-w-2xl text-sm text-white/80">
              Integrate SupportCopilot with your customer, collaboration, and AI tools for frictionless operations.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            Add custom integration
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.name} className="overflow-hidden">
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-700 dark:bg-ink-900 dark:text-ink-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-ink-950 dark:text-ink-100">{integration.name}</p>
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={integration.status === 'Connected' ? 'success' : 'accent'}>
                    {integration.status}
                  </Badge>
                  <Button size="sm" variant={integration.status === 'Connected' ? 'secondary' : 'primary'}>
                    {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
