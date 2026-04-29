import { useState } from 'react'
import { 
  FileText, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  Download, 
  Eye, 
  Plus,
  ScanLine,
  ArrowRight
} from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

export default function AggregatorWeightReconciliationPage() {
  const [receivedWeight, setReceivedWeight] = useState('00.000')

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          { label: 'Dashboard', href: '/aggregator' },
          { label: 'Weight Reconciliation' }
        ]}
        action={
          <Button className="bg-brand hover:bg-brand/90 text-white rounded-lg h-9 px-4 text-xs font-bold gap-2">
            <Plus className="size-4" />
            Initiate New Transfer
          </Button>
        }
      />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-brand tracking-tight">Confirm Transfer Receipt</h1>
        <p className="text-[12px] text-gray-500 font-medium">Monitor and audit global logistics transfer flows and manifest status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="size-5 text-brand" />
              <h3 className="text-lg font-bold text-brand tracking-tight">Lot Validation Details</h3>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-wider">Lot Identifier (Read-Only)</Label>
                  <div className="h-11 flex items-center px-4 rounded-lg bg-blue-50/50 border border-blue-100/50 text-brand font-bold text-sm">
                    LT-8829-XJ-2024
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-wider">Declared Weight (Metric Tons)</Label>
                  <div className="relative">
                    <Input readOnly value="45.280" className="h-11 bg-blue-50/50 border-blue-100/50 rounded-lg text-sm font-bold text-brand pr-24" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-blue-100 text-[9px] font-bold text-blue-700 uppercase">
                      System Verified
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-dashed border-gray-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-wider">Received Weight (MT)</Label>
                  <div className="relative">
                    <Input 
                      value={receivedWeight} 
                      onChange={(e) => setReceivedWeight(e.target.value)}
                      className="h-11 bg-white border-gray-200 rounded-lg text-sm font-bold pr-12" 
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                      MT
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium">Calibration certificate must be valid.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-wider">Total Quantity (Units)</Label>
                  <Input placeholder="Enter quantity" className="h-11 bg-white border-gray-200 rounded-lg text-sm font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-brand uppercase tracking-wider">Weighbridge Reference</Label>
                <div className="relative">
                  <Input placeholder="WBR-####-####" className="h-11 bg-white border-gray-200 rounded-lg text-sm font-bold pl-12" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <ScanLine className="size-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" className="h-11 px-8 rounded-lg border-gray-200 text-gray-600 font-bold text-sm">
                  Save Draft
                </Button>
                <Button className="h-11 px-8 rounded-lg bg-brand hover:bg-brand/90 text-white font-bold text-sm gap-2">
                  <CheckCircle2 className="size-4" />
                  Confirm Receipt
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-5">
              <div className="size-12 rounded-xl bg-green-50 flex items-center justify-center text-brand border border-green-100/50">
                <Truck className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transporter</p>
                <h4 className="text-base font-bold text-gray-900 tracking-tight">Global Logistics Ltd.</h4>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-5">
              <div className="size-12 rounded-xl bg-green-50 flex items-center justify-center text-brand border border-green-100/50">
                <MapPin className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Terminal</p>
                <h4 className="text-base font-bold text-gray-900 tracking-tight">East Bay Hub | Gate 4</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis & Files */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="text-[10px] font-bold text-brand uppercase tracking-wider mb-6">Live Discrepancy Analysis</h4>
            
            <div className="space-y-6">
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-bold text-gray-400">Weight Delta</p>
                <p className="text-2xl font-bold text-red-500 tracking-tight">+1.042 MT</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-900 uppercase">Difference (%)</p>
                  <p className="text-[10px] font-bold text-red-500">2.30%</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '70%' }} />
                </div>
                <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                  <span>Tolerance: 2.0%</span>
                  <span>Threshold Exceeded</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-100/50 flex items-start gap-3">
                <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">Critical Alert</p>
                  <p className="text-[10px] text-red-700/80 font-bold leading-relaxed">
                    Difference exceeds 2% threshold. Supervisor override or mandatory remark required for submission.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="text-[10px] font-bold text-brand uppercase tracking-wider mb-6">Attached Manifests</h4>
            <div className="space-y-3">
              <ManifestFile name="bill_of_lading.pdf" icon={<Download className="size-3.5" />} />
              <ManifestFile name="scale_photo_01.jpg" icon={<Eye className="size-3.5" />} />
              <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors group">
                <div className="size-8 rounded-full border border-gray-200 flex items-center justify-center text-brand group-hover:bg-white transition-colors">
                  <Plus className="size-4" />
                </div>
                <p className="text-[10px] font-bold text-brand uppercase tracking-widest">Upload Ticket Image</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ManifestFile({ name, icon }: { name: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white group hover:border-brand/20 transition-all">
       <div className="flex items-center gap-3">
          <FileText className="size-4 text-gray-300 group-hover:text-brand transition-colors" />
          <p className="text-[11px] font-bold text-gray-500">{name}</p>
       </div>
       <button className="text-gray-300 hover:text-brand transition-colors p-1">
          {icon}
       </button>
    </div>
  )
}
