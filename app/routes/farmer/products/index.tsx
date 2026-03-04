import { useState } from 'react'
import { Link } from 'react-router'
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
import { products, type Product } from '~/lib/mock-data/farmer'

/* Deterministic QR-like SVG seeded from a string */
function QRCode({ seed }: { seed: string }) {
  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const S = 9
  const cells: boolean[][] = []
  for (let r = 0; r < S; r++) {
    const row: boolean[] = []
    for (let c = 0; c < S; c++) {
      const tl = r < 3 && c < 3
      const tr = r < 3 && c >= S - 3
      const bl = r >= S - 3 && c < 3
      const ctr = r === 4 && c === 4
      row.push(tl || tr || bl || ctr || ((hash * (r + 2) * (c + 3) + r * 7 + c * 13) % 5 < 2))
    }
    cells.push(row)
  }
  return (
    <svg viewBox={`0 0 ${S + 2} ${S + 2}`} className="w-full h-full" shapeRendering="crispEdges">
      <rect width={S + 2} height={S + 2} fill="white" />
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={1} height={1} fill="#1a1a1a" /> : null
        )
      )}
    </svg>
  )
}

function ProductGridCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex gap-5 mt-4 hover:border-brand/20 transition-all relative group">
      <div className="flex-shrink-0 w-[100px] h-[100px] rounded-lg border border-gray-200 bg-white p-1.5 overflow-hidden">
        <QRCode seed={product.batchId} />
      </div>
      <div className="flex-1 min-w-0 pr-8">
        <div className="mb-2.5">
          <span className="inline-flex items-center rounded-md bg-[#FFF5EE] px-2 py-0.5 text-[10px] font-bold text-[#E67E22] tracking-wide">
            {product.batchId}
          </span>
        </div>

        <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1">
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1.5 leading-tight">{product.name}</h3>
        <p className="text-[11px] text-gray-500 mb-0.5">Farm: <span className="font-semibold text-gray-600">{product.farm}</span></p>
        <p className="text-[11px] font-medium text-gray-500 mb-4 truncate">{product.location}</p>
        <Link to={`/farmer/products/${product.id}`} className="block w-full">
          <Button variant="outline" className="w-full bg-[#2E5A27] hover:bg-[#20401b] text-white border-none py-2.5 h-auto text-xs font-bold rounded-lg transition-colors">
            View Product Story
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function ProductsIndex() {
  const [activeTab, setActiveTab] = useState('products')
  const completedProducts = products

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[26px] font-bold italic text-[#2E5A27] tracking-tight mb-1">My Products</h1>
          <p className="text-[13px] font-medium text-gray-500">View and manage all products you have created</p>
        </div>

        {/* Tabs Region */}
        <Tabs defaultValue="products" className="mb-6 w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border border-gray-200 p-0 rounded-lg h-auto inline-flex w-auto mb-6">
            <TabsTrigger
              value="products"
              className="px-6 py-2.5 text-sm font-medium text-gray-500 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="ongoing"
              className="px-6 py-2.5 text-sm font-medium text-gray-500 rounded-lg data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
            >
              Ongoing Crop Cycles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="m-0 border-none p-0 outline-none">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <Input type="text" placeholder="Search products..." className="bg-white max-w-[220px] h-10 text-sm" />
              <Button variant="outline" className="h-10 px-4 gap-2 border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Button>

              <Select>
                <SelectTrigger className="w-[180px] h-10 bg-white text-sm text-gray-600 border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <SelectTrigger className="w-[190px] h-10 bg-white text-sm text-gray-600 border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProducts.map(p => (
                <ProductGridCard key={p.id} product={p} />
              ))}
            </div>

            {/* Footer Pagination */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-700 font-medium">
                {completedProducts.length} product(s) found
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Rows per page</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[70px] h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-sm font-medium text-gray-700">Page 1 of 1</span>

                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg></button>
                  <button className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg></button>
                  <button className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg></button>
                  <button className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg></button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ongoing" className="m-0 border-none p-0 outline-none">
            <div className="flex items-center justify-center p-12 bg-white rounded-[10px] border border-gray-100 text-gray-500 font-medium h-64 shadow-sm">
              Loading active crop cycles...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
