import { useMemo } from 'react'
import { PageHeader } from '~/components/page-header'
import { ReportMetricsBar } from '~/components/compliance/report-metrics'
import { ReportSidebar } from '~/components/compliance/report-sidebar'
import { ReportOverview } from '~/components/compliance/report-overview'
import { ReportGeolocation } from '~/components/compliance/report-geolocation'
import { ReportRegulatory } from '~/components/compliance/report-regulatory'
import { Button } from '~/components/ui/button'
import { Download, ExternalLink, Globe, CheckCircle2 } from 'lucide-react'
import { cn } from '~/lib/utils'

export default function ComplianceReportPage() {
  return (
    <div className="w-full space-y-6 pb-20 text-left">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/farmer' },
          { label: 'Compliance Check' },
          { label: 'Compliance Report' },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-brand tracking-tight">EUDR Compliance Report</h1>
          <p className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Globe className="size-3" /> Region: South America
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 border-gray-200 text-gray-700 font-bold text-[9px] uppercase tracking-widest px-5 rounded shadow-sm hover:bg-gray-50">
            <Download className="size-3.5 mr-2" /> Download PDF
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand-light text-white font-bold text-[9px] uppercase tracking-widest px-5 rounded shadow-lg transition-all active:scale-95">
            <ExternalLink className="size-3.5 mr-2" /> Export for Regulator
          </Button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-100 -mx-8 px-8 py-3 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0">
            <h2 className="text-xs font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Kaduna, Nigeria</p>
          </div>
        </div>
        <ReportMetricsBar />
      </div>

      <div className="bg-brand-lighter/5 -mx-8 px-8 py-12 rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl mx-auto">
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            <ReportSidebar />
          </div>

          <div className="lg:col-span-9 space-y-12">
            <ReportOverview />
            <ReportGeolocation />
            <ReportRegulatory />
          </div>
        </div>
      </div>
    </div>
  )
}

