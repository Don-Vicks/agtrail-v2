import React, { useState, useMemo } from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import { Loader2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useGetPurchases } from '~/lib/api/generated/purchases/purchases'
import { format } from 'date-fns'

export default function PaymentHistoryPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // 1. Fetch Purchases (as payments received)
  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useGetPurchases()
  const purchases = purchasesResponse?.data?.data || []

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setHasGenerated(true)
    }, 800)
  }

  // Calculate Total Settled Amount
  const totalSettled = useMemo(() => {
    return purchases.reduce((acc, p) => acc + Number(p.amount || 0), 0)
  }, [purchases])

  return (
    <ReportLayout
      title="Payment History & Ledger"
      subtitle="Complete record of all inbound and outbound financial transactions"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Payment History' },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <ReportFilter
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          filters={[
            {
              label: 'Transaction Type',
              placeholder: 'All Transactions',
              options: [
                { label: 'Inbound (Sales)', value: 'inbound' },
                { label: 'Outbound (Expenses)', value: 'outbound' }
              ],
              value: 'inbound'
            },
          ]}
        />

        {isLoadingPurchases ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-md border border-gray-100">
             <div className="size-16 rounded-full border-4 border-gray-50 border-t-brand animate-spin flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
             </div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Retrieving History...</p>
           </div>
        ) : hasGenerated ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrendStatCard
                title="Total Settled"
                value={`₦${totalSettled.toLocaleString()}`}
                trend={{ value: "Live", isUp: true }}
                description="Payments successfully received"
                trendLabel="Settled into digital wallet"
              />
              <TrendStatCard
                title="Pending Payouts"
                value="₦0"
                trend={{ value: "Low", isUp: true }}
                description="Funds awaiting clearance"
                trendLabel="Market settlement time"
              />
              <TrendStatCard
                title="Success Rate"
                value="100%"
                trend={{ value: "Stable", isUp: true }}
                description="Transaction completion rate"
                trendLabel="Wallet processing efficiency"
              />
            </div>

            {/* Payment Ledger Table */}
            <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-widest">Consolidated Payment Ledger</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time financial movement log</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Transaction ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Timestamp</th>
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
                            <span className="font-bold text-gray-900 tracking-tight text-[11px] uppercase">#{p.id?.slice(0, 12) || 'TX-REF'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600 tracking-tight text-sm">+₦{Number(p.amount).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-md">Settled Inbound</Badge>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">{format(new Date(p.createdAt as string), 'MMM d, yyyy HH:mm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState 
            title="Access Payment Ledger"
            description="Select a transaction type to generate a detailed history of all settled payments and digital wallet movements."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
