import { CheckCircle2, Eye, MapPin, Truck } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { BATCHES, SHIPMENTS, VERIFIED_EVENTS } from '~/lib/mock-data/transporter'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Transporter Dashboard | Agtrail' },
    { name: 'description', content: 'Operations control and fleet monitoring' },
  ]
}

export default function TransporterDashboard() {
  const [showPickupModal, setShowPickupModal] = useState(false)

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          { label: 'Transporter', href: '/transporter' },
        ]}
      />

      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand tracking-tight">Operations Control</h1>
          <p className="text-xs text-gray-400 font-medium max-w-sm">Institutional-grade logistics monitoring for the Sitsillia fleet. Ensuring optimal throughput across all supply nodes.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm min-w-[200px] h-28 flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Active Fleet</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">156</p>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm min-w-[200px] h-28 flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Pending</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight">24</p>
          </div>
        </div>
      </div>

      {/* Available Batches */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='size-6 rounded bg-brand/5 flex items-center justify-center text-brand'>
              <Truck className='size-3.5' />
            </div>
            <h2 className='text-sm font-bold text-gray-900 uppercase tracking-widest'>Available Batches</h2>
          </div>
          <button className='text-brand font-bold text-[11px] uppercase tracking-widest hover:underline'>
            View All Batches
          </button>
        </div>

        <div className='rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='bg-gray-50/30 border-b border-gray-100'>
                <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Batch Identifier</th>
                <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Origin Node</th>
                <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Commodity</th>
                <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Net Weight</th>
                <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {BATCHES.map((batch, index) => (
                <tr key={index} className='hover:bg-gray-50/30 transition-colors group'>
                  <td className='px-6 py-4'>
                    <span className='font-bold text-brand text-[13px]'>{batch.id}</span>
                  </td>
                  <td className='px-6 py-4 text-emerald-600 font-bold text-[13px]'>{batch.origin}</td>
                  <td className='px-6 py-4 text-emerald-600 font-bold text-[13px]'>{batch.commodity}</td>
                  <td className='px-6 py-4 text-emerald-600 font-bold text-[13px]'>{batch.weight}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-6'>
                      <Button
                        onClick={() => setShowPickupModal(true)}
                        className='bg-brand-dark hover:bg-black text-white font-bold text-[11px] uppercase tracking-widest px-8 h-9 rounded-md shadow-md active:scale-95 transition-all'
                      >
                        Accept
                      </Button>
                      <button className='text-gray-300 hover:text-brand transition-colors'>
                        <Eye className='size-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verified Events */}
      <section className='space-y-4'>
        <div className='flex items-center gap-2'>
          <div className='size-2 rounded-full bg-gray-400'></div>
          <h2 className='text-[11px] font-bold text-gray-900 uppercase tracking-widest'>Verified Events</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {VERIFIED_EVENTS.map((event) => (
            <div key={event.id} className='flex items-center gap-5 p-5 rounded-md border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all group'>
              <div className='size-14 rounded-md border border-gray-100 flex items-center justify-center shadow-sm shrink-0 bg-gray-50 group-hover:bg-brand/10 group-hover:text-brand transition-colors'>
                <CheckCircle2 className='size-6 text-gray-400 group-hover:text-brand' />
              </div>
              <div className='space-y-1'>
                <p className='text-[15px] font-bold text-gray-900 tracking-tight'>{event.location}</p>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest'>Verified by {event.verifiedBy}</span>
                  <span className='text-[11px] font-bold text-brand flex items-center gap-1.5 uppercase tracking-widest'>
                    <ClockIcon className='size-3.5' />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* In-Transit Shipments */}
      <section className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='size-8 rounded bg-brand/5 flex items-center justify-center text-brand'>
            <MapPin className='size-4' />
          </div>
          <h2 className='text-lg font-bold text-gray-900 tracking-tight'>In-Transit Shipments</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
          {SHIPMENTS.map((shipment) => (
            <div key={shipment.id} className='rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='size-12 rounded-md bg-gray-900 flex items-center justify-center overflow-hidden shrink-0'>
                  <img src={shipment.image} alt={shipment.driver} className='size-10 object-contain grayscale brightness-200' />
                </div>
                <div className='min-w-0 space-y-0.5'>
                  <p className='text-sm font-bold text-gray-900 truncate tracking-tight'>{shipment.driver}</p>
                  <p className='text-[11px] text-gray-400 font-bold uppercase tracking-widest'>{shipment.vessel}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Vector Path</p>
                  <p className="text-[11px] font-bold text-gray-900">{shipment.path}</p>
                </div>
                <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-brand-dark rounded-full transition-all duration-1000'
                    style={{ width: `${shipment.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Status</p>
                  <p className="text-[11px] font-semibold text-gray-600 mt-0.5 tracking-tight">{shipment.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">ETA</p>
                  <p className="text-[11px] font-bold text-gray-900 mt-0.5">{shipment.eta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PickupRequestModal
        open={showPickupModal}
        onClose={() => setShowPickupModal(false)}
      />
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function PickupRequestModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-md border-none shadow-2xl">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">New Pickup Request</h2>
              <div className="flex items-center gap-2">
                <div className="size-5 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" className="size-4" />
                </div>
                <span className="text-[11px] text-gray-400 font-bold tracking-tight">From <span className="text-gray-900">John Mwangi</span></span>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase tracking-widest rounded-md px-3">Pending</Badge>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1.5 py-1">
                <div className="size-8 rounded-full bg-emerald-900 flex items-center justify-center text-white">
                  <MapPin className="size-4" />
                </div>
                <div className="flex-1 w-0.5 bg-gray-100 border-dashed border-l-2"></div>
                <div className="size-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                  <MapPin className="size-4" />
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type of Goods</p>
                  <p className="text-[13px] font-bold text-emerald-900">Kiambu Farm, Kiambu County</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type of Goods</p>
                  <p className="text-[13px] font-bold text-emerald-900">Kiambu Farm, Kiambu County</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-md border border-gray-100">
                <div className="size-8 rounded-md bg-white flex items-center justify-center shadow-sm text-emerald-900">
                  <Truck className="size-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Type of Goods</p>
                  <p className="text-[11px] font-bold text-emerald-900">Maize</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-md border border-gray-100">
                <div className="size-8 rounded-md bg-white flex items-center justify-center shadow-sm text-emerald-900">
                  <Truck className="size-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Quantity</p>
                  <p className="text-[11px] font-bold text-emerald-900">500Kg (10 Bags)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-md border border-gray-100">
                <div className="size-8 rounded-md bg-white flex items-center justify-center shadow-sm text-emerald-900">
                  <Truck className="size-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Distance</p>
                  <p className="text-[11px] font-bold text-emerald-900">32 km</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-md border border-gray-100">
                <div className="size-8 rounded-md bg-white flex items-center justify-center shadow-sm text-emerald-900">
                  <Truck className="size-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Est. Time</p>
                  <p className="text-[11px] font-bold text-emerald-900">45 mins</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-md border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-emerald-600">$</span>
                <span className="text-lg font-bold text-emerald-900 tracking-tight">Payment</span>
              </div>
              <span className="text-2xl font-bold text-emerald-900 tracking-tight">2,500</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 bg-red-600 hover:bg-red-700 text-white border-none font-bold text-[13px] rounded-md active:scale-95 transition-all"
            >
              Decline
            </Button>
            <Button
              onClick={onClose}
              className="h-12 bg-brand-dark hover:bg-black text-white font-bold text-[13px] rounded-md shadow-lg active:scale-95 transition-all"
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
