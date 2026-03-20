import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { cooperativeFarmers } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/farmers'
import { Search, Plus, Trash2, Eye } from 'lucide-react'
import { AddFarmersModal } from '~/components/add-farmers-modal'
import { CreateFarmModal } from '~/components/create-farm-modal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Link } from 'react-router'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farmer Traceability | Agrolinking' },
    { name: 'description', content: 'Manage cooperative farmers' },
  ]
}

export default function CooperativeFarmers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteFarmerId, setDeleteFarmerId] = useState<string | null>(null)
  const [createFarmForFarmer, setCreateFarmForFarmer] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Farmers' },
        ]}
      />
      <div>
        <h1 className="text-xl font-bold text-[#2B5C2D] uppercase tracking-wide">FARMER TRACEABILITY</h1>
        <p className="text-sm text-gray-500 mt-1">Here are all the farmers registered in your cooperative group.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Farmer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-64 rounded-md border border-gray-200 px-3 text-sm placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Search className="size-4" />
            Search
          </button>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex h-9 items-center justify-center gap-2 rounded-md bg-[#1d3d1e] px-4 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          <Plus className="size-4" />
          Add Farmers
        </button>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {cooperativeFarmers.map((farmer) => (
          <div key={farmer.id} className="relative rounded-md border border-gray-200 bg-white p-6 flex flex-col items-center text-center">
            <button 
              onClick={() => setDeleteFarmerId(farmer.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
            
            <div className="mb-4">
              <img 
                src={farmer.avatar} 
                alt={farmer.name} 
                className="size-20 rounded-full object-cover bg-gray-100" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random`
                }}
              />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{farmer.name}</h3>
            {farmer.identifier && <p className="text-xs text-gray-500">{farmer.identifier}</p>}
            {farmer.phone && <p className="text-xs text-gray-500 mt-0.5">{farmer.phone}</p>}
            
            <div className="w-full flex flex-col gap-2 mt-6">
              <button 
                onClick={() => setCreateFarmForFarmer(farmer.id)}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-green-800 hover:bg-gray-50 transition-colors"
              >
                <Plus className="size-4 text-green-700" />
                Add New Farm
              </button>
              <Link 
                to={`/cooperative/farmers/${farmer.id}`}
                className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-green-800 hover:bg-gray-50 transition-colors"
              >
                <Eye className="size-4 text-green-700" />
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span>Showing 1 to {cooperativeFarmers.length} of {cooperativeFarmers.length} farmers</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select className="rounded-md border border-gray-200 py-1 pl-2 pr-6 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 text-gray-700">
              <option>8</option>
            </select>
          </div>
          <span>Page 1 of 1</span>
          <div className="flex gap-1">
            <button disabled className="rounded p-1 text-gray-300">«</button>
            <button disabled className="rounded p-1 text-gray-300">‹</button>
            <button disabled className="rounded p-1 text-gray-300">›</button>
            <button disabled className="rounded p-1 text-gray-300">»</button>
          </div>
        </div>
      </div>

      <AddFarmersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CreateFarmModal isOpen={createFarmForFarmer !== null} onClose={() => setCreateFarmForFarmer(null)} />

      <AlertDialog open={deleteFarmerId !== null} onOpenChange={(open) => { if (!open) setDeleteFarmerId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Farmer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this farmer from the cooperative? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => setDeleteFarmerId(null)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
