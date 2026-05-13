import {
  Activity,
  Calendar,
  ExternalLink,
  FileText,
  History,
  MapPin,
  Navigation,
  Plus,
  Thermometer,
  User
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { Switch } from '../../components/ui/switch'

// Mock Data
const mockLots = [
  {
    id: 'COC-2025-014',
    commodity: 'Coco Beans',
    location: 'Kumasi, Ghana',
    quantity: '1200 kg',
    logs: 3,
    lastTemp: '22.5c',
    tempRange: '15-20c',
    humRange: '60-70%',
    sensor: 'SENS-CC-001',
    receivedAt: '4/16/2026',
    custody: 'agg_c5cf7741',
  },
  {
    id: 'COC-2025-015',
    commodity: 'Coco Beans',
    location: 'Kumasi, Ghana',
    quantity: '850 kg',
    logs: 1,
    lastTemp: '18.2c',
    tempRange: '15-20c',
    humRange: '60-70%',
    sensor: 'SENS-CC-002',
    receivedAt: '4/18/2026',
    custody: 'agg_c5cf7741',
  }
]

const mockLogs = [
  {
    id: 1,
    location: 'Warehouse A - Bay 3',
    method: 'Manual',
    time: '4/17/2026, 5:29pm',
    savedTime: '4/23/2026, 5:29pm',
    temp: '22.5c',
    hum: '73%',
    tempLimit: '20',
    humLimit: '70',
    breached: true,
  },
  {
    id: 2,
    location: 'Warehouse A - Bay 3',
    method: 'Manual',
    time: '4/17/2026, 5:29pm',
    savedTime: '4/23/2026, 5:29pm',
    temp: '18c',
    breached: false,
  },
  {
    id: 3,
    location: 'Warehouse A - Bay 3',
    method: 'Manual',
    time: '4/17/2026, 5:29pm',
    savedTime: '4/23/2026, 5:29pm',
    temp: '18c',
    breached: false,
  }
]

export default function AggregatorLotStoragePage() {
  const [selectedLotId, setSelectedLotId] = useState(mockLots[0].id)
  const selectedLot = mockLots.find(l => l.id === selectedLotId) || mockLots[0]

  return (
    <div className='space-y-6 pb-20'>
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
          },
          { label: 'Lot Storage' }
        ]}
        action={
          <NewLotModal />
        }
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className='text-2xl font-bold text-[#2e7d32]'>Lot Storage</h1>
          <p className='text-sm text-gray-500'>Scan farmer batch QRs, review verification status, and consolidate them into a lot before taking custody.</p>
        </div>
        <div className="flex items-center gap-3">
          <NewLotModal />
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">External Materials</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">112 kg</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Your Lots (Left) | Monitoring & Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Your Lots */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Your Lots</h2>
          <div className="space-y-4">
            {mockLots.map(lot => (
              <button
                key={lot.id}
                onClick={() => setSelectedLotId(lot.id)}
                className={cn(
                  "w-full text-left rounded-2xl border p-6 transition-all duration-200 shadow-sm",
                  selectedLotId === lot.id
                    ? "border-[#2e7d32] bg-white ring-1 ring-[#2e7d32]/10"
                    : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{lot.commodity}</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1">{lot.id}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="size-3 text-[#2e7d32]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lot.location}</span>
                </div>

                <div className="pt-6 border-t border-gray-50 grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">Qty</p>
                    <p className="text-xs font-bold text-[#2e7d32]">{lot.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">Logs</p>
                    <p className="text-xs font-bold text-[#2e7d32]">{lot.logs}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">Last</p>
                    <p className="text-xs font-bold text-[#2e7d32]">{lot.lastTemp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Lot Detail & Logs */}
        <div className="space-y-8">
          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Navigation className="size-4 text-[#2e7d32]" />
                  <span className="text-[10px] font-bold text-[#2e7d32] uppercase tracking-widest">{selectedLot.location}</span>
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{selectedLot.id}</h2>
                  <div className="flex size-7 items-center justify-center rounded-md border border-gray-100 text-gray-300">
                    <ExternalLink className="size-4" />
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[#2e7d32]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{selectedLot.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[#2e7d32]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-nowrap">Received {selectedLot.receivedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-[#2e7d32]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Custody: {selectedLot.custody}</span>
                  </div>
                </div>
              </div>
              <LogConditionModal lotId={selectedLot.id} />
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              <ConditionStat label="Quantity" value={selectedLot.quantity} />
              <ConditionStat label="Temp Raange" value={selectedLot.tempRange} />
              <ConditionStat label="Humdity Range" value={selectedLot.humRange} />
              <ConditionStat label="Lot Sensor" value={selectedLot.sensor} />
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-3.5 flex items-center gap-3">
              <div className="flex size-6 items-center justify-center rounded-md border border-gray-100 text-gray-400">
                <FileText className="size-3" />
              </div>
              <p className="text-[10px] font-bold text-[#2e7d32] uppercase tracking-wide">1 entry breached commodity threshold during your custody</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">Scanned Batches <span className="text-gray-300 ml-1">({mockLogs.length})</span></h2>
            <div className="space-y-4">
              {mockLogs.map(log => (
                <div key={log.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-3.5 text-[#2e7d32]" />
                      <h4 className="text-sm font-bold text-[#2e7d32]">{log.location}</h4>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100">{log.method}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="size-4 text-gray-200" />
                      <span className="text-sm font-bold text-[#1a4332] tracking-tight">{log.temp}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <p className="text-[10px] font-bold text-[#2e7d32]">{log.time}</p>
                    <p className="text-[10px] font-bold text-gray-300">Saved {log.savedTime}</p>
                  </div>

                  {log.breached && (
                    <div className="flex gap-3">
                      <div className="flex flex-1 items-center gap-3 rounded-md border border-[#2e7d32]/10 bg-[#e8f5e9]/30 px-4 py-3">
                        <Activity className="size-4 text-[#2e7d32]" />
                        <span className="text-[10px] font-bold text-[#2e7d32] uppercase tracking-wide">Temp High: {log.temp} (Limit {log.tempLimit})</span>
                      </div>
                      <div className="flex flex-1 items-center gap-3 rounded-md border border-gray-100 bg-white px-4 py-3">
                        <History className="size-4 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Humidity High: {log.hum} (Limit {log.humLimit})</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConditionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-xs font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
  )
}

function NewLotModal() {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-md h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2">
          <Plus className="size-3.5" />
          New lot
        </Button>
      } />
      <DialogContent className="sm:max-w-[480px] p-6 rounded-md border-none shadow-2xl bg-white">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-extrabold text-[#1a4332] tracking-tighter">New lot in Custody</DialogTitle>
          <DialogDescription className="text-xs text-gray-400 font-medium">
            Track a new aggregated lot. Thresholds default to commodity standards.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Lot Code</Label>
            <Input defaultValue="COC-2025-014" className="h-9 bg-gray-50/50 border-gray-200 rounded-md text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Commodity</Label>
            <Input placeholder="Cocoa beans" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Quantity (Kg)</Label>
            <Input placeholder="" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Origin</Label>
            <Input placeholder="Region, Country" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
          </div>
        </div>

        <div className="rounded-md border border-gray-100 bg-white p-4 mb-4">
          <h4 className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-[0.2em] mb-4">Thresholds</h4>
          <div className="grid grid-cols-4 gap-3">
            <ThresholdInput label="Temp Min" defaultValue="15" />
            <ThresholdInput label="Temp Max" defaultValue="20" />
            <ThresholdInput label="Hum Min" defaultValue="60" />
            <ThresholdInput label="Hum Max" defaultValue="70" />
          </div>
        </div>

        <div className="rounded-md border border-gray-100 bg-white p-4 mb-6 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-[#1a4332] tracking-tight">Connect lot Sensor</h4>
            <p className="text-[10px] text-gray-400 font-medium">Auto-populate reading from a linked sensor</p>
          </div>
          <Switch className="scale-75 origin-right data-[state=checked]:bg-[#1a4332]" />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => { }} variant="outline" className="h-10 flex-1 rounded-md bg-brand-accent hover:bg-red-700 text-white border-none text-xs font-bold uppercase tracking-widest transition-all active:scale-95">
            Cancel
          </Button>
          <Button className="h-10 flex-1 rounded-md bg-[#1a4332] hover:bg-[#122e22] text-white text-xs font-bold uppercase tracking-widest shadow-md shadow-[#1a4332]/10 transition-all active:scale-95">
            Create Lot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ThresholdInput({ label, defaultValue }: { label: string, defaultValue?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{label}</Label>
      <Input defaultValue={defaultValue} className="h-8 bg-white border-gray-200 rounded-md text-[10px] font-bold text-gray-900 text-center" />
    </div>
  )
}

function LogConditionModal({ lotId }: { lotId: string }) {
  return (
    <Dialog>
      <DialogTrigger render={
        <Button className="bg-[#1a4332] hover:bg-[#122e22] text-white rounded-md h-8 px-4 text-[9px] font-bold uppercase tracking-widest gap-2">
          <Plus className="size-3" />
          Log entry
        </Button>
      } />
      <DialogContent className="sm:max-w-[480px] p-6 rounded-md border border-dashed border-[#2e7d32]/30 shadow-2xl bg-white">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-extrabold text-[#1a4332] tracking-tighter">Log storage conditions</DialogTitle>
          <DialogDescription className="text-xs text-gray-400 font-medium tracking-tight">
            Lot {lotId}. Threshold 15-20c, 60-70%
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Storage Location</Label>
            <Input placeholder="e.g. Warehouse A - Bay 3" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Date & Time</Label>
              <Input defaultValue="04/23/2026 04:12 pm" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Temperature (c)</Label>
              <Input placeholder="e.g. 18.5" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Humidity</Label>
            <Input placeholder="e.g. 65%" className="h-9 bg-white border-gray-200 rounded-md text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold text-[#2e7d32] uppercase tracking-widest">Notes (optional)</Label>
            <textarea
              className="w-full min-h-[100px] p-3 bg-white border border-gray-200 rounded-md text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2e7d32]/20"
              placeholder="Cooling unit status, anomalies, etc."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => { }} variant="outline" className="h-10 flex-1 rounded-md bg-brand-accent hover:bg-red-700 text-white border-none text-xs font-bold uppercase tracking-widest transition-all active:scale-95">
            Cancel
          </Button>
          <Button className="h-10 flex-1 rounded-md bg-[#1a4332] hover:bg-[#122e22] text-white text-xs font-bold uppercase tracking-widest shadow-md shadow-[#1a4332]/10 transition-all active:scale-95">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
