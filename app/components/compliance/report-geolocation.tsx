import { Globe } from 'lucide-react'
import { FarmMap } from '~/components/farm-map.client'

export function ReportGeolocation() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">Geolocation Analysis</h3>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Verified plot coordinates with satellite cross-referencing.</p>
        </div>
        <button className="text-[9px] font-black text-brand uppercase tracking-widest flex items-center gap-1 hover:underline">
          <Globe className="size-3" /> Expand GIS View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="relative aspect-[21/9] rounded-md border border-gray-100 overflow-hidden bg-gray-50 group">
            <FarmMap farms={[]} className="size-full grayscale opacity-80" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-900 tracking-tighter uppercase">LAT: -18.3186 | LONG: 48.2772</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-brand-surface rounded-md p-6 space-y-4 border border-brand-surface">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-brand-light uppercase tracking-widest">SATELLITE VERIFICATION</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-brand leading-none">100%</span>
                <span className="text-[10px] text-brand font-bold pb-1 leading-tight">Match between declared area and Sentinel-2 imagery (Ref: S2-B8329).</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface rounded-md p-6 space-y-2 border border-brand-surface">
            <p className="text-[10px] font-black text-brand-light uppercase tracking-widest">POLYGON INTEGRITY</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              Boundaries verified by local agronomist on 2023-09-12. No overlaps with protected indigenous lands detected.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
