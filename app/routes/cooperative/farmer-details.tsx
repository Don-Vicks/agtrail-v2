import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  Mail,
  MapPin,
  Maximize,
  Package,
  Phone,
  Plus,
  User,
  Users
} from 'lucide-react'
import { Link, useParams } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cooperativeFarmers } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/farmer-details'

export function meta({ params }: Route.MetaArgs) {
  const farmer = cooperativeFarmers.find((f) => f.id === params.id)
  return [
    { title: `${farmer?.name || 'Farmer'} Details | Agrolinking` },
    { name: 'description', content: 'Farmer profile and activities overview' },
  ]
}

export default function CooperativeFarmerDetails() {
  const { id } = useParams()
  const farmer = cooperativeFarmers.find((f) => f.id === id) || cooperativeFarmers[0]

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
          { label: farmer.name }
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farmer Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Traceability log and historical performance for {farmer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
            Edit Profile
          </Button>
          <Link to={`/cooperative/farmers/${farmer.id}/farms`}>
            <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
              <Plus className="size-4" />
              <span className="font-bold uppercase tracking-wide text-xs">Record Operation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* High Density Profile Card */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-20 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random&color=fff`
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 rounded-md bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                <Badge variant="ghost" className="p-0 text-brand"><User className="size-3" /></Badge>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{farmer.name}</h2>
                <Badge className="bg-green-50 text-brand text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-green-100">Verified Member</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">
                <span className="flex items-center gap-1.5"><MapPin className="size-3 text-red-400" /> Nigeria (Ogun State)</span>
                <span className="flex items-center gap-1.5"><Phone className="size-3 text-gray-300" /> {farmer.phone || '+234 81 234 5678'}</span>
                <span className="flex items-center gap-1.5"><Mail className="size-3 text-gray-300" /> member_id_{farmer.id.slice(0, 4)}@agtrail.bio</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
            <div className="text-right hidden sm:block px-4 border-r border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Enlisted Since</p>
              <p className="text-sm font-bold text-gray-900">Oct 2023</p>
            </div>
            <div className="text-right px-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Audit Score</p>
              <p className="text-sm font-bold text-brand italic">A+ Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* High Density Stats Layer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Yield Volume"
          value="1.2k Tons"
          subtitle="Lifetime harvests"
          description="Total recorded commodity volume"
          icon={<Package className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Total Area"
          value="45.2 ha"
          subtitle="Farm scale"
          description="Total farmland area"
          icon={<Maximize className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Active Products"
          value="4 Products"
          subtitle="Production items"
          description="Products currently in market"
          icon={<Activity className="size-4 text-brand" />}
          trend="neutral"
        />
        <StatCard
          title="Farms"
          value="2 Farms"
          subtitle="Farm count"
          description="Registered farms"
          icon={<MapPin className="size-4" />}
          trend="up"
        />
      </div>

      {/* High Density Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Crop Cycles */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Product Monitoring</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Active cultivation logs</p>
            </div>
            <Button variant="ghost" size="icon" className="size-8 text-gray-300 hover:text-brand"><Activity className="size-4" /></Button>
          </div>

          <div className="mb-6">
            <EmptyState
              className="rounded-md border-2 border-dashed border-gray-50 bg-gray-50/10 py-10"
              icon={<Package className="size-7 text-gray-300" />}
              title="No active cycles"
              description="Start a new production cycle to begin tracking performance."
            />
          </div>

          <Link to={`/cooperative/farmers/${farmer.id}/farms`} className="block">
            <Button className="w-full bg-brand/5 text-brand hover:bg-brand hover:text-white border border-brand/10 shadow-none font-bold uppercase tracking-wider text-[11px] h-11">
              <Plus className="size-4 me-2" />
              Start New Cycle
            </Button>
          </Link>
        </div>

        {/* Commodity Distribution Cluster */}
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-6">Products</h3>
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="text-center group cursor-default">
                <div className="size-16 rounded-full border-4 border-gray-50 border-t-brand mb-3 mx-auto transition-transform group-hover:rotate-45 duration-700" />
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Awaiting Cycle</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-6">Farm Inventory</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Farms</span>
                <span className="text-xs font-bold text-gray-900 tracking-tight">2 Registered</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Total Area</span>
                <span className="text-xs font-bold text-gray-900 tracking-tight">45.20 Hectares</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Available Products</span>
                <span className="text-xs font-bold text-brand">4 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm flex flex-col min-h-[320px]">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex size-8 items-center justify-center rounded-md bg-blue-50 text-blue-500 shadow-sm">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Insights</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Important updates</p>
            </div>
          </div>

          <EmptyState
            className="rounded-md border-2 border-dashed border-gray-50 bg-gray-50/10 py-10"
            icon={<ClipboardList className="size-7 text-gray-300" />}
            title="Status: clear"
            description="No critical deviations flagged for this view."
          />
        </div>
      </div>
    </div>
  )
}
