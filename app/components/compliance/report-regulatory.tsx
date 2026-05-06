import { ShieldCheck, CheckCircle2 } from 'lucide-react'

export function ReportRegulatory() {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Regulatory Compliance Context</h3>
      
      <div className="bg-brand-surface rounded-md p-8 flex items-start gap-8 border border-brand-surface">
        <div className="size-16 rounded-md bg-white flex items-center justify-center text-brand shrink-0 border border-brand/10">
          <ShieldCheck className="size-8" />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900 tracking-tight uppercase">Regulation (EU) 2023/1115</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Directly addresses the making available on the Union market and the export from the Union of certain commodities and products associated with deforestation and forest degradation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-brand/10 shadow-sm">
              <CheckCircle2 className="size-3.5" /> Article 3: General Obligations
            </p>
            <p className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-brand/10 shadow-sm">
              <CheckCircle2 className="size-3.5" /> Article 9: Due Diligence
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatusBadge label="Local Land Rights (Brazilian Forest Code)" status="COMPLIANT" />
        <StatusBadge label="ILO Convention No. 169 Compliance" status="COMPLIANT" />
      </div>
    </div>
  )
}

function StatusBadge({ label, status }: { label: string; status: string }) {
  return (
    <div className="bg-brand-surface rounded-md p-5 flex items-center justify-between border border-brand-surface">
      <span className="text-[11px] font-bold text-gray-700 tracking-tight uppercase">{label}</span>
      <span className="bg-white text-brand text-[9px] font-black px-3 py-1.5 rounded-md border border-brand/10 flex items-center gap-1 uppercase tracking-tighter shadow-sm">
        {status}
      </span>
    </div>
  )
}
