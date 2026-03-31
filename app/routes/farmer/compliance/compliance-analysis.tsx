import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import type { Route } from './+types/compliance-analysis'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance Analysis | Agtrail' },
    { name: 'description', content: 'Risk assessment and compliance status across your products' },
  ]
}

/* ─── Icons ─── */
function ShieldCheck() {
  return (
    <svg className="size-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function AlertCircle() {
  return (
    <svg className="size-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TrendUp() {
  return (
    <svg className="size-6 text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function CheckCircle() {
  return (
    <svg className="size-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg className="size-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

/* ─── Mock Data ─── */
const COMPLIANCE_DATA = [
  {
    id: 1,
    product: 'Maize',
    batchId: 'BATCH-8022dd4d-1770974808765',
    category: 'Agricultural Product',
    origin: 'N/A',
    riskLevel: 'Medium',
    complianceScore: 0,
    certifications: 0,
    alerts: 0,
    lastAudit: 'Never',
  }
]

/* ─── Page Component ─── */
export default function ComplianceAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('')

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Breadcrumbs */}
      <div>
        <PageHeader
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
            { label: 'Compliance Analysis' },
          ]}
        />
        <div className="mt-4" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2e7d32]">Compliance Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">Risk assessment and compliance status across your products</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
              <DocumentIcon />
              Export CSV
            </button>
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#2e7d32] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1b5e20]">
              <DownloadIcon />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Compliance */}
        <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Compliance</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">0%</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <ShieldCheck />
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-12 rounded-full bg-[#8d6e63]"></div>
          </div>
        </div>

        {/* High Risk */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">High Risk</p>
            <p className="mt-1 text-3xl font-bold text-[#ef4444]">0</p>
            <p className="mt-1 text-xs text-gray-500">Products need attention</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
            <AlertCircle />
          </div>
        </div>

        {/* Medium Risk */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Medium Risk</p>
            <p className="mt-1 text-3xl font-bold text-[#f59e0b]">1</p>
            <p className="mt-1 text-xs text-gray-500">Under review</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-50">
            <TrendUp />
          </div>
        </div>

        {/* Low Risk */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-gray-500">Low Risk</p>
            <p className="mt-1 text-3xl font-bold text-[#22c55e]">0</p>
            <p className="mt-1 text-xs text-gray-500">Compliant</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
            <CheckCircle />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="relative">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Product Compliance Overview</h2>
          <p className="text-sm text-gray-500">Real-time compliance status across your products</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Origin</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Risk Level</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Compliance Score</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Certifications</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Alerts</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Last Audit</th>
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE_DATA.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30">
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">{row.product}</div>
                    <div className="text-xs text-gray-400">{row.batchId}</div>
                  </td>
                  <td className="px-4 py-4 font-medium">{row.category}</td>
                  <td className="px-4 py-4 font-bold text-gray-900">{row.origin}</td>
                  <td className="px-4 py-4">
                    {row.riskLevel === 'Medium' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 border border-yellow-200/60">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {row.riskLevel}
                      </span>
                    )}
                    {/* Add other risk levels if mock data requires */}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{row.complianceScore}%</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-[#8d6e63]"
                          style={{ width: '40%' /* visually approximating the screenshot */ }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#22c55e]">{row.certifications}</td>
                  <td className="px-4 py-4 text-gray-500">{row.alerts}</td>
                  <td className="px-4 py-4 text-gray-500">{row.lastAudit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
