import React from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { Badge } from '~/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function PaymentHistoryPage() {
  return (
    <ReportLayout
      title="Payment History"
      subtitle="Track all payments, rewards, and financial transactions"
      breadcrumb={[
        { label: 'Dashboard', href: '/farmer' },
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Payment History' },
      ]}
    >
      <div className="space-y-8">
        {/* Filters */}
        <ReportFilter
          filters={[
            {
              label: 'Select Farmer',
              placeholder: 'All Farmers',
              options: [{ label: 'Agrolinking Admin', value: '1' }],
            },
            {
              label: 'Payment Type',
              placeholder: 'All Types',
              options: [
                { label: 'Receivable', value: 'receivable' },
                { label: 'Purchase', value: 'purchase' },
              ],
            },
          ]}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrendStatCard
            title="Total Received"
            value="₦10K"
            trend={{ value: "+12.5%", isUp: true }}
            description="From receivables and sales"
            trendLabel="Engagement exceed targets"
          />
          <TrendStatCard
            title="Total Paid"
            value="₦5K"
            trend={{ value: "-20%", isUp: false }}
            description="For purchases and expenses"
            trendLabel="Acquisition needs attention"
          />
          <TrendStatCard
            title="Net Balance"
            value="₦5K"
            trend={{ value: "+12.5%", isUp: true }}
            description="Received minus paid"
            trendLabel="Trending up this month"
          />
          <TrendStatCard
            title="Token Rewards"
            value="₦0"
            trend={{ value: "0%", isUp: true }}
            description="Earned from activities"
            trendLabel="Stable this month"
          />
        </div>

        {/* Payment Timeline Chart Placeholder */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Payment Timeline</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Received vs Paid over the last 6 months</p>
          </div>
          
          <div className="h-40 w-full relative border-b border-gray-100 mb-10">
            {/* Simple static lines for the screenshot look */}
            <div className="absolute top-1/4 w-full h-0.5 bg-green-500" />
            <div className="absolute top-2/3 w-full h-0.5 bg-orange-500" />
            <div className="absolute bottom-[-20px] left-0 text-[10px] font-bold text-gray-400 uppercase">Jan</div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Received</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Paid</span>
            </div>
          </div>
        </div>

        {/* All Payments Table */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">All Payments</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Complete history of all financial transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Transaction ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Payment Method</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { id: 'TRX-7E005443', date: 'Jan 7, 2026', type: 'Receivable', desc: 'No desc here', amount: '₦5,000', method: '-', status: 'Received', statusColor: 'bg-green-50 text-green-600 border-green-100' },
                  { id: 'TRX-95E97563', date: 'Jan 7, 2026', type: 'Receivable', desc: 'No desc for this', amount: '₦5,000', method: '-', status: 'Received', statusColor: 'bg-green-50 text-green-600 border-green-100' },
                  { id: 'TRX-6759A30E', date: 'Jan 7, 2026', type: 'Purchase', desc: 'No desc. here', amount: '₦5,000', method: 'cash', status: 'Paid', statusColor: 'bg-orange-50 text-orange-600 border-orange-100' },
                ].map((trx, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">{trx.id}</td>
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">{trx.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-green-50 text-green-600 border-green-100 px-2 py-0">{trx.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{trx.desc}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{trx.amount}</td>
                    <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trx.method}</td>
                    <td className="px-6 py-4">
                       <span className={cn("text-[10px] font-bold uppercase tracking-widest", trx.status === 'Paid' ? 'text-orange-500' : 'text-brand')}>
                        {trx.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between">
             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select className="bg-transparent border-none outline-none font-extrabold text-gray-900">
                    <option>10</option>
                  </select>
                </div>
                <span>1-3 of 3</span>
             </div>
             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="rounded-md border-gray-200 h-9 font-bold px-4" disabled>Previous</Button>
                  <span className="px-2">Page 1 of 1</span>
                  <Button variant="outline" size="sm" className="rounded-md border-gray-200 h-9 font-bold px-4">Next</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ReportLayout>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
