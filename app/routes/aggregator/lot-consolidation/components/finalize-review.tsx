import { AlertTriangle, Building2, ChevronRight, History, MapPin } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { FarmMap } from '~/components/farm-map.client'
import { StatCard } from './stat-card'

interface FinalizeReviewProps {
  onBack: () => void
  onFinalize: () => void
}

const mockFarms = [
  {
    id: 'F1',
    name: 'Jonathan Arable Farm',
    location: 'North Valley Flats',
    region: 'Western Region',
    hectares: 240.5,
    lat: 7.1881,
    lng: 2.1033,
    boundary: [
      { lat: 7.190, lng: 2.100 },
      { lat: 7.195, lng: 2.105 },
      { lat: 7.190, lng: 2.110 },
      { lat: 7.185, lng: 2.105 }
    ]
  },
  {
    id: 'F2',
    name: 'Sarah Greenfield Farm',
    location: 'East Ridge',
    region: 'Eastern Region',
    hectares: 188.0,
    lat: 7.2500,
    lng: 2.2000,
    boundary: [
      { lat: 7.255, lng: 2.195 },
      { lat: 7.260, lng: 2.205 },
      { lat: 7.255, lng: 2.215 },
      { lat: 7.245, lng: 2.205 }
    ]
  }
]

export function FinalizeReview({ onBack, onFinalize }: FinalizeReviewProps) {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-extrabold text-[#2e7d32] tracking-tight'>
          Finalize Lot Review
        </h1>
        <p className='text-[13px] text-gray-500 font-medium'>
          Merge farmer batches into sealed aggregators lots with an
          immutable composition
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='Total Batches'
          value='142'
          subtext='All Verified'
        />
        <StatCard
          label='Total Farmers'
          value='2'
          subtext='Direct Sourcing'
        />
        <StatCard
          label='Final Weight'
          value='1000 kg'
          subtext='+12% vs last Most'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Composition Tree Summary */}
        <div className='lg:col-span-2 bg-white border border-gray-100 rounded-md p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='text-lg font-bold text-gray-900'>
              Composition Tree
            </h3>
            <span className='text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-widest'>
              Hierarchy View
            </span>
          </div>

          <div className='flex flex-col items-center overflow-x-auto pb-4'>
            <div className='bg-[#1a4332] text-white rounded-md p-4 w-64 text-center shadow-md z-10 relative shrink-0'>
              <p className='text-[9px] text-white/70 uppercase tracking-widest font-bold mb-1'>
                Lot Root
              </p>
              <p className='text-lg font-bold'>LOT-2023-001</p>
            </div>

            <div className='w-px h-6 bg-gray-200 shrink-0'></div>
            <div className='w-[320px] border-t border-gray-200 shrink-0'></div>
            <div className='flex justify-between w-[320px] shrink-0'>
              <div className='w-px h-6 bg-gray-200'></div>
              <div className='w-px h-6 bg-gray-200'></div>
            </div>

            <div className='flex justify-between w-[480px] relative -top-px mb-6 shrink-0'>
              <div className='bg-white border border-gray-200 rounded-md p-4 w-52 flex items-center justify-center gap-3 shadow-sm'>
                <MapPin className='size-5 text-[#2e7d32]' />
                <div className='text-center'>
                  <p className='text-sm font-bold text-gray-900'>
                    Sector A
                  </p>
                  <p className='text-[10px] font-medium text-gray-500'>
                    5 Batches
                  </p>
                </div>
              </div>
              <div className='bg-white border border-gray-200 rounded-md p-4 w-52 flex items-center justify-center gap-3 shadow-sm'>
                <MapPin className='size-5 text-[#2e7d32]' />
                <div className='text-center'>
                  <p className='text-sm font-bold text-gray-900'>
                    Sector B
                  </p>
                  <p className='text-[10px] font-medium text-gray-500'>
                    4 Batches
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-4'>
              <div className='bg-[#fcfdfc] border border-gray-100 rounded-md p-4 flex gap-3 shadow-sm'>
                <div className='size-8 rounded bg-[#e8f5e9] flex items-center justify-center shrink-0'>
                  <Building2 className='size-4 text-[#2e7d32]' />
                </div>
                <div>
                  <p className='text-xs font-bold text-gray-900 mb-1'>
                    Sub-Lot Traceability
                  </p>
                  <p className='text-[10px] text-gray-500 font-medium'>
                    All nodes linked to source farm IDs
                  </p>
                </div>
              </div>
              <div className='bg-[#fcfdfc] border border-gray-100 rounded-md p-4 flex gap-3 shadow-sm'>
                <div className='size-8 rounded bg-[#e8f5e9] flex items-center justify-center shrink-0'>
                  <History className='size-4 text-[#2e7d32]' />
                </div>
                <div>
                  <p className='text-xs font-bold text-gray-900 mb-1'>
                    Audit Readiness
                  </p>
                  <p className='text-[10px] text-gray-500 font-medium'>
                    Compliance checks passed for all branches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Origin */}
        <div className='bg-white border border-gray-100 rounded-md p-6 shadow-sm flex flex-col'>
          <h3 className='text-sm font-bold text-gray-900 mb-4'>
            Geographic Origin
          </h3>
          <div className='flex-1 mb-4 min-h-[300px]'>
            <FarmMap farms={mockFarms} className="h-full w-full" />
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-gray-500 font-medium'>
                Primary Region
              </span>
              <span className='font-bold text-gray-900'>
                North Valley Flats
              </span>
            </div>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-gray-500 font-medium'>Total Area</span>
              <span className='font-bold text-gray-900'>
                428.5 Hectares
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-[#fef2f2] border border-[#fecaca] rounded-md p-5 flex gap-4 items-start shadow-sm mt-4'>
        <AlertTriangle className='size-5 text-[#dc2626] shrink-0 mt-0.5' />
        <div className='space-y-1 text-left'>
          <h4 className='text-sm font-bold text-[#dc2626]'>
            Critical Action: Data Lock Notice
          </h4>
          <p className='text-xs font-medium text-[#dc2626]/80 leading-relaxed'>
            Finalizing will permanently lock all data and logs for this lot.
            This action cannot be undone. Ensure all weights, farmer
            attributions, and batch links are accurate before proceeding.
          </p>
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-6 border-t border-gray-100'>
        <Button
          onClick={onBack}
          variant='outline'
          className='h-11 px-6 rounded-md font-bold text-gray-600'
        >
          Save as Draft
        </Button>
        <Button
          onClick={onFinalize}
          className='h-11 px-6 rounded-md bg-[#1a4332] hover:bg-[#122e22] font-bold text-white shadow-sm'
        >
          Finalize & Create Lot <ChevronRight className='ml-2 size-4' />
        </Button>
      </div>
    </div>
  )
}
