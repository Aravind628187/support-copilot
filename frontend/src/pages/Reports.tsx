import { FileText, Download, CalendarDays, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ticketsExportCsvUrl } from '../api/tickets';

const reportCards = [
  {
    title: 'Weekly insights',
    description: 'Ticket volume, response time, and customer satisfaction across the past seven days.',
    icon: CalendarDays,
    action: 'Download weekly',
  },
  {
    title: 'Monthly scorecard',
    description: 'Performance trends and service level compliance for leadership reviews.',
    icon: FileText,
    action: 'Download monthly',
  },
  {
    title: 'Executive snapshot',
    description: 'High-level KPIs to share with executives and support stakeholders.',
    icon: TrendingUp,
    action: 'Download snapshot',
  },
];

const recentExports = [
  { name: 'Customer success report', type: 'PDF', date: 'Today, 10:24 AM' },
  { name: 'Weekly support scorecard', type: 'Excel', date: 'Yesterday, 4:10 PM' },
  { name: 'SLA compliance summary', type: 'CSV', date: 'Jul 10, 2026' },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const exportUrl = ticketsExportCsvUrl({});
  return (
    <div className="flex flex-col gap-6">
      <Seo title="Reports" description="Generate support reports and export them for leadership review." />

      <div className="rounded-[16px] border border-white/20 bg-gradient-to-br from-ink-950 via-ink-900 to-accent-700 p-6 text-white shadow-[0_24px_72px_-32px_rgba(2,6,23,0.78)]">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-accent-200">Reports</p>
            <h1 className="text-3xl font-semibold tracking-tight">Enterprise-ready insights for support leadership</h1>
            <p className="max-w-2xl text-sm leading-6 text-white/80">
              Export executive summaries, scorecards, and operational reports for stakeholders, compliance reviews, and planning sessions.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Last export</p>
            <p className="mt-4 text-lg font-semibold text-white">Weekly support scorecard</p>
            <p className="mt-2 text-sm text-white/70">PDF exported 25 minutes ago</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent-600" />
                  <h2 className="text-sm font-semibold">{card.title}</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-ink-500 dark:text-ink-400">{card.description}</p>
                <a href={exportUrl} download>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" /> {card.action} (CSV)
                  </Button>
                </a>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Recent exports</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">Review the latest generated report files and download history.</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigate('/tickets')}>
              <ArrowRight className="h-4 w-4" /> View all exports
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-100 text-xs uppercase tracking-[0.24em] text-ink-400 dark:border-ink-800">
              <tr>
                <th className="px-5 py-4">Report</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Generated</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentExports.map((item) => (
                <tr key={item.name} className="border-b border-ink-100 dark:border-ink-800">
                  <td className="px-4 py-3 font-semibold text-ink-950 dark:text-ink-100">{item.name}</td>
                  <td className="px-4 py-3 text-ink-600 dark:text-ink-400">{item.type}</td>
                  <td className="px-4 py-3 text-ink-600 dark:text-ink-400">{item.date}</td>
                  <td className="px-4 py-3">
                    <a href={exportUrl} download>
                      <Button size="sm" variant="secondary">Download CSV</Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
