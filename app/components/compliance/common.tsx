import { CheckCircle2, AlertCircle, Upload, Sprout, History, MapPin, User, Calendar, FileSearch, Award, ClipboardCheck } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

export function StatusItem({ label, value, valueColor = "text-gray-900" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="space-y-0 text-left">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-lg font-black tracking-tight uppercase", valueColor)}>{value}</p>
    </div>
  )
}

export function VerifiedRequirementCard({ title, description, items }: { title: string; description: string; items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <div className="bg-brand-surface/30 border border-brand-surface rounded-md overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-brand-surface">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-brand-surface flex items-center justify-center text-brand">
            <Sprout className="size-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase">{title}</h4>
            <p className="text-[10px] text-gray-500 font-medium">{description}</p>
          </div>
        </div>
        <span className="bg-brand-surface text-brand text-[9px] font-black px-2 py-1 rounded-md border border-brand/10 flex items-center gap-1 uppercase tracking-tighter">
          <CheckCircle2 className="size-3" /> VERIFIED
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-brand-surface/50 border border-brand-surface/50 rounded-md p-3 flex items-center gap-3 shadow-sm hover:border-brand/20 transition-all cursor-default">
            <div className="text-brand">{item.icon}</div>
            <span className="text-xs font-bold text-gray-700 tracking-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActionRequiredCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-brand-accent-surface/30 border border-brand-accent-surface rounded-md overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-brand-accent-surface text-left">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-brand-accent-surface flex items-center justify-center text-brand-accent">
            {icon}
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase">{title}</h4>
            <p className="text-[10px] text-gray-500 font-medium">{description}</p>
          </div>
        </div>
        <span className="bg-brand-accent-surface text-brand-accent text-[9px] font-black px-2 py-1 rounded-md border border-brand-accent/10 flex items-center gap-1 uppercase tracking-tighter">
          <AlertCircle className="size-3" /> ACTION REQUIRED
        </span>
      </div>
      <div className="p-4 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="size-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-300">
            <Upload className="size-3" />
          </div>
          <span className="text-xs font-bold text-gray-400 tracking-tight">Pending Laboratory Result Upload</span>
        </div>
        <Button className="h-8 bg-brand hover:bg-brand-light text-white text-[10px] font-black uppercase tracking-widest px-4 rounded-md">
          Resolve
        </Button>
      </div>
    </div>
  )
}
