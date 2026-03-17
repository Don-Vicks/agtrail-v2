import { Breadcrumb } from '~/components/breadcrumb';

function StatCard({ label, value, icon, iconBg, iconColor }: { label: string; value: number | string; icon: React.ReactNode; iconBg: string; iconColor: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-1">{label}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`flex size-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        {icon}
      </div>
    </div>
  )
}

export default function CertificationReadiness() {
  return (
    <div className="pb-10">
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              label: 'Dashboard',
              href: '/processor',
              icon: (
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              ),
            },
            { label: 'Certification Readiness' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand">Certification Readiness</h1>
          <p className="text-sm text-gray-500 mt-1">Track your certification progress and requirements</p>
        </div>
        <div className="relative w-full sm:w-[250px]">
          <select className="appearance-none w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-brand outline-none hover:bg-gray-50">
            <option>Select a product...</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Certifications"
          value={4}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          label="In Progress"
          value={4}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
        />
        <StatCard
          label="Completed"
          value={0}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          label="Pending Review"
          value={0}
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>

      {/* Main Empty State Panel */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="mb-4 text-[#cfdfd6]">
          <svg className="size-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Product</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-sm">Choose a product from the dropdown above to view certification readiness.</p>
        <div className="text-xs font-semibold text-gray-400">8 products available</div>
      </div>
    </div>
  )
}
