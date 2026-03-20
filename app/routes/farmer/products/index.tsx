import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { allCropCycles, products, type CropCycle, type Product } from '~/lib/mock-data/farmer'

/* ─── Product Card ─── */
function ProductGridCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow relative">
      {/* Top row: QR + Info */}
      <div className="flex gap-4 p-4 sm:p-5 pb-3">
        <div className="flex-shrink-0 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg border border-gray-200 bg-white p-1 overflow-hidden">
          <QRCodeSVG value={product.batchId} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="mb-1.5">
            <span className="inline-block rounded bg-[#2E5A27] px-2 py-[2px] text-[10px] font-bold text-white tracking-wide">
              {product.batchId}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 leading-tight">{product.name}</h3>
          <p className="text-xs sm:text-[13px] text-gray-600">Farm: <span className="font-semibold text-gray-800">{product.farm}</span></p>
          <p className="text-xs sm:text-[13px] text-gray-500 truncate">{product.location}</p>
        </div>
        <button className="absolute right-3 sm:right-4 top-4 sm:top-5 text-gray-400 hover:text-gray-600 p-1">
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      {/* Full-width button at bottom */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
        <Link to={`/farmer/products/${product.id}`} className="block">
          <Button className="w-full bg-[#2E5A27] hover:bg-[#1e3d1a] text-white border-none py-2.5 h-auto text-[13px] font-semibold rounded-lg shadow-none">
            View Product Story
          </Button>
        </Link>
      </div>
    </div>
  )
}

/* ─── Page ─── */
export default function ProductsIndex() {
  const [activeTab, setActiveTab] = useState('products')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const allProducts = products

  const totalPages = Math.ceil(allProducts.length / rowsPerPage)
  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Products' },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <p className="text-sm text-gray-500">View and manage all products you have created</p>
      </div>

      {/* Tabs Region */}
      <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 border border-gray-200 p-1 rounded-md h-auto w-fit">
          <TabsTrigger
            value="products"
            className="flex-none px-6 sm:px-8 py-2 text-sm font-medium text-gray-500 rounded-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="ongoing"
            className="flex-none px-4 sm:px-8 py-2 text-sm font-medium text-gray-500 rounded-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Ongoing Crop Cycles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="m-0 border-none p-0 outline-none mt-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search products..."
                className="bg-white w-full h-10 text-sm border-gray-200 rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 gap-2 border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50 rounded-lg flex-shrink-0"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>

            <div className="flex items-center gap-3 sm:ml-auto">
              <Select>
                <SelectTrigger className="w-full sm:w-[190px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <SelectValue placeholder="Filter by Farm" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farms</SelectItem>
                  <SelectItem value="iita">IITA FCI4Afric Farm</SelectItem>
                  <SelectItem value="baba">Baba Beji Farms</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <SelectValue placeholder="Filter by Product" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="ginger">Ginger</SelectItem>
                  <SelectItem value="sesame">Sesame</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {paginatedProducts.map(p => (
              <ProductGridCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={allProducts.length}
            itemsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(count) => {
              setRowsPerPage(count)
              setCurrentPage(1)
            }}
            itemLabel="product(s)"
          />
        </TabsContent>

        <TabsContent value="ongoing" className="m-0 border-none p-0 outline-none mt-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by crop, farm, or farmer..."
                className="bg-white w-full h-10 text-sm border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <Button
                variant="outline"
                className="h-10 px-4 gap-2 border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50 rounded-lg flex-shrink-0"
              >
                Search
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[150px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <SelectValue placeholder="Most Recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCropCycles.map(cycle => (
              <CropCycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ─── Crop Cycle Card ─── */
function CropCycleCard({ cycle }: { cycle: CropCycle }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      {/* Top row: status + days to harvest */}
      <div className="flex items-center justify-between">
        <span className={`inline-block rounded px-2.5 py-[3px] text-[11px] font-bold tracking-wide ${cycle.status === 'completed'
          ? 'bg-gray-200 text-gray-700'
          : 'bg-[#2E5A27] text-white'
          }`}>
          {cycle.status}
        </span>
        {cycle.daysToHarvest !== undefined && (
          <span className="text-xs text-gray-500 font-medium">{cycle.daysToHarvest} days to harvest</span>
        )}
      </div>

      {/* Crop name + variety */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {cycle.productName}
          {cycle.variety && <span className="text-sm font-normal text-gray-500 ml-1">({cycle.variety})</span>}
        </h3>
        <p className="text-[13px] text-gray-700 font-medium mt-0.5">{cycle.farmName}</p>
        <p className="text-[12px] text-gray-400">{cycle.farmLocation}</p>
      </div>

      {/* Farmer */}
      <div className="flex items-center gap-2">
        <div
          className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: cycle.farmerColor }}
        >
          {cycle.farmerInitials}
        </div>
        <span className="text-xs text-gray-600 truncate">{cycle.farmer}</span>
      </div>

      {/* Planted + Area */}
      <div className="flex items-center justify-between text-[12px] text-gray-500">
        <span>Planted: <span className="font-semibold text-gray-700">{cycle.plantedDate || '—'}</span></span>
        <span>Area: <span className="font-semibold text-gray-700">{cycle.area || '—'}</span></span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-1">
        <Link to={`/farmer/crop-cycle/${cycle.id}`} className="block">
          <Button
            variant="outline"
            className="w-full h-9 text-xs font-medium text-gray-700 border-gray-200 bg-white hover:bg-gray-50 rounded-lg gap-1.5"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Activities
          </Button>
        </Link>
        <Link to={`/farmer/record-operation?cycleId=${cycle.id}`} className="block">
          <Button className="w-full h-9 text-xs font-semibold bg-[#2E5A27] hover:bg-[#1e3d1a] text-white border-none rounded-lg shadow-none">
            Record Operation
          </Button>
        </Link>
      </div>
    </div>
  )
}
