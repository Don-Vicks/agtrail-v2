import { ShieldCheck, ArrowRight } from 'lucide-react'
import { cn } from '~/lib/utils'

const SECTIONS = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'geolocation', label: 'Geolocation Data', active: false },
  { id: 'deforestation', label: 'Deforestation Analysis', active: false },
  { id: 'ownership', label: 'Ownership Verification', active: false },
  { id: 'ledger', label: 'Ledger Proof', active: false },
]

export function ReportSidebar() {
  return (
    <div className="space-y-6 w-full">
      <div className="bg-brand-surface rounded-md p-4 space-y-4">
        <h3 className="text-[9px] font-black text-brand-light uppercase tracking-widest ">REPORT SECTIONS</h3>
        <div className="space-y-1">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              className={cn(
                "w-full text-left px-4 py-3 rounded-md text-xs font-bold transition-all",
                section.active
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-500 hover:bg-white/50"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-brand-surface/50 border border-brand-surface rounded-md p-5 space-y-4">
        <div className="flex items-center gap-2 text-brand">
          <ShieldCheck className="size-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Immutable Status</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          This document is hashed on the AgTrail Public Ledger. Integrity verified 2 mins ago.
        </p>
        <button className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-1 hover:underline">
          VERIFY ON LEDGER <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  )
}
