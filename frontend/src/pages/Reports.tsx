import { FileText, Download, CalendarDays } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Seo title="Reports" description="Generate support reports and export them for leadership." />

      <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(2,6,23,0.95)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-accent-200">Reports</p>
            <h1 className="text-3xl font-semibold">Executive summaries</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">
              Export weekly and monthly metrics in PDF, Excel, or CSV for leadership review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary">
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button size="sm" variant="secondary">
              <Download className="h-4 w-4" /> Export Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Weekly insights</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Summary of ticket volume, response time, and customer satisfaction per week.
            </p>
            <Button size="sm" variant="secondary">Download weekly report</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent-600" />
              <h2 className="text-sm font-semibold">Monthly scorecard</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Track your top metrics and performance trends across the entire support organization.
            </p>
            <Button size="sm" variant="secondary">Download monthly report</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
