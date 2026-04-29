import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Eye, 
  Shield, 
  Clock, 
  TrendingUp, 
  RefreshCcw,
  Navigation,
  MapPin,
  ExternalLink,
  ChevronRight,
  User,
  History,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Download,
  Info,
  QrCode
} from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'

// Mock Data
const mockTransfers = [
  { id: '#BT - 98442', receiver: 'Takoradi, GHA', date: '2025-04-13', lotId: 'COC-2025-114', status: 'In Transit' },
  { id: '#BT - 98442', receiver: 'Soubre, CV', date: '2025-04-13', lotId: 'COC-2025-114', status: 'In Transit' },
  { id: '#BT - 98442', receiver: 'Kumasi, GHA', date: '2025-04-13', lotId: 'COC-2025-114', status: 'In Transit' },
  { id: '#BT - 98442', receiver: 'Kumasi, GHA', date: '2025-04-13', lotId: 'COC-2025-114', status: 'In Transit' },
  { id: '#BT - 98442', receiver: 'Kumasi, GHA', date: '2025-04-13', lotId: 'COC-2025-114', status: 'In Transit' }
]

const mockFarms = [
  { id: '1', name: 'West Valley Farm', location: 'Takoradi', region: 'Western', hectares: 120, lat: 4.8951, lng: -1.7522 },
  { id: '2', name: 'Green Pastures', location: 'Kumasi', region: 'Ashanti', hectares: 85, lat: 6.6666, lng: -1.6163 }
]

type ViewState = 'history' | 'initiate' | 'review' | 'manifest'

export default function AggregatorTransferPage() {
  const [view, setView] = useState<ViewState>('history')

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
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
          { label: 'Add Farmer' }
        ]}
        action={
          view === 'history' ? (
            <Button 
              onClick={() => setView('initiate')}
              className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-lg h-10 px-4 text-xs font-bold gap-2"
            >
              <Plus className="size-4" />
              Initiate New Transfer
            </Button>
          ) : view === 'initiate' ? (
             <div className="flex items-center gap-3">
                <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-lg border-gray-200">
                  Draft Slip
                </Button>
                <Button 
                  onClick={() => setView('review')}
                  className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-lg h-9 px-4 text-xs font-bold gap-2"
                >
                  <Plus className="size-4" />
                  Sign & Intittaie Transefer
                </Button>
             </div>
          ) : view === 'review' ? (
             <div className="flex items-center gap-3">
                <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-lg border-gray-200">
                  Flag Issue
                </Button>
                <Button 
                  onClick={() => setView('manifest')}
                  className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-lg h-9 px-4 text-xs font-bold gap-2"
                >
                  <Plus className="size-4" />
                  Sign & Confirm Receipt
                </Button>
             </div>
          ) : (
             <div className="flex items-center gap-3">
                <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-lg border-gray-200 gap-2">
                  <Printer className="size-4" />
                  Print Document
                </Button>
                <Button 
                  className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-lg h-9 px-4 text-xs font-bold gap-2"
                >
                  <Download className="size-4" />
                  Download PDF
                </Button>
             </div>
          )
        }
      />

      {view === 'history' && <HistoryView setView={setView} />}
      {view === 'initiate' && <InitiateView />}
      {view === 'review' && <ReviewView />}
      {view === 'manifest' && <ManifestView />}
    </div>
  )
}

