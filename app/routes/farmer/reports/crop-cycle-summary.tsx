import React from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { Badge } from '~/components/ui/badge'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '~/components/ui/button'

const MOCK_ACTIVITY_DATA = [
  { label: 'Apr 3', value: 20 },
  { label: 'Apr 10', value: 45 },
  { label: 'Apr 17', value: 30 },
  { label: 'Apr 24', value: 55 },
  { label: 'May 1', value: 40 },
  { label: 'May 8', value: 70 },
  { label: 'May 15', value: 50 },
  { label: 'May 22', value: 85 },
  { label: 'May 29', value: 60 },
  { label: 'Jun 5', value: 95 },
  { label: 'Jun 12', value: 75 },
  { label: 'Jun 19', value: 80 },
  { label: 'Jun 26', value: 65 },
]

export default function CropCycleSummaryPage() {
  return (
    <ReportLayout
      title="Crop Cycle Summary"
      subtitle="Complete activity timeline and performance for a specific crop cycle"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Crop Cycle Summary' },
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

        {/* Input Usage & Costs Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Input Usage & Costs</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total for the last 3 months</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Input</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Usage</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'NPK Fertilizer', qty: 'Paid', usage: 'Credit Card', cost: '$2,500.00' },
                  { name: 'Organic Compost', qty: 'Pending', usage: 'PayPal', cost: '$1,50.00' },
                  { name: 'Pest Control (Organic)', qty: 'Unpaid', usage: 'Bank Transfer', cost: '$3,50.00' },
                  { name: 'Irrigation Water', qty: 'Paid', usage: 'Credit Card', cost: '$4,50.00' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{item.qty}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">{item.usage}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{item.cost}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50/30">
                  <td colSpan={3} className="px-6 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-right font-extrabold text-gray-900 text-base">$2,500.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Complete Activity Timeline</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total for the last 3 months</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-0 mt-1 size-10 flex items-center justify-center rounded-full bg-brand/10 border-4 border-white z-10">
                  <div className="size-3 rounded-full bg-brand" />
                </div>
                
                <div className="rounded-xl border border-gray-100 p-6 bg-gray-50/30">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 uppercase tracking-tight">Land Preparation</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Clearing and preparing the land for farming</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                          <p className="text-[11px] font-bold text-gray-900">20th September 2024</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
                          <p className="text-[11px] font-bold text-gray-900">10:00 AM</p>
                        </div>
                      </div>
                   </div>

                   <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    This region has a tropical climate ensuring the soil will remain natural fertility, our review of previous reports and weather maps established a Sustainability Score of 84. The region usually experiences rain with sessions of clouding that will favor our farmers and yield.
                   </p>

                   <div className="border-t border-gray-100 pt-4">
                      <p className="text-[10px] font-extrabold text-gray-900 uppercase tracking-widest mb-3">Operational Details</p>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Tillage</span>
                          <span className="text-[10px] font-bold text-gray-900">Not Applicable</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Conservation Structure</span>
                          <span className="text-[10px] font-bold text-gray-900">Contour Ploughing</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Clearing Method</span>
                          <span className="text-[10px] font-bold text-gray-900">Manual Clearing</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Equipment</span>
                          <span className="text-[10px] font-bold text-gray-900">Tractor</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportLayout>
  )
}
