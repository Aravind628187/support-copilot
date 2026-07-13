import { Sparkles, MessageCircle, Cpu } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function AIPage() {

  return (
    <div className="flex flex-col gap-6">
      <Seo title="AI Assistant" description="AI-powered support drafting and knowledge recommendations." />
      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(2,6,23,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-200">AI assistant</p>
            <h1 className="text-3xl font-semibold">Support intelligence, in-context.</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Generate replies, summarize conversations, and surface knowledge without leaving your workflow.
            </p>
          </div>
          <Button size="sm" variant="secondary">Configure Gemini</Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Draft replies</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Generate polished support responses instantly from any ticket thread.
            </p>
            <Button size="sm">Open assistant</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Knowledge suggestions</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Surface relevant help articles to reduce resolution time and improve consistency.
            </p>
            <Button size="sm" variant="secondary">View suggestions</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Usage analytics</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Track how AI is helping your team and where to optimize across workflows.
            </p>
            <Button size="sm" variant="secondary">Review usage</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