function HistoryView({ setView }: { setView: (v: ViewState) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-brand">Transfer History</h1>
        <p className="text-sm text-gray-500">Monitor and audit global logistics transfer flows and manifest status</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm relative">
           <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Active Transfers</p>
           <p className="text-3xl font-bold text-gray-900 tracking-tighter">142</p>
           <div className="mt-4 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div className="h-full w-[40%] bg-[#8b5e3c]" />
           </div>
           <div className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 border border-blue-100">
              <Shield className="size-5" />
           </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm relative">
           <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Delayed</p>
           <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-red-600 tracking-tighter">08</p>
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Requires Attention</p>
           <div className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-100">
              <Clock className="size-5" />
           </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm relative">
           <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Completed Today</p>
           <p className="text-3xl font-bold text-amber-600 tracking-tighter">56</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">98% Success Rate</p>
           <div className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
              <TrendingUp className="size-5" />
           </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm relative">
           <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Volume Rate</p>
           <p className="text-3xl font-bold text-brand tracking-tighter">2.4K</p>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Unit Processed</p>
           <div className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-xl bg-green-50 text-brand border border-green-100">
              <RefreshCcw className="size-5" />
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Available Farmer</h2>
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-brand uppercase tracking-wider">Manifest ID</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-brand uppercase tracking-wider">Receiver</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-brand uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-brand uppercase tracking-wider">Lot ID</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-brand uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {mockTransfers.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                       <td className="px-6 py-5">
                          <span className="text-sm font-extrabold text-brand tracking-tight">{t.id}</span>
                       </td>
                       <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight">{t.receiver}</td>
                       <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight">{t.date}</td>
                       <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight uppercase">{t.lotId}</td>
                       <td className="px-6 py-5 text-center">
                          <span className="inline-flex px-3 py-1 rounded-lg border border-gray-100 bg-white text-[10px] font-bold text-gray-500 tracking-tight">
                             {t.status}
                          </span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300">
                             <Eye className="size-4" />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[11px] font-medium text-gray-400">0 of 68 row(s) selected.</p>
              <div className="flex items-center gap-6">
                 <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Page 1 of 7</p>
                 <div className="flex items-center gap-1">
                    <PaginationButton icon={<ChevronRight className="size-3.5 rotate-180" />} />
                    <PaginationButton icon={<ChevronRight className="size-3.5 rotate-180" />} double />
                    <PaginationButton icon={<ChevronRight className="size-3.5" />} />
                    <PaginationButton icon={<ChevronRight className="size-3.5" />} double />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Farm Crops Locations</h3>
               </div>
               <span className="px-3 py-1 rounded-lg border border-green-100 bg-green-50 text-[10px] font-bold text-brand uppercase tracking-widest">GPRS Active</span>
            </div>
            <FarmMap farms={mockFarms} className="aspect-[2/1] h-auto border-none" />
         </div>
         <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-8">Operational Guidelines</h3>
            <ul className="space-y-6">
               <Guideline text="Mainfesta Must be digitally signed upon receipt within 2 hours of arrival" />
               <Guideline text="Any 'In Transit' status exceeding 72 hours triggers an automatic security audit" />
               <Guideline text="Confirm LOT IDs match physical Seals before updating manifest status" />
            </ul>
         </div>
      </div>
    </div>
  )
}

function PaginationButton({ icon, double }: { icon: React.ReactNode, double?: boolean }) {
  return (
    <button className="size-8 rounded-lg border border-gray-100 bg-white flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors">
       <div className="flex -space-x-1.5">
          {icon}
          {double && icon}
       </div>
    </button>
  )
}

function Guideline({ text }: { text: string }) {
  return (
    <li className="flex gap-4">
       <div className="size-1.5 rounded-full bg-[#2e7d32] mt-1.5 shrink-0" />
       <p className="text-[11px] font-medium text-gray-500 leading-relaxed">{text}</p>
    </li>
  )
}

function InitiateView() {
  const [formData, setFormData] = useState({
    receivingParty: '',
    lotId: 'COC-2025-114',
    date: '04/23/2026',
    quantity: '0.00',
    commodity: 'Cocoa beans'
  })

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-2xl font-bold text-brand">Custody Transfer</h1>
        <p className="text-sm text-gray-500">Initiate Institutional Handover for Verified Inventory lots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
               <Truck className="size-5 text-gray-400" />
               <h3 className="text-sm font-bold text-gray-900 tracking-tight">Handoff Parameters</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Receiving Party</Label>
                  <Select value={formData.receivingParty} onValueChange={(v) => setFormData(prev => ({ ...prev, receivingParty: v }))}>
                     <SelectTrigger className="h-12 bg-white border-gray-100 rounded-xl">
                        <SelectValue placeholder="Select Entity" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="entity-1">Ops-Center Delta</SelectItem>
                        <SelectItem value="entity-2">Warehouse Gamma</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Lot ID</Label>
                  <Input 
                    value={formData.lotId} 
                    onChange={(e) => setFormData(prev => ({ ...prev, lotId: e.target.value }))}
                    className="h-12 bg-gray-50/50 border-gray-100 rounded-xl" 
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Transfer Date</Label>
                  <Input 
                    value={formData.date} 
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="h-12 bg-white border-gray-100 rounded-xl" 
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Quantity</Label>
                  <Input 
                    value={formData.quantity} 
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="h-12 bg-white border-gray-100 rounded-xl" 
                  />
               </div>
            </div>

            <div className="space-y-2 mb-10">
               <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Commodity</Label>
               <Input 
                value={formData.commodity} 
                onChange={(e) => setFormData(prev => ({ ...prev, commodity: e.target.value }))}
                className="h-12 bg-white border-gray-100 rounded-xl" 
               />
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] font-bold text-brand uppercase tracking-widest">Institutional Attestation</Label>
               <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                     By initiating this transfer, you certify that the goods match the Lot ID description and quantity specified. All handoffs are timestamped and logged via the immutable ledger for auditing and chain of custody compliance.
                  </p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
               <h4 className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-6">LOT SNAPSHOT</h4>
               <div className="flex items-center gap-4 mb-8">
                  <div className="size-14 rounded-xl bg-gray-900 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lot" alt="Lot" className="size-full object-cover opacity-50" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 tracking-tight">LOT-8829-X</h3>
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Verified 04:32 UTC</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <SidebarStat label="Current Custodian" value="Ops-Center Delta" />
                  <SidebarStat label="Asset Class" value="Hazardous-B" />
                  <SidebarStat label="Security Clearance" value="High" icon={<CheckCircle2 className="size-3.5 text-green-500" />} />
               </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
               <div className="p-6">
                  <div className="aspect-video rounded-xl bg-gray-100 relative mb-4">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="size-8 text-black" />
                     </div>
                  </div>
                  <div className="flex items-start justify-between">
                     <div>
                        <p className="text-[9px] font-bold text-brand uppercase tracking-widest">CURRENT TERMINAL</p>
                        <h4 className="text-sm font-bold text-gray-900 tracking-tight mt-1">Port of Singapore, H6</h4>
                     </div>
                     <ExternalLink className="size-4 text-gray-300" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <SecondaryStat label="Est. Lead Time" value="4.5 hours" icon={<Shield className="size-4 text-blue-500" />} bg="bg-blue-50" />
         <SecondaryStat label="Transfer" value="$2,440.00" icon={<Clock className="size-4 text-red-500" />} bg="bg-red-50" />
         <SecondaryStat label="Insurance Status" value="Active" icon={<TrendingUp className="size-4 text-amber-500" />} bg="bg-amber-50" />
         <SecondaryStat label="Active Operators" value="12 Available" icon={<RefreshCcw className="size-4 text-brand" />} bg="bg-green-50" />
      </div>
    </div>
  )
}

function SidebarStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
       <p className="text-[11px] font-medium text-gray-400">{label}</p>
       <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-bold text-gray-900">{value}</p>
          {icon}
       </div>
    </div>
  )
}

function SecondaryStat({ label, value, icon, bg }: { label: string; value: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between">
       <div>
          <p className="text-[11px] font-bold text-gray-400 tracking-tight">{label}</p>
          <p className="text-xl font-extrabold text-gray-900 tracking-tighter mt-1">{value}</p>
       </div>
       <div className={cn("size-10 rounded-xl flex items-center justify-center border border-gray-100/50", bg)}>
          {icon}
       </div>
    </div>
  )
}

function ReviewView() {
  const [attestations, setAttestations] = useState({
    seal: false,
    quantity: false,
    docs: false,
    temp: false
  })

  const toggleAttestation = (key: keyof typeof attestations) => {
    setAttestations(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-8">
       <div className="space-y-1">
        <h1 className="text-3xl font-[900] text-[#1a4332] tracking-tighter">Custody Transfer</h1>
        <p className="text-[13px] text-gray-500 font-medium">Transfer Request #TR-9902-BX . Received</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
               <div className="flex items-center gap-3 mb-10">
                  <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <FileText className="size-4" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Transfer Specifications</h3>
               </div>

               <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                  <SpecItem label="LOT ID" value="AG-8821-KAPPA-01" />
                  <SpecItem label="ORIGIN AGGREGATOR" value="Global Harvest Hub (North)" />
                  <SpecItem label="TOTAL QUANTITY" value="14,250 Units" />
                  <SpecItem label="COMMODITY CLASS" value="Grade A Industrial Feedstock" />
                  <SpecItem label="TRANSIT DATE" value="October 24, 2023, 14:30 GMT" />
                  <SpecItem label="PACKAGING" value="Steel Reinforced Bulk Containers" />
               </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
               <div className="flex items-center gap-3 mb-10">
                  <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Truck className="size-4" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Logistics & Vehicle Info</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="flex gap-6">
                     <div className="size-24 rounded-2xl bg-gray-900 overflow-hidden shrink-0 border border-gray-800 shadow-xl">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Truck" alt="Truck" className="size-full object-cover opacity-50" />
                     </div>
                     <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">VEHICLE UNIT</p>
                        <h4 className="text-[15px] font-[900] text-brand tracking-tighter">Unit ID: VOLVO-FH16-928</h4>
                        <p className="text-[11px] font-bold text-gray-400">License: BK-992-TX-2023</p>
                     </div>
                  </div>
                  <div className="flex gap-6">
                     <div className="size-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-md">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Markus" alt="Driver" className="size-full object-cover" />
                     </div>
                     <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">CARRIER PERSONNEL</p>
                        <h4 className="text-[15px] font-[900] text-brand tracking-tighter">Markus Theron</h4>
                        <p className="text-[11px] font-bold text-gray-400">ID: DR-900223-CERT</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm overflow-hidden group">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand">
                        <MapPin className="size-4" />
                     </div>
                     <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Current Location</h3>
                  </div>
                  <ExternalLink className="size-4 text-gray-200 group-hover:text-brand transition-colors" />
               </div>
               <div className="aspect-[4/3] rounded-[24px] bg-gray-100 relative mb-6 overflow-hidden border border-gray-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <MapPin className="size-10 text-red-500 drop-shadow-xl" />
                  </div>
               </div>
               <div className="space-y-1">
                  <h4 className="text-[15px] font-[900] text-brand tracking-tighter">Processing Center Alpha</h4>
                  <p className="text-[11px] font-bold text-gray-400 leading-tight">Rotterdam, Zone 4, Berth 12</p>
               </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-10">
                  <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand">
                    <History className="size-4" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Audit Trail</h3>
               </div>
               <div className="relative pl-8 space-y-10 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
                  <AuditItem label="Origin Departure" time="Oct 24, 08:12 AM" active />
                  <AuditItem label="Transit Checkpoint B" time="Oct 24, 11:45 AM" active />
                  <AuditItem label="Pending Your Confirmation" time="Current State" isPending />
               </div>
            </div>
         </div>
      </div>

      <div className="rounded-[40px] border border-gray-100 bg-white p-12 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
               <h3 className="text-3xl font-[900] text-[#1a4332] tracking-tighter uppercase">Processor Attestation</h3>
               <p className="text-sm text-gray-400 font-bold max-w-xl">
                  Please confirm that the physical cargo matches the digital manifest provided by the sender before finalizing the legal custody transfer.
               </p>
            </div>
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                  <div key={i} className="size-10 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
                     <User className="size-4 text-gray-300" />
                  </div>
               ))}
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttestationCheckbox 
               label="Visual seal integrity verified" 
               checked={attestations.seal} 
               onChange={() => toggleAttestation('seal')}
            />
            <AttestationCheckbox 
               label="Quantity count validated" 
               checked={attestations.quantity} 
               onChange={() => toggleAttestation('quantity')}
            />
            <AttestationCheckbox 
               label="Vehicle documentation present" 
               checked={attestations.docs} 
               onChange={() => toggleAttestation('docs')}
            />
            <AttestationCheckbox 
               label="Temperature logs reviewed" 
               checked={attestations.temp} 
               onChange={() => toggleAttestation('temp')}
            />
         </div>
      </div>
    </div>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
       <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</p>
       <p className="text-[14px] font-[900] text-gray-600 tracking-tight">{value}</p>
    </div>
  )
}

