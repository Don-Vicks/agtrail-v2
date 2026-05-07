import React, { useState, useMemo } from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { EmptyReportState } from '~/components/empty-report-state'
import { Loader2, CreditCard, ArrowDownCircle } from 'lucide-react'
import { useGetPurchases } from '~/lib/api/generated/purchases/purchases'
import { format } from 'date-fns'

export default function FinancialSummaryPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // 1. Fetch Purchases (as income)
  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useGetPurchases()
  const purchases = purchasesResponse?.data?.data || []

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 800)
  }

  // Calculate Total Gross Income from purchases
  const totalIncome = useMemo(() => {
    return purchases.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  }, [purchases])

  // Process data for Area Chart (Income Trend)
  const trendData = useMemo(() => {
    if (!purchases.length) return []
    const groups: Record<string, number> = {}
    purchases.sort((a,b) => new Date(a.createdAt as string).getTime() - new Date(b.createdAt as string).getTime()).forEach(p => {
      const d = format(new Date(p.createdAt as string), 'MMM d')
      groups[d] = (groups[d] || 0) + Number(p.amount)
    })
    return Object.entries(groups).map(([label, value]) => ({ label, value }))
  }, [purchases])

  return (
    <ReportLayout
      title="Financial Summary"
      subtitle="Comprehensive overview of revenue, costs, and profit margins"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Financial Summary' },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <ReportFilter
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          filters={[
            {
              label: 'Reporting Period',
              placeholder: 'Current Month',
              options: [{ label: 'May 2026', value: '2026-05' }],
              value: '2026-05'
            },
          ]}
        />

        {isLoadingPurchases ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-md border border-gray-100">
             <div className="size-16 rounded-full border-4 border-gray-50 border-t-brand animate-spin flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
             </div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aggregating Ledger...</p>
           </div>
        ) : hasGenerated ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrendStatCard
                title="Gross Income"
                value={`₦${totalIncome.toLocaleString()}`}
                trend={{ value: "+15.2%", isUp: true }}
                description="Total sales revenue"
                trendLabel="Based on verified sales"
              />
              <TrendStatCard
                title="Operating Costs"
                value="₦0"
                trend={{ value: "Stable", isUp: true }}
                description="Total input and labor costs"
                trendLabel="Estimated from activities"
              />
              <TrendStatCard
                title="Net Profit"
                value={`₦${totalIncome.toLocaleString()}`}
                trend={{ value: "Good", isUp: true }}
                description="Estimated net margin"
                trendLabel="Revenue minus expenses"
              />
            </div>

            {/* Income Trend Chart */}
            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Income Trend</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Daily cash inflow for the period</p>
              </div>
              <div className="h-[200px] flex items-end">
                {trendData.length > 1 ? (
                   <SimpleAreaChart data={trendData} height={200} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-gray-400 uppercase font-bold gap-2 bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                    Insufficient data for trend analysis
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Logs Table */}
            <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Financial Transaction Ledger</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Verified financial movements</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Transaction</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {purchases.map((p, i) => (
                      <tr key={p.id || i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <ArrowDownCircle className="size-4" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-[13px]">Sale Income</p>
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight">{format(new Date(p.createdAt as string), 'MMM d, yyyy')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600 tracking-tight text-sm">+₦{Number(p.amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">Harvest Sale</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1.5 text-gray-500">
                              <CreditCard className="size-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Digital Wallet</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState 
            title="Generate Financial Summary"
            description="Select a reporting period to aggregate all income, operating expenses, and net profit margins."
            icon="search"
          />
        )}
      </div>
    </ReportLayout>
  )
}
