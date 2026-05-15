import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Filter,
  ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { auditTrail, shipmentHistory } from '~/lib/mock-data/transporter'
import { cn } from '~/lib/utils'

export default function ShipmentHistoryPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-bold text-[#1a4332]">Product</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Shipment History</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Verified ledger of all global dispatches, Immutable lineage tracking and compliance audit trail for institutional reporting.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 px-4 text-[11px] font-bold border-gray-200 text-gray-600 gap-2 rounded-md">
            <Filter className="size-4" /> Filter View
          </Button>
          <Button className="h-9 px-4 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-2 rounded-md">
            <Download className="size-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIStatCard
          label="Total Dispatches"
          value="1,482"
          trend="+12% this month"
        />
        <KPIStatCard
          label="Blockchain Verified"
          value="100%"
          trend="Zero integrity failure"
        />
        <KPIStatCard
          label="Compliance Health"
          value="Audit-Grade Readiness"
          trend="All records compliant with ISO-22000 standards"
        />
      </div>

      {/* History Table */}
      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[11px] font-bold text-[#1a4332] bg-gray-50/10">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Batch Identifier</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shipmentHistory.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <p className="text-[12px] font-bold text-[#1a4332]">{shipment.date}</p>
                  <p className="text-[10px] font-bold text-gray-400">{shipment.time}</p>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-brand">{shipment.batchId}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-gray-500">{shipment.driver}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-gray-500">{shipment.route}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "size-2 rounded-full",
                      shipment.status === 'Delivered' ? "bg-green-600" :
                        shipment.status === 'In Transit' ? "bg-orange-500" : "bg-gray-400"
                    )} />
                    <span className="text-[11px] font-bold text-gray-900">{shipment.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link to={`/transporter/history/${shipment.id}`} className="text-gray-300 hover:text-brand transition-colors p-1 block">
                    <Eye className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white">
          <p className="text-[12px] text-gray-400 font-bold">0 of 68 row(s) selected.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500 font-bold">Rows per page</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-100 bg-white cursor-pointer">
                <span className="text-[12px] font-bold">10</span>
                <ChevronDown className="size-3.5 text-gray-400" />
              </div>
            </div>
            <span className="text-[12px] text-gray-500 font-bold">Page 1 of 7</span>
            <div className="flex items-center gap-1">
              <PaginationButton disabled><ChevronsLeft className="size-4" /></PaginationButton>
              <PaginationButton disabled><ChevronLeft className="size-4" /></PaginationButton>
              <PaginationButton><ChevronRight className="size-4" /></PaginationButton>
              <PaginationButton><ChevronsRight className="size-4" /></PaginationButton>
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain Audit Trail */}
      <div className="rounded-md border border-brand/20 bg-white p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#1a4332] tracking-tight">Blockchain Audit Trail</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Verification Hash: 0x82f.......................a921</p>
          </div>
          <ShieldCheck className="size-8 text-[#1a4332] opacity-50" />
        </div>

        <div className="space-y-8 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
          {auditTrail.map((step) => (
            <div key={step.id} className="relative">
              <div className={cn(
                "absolute -left-[24px] top-1 size-5 rounded-full border-2 border-white ring-2 ring-gray-50 flex items-center justify-center",
                step.status === 'completed' ? "bg-brand ring-brand/10" : "bg-gray-400 ring-gray-50"
              )}>
                {step.status === 'completed' && <CheckCircle2 className="size-3 text-white" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-gray-900">{step.title}</h4>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight leading-relaxed">
                  {step.date} • {step.location} {step.lot && `• ${step.lot}`}
                  {step.detail && `• ${step.detail}`}
                  {step.dispatch && `• ${step.dispatch}`}
                  {step.driver && `• ${step.driver}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KPIStatCard({ label, value, trend }: any) {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-4">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="space-y-1">
        <h4 className="text-2xl font-bold text-[#1a4332] tracking-tight">{value}</h4>
        <p className="text-[11px] font-bold text-gray-400 uppercase">{trend}</p>
      </div>
    </div>
  )
}

function PaginationButton({ children, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "size-8 flex items-center justify-center rounded-md border border-gray-100 transition-colors",
        disabled ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
      )}
    >
      {children}
    </button>
  )
}
