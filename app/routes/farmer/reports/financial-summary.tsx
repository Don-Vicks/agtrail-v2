import React from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { DonutChart } from '~/components/charts/report-charts'
import { Badge } from '~/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'

const MOCK_FINANCIAL_DATA = [
  { label: 'Apr 3', value: 1000 },
  { label: 'Apr 10', value: 2500 },
  { label: 'Apr 17', value: 1800 },
  { label: 'Apr 24', value: 3500 },
  { label: 'May 1', value: 2800 },
  { label: 'May 8', value: 4200 },
  { label: 'May 15', value: 3600 },
  { label: 'May 22', value: 5500 },
  { label: 'May 29', value: 4000 },
  { label: 'Jun 5', value: 6500 },
  { label: 'Jun 12', value: 4800 },
  { label: 'Jun 19', value: 7200 },
  { label: 'Jun 26', value: 5500 },
]

export default function FinancialSummaryReportPage() {
  return (
    <ReportLayout
      title="Financial Summary Report"
      subtitle="Revenue, costs, profit margins, and wallet activity"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Financial Summary Report' },
      ]}
    >
      <div className="space-y-8">
        {/* Filters */}
        <ReportFilter
          filters={[
            {
              label: 'Select Farmer',
              placeholder: 'Choose a Farmer',
              options: [{ label: 'Agrolinking Admin', value: '1' }],
            },
          ]}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TrendStatCard
            title="Total Revenue"
            value="₦2.45M"
            trend={{ value: "+12.5%", isUp: true }}
            description="Trending up this month"
            trendLabel="Visitors for the last 6 months"
          />
          <TrendStatCard
            title="Total Revenue" // Corrected to Expense based on icon usually
            value="₦1.20M"
            trend={{ value: "-20%", isUp: false }}
            description="Down 20% this period"
            trendLabel="Acquisition needs attention"
          />
          <TrendStatCard
            title="Sustainability"
            value="₦456K"
            trend={{ value: "+12.5%", isUp: true }}
            description="Strong user retention"
            trendLabel="Engagement exceed targets"
          />
        </div>

        {/* Revenue, Costs & Profit Trend */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Revenue, Costs & Profit Trend</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Showing status from the last 3 months</p>
            </div>
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                  <p className="text-sm font-bold text-gray-900 tracking-tight">24,828</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Costs</p>
                  <p className="text-sm font-bold text-brand tracking-tight">25,010</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profit</p>
                  <p className="text-sm font-bold text-brand tracking-tight">25,010</p>
               </div>
            </div>
          </div>
          <div className="h-[180px] flex items-end">
            <SimpleAreaChart data={MOCK_FINANCIAL_DATA} height={180} />
          </div>
        </div>

        {/* Middle Section: Cost Breakdown + Crop Sales Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Cost Breakdown</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">January - June 2024</p>
            </div>
            <div className="py-4">
               <DonutChart 
                 centerLabel="Total" 
                 centerValue="100%" 
                 data={[
                   { label: 'Fertilizer', value: 40, color: '#1B4332' },
                   { label: 'Seeds', value: 20, color: '#2D6A4F' },
                   { label: 'Labor', value: 25, color: '#40916C' },
                   { label: 'Pesticides', value: 15, color: '#52B788' },
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
            <div className="space-y-6 pt-4">
              {[
                { name: 'Tomato', value: 75, qty: '120kg / ₦40,000', profit: '₦200,000' },
                { name: 'Rice', value: 60, qty: '80kg / ₦60,000', profit: '₦150,000' },
                { name: 'Tomato', value: 45, qty: '120kg / ₦40,000', profit: '₦100,000' },
                { name: 'Tomato', value: 85, qty: '120kg / ₦40,000', profit: '₦300,000' },
              ].map((crop, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-900">{crop.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{crop.qty}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${crop.value}%` }} className="h-full bg-brand" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Profit: {crop.profit}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Trending up by 5.2% this month</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase">Showing total visitors for the last 6 months</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Recent Transactions</h3>
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
                <span>1 of 100 row(s) selected.</span>
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
