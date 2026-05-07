import React from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { DonutChart, SimpleBarChart } from '~/components/charts/report-charts'
import { Badge } from '~/components/ui/badge'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function HarvestSalesReportPage() {
  return (
    <ReportLayout
      title="Harvest & Sales Report"
      subtitle="Complete activity timeline and performance for a specific crop cycle"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Harvest & Sales Report' },
      ]}
    >
      <div className="space-y-8">
        {/* Filters */}
        <ReportFilter
          filters={[
            {
              label: 'Select Year',
              placeholder: 'Choose Year',
              options: [{ label: '2024', value: '2024' }],
            },
            {
              label: 'Select Farmer',
              placeholder: 'Choose a Farmer',
              options: [{ label: 'Agrolinking Admin', value: '1' }],
            },
            {
              label: 'Select Farm',
              placeholder: 'Choose Farm',
              options: [{ label: 'Baba Beji Farms', value: '1' }],
            },
          ]}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrendStatCard
            title="Total Harvested"
            value="4,980kg"
            trend={{ value: "+12.5%", isUp: true }}
            description="Trending up this month"
            trendLabel="Visitors for the last 6 months"
          />
          <TrendStatCard
            title="Total Revenue"
            value="₦987,500"
            trend={{ value: "-20%", isUp: false }}
            description="Down 20% this period"
            trendLabel="Acquisition needs attention"
          />
          <TrendStatCard
            title="Sustainability"
            value="₦232"
            trend={{ value: "+12.5%", isUp: true }}
            description="Strong user retention"
            trendLabel="Engagement exceed targets"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Crop Distribution</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">January - June 2024</p>
            </div>
            <div className="py-4">
              <DonutChart 
                centerLabel="Crops" 
                centerValue="5" 
                data={[
                  { label: 'Maize', value: 40, color: '#1B4332' },
                  { label: 'Rice', value: 25, color: '#2D6A4F' },
                  { label: 'Beans', value: 15, color: '#40916C' },
                  { label: 'Pepper', value: 10, color: '#52B788' },
                  { label: 'Yam', value: 10, color: '#74C69D' },
                ]}
              />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Trending up by 5.2% this month</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">Showing total visitors for the last 6 months</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Crop Sales Revenue</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">January - June 2024</p>
            </div>
            <div className="py-4">
              <SimpleBarChart 
                data={[
                  { label: 'Tomato', value: 65 },
                  { label: 'Rice', value: 75 },
                  { label: 'Beans', value: 100 },
                  { label: 'Pepper', value: 80 },
                  { label: 'Yam', value: 40 },
                ]}
              />
            </div>
             <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Trending up by 5.2% this month</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">Showing total visitors for the last 6 months</p>
            </div>
          </div>
        </div>

        {/* Recent Harvest Batches Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Recent Harvest Batches</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Performance metrics by geographic region</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Batch ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Crop</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Exp. Yield (kg)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Qty Harvested (kg)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Qty Purchased</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">HRV-001</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">Cassava</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Oct 8, 2024</td>
                    <td className="px-6 py-4 font-bold text-brand">200</td>
                    <td className="px-6 py-4 font-bold text-gray-900">180</td>
                    <td className="px-6 py-4 font-bold text-gray-900">180</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border-red-100 px-2 py-0">Purchased</Badge>
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