function AuditItem({ label, time, active, isPending }: { label: string; time: string; active?: boolean; isPending?: boolean }) {
  return (
    <div className="relative">
       <div className={cn(
          "absolute -left-[32.5px] top-1.5 size-3 rounded-full border-[3px] border-white ring-4",
          active && "bg-blue-500 ring-blue-50",
          isPending && "bg-[#1a4332] ring-[#e8f5e9]"
       )} />
       <p className={cn("text-[12px] font-black tracking-tight uppercase", active ? "text-brand" : "text-gray-900")}>{label}</p>
       <p className="text-[11px] font-bold text-gray-400 mt-1">{time}</p>
    </div>
  )
}

function AttestationCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div 
      onClick={onChange}
      className={cn(
        "flex items-center gap-6 rounded-[24px] border-[1.5px] p-8 transition-all cursor-pointer group shadow-sm",
        checked 
          ? "border-[#2e7d32] bg-[#e8f5e9]/10 ring-4 ring-[#e8f5e9]/50" 
          : "border-gray-50 bg-white hover:border-[#2e7d32]/30 hover:bg-gray-50/50"
      )}
    >
       <div className={cn(
          "size-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
          checked ? "bg-[#2e7d32] border-[#2e7d32] scale-110" : "border-gray-100 bg-gray-50 group-hover:border-gray-200"
       )}>
          {checked && <CheckCircle2 className="size-4 text-white stroke-[3]" />}
       </div>
       <span className={cn(
          "text-base font-black tracking-tighter transition-colors",
          checked ? "text-[#1a4332]" : "text-gray-400"
       )}>{label}</span>
    </div>
  )
}

