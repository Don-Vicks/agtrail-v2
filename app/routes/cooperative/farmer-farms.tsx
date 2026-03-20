import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cooperativeFarmers } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/farmer-farms'

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
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <PageHeader
        items={[
          {
            label: 'Cooperative',
            href: '/cooperative',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Farmers', href: '/cooperative/farmers' },
          { label: farmer.name, href: `/cooperative/farmers/${farmer.id}` },
          { label: 'Farms' }
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-[#18421A] uppercase tracking-wide">RECORD FARM OPERATION</h1>
        <p className="text-xs text-gray-500 mt-1">Select a farm to record operations and track farm activities</p>
      </div>

      {/* Mini Profile Summary */}
      <div className="flex items-center gap-3">
        <img
          src={farmer.avatar}
          alt={farmer.name}
          className="size-10 rounded-full object-cover bg-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random`
          }}
        />
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-tight">{farmer.name}</h2>
          <p className="text-xs text-gray-600 leading-snug">adasd, MDs</p>
          <p className="text-xs text-gray-500 leading-snug">{farmer.phone || '+2348232313123'}</p>
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

        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search Farm..."
              className="h-9 w-full rounded-md border border-gray-200 px-3 text-xs placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
            />
          </div>
          <button className="flex h-9 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-5 text-xs font-medium text-gray-700 hover:bg-gray-50">
            Search
          </button>

          <div className="w-full sm:w-40">
            <Select defaultValue="name">
              <SelectTrigger className="h-9 w-full bg-white text-gray-700 text-xs">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name" className="text-xs">Sort by Name</SelectItem>
                <SelectItem value="newest" className="text-xs">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Empty State / Farm Grid Area */}
        <div className="rounded-lg border border-gray-200 bg-white p-10 flex flex-col items-center justify-center text-center shadow-xs min-h-[260px]">
          <p className="text-xs font-bold text-gray-500 mb-4">No farms found</p>
          <button
            onClick={() => setIsCreateFarmOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#2B5C2D] px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-black shadow-sm"
          >
            <Plus className="size-3.5" />
            Create Your First Farm
          </button>
        </div>
      </div>

      <CreateFarmModal isOpen={isCreateFarmOpen} onClose={() => setIsCreateFarmOpen(false)} />
    </div>
  )
}
