import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { ReportMetricsBar } from '~/components/compliance/report-metrics'
import { VerifiedRequirementCard, ActionRequiredCard } from '~/components/compliance/common'
import { MapPin, User, Calendar, History, Sprout, FileSearch, Award, Upload } from 'lucide-react'

export default function ExporterComplianceAnalysis() {
  const navigate = useNavigate()

  return (
    <div className="w-full space-y-8 pb-12 text-left">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Compliance Check' },
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold text-brand tracking-tight">Select Target Market</h1>
        <p className="text-xs md:text-sm text-gray-500">Choose your trade destination to automatically align documentation and logistics with regional trade agreements.</p>
      </div>

      <div className="bg-white border-y border-gray-50 px-8 py-4 space-y-4 -mx-8">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0">
            <h2 className="text-xs font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Kaduna, Nigeria</p>
          </div>
        </div>
        <div className="flex items-center gap-12 mt-2">
            <div>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">PRODUCT</p>
               <p className="text-[14px] font-bold text-gray-900 uppercase tracking-tight text-[#1a4332]">Maize</p>
            </div>
            <div>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">BATCH NUMBER</p>
               <p className="text-[14px] font-bold text-gray-900 tracking-tight">BT192372320323</p>
            </div>
            <div>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">TOTAL QUANTITY</p>
               <p className="text-[14px] font-bold text-gray-900 tracking-tight">1,340 MT</p>
            </div>
            <div>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">MARKET READINESS</p>
               <p className="text-[14px] font-bold text-[#1a4332] tracking-tight">94%</p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OVERALL READINESS</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-brand leading-none">94%</span>
            <span className="text-sm font-bold text-brand pb-1 uppercase tracking-widest">Target: 100%</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: '94%' }} />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">14 of 15 criteria successfully met</p>
          </div>
        </div>

        <div className="space-y-6">
          <VerifiedRequirementCard 
            title="EU Deforestation-free Regulation (EUDR)" 
            description="Mandatory for all timber, cocoa, and rubber exports."
            items={[
              { icon: <MapPin className="size-4" />, label: 'Geolocation Coordinates' },
              { icon: <User className="size-4" />, label: 'Plot Ownership' },
              { icon: <Calendar className="size-4" />, label: 'Time of Harvest' },
            ]}
          />

          <VerifiedRequirementCard 
            title="EU Deforestation-free Regulation (EUDR)" 
            description="Mandatory for all timber, cocoa, and rubber exports."
            items={[
              { icon: <MapPin className="size-4" />, label: 'Geolocation Coordinates' },
              { icon: <User className="size-4" />, label: 'Plot Ownership' },
              { icon: <Calendar className="size-4" />, label: 'Time of Harvest' },
            ]}
          />

          <VerifiedRequirementCard 
            title="ISO 22005:2007 (Traceability)" 
            description="International standard for food and feed chain traceability."
            items={[
              { icon: <History className="size-4" />, label: 'Batch History' },
              { icon: <Sprout className="size-4" />, label: 'Feed Source' },
            ]}
          />

          <ActionRequiredCard 
            icon={<FileSearch className="size-5" />}
            title="Lab Report"
            description="Phytosanitary inspection and health clearance."
          />

          <ActionRequiredCard 
            icon={<Award className="size-5" />}
            title="GAP Certifications"
            description="Phytosanitary inspection and health clearance."
          />

          <ActionRequiredCard 
            icon={<Award className="size-5" />}
            title="NAFDAC Phytosanitary Certificate"
            description="Phytosanitary inspection and health clearance."
          />
        </div>

        <div className="space-y-4 pt-6">
          <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-wider">Supporting Annex</h3>
          <div className="border border-brand-surface rounded-md p-12 flex flex-col items-center justify-center bg-brand-surface/30 group hover:border-brand/20 transition-all cursor-pointer border-dashed border-2">
            <div className="size-14 rounded-md bg-white border border-brand-surface flex items-center justify-center text-brand mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="size-7" />
            </div>
            <p className="text-base font-bold text-gray-900 mb-1 text-center">Drag and drop supporting documents</p>
            <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-tighter">Accepted formats: PDF, JPG, PNG (Max 10MB each)</p>
            <p className="mt-4 text-xs font-black text-brand uppercase tracking-widest hover:underline">Browse Local Files</p>
          </div>
        </div>
      </div>
    </div>
  )
}