function ManifestView() {
  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-2xl font-bold text-brand">Transit Manifest</h1>
        <p className="text-sm text-gray-500">Official Shipment</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-16 shadow-2xl relative overflow-hidden">
         {/* Authenticity Stamp */}
         <div className="absolute top-[50%] right-[10%] rotate-[-15deg] opacity-20 pointer-events-none">
            <div className="border-8 border-[#2e7d32] rounded-3xl p-6 text-center">
               <h4 className="text-6xl font-black text-brand uppercase tracking-tighter">AUTHORIZED</h4>
               <p className="text-sm font-bold text-brand uppercase tracking-widest mt-1">Logistics Verified</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-16 mb-20">
            <ManifestSection title="AGGREGATOR (ORIGIN)" name="Global Logistics Partners LLC" detail="Facility ID: WH-NORTH-422\n102 Industrial Way, Port District\nNew York, NY 10001\nContact: logistics-ops@glp.corp" />
            <ManifestSection title="RECEIVER (DESTINATION)" name="Advanced Retail Distribution" detail="Facility ID: DIST-HUB-09\n88 Logistics Cir, East Campus\nChicago, IL 60601\nContact: intake@adv-retail.com" />
         </div>

         <div className="grid grid-cols-3 border-y-4 border-[#1a4332] py-12 mb-16 gap-12">
            <ManifestMetric label="CARRIER DETAILS" value="SwiftTrans Intermodal" sub="Fleet ID: T-992-K" />
            <ManifestMetric label="PACKAGE COUNT" value="148 Units (6 Pallets)" sub="Class: A-Prime" />
            <ManifestMetric label="EST. ARRIVAL" value="OCT 27, 2023" sub="TZ: EST (UTC-5)" />
         </div>

         <div className="space-y-6 mb-20">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">TRANSFER INVENTORY DETAIL</h4>
            <div className="border-t border-gray-100">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-gray-100">
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-brand">SKU/BATCH ID</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-brand">DESCRIPTION</th>
                        <th className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-brand">QUANTITY</th>
                        <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-brand">WEIGHT (KG)</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     <ManifestRow id="ELC-2294-01" desc="Precision Circuit Modules (Type B)" qty="40" weight="120.00" />
                     <ManifestRow id="IND-X92-A" desc="Fiber-Optic Core Splicers" qty="100" weight="45.50" />
                     <ManifestRow id="SP-002-VAL" desc="Pneumatic Calibration Kit" qty="8" weight="182.40" />
                     <tr className="border-t-2 border-gray-900">
                        <td colSpan={2}></td>
                        <td className="py-4 text-center font-black text-gray-900 uppercase text-xs tracking-widest">TOTALS</td>
                        <td className="py-4 text-right">
                           <div className="flex justify-end gap-12">
                              <span className="font-black text-gray-900 text-sm tracking-tighter">148</span>
                              <span className="font-black text-gray-900 text-sm tracking-tighter">347.90</span>
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

         <div className="rounded-2xl bg-gray-50 p-10 flex items-center gap-8 mb-20">
            <div className="size-20 rounded-xl bg-white border border-gray-100 p-2 shrink-0">
               <QrCode className="size-full text-gray-300" />
            </div>
            <div>
               <h4 className="text-lg font-black text-[#1a4332] tracking-tight">Digital Tracking Enabled</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">
                  Scan this code with the LogisticsOS Mobile App to verify physical custody transfer and real-time GPS coordinates.
               </p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-16 pt-16 border-t-2 border-gray-100">
            <Signature title="AGGREGATOR AUTHORIZATION" name="Sarah Jenkins" />
            <Signature title="RECEIVER ACKNOWLEDGEMENT" name="Marcus Thorne" />
         </div>

         <div className="mt-20 text-center space-y-4">
            <p className="text-[9px] text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">
               This document serves as a binding transit manifest between the named parties. By signing, the Receiver acknowledges receipt of goods in the specified quantities and conditions for further distribution. Any discrepancies must be logged via the LogisticsOS Digital Portal within 2 hours of transit initiation.
            </p>
            <div className="flex items-center justify-center gap-8 text-[8px] font-black text-gray-300 uppercase tracking-widest">
               <span>ISO 9001:2015 CERTIFIED</span>
               <span>SECURITY COMPLIANT (SOC2)</span>
               <span>DOT-REGULATED #911202</span>
            </div>
         </div>
      </div>
    </div>
  )
}

