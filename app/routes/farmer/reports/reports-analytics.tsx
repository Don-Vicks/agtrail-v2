import { Breadcrumb } from '~/components/breadcrumb'
import type { Route } from './+types/reports-analytics'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Reports & Analytics | Agtrail' },
    { name: 'description', content: 'Access your farm insights and documentation' },
  ]
}

/* ─── Icons ─── */
function SeedlingIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> {/* Approximate icon for crop */}
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function DollarIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

/* ─── Helper Component ─── */
function ReportCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10">
          {icon}
        </div>
        {/* Text */}
        <div>
          <h3 className="text-base font-bold text-brand">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {/* View Button */}
      <button className="flex h-9 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1b5e20]">
        <EyeIcon />
        View
      </button>
    </div>
  )
}

/* ─── Page Component ─── */
export default function ReportsAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Reports & Analytics' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold uppercase text-brand">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Access your farm insights and documentation</p>
      </div>

      {/* Production Reports */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-brand">Production Reports</h2>
        <div className="space-y-4">
          <ReportCard
            icon={<SeedlingIcon />}
            title="Crop Cycle Summary"
            description="Complete activity timeline and performance for a specific crop cycle"
          />
          <ReportCard
            icon={<TrendingUpIcon />}
            title="Harvest & Sales Report"
            description="All harvests, sales, payments, and buyer information"
          />
          <ReportCard
            icon={<BarChartIcon />}
            title="Farm Report"
            description="Comprehensive overview of farm activities, infrastructure, and status"
          />
        </div>
      </div>

      {/* Financial Reports */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-brand">Financial Reports</h2>
        <div className="space-y-4">
          <ReportCard
            icon={<DollarIcon />}
            title="Financial Summary"
            description="Revenue, costs, profit margins, and wallet activity"
          />
          <ReportCard
            icon={<CreditCardIcon />}
            title="Payment History"
            description="All payments received from buyers and token rewards"
          />
        </div>
      </div>
    </div>
  )
}
