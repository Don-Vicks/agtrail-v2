import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  PenTool,
  Plus,
  ShieldCheck,
  Users,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { violationQueue } from '~/lib/mock-data/regulator'
import { cn } from '~/lib/utils'

export default function RegulatorViolationsPage() {
  const [selectedBatch, setSelectedBatch] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleApproveClick = (batch: any) => {
    setSelectedBatch(batch)
    setIsModalOpen(true)
  }

  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-bold text-[#1a4332]">Good afternoon, Olamide</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Violation Queue</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Managing active regulatory enforcement and stakeholder compliance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <FileText className="size-3.5" /> Sort by Commodities <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <Users className="size-3.5" /> Sort by Region <ChevronDown className="size-3" />
          </Button>
          <Button className="h-8 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-1.5 px-3 rounded-md">
            <Plus className="size-3.5" /> Create a New Violation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard label="Total Active" value="1,248,502" trend="+12%" icon={<Users className="size-4" />} />
        <StatCard label="Critical Tier" value="94.2%" trend="Last 7 days" icon={<AlertTriangle className="size-4" />} />
        <StatCard label="Average Resolution" value="88.5%" trend="0.5d" icon={<Clock className="size-4" />} />
        <StatCard label="Pending Deadline" value="892,104" trend="Next 24h" icon={<Clock className="size-4" />} />
      </div>

      {/* Violation List */}
      <div className="space-y-4">
        {violationQueue.map((batch) => (
          <ViolationBatchCard
            key={batch.id}
            batch={batch}
            onApprove={() => handleApproveClick(batch)}
          />
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 1 - 25 of 142 violations</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 6].map((p, i) => (
            <button
              key={i}
              className={cn(
                "size-7 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors border border-transparent",
                p === 1 ? "bg-[#1a4332] text-white" : "text-gray-500 hover:bg-gray-100 border-gray-100"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Global Audit Trail */}
      <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[#1a4332]">Global Audit Trail</h3>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
            <ShieldCheck className="size-3" /> Immutable Record
          </div>
        </div>
        <div className="space-y-6">
          {[
            { time: '09:42', text: 'Inspector Davis flagged BioPasta Org. for "Chemical Runoff" in Zone C.', hash: '0x82f...a72c' },
            { time: '08:15', text: 'System Automator auto-closed violation #8821 for GreenFields Co.', reason: 'Fine payment confirmed via Central Treasury.' },
            { time: 'Oct 13', text: 'Admin Roberts updated severity for AgroMiller Ltd. from high to Critical.', detail: 'Evidence updated: Satellite imagery overlay added.' }
          ].map((log, i) => (
            <div key={i} className="flex gap-6 items-start text-[11px]">
              <span className="text-gray-400 font-bold w-12 shrink-0">{log.time}</span>
              <div className="space-y-1 flex-1">
                <p className="text-gray-700 font-bold leading-relaxed">{log.text}</p>
                {log.hash && <p className="text-[9px] font-bold text-gray-400 uppercase">Verification Hash: {log.hash}</p>}
                {log.reason && <p className="text-[9px] font-bold text-gray-400 uppercase">Reason: {log.reason}</p>}
                {log.detail && <p className="text-[9px] font-bold text-gray-400 uppercase">{log.detail}</p>}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-8 h-10 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-gray-100">
          View Full Audit Log
        </Button>
      </div>

      {/* Approval Modal */}
      {isModalOpen && (
        <ApprovalModal
          batch={selectedBatch}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, trend, icon }: any) {
  return (
    <div className='rounded-md border border-gray-100 bg-white p-6 shadow-sm group'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>{label}</p>
          <div className='size-8 rounded-md flex items-center justify-center text-gray-400 bg-gray-50'>
            {icon}
          </div>
        </div>
        <div className='space-y-1'>
          <h4 className='text-2xl font-bold text-gray-900 tracking-tight'>{value}</h4>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>{trend}</p>
        </div>
      </div>
    </div>
  )
}

function ViolationBatchCard({ batch, onApprove }: any) {
  const isPending = batch.status === 'READY FOR ENDORSEMENT'

  return (
    <div className={cn(
      "rounded-md border-l-4 bg-white p-6 shadow-sm relative",
      isPending ? "border-l-green-500 border-gray-100" : "border-l-red-500 border-gray-100"
    )}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Batch #{batch.id}</h3>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                isPending ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
              )}>
                {batch.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#1a4332] uppercase">HASH: {batch.hash}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Submitted {batch.submittedAt}</p>
            </div>
          </div>

          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {batch.certification} • {batch.commodity}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Auditor Information</p>
              <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 border border-gray-100">
                <div className="size-8 rounded-md bg-green-100 flex items-center justify-center">
                  <PenTool className="size-4 text-green-700" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900">{batch.auditor}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{batch.auditorTitle}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Review Findings</p>
              <div className={cn(
                "p-3 rounded-md border",
                isPending ? "bg-green-50/30 border-green-100" : "bg-red-50/30 border-red-100"
              )}>
                <div className="flex gap-2">
                  {isPending ? <CheckCircle2 className="size-4 text-green-600 shrink-0" /> : <AlertTriangle className="size-4 text-red-600 shrink-0" />}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-gray-800 leading-normal">{batch.findings}</p>
                    {batch.escalated && <p className="text-[9px] font-bold text-red-600 uppercase">{batch.escalated}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Certification Type</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-[#1a4332] text-white text-[9px] font-bold uppercase">{batch.type}</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[9px] font-bold uppercase border border-gray-200">{batch.grade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center">
            <ShieldCheck className="size-4 text-gray-400" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase italic">
            Endorsement area disabled until findings are resolved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 text-[11px] font-bold text-red-600 border-red-100 hover:bg-red-50 rounded-md">
            Reject with Reason
          </Button>
          <Button variant="outline" className="h-9 px-4 text-[11px] font-bold text-[#1a4332] border-gray-200 rounded-md">
            View Product Story
          </Button>
          {isPending && (
            <Button variant="outline" className="h-9 px-4 text-[11px] font-bold text-green-600 border-green-200 hover:bg-green-50 rounded-md">
              Approve with Conditions
            </Button>
          )}
          <Button
            onClick={onApprove}
            className={cn(
              "h-9 px-6 text-[11px] font-bold rounded-md transition-all",
              isPending ? "bg-[#1a4332] hover:bg-[#1a4332]/90 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            )}
            disabled={!isPending}
          >
            Approve Batch
          </Button>
        </div>
      </div>
    </div>
  )
}

function ApprovalModal({ batch, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand uppercase tracking-widest">
                <CheckCircle2 className="size-4" /> Batch Verification Protocol
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Confirm Approval</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                You are about to authorize the immutable certification for Batch #{batch.id}. This action will generate a unique cryptographic hash and broadcast the provenance data to the global agribusiness transparency ledger.
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
              <X className="size-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 rounded-md bg-gray-50 border border-gray-100">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Entity</p>
              <p className="text-lg font-bold text-gray-900">Maize</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Weight</p>
              <p className="text-lg font-bold text-gray-900">2,400.00 KG</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origin</p>
              <p className="text-lg font-bold text-gray-900">Kaduna, Nigeria</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lab Compliance</p>
              <p className="text-[11px] font-bold text-green-600 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" /> Certified Pass
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Comment/Feedback</p>
            <textarea
              placeholder="Comment"
              className="w-full h-32 p-4 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand text-sm placeholder:text-gray-400 bg-white"
            />
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Regulator Digital Signature</p>
            <div className="h-32 w-full rounded-md border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer group hover:bg-gray-100/50 transition-colors">
              <div className="relative">
                <PenTool className="size-8 text-gray-300 group-hover:text-gray-400 transition-colors" />
                <div className="absolute -top-1 -right-1">
                  <div className="size-4 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <Plus className="size-2.5 text-gray-400" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Click to attach biometric signature or draw</p>
            </div>
          </div>

          <div className="p-4 rounded-md bg-brand/5 border border-brand/10 flex gap-3">
            <ShieldCheck className="size-5 text-brand shrink-0" />
            <p className="text-[11px] font-medium text-brand leading-relaxed">
              Protocol MD-5: By clicking confirm, you acknowledge that all audit trails have been verified. This transaction is immutable and will be visible to all permissioned nodes in the supply chain.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={onClose} className="h-14 font-bold text-gray-900 border-gray-200 rounded-md hover:bg-gray-50">
              Cancel Audit
            </Button>
            <Button className="h-14 font-bold text-white bg-brand hover:bg-brand/90 rounded-md shadow-lg shadow-brand/20 gap-2">
              <ShieldCheck className="size-5" /> Approve Batch
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