function ManifestSection({ title, name, detail }: { title: string; name: string; detail: string }) {
  return (
    <div className="space-y-4">
       <p className="text-[10px] font-black text-brand uppercase tracking-[0.25em]">{title}</p>
       <div className="space-y-1">
          <h4 className="text-2xl font-black text-gray-900 tracking-tighter">{name}</h4>
          <div className="space-y-0.5">
             {detail.split('\\n').map((line, i) => (
                <p key={i} className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{line}</p>
             ))}
          </div>
       </div>
    </div>
  )
}

function ManifestMetric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="space-y-1.5 border-l-2 border-gray-100 pl-8 first:border-0 first:pl-0">
       <p className="text-[10px] font-black text-brand uppercase tracking-widest">{label}</p>
       <h4 className="text-xl font-black text-gray-900 tracking-tighter">{value}</h4>
       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub}</p>
    </div>
  )
}

function ManifestRow({ id, desc, qty, weight }: { id: string, desc: string, qty: string, weight: string }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
       <td className="py-6 text-sm font-black text-brand tracking-tighter">{id}</td>
       <td className="py-6 text-xs font-bold text-gray-500 uppercase tracking-wide">{desc}</td>
       <td className="py-6 text-center text-sm font-black text-gray-900 tracking-tighter">{qty}</td>
       <td className="py-6 text-right text-sm font-black text-gray-900 tracking-tighter">{weight}</td>
    </tr>
  )
}

function Signature({ title, name }: { title: string; name: string }) {
  return (
    <div className="space-y-8">
       <p className="text-[10px] font-black text-[#2e7d32] uppercase tracking-[0.25em]">{title}</p>
       <div className="space-y-4">
          <h4 className="text-3xl font-black text-gray-900 tracking-tighter border-b-2 border-gray-900 pb-2 inline-block min-w-[280px]">{name}</h4>
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                <CheckCircle2 className="size-3" />
                <span>DIGITALLY SIGNED VIA OIDC-AUTH (HASH: 8e2a...91f)</span>
             </div>
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">TIMESTAMP: 2023-10-24 09:12:44 UTC</p>
          </div>
       </div>
    </div>
  )
}
