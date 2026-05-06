import { CheckCircle2, Eye, MapPin, Truck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Transporter Dashboard | Agtrail' },
    { name: 'description', content: 'Operations control and fleet monitoring' },
  ]
}

const BATCHES = [
  {
    id: '#BT - 98442',
    origin: 'Akure, Nigeria',
    commodity: 'Feed Corn',
    weight: '300 Kg',
    status: 'Available',
  },
  {
    id: '#BT - 98442',
    origin: 'Abeokuta, Nigeria',
    commodity: 'Premium Wheat',
    weight: '300 Kg',
    status: 'Available',
  },
  {
    id: '#BT - 98442',
    origin: 'Abeokuta, Nigeria',
    commodity: 'Grain',
    weight: '300 Kg',
    status: 'Available',
  },
]

const VERIFIED_EVENTS = [
  {
    id: 1,
    location: 'Chicago Central Silo',
    verifiedBy: 'Mark K.',
    time: '24m AGO',
  },
  {
    id: 2,
    location: 'Denver Processing',
    verifiedBy: 'Sarah J.',
    time: '1.5h AGO',
  },
  {
    id: 3,
    location: 'Denver Processing',
    verifiedBy: 'Sarah J.',
    time: '1.5h AGO',
  },
]

const SHIPMENTS = [
  {
    id: 1,
    driver: 'Marcus Thorne',
    vessel: 'Vessel #4420-B',
    path: 'NE Farm - Chicago',
    progress: 75,
    status: 'Operational',
    eta: '14:45',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    id: 2,
    driver: 'Elena Rodriguez',
    vessel: 'Vessel #5512-C',
    path: 'South Silo - Port Mobile',
    progress: 45,
    status: 'Stationary',
    eta: '19:20',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
  },
  {
    id: 3,
    driver: 'Julian Vose',
    vessel: 'Vessel #8891-A',
    path: 'Valley Ranch - Denver',
    progress: 90,
    status: 'Final Approach',
    eta: '09:15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
  },
  {
    id: 4,
    driver: 'Sarah McEnery',
    vessel: 'Vessel #1042-X',
    path: 'Agro Park - Chicago',
    progress: 60,
    status: 'Congestion',
    eta: '11:55',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
]

export default function TransporterDashboard() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          {
            label: 'Transporter',
            href: '/transporter',
            icon: (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          { label: 'Dashboard' },
        ]}
      />

      {/* Header & Stats moved below PageHeader */}
      <div className="px-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Operations Control</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-md">Institutional-grade logistics monitoring for the fleet.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm min-w-[160px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Fleet</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">156</p>
          </div>
          <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm min-w-[160px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">24</p>
          </div>
        </div>
      </div>

      {/* Available Batches */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='size-8 rounded-md bg-brand/10 flex items-center justify-center text-brand'>
              <Truck className='size-4' />
            </div>
            <h2 className='text-lg font-bold text-gray-900'>Available Batches</h2>
          </div>
          <Button variant='link' className='text-brand font-bold text-sm'>
            View All Batches
          </Button>
        </div>

        <div className='rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-100'>
                <th className='px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]'>Batch Identifier</th>
                <th className='px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]'>Origin Node</th>
                <th className='px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]'>Commodity</th>
                <th className='px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]'>Net Weight</th>
                <th className='px-6 py-4 font-bold text-gray-400 uppercase tracking-wider text-[10px] text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {BATCHES.map((batch, index) => (
                <tr key={index} className='hover:bg-gray-50/50 transition-colors group'>
                  <td className='px-6 py-5'>
                    <span className='font-bold text-brand'>{batch.id}</span>
                  </td>
                  <td className='px-6 py-5 text-gray-600 font-medium'>{batch.origin}</td>
                  <td className='px-6 py-5 text-gray-600 font-medium'>{batch.commodity}</td>
                  <td className='px-6 py-5 text-gray-600 font-medium'>{batch.weight}</td>
                  <td className='px-6 py-5'>
                    <div className='flex items-center justify-end gap-3'>
                      <Button className='bg-brand-dark hover:bg-black text-white font-bold text-xs px-6 h-9 rounded-md'>
                        Accept
                      </Button>
                      <button className='text-gray-400 hover:text-brand transition-colors'>
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
          <div className='size-2 rounded-full bg-gray-400' />
          <h2 className='text-sm font-bold text-gray-900 uppercase tracking-wider'>Verified Events</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {VERIFIED_EVENTS.map((event) => (
            <div key={event.id} className='flex items-center gap-4'>
              <div className='size-10 rounded-full border border-gray-100 flex items-center justify-center shadow-sm shrink-0'>
                <CheckCircle2 className='size-4 text-gray-400' />
              </div>
              <div>
                <p className='text-sm font-bold text-gray-900'>{event.location}</p>
                <div className='flex items-center gap-2 mt-0.5'>
                  <span className='text-[11px] text-gray-400'>Verified by {event.verifiedBy}</span>
                  <span className='text-[11px] font-bold text-gray-400 flex items-center gap-1'>
                    <span className='size-1 rounded-full bg-gray-300' />
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
          <div className='size-8 rounded-md bg-brand/10 flex items-center justify-center text-brand'>
            <MapPin className='size-4' />
          </div>
          <h2 className='text-lg font-bold text-gray-900'>In-Transit Shipments</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
          {SHIPMENTS.map((shipment) => (
            <div key={shipment.id} className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5'>
              <div className='flex items-center gap-3'>
                <div className='size-12 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100'>
                  <img src={shipment.image} alt={shipment.driver} className='size-10 object-contain opacity-80' />
                </div>
                <div className='min-w-0'>
                  <p className='text-sm font-bold text-gray-900 truncate'>{shipment.driver}</p>
                  <p className='text-[11px] text-gray-400 font-medium'>{shipment.vessel}</p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between text-[11px] font-bold'>
                  <span className='text-gray-400 uppercase tracking-wider'>Vector Path</span>
                </div>
                <p className='text-xs font-bold text-gray-900'>{shipment.path}</p>
                <div className='h-2 w-full bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-brand-dark rounded-full transition-all duration-1000'
                    style={{ width: `${shipment.progress}%` }}
                  />
                </div>
              </div>

              <div className='flex items-center justify-between pt-2'>
                <div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Status</p>
                  <p className='text-xs font-bold text-gray-700 mt-0.5'>{shipment.status}</p>
                </div>
                <div className='text-right'>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>ETA</p>
                  <p className='text-xs font-bold text-gray-900 mt-0.5'>{shipment.eta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
