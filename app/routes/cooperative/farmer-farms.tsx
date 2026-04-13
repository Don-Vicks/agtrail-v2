import { 
  Plus, 
  Search, 
  MapPin, 
  User, 
  LayoutDashboard, 
  Users, 
  ChevronDown,
  Activity,
  Maximize
} from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { cooperativeFarmers } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/farmer-farms'
import { cn } from '~/lib/utils'

export function meta({ params }: Route.MetaArgs) {
  const farmer = cooperativeFarmers.find((f) => f.id === params.id)
  return [
    { title: `Record Farm Operation - ${farmer?.name || 'Farmer'} | Agrolinking` },
    { name: 'description', content: 'Select farm to record activities' },
  ]
}

export default function CooperativeFarmerFarms() {
  const { id } = useParams()
  const farmer = cooperativeFarmers.find((f) => f.id === id) || cooperativeFarmers[0]
  const [isCreateFarmOpen, setIsCreateFarmOpen] = useState(false)

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Farmers', href: '/cooperative/farmers', icon: <Users className="size-4 text-gray-400" /> },
          { label: farmer.name, href: `/cooperative/farmers/${farmer.id}` },
          { label: 'Farms' }
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farms</h1>
          <p className="text-sm text-gray-500 mt-1">Select or add farms for {farmer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateFarmOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Add New Farm</span>
          </Button>
        </div>
      </div>

      {/* High Density Farmer Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="size-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random&color=fff`
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">{farmer.name}</h2>
              <Badge variant="ghost" className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 px-2">Registered Member</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
              <span className="flex items-center gap-1.5"><MapPin className="size-3 text-red-400" /> Nigeria (Ogun State)</span>
              <span className="flex items-center gap-1.5"><User className="size-3 text-gray-300" /> ID: MEM-{farmer.id.slice(0, 4)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Select or Create a Farm Block */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Select or Create a Farm</h3>
            <p className="text-xs text-gray-500">Choose an existing farm or create a new one with GPS mapping to start your traceability journey.</p>
          </div>
          <button
            onClick={() => setIsCreateFarmOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#2B5C2D] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-black whitespace-nowrap"
          >
            <Plus className="size-3.5" />
            Create New Farm
          </button>
        </div>

      {/* Search & Discovery Toolbar */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by farm name, area, or location..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sort Metric</span>
              <div className="relative">
                <select className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]">
                  <option>Name (A-Z)</option>
                  <option>Area Size</option>
                  <option>Location</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Empty State Discovery */}
        <div className="rounded-xl border border-gray-200 bg-white p-20 flex flex-col items-center justify-center text-center shadow-sm min-h-[360px]">
          <div className="size-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
            <MapPin className="size-8 text-gray-200" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 italic">No Farms Registered</h3>
          <p className="text-[10px] text-gray-300 uppercase tracking-tight mb-8">This member has no linked farms for cultivation</p>
          <Button
            onClick={() => setIsCreateFarmOpen(true)}
            className="bg-brand/5 text-brand hover:bg-brand hover:text-white border border-brand/10 shadow-none font-bold uppercase tracking-wider text-[11px] h-11 px-8"
          >
            <Plus className="size-4 me-2" />
            Add New Farm
          </Button>
        </div>
      </div>

      <CreateFarmModal isOpen={isCreateFarmOpen} onClose={() => setIsCreateFarmOpen(false)} />
    </div>
  )
}
