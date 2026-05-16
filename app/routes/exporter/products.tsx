import { PageHeader } from '~/components/page-header'
import {
   ArrowRight,
   ChevronDown,
   ChevronLeft,
   ExternalLink,
   Filter,
   Search
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const mockProducts = [
   { id: '1', name: 'Cashew', batchId: 'BATCH-1758814569861', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cashew' },
   { id: '2', name: 'Maize', batchId: 'BATCH-1758814569861', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Maize' },
   { id: '3', name: 'Cashew', batchId: 'BATCH-1758814569861', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cashew2' },
   { id: '4', name: 'Maize', batchId: 'BATCH-1758814569861', farm: 'Deborah Ogunyemi Farm', location: 'Zone 16, Kute, Iwo Road', image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Maize2' },
]

export default function ExporterProducts() {
   return (
      <div className="space-y-6 pb-12">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Products' },
        ]}
      />

         <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <ChevronLeft className="size-3" /> Product
         </div>

         <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Products Dashboard</h1>
            <p className="text-sm text-gray-500 font-medium">Manage and track all your products throughout their journey</p>
         </div>

         <div className="flex flex-wrap items-center gap-3 py-2">
            <div className="relative flex-1 min-w-[300px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
               <input
                  placeholder="Search Farm..."
                  className="w-full h-11 pl-10 pr-4 rounded-md border border-gray-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 h-7 px-3 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-gray-100">
                  <Search className="size-3" /> Search
               </button>
            </div>

            <Button variant="outline" className="h-11 px-4 border-gray-100 bg-white text-gray-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
               <Filter className="size-4" /> Sort by Location <ChevronDown className="size-3" />
            </Button>
            <Button variant="outline" className="h-11 px-4 border-gray-100 bg-white text-gray-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
               <Filter className="size-4" /> Sort by Product <ChevronDown className="size-3" />
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {mockProducts.map((product) => (
               <ProductCard key={product.id} {...product} />
            ))}
         </div>

         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">0 of 100 row(s) selected.</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rows per page</span>
                  <div className="relative">
                     <select className="h-9 px-3 pr-8 rounded border border-gray-100 bg-white text-[11px] font-bold text-gray-700 appearance-none outline-none focus:ring-1 focus:ring-brand">
                        <option>10</option>
                        <option>25</option>
                     </select>
                     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Page 1 of 4</span>
                  <div className="flex items-center gap-1">
                     <PaginationButton icon={<ChevronLeft className="size-4" rotate={180} />} disabled />
                     <PaginationButton icon={<ChevronLeft className="size-4" />} disabled />
                     <PaginationButton icon={<ArrowRight className="size-4" />} />
                     <PaginationButton icon={<ArrowRight className="size-4" />} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

function ProductCard({ name, batchId, farm, location, image }: any) {
   return (
      <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group flex flex-col gap-6">
         <div className="flex items-start justify-between">
            <div className="size-20 rounded-xl bg-gray-50 flex items-center justify-center p-3">
               <img src={image} className="size-full opacity-80" />
            </div>
            <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-md text-[10px] font-bold uppercase tracking-widest">{batchId}</span>
         </div>

         <div className="space-y-3">
            <div className="space-y-1">
               <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">{name}</h3>
               <button className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-brand transition-colors group/btn">
                  {farm} <ExternalLink className="size-3 opacity-50 group-hover/btn:opacity-100" />
               </button>
               <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-1.5">
                  {location}
               </p>
            </div>
         </div>

         <Link to="/exporter/batch-details" className="w-full">
            <Button className="w-full h-11 bg-[#1a4332] hover:bg-black text-white font-bold text-[12px] uppercase tracking-widest shadow-sm transition-all group-hover:scale-[1.01]">
               View Product Story
            </Button>
         </Link>
      </div>
   )
}

function PaginationButton({ icon, disabled }: any) {
   return (
      <button className={cn(
         "size-8 rounded border border-gray-100 flex items-center justify-center transition-all",
         disabled ? "bg-gray-50 text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 hover:bg-brand/5 hover:text-brand hover:border-brand/20"
      )}>
         {icon}
      </button>
   )
}
