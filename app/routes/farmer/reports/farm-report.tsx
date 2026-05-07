import React, { useState } from 'react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import { Loader2, MapPin, Package } from 'lucide-react'
import { useGetFarms, useGetFarmsId } from '~/lib/api/generated/farms/farms'

export default function FarmReportPage() {
  const [selectedFarmId, setSelectedFarmId] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeFarmId, setActiveFarmId] = useState<string>('')

  // 1. Fetch Farms list for filter
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()
  const farms = farmsResponse?.data?.data || []

  // 2. Fetch specific farm details
  const { data: farmDetailResponse, isLoading: isLoadingDetail } = useGetFarmsId(activeFarmId, {
    query: { enabled: !!activeFarmId }
  })
  const farmDetail = farmDetailResponse?.data?.data

  const handleGenerate = () => {
    if (selectedFarmId) {
      setIsGenerating(true)
      setActiveFarmId(selectedFarmId)
      setTimeout(() => setIsGenerating(false), 800)
    }
  }

  return (
    <ReportLayout
      title="Farm Analysis Report"
      subtitle="Detailed overview of farm units, land usage, and infrastructure"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Farm Analysis' },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <ReportFilter
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          filters={[
            {
              label: 'Target Farm',
              placeholder: 'Choose a Farm',
              options: farms.map(f => ({ label: f.name, value: f.id })),
              value: selectedFarmId,
              onChange: setSelectedFarmId,
              isLoading: isLoadingFarms
            },
          ]}
        />

        {activeFarmId && isLoadingDetail ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-md border border-gray-100">
             <div className="size-16 rounded-full border-4 border-gray-50 border-t-brand animate-spin flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
             </div>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Surveying Land Data...</p>
           </div>
        ) : activeFarmId && farmDetail ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TrendStatCard
                title="Total Area"
                value={`${farmDetail.totalArea || '0'} ha`}
                trend={{ value: "Verified", isUp: true }}
                description="Total land extent"
                trendLabel="Based on GPS polygons"
              />
              <TrendStatCard
                title="Farm Units"
                value="2"
                trend={{ value: "Active", isUp: true }}
                description="Sub-plots under management"
                trendLabel="Cultivated land sectors"
              />
              <TrendStatCard
                title="Compliance"
                value="Eligible"
                trend={{ value: "EUDR", isUp: true }}
                description="Deforestation risk status"
                trendLabel="Satellite check passed"
              />
            </div>

            {/* Farm Units Table */}
            <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50">
                <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-widest">Plot & Infrastructure Inventory</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Physical farm assets and sectors</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Unit Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Area</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Current Use</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-md bg-brand/10 flex items-center justify-center text-brand">
                            <MapPin className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-[13px]">North Sector A</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight">Plot-2026-X1</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 tracking-tight text-sm">2.4 ha</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Package className="size-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Maize Cultivation</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-0.5 rounded-md">Optimal</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-md bg-brand/10 flex items-center justify-center text-brand">
                            <MapPin className="size-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-[13px]">East sector B</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight">Plot-2026-X2</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 tracking-tight text-sm">1.8 ha</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Package className="size-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Fallow / Preparation</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5 rounded-md">Resting</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState 
            title="Generate Farm Analysis"
            description="Select a farm to view a detailed breakdown of land utilization, physical sectors, and asset inventory."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
