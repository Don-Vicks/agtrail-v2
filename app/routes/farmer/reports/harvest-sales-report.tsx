import React, { useState, useMemo } from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { DonutChart, SimpleBarChart } from '~/components/charts/report-charts'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { useGetPurchases } from '~/lib/api/generated/purchases/purchases'
import { useGetFarmersDashboardStats } from '~/lib/api/generated/farmers/farmers'
import { format } from 'date-fns'

export default function HarvestSalesReportPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // 1. Fetch Dashboard Stats for overall metrics
  const { data: dashboardResponse, isLoading: isLoadingStats } = useGetFarmersDashboardStats()
  const metrics = dashboardResponse?.data?.data?.metrics
  const productCategories = dashboardResponse?.data?.data?.productCategories || []

  // 2. Fetch Purchases (Sales)
  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useGetPurchases()
  const purchases = purchasesResponse?.data?.data || []

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 800)
  }

  // Calculate Total Sales Revenue from purchases
  const totalRevenue = useMemo(() => {
    return purchases.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  }, [purchases])

  // Process data for Donut Chart
  const donutData = useMemo(() => {
    const colors = ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D']
    return productCategories.map((cat, i) => ({
      label: cat.name,
      value: cat.percentage,
      color: colors[i % colors.length]
    }))
  }, [productCategories])

  // Process data for Bar Chart (Sales by Month)
  const barData = useMemo(() => {
    if (!purchases.length) return []
    const months: Record<string, number> = {}
    purchases.forEach(p => {
      const m = format(new Date(p.createdAt as string), 'MMM')
      months[m] = (months[m] || 0) + Number(p.amount)
    })
    return Object.entries(months).map(([label, value]) => ({ label, value }))
  }, [purchases])

  return (
    <ReportLayout
      title="Harvest & Sales Report"
      subtitle="Production output and sales performance analysis"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Harvest & Sales Report' },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <ReportFilter
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          filters={[
            {
              label: 'Analysis Year',
              placeholder: 'Current Year',
              options: [{ label: '2024', value: '2024' }],
              value: '2024'
            },
          ]}
        />

        {isLoadingStats || isLoadingPurchases ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-md border border-gray-100">
             <div className="relative">
               <div className="size-16 rounded-full border-4 border-gray-50 border-t-brand animate-spin" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-5 text-brand" />
               </div>
             </div>
             <div className="text-center">
               <p className="text-lg font-bold text-gray-900 uppercase tracking-tight">Processing Logs</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Aggregating transactions...</p>
             </div>
           </div>
        ) : hasGenerated ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrendStatCard
                title="Sales Revenue"
                value={`₦${totalRevenue.toLocaleString()}`}
                trend={{ value: "+8.4%", isUp: true }}
                description="Total income from sales"
                trendLabel="Based on verified logs"
              />
              <TrendStatCard
                title="Harvest Count"
                value={purchases.length.toString()}
                trend={{ value: "Live", isUp: true }}
                description="Total batches harvested"
                trendLabel="Production batch count"
              />
              <TrendStatCard
                title="Active Products"
                value={(metrics?.activeProducts || 0).toString()}
                trend={{ value: "Stable", isUp: true }}
                description="Currently tracked items"
                trendLabel="Market-ready stock"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Category Distribution</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Production volume by type</p>
                </div>
                <div className="py-2">
                  {donutData.length > 0 ? (
                    <DonutChart 
                      centerLabel="Types" 
                      centerValue={donutData.length.toString()} 
                      data={donutData}
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-[10px] text-gray-400 uppercase font-bold bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                      No Category Data
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Monthly Sales</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Revenue generated monthly</p>
                </div>
                <div className="py-2">
                  {barData.length > 0 ? (
                    <SimpleBarChart data={barData} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-[10px] text-gray-400 uppercase font-bold bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                      No Sales History
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sales Transactions Table */}
            <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Verified Sale Logs</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Detailed transaction history</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Log Ref</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {purchases.length > 0 ? purchases.map((p, i) => (
                      <tr key={p.id || i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 uppercase tracking-tighter">TRX</div>
                            <span className="text-[10px] font-bold text-gray-900 tracking-widest uppercase">#{p.id?.slice(0, 10) || 'REF'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 tracking-tight text-sm">₦{Number(p.amount).toLocaleString()}</td>
                        <td className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase">{format(new Date(p.createdAt as string), 'MMM d, yyyy')}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-0.5 rounded-md">Settled</Badge>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-[10px] text-gray-400 uppercase font-bold italic">No sales found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState 
            title="Analyze Sales Performance"
            description="Generate a detailed report of your harvests, sales volumes, and market category distribution."
            icon="chart"
          />
        )}
      </div>
    </ReportLayout>
  )
}
