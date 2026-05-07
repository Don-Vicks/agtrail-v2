import React from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { Badge } from '~/components/ui/badge'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '~/components/ui/button'

const MOCK_ACTIVITY_DATA = [
  { label: 'Apr 3', value: 30 },
  { label: 'Apr 10', value: 20 },
  { label: 'Apr 17', value: 50 },
  { label: 'Apr 24', value: 40 },
  { label: 'May 1', value: 70 },
  { label: 'May 8', value: 60 },
  { label: 'May 15', value: 90 },
  { label: 'May 22', value: 80 },
  { label: 'May 29', value: 100 },
  { label: 'Jun 5', value: 85 },
  { label: 'Jun 12', value: 110 },
  { label: 'Jun 19', value: 95 },
  { label: 'Jun 26', value: 120 },
]

export default function FarmReportPage() {
  return (
    <ReportLayout
      title="Farm Report"
      subtitle="Complete activity timeline and performance for a specific crop cycle"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Farm Report' },
      ]}
    >
      <div className="space-y-8">
        {/* Filters */}
        <ReportFilter
          filters={[
            {
              label: 'Select Partner',
              placeholder: 'Choose a Partner',
              options: [{ label: 'Agrolinking', value: '1' }],
            },
            {
              label: 'Select Farm',
              placeholder: 'Choose a Farm',
              options: [{ label: 'Baba Beji Farms', value: '1' }],
            },
            {
              label: 'Select Crop',
              placeholder: 'Choose a Crop',
              options: [{ label: 'Maize', value: '1' }],
            },
          ]}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrendStatCard
            title="Quality Score"
            value="89"
            trend={{ value: "+12.5%", isUp: true }}
            description="Trending up this month"
            trendLabel="Visitors for the last 6 months"
          />
          <TrendStatCard
            title="Estimated Yield"
            value="850kg"
            trend={{ value: "+28%", isUp: true }}
            description="Down 20% this period"
            trendLabel="Acquisition needs attention"
          />
          <TrendStatCard
            title="Sustainability"
            value="94"
            trend={{ value: "+12.5%", isUp: true }}
            description="Strong user retention"
            trendLabel="Engagement exceed targets"
          />
        </div>

        {/* Activity Distribution Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Activity Distribution</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total activity last 3 months</p>
          </div>
          <div className="h-[200px] flex items-end pt-10">
            <SimpleAreaChart data={MOCK_ACTIVITY_DATA} height={200} />
          </div>
        </div>

        {/* Farm Performance Summary Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Farm Performance Summary</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Performance metrics across your farm units</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Product ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farm Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farmer Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Exp. Yield (kg)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Exp. Yield (tons)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Hectares</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Compliance Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.from({ length: 12 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">PROD-001</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">Tunde and Co Farms</td>
                    <td className="px-6 py-4 text-xs font-bold text-brand italic">Tunde Alabi</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-brand/10 text-brand border-brand/20 px-2 py-0">Planning</Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">2,500</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">2.50</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">12.5</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 border-orange-100 px-2 py-0">Medium</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="size-8 text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="size-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>0 of 100 row(s) selected.</span>
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select className="bg-transparent border-none outline-none font-extrabold text-gray-900">
                    <option>10</option>
                  </select>
                </div>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Page 1 of 4</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200"><ChevronLeft className="size-4" /></Button>
                  <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200"><ChevronRight className="size-4" /></Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ReportLayout>
  )
}
