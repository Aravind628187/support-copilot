import type { ReactNode } from 'react';
import { Sparkles, MessageCircle, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function AIPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      <Seo title="AI Assistant" description="AI-powered support drafting, knowledge recommendations, and productivity insights." />

      <div className="rounded-[16px] border border-white/20 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-700 p-6 text-white shadow-[0_24px_72px_-32px_rgba(2,6,23,0.78)]">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-200">AI command center</p>
            <h1 className="text-3xl font-semibold tracking-tight">AI that makes every support interaction smarter</h1>
            <p className="max-w-2xl text-sm leading-6 text-white/80">
              Generate responses, summarize conversations, and surface knowledge suggestions across your support queue with enterprise-grade accuracy.
            </p>
          </div>
          <div className="rounded-[16px] border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">AI performance</p>
            <p className="mt-3 text-2xl font-semibold text-white">78% draft adoption</p>
            <p className="mt-2 text-sm text-white/70">Average time saved per conversation across the last 30 days.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <FeatureCard
          icon={<Sparkles className="h-5 w-5 text-accent-600" />}
          title="Draft replies"
          description="Create polished support responses from any ticket thread in seconds."
          cta="Open assistant"
        />
        <FeatureCard
          icon={<MessageCircle className="h-5 w-5 text-accent-600" />}
          title="Knowledge suggestions"
          description="Surface relevant help articles and reduce manual lookup time."
          cta="View suggestions"
          secondary
        />
        <FeatureCard
          icon={<Cpu className="h-5 w-5 text-accent-600" />}
          title="Usage analytics"
          description="Track AI adoption, top users, and performance impact across teams."
          cta="Review usage"
          secondary
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5 text-accent-600" />}
          title="Automations"
          description="Trigger AI workflows on recurring ticket types and reduce repetitive work."
          cta="Configure flows"
          secondary
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Compliance-ready AI</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Control how AI drafts are stored, reviewed, and published across your support organization.
            </p>
            <Button size="sm" variant="secondary" onClick={() => navigate('/settings')}>
              Review policies
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Knowledge pulse</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              AI recommendations are aligned with your internal knowledge base and latest product updates.
            </p>
            <Button size="sm" variant="secondary" onClick={() => navigate('/kb')}>
              Sync knowledge
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Performance insights</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Identify the workflows where AI delivers the greatest time savings and consistency gains.
            </p>
            <Button size="sm" variant="secondary" onClick={() => navigate('/analytics')}>
              View insights
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  cta,
  secondary,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  secondary?: boolean;
}) {
  const navigate = useNavigate();

  function handleCta() {
    const destinations: Record<string, string> = {
      'Open assistant': '/assistant/chat',
      'View suggestions': '/kb',
      'Review usage': '/analytics',
      'Configure flows': '/integrations',
    };
    navigate(destinations[cta] ?? '/assistant/chat');
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">{icon}</div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-950 dark:text-ink-100">{title}</h3>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{description}</p>
        </div>
        <Button size="sm" variant={secondary ? 'secondary' : 'primary'} onClick={handleCta}>
          {cta}
        </Button>
      </CardBody>
    </Card>
  );
}
