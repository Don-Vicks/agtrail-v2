import { ExternalLink } from 'lucide-react'
import { cn } from '~/lib/utils'

export function ReportOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Summary Content */}
      <div className="lg:col-span-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Summary of Compliance</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            This batch of Arabica Coffee originates from certified sustainable farm plots in the Minas Gerais region. Comprehensive analysis confirms zero deforestation activity since the December 31, 2020 cutoff date. All production meets local labor laws and indigenous rights protections mandated by the EU Deforestation Regulation (EUDR).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryMetricBox label="TARGET MARKET" value="European Union" />
          <SummaryMetricBox label="PRODUCT TYPE" value="Coffee (Raw)" />
          <SummaryMetricBox label="ISSUANCE DATE" value="2023-10-24" />
        </div>
      </div>

      {/* Risk Assessment Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Risk Assessment</h3>
          <button className="text-[9px] font-black text-brand uppercase tracking-widest flex items-center gap-1 hover:underline">
            <ExternalLink className="size-3" /> Risk View
          </button>
        </div>

        <div className="bg-brand-surface/30 rounded-md p-4 space-y-4">
          <div className="relative">
            <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-brand w-[10%]" />
            </div>
            <div className="flex items-center justify-between mt-2">
               <span className="text-[10px] font-black text-brand uppercase">Low</span>
               <span className="text-[10px] font-black text-gray-300 uppercase">High</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <RiskItem label="Deforestation" status="Passed" />
            <RiskItem label="Human Rights" status="Passed" />
            <RiskItem label="Tax Compliance" status="Passed" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryMetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-surface rounded-md p-5 space-y-1.5 border border-brand-surface">
      <p className="text-[9px] font-black text-brand-light uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{value}</p>
    </div>
  )
}

function RiskItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-brand-surface/20 pb-2">
      <span className="text-xs font-bold text-gray-500">{label}</span>
      <span className="text-[10px] font-black text-brand uppercase tracking-widest">{status}</span>
    </div>
  )
}
