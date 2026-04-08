import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { FarmProduct } from '~/lib/api/generated/models'

interface ProductGridCardProps {
  product: FarmProduct
  farmName: string
  basePath?: string
}

export function ProductGridCard({ product, farmName, basePath = '/farmer/products' }: ProductGridCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow relative">
      {/* Top row: QR + Info */}
      <div className="flex gap-4 p-4 sm:p-5 pb-3">
        <div className="flex-shrink-0 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-lg border border-gray-200 bg-white p-1 overflow-hidden">
          <QRCodeSVG value={product.batchNumber || product.id} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="mb-1.5">
            <span className="inline-block rounded bg-[#2E5A27] px-2 py-[2px] text-[10px] font-bold text-white tracking-wide">
              {product.batchNumber}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 leading-tight">{product.productName}</h3>
          <p className="text-xs sm:text-[13px] text-gray-600">Farm: <span className="font-semibold text-gray-800">{farmName}</span></p>
          <p className="text-xs sm:text-[13px] text-gray-500 truncate">
            {product.variety && <span className="mr-2">Variety: {product.variety}</span>}
            {product.category}
          </p>
        </div>
        <button className="absolute right-3 sm:right-4 top-4 sm:top-5 text-gray-400 hover:text-gray-600 p-1">
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Status + quantity row */}
      <div className="px-4 sm:px-5 flex items-center justify-between">
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
          product.status === 'available'
            ? 'border-green-200 bg-green-50 text-green-700'
            : product.status === 'sold'
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : product.status === 'reserved'
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}>
          {product.status || 'Active'}
        </span>
        <span className="text-xs text-gray-500">
          {product.quantityAvailable} / {product.quantityHarvested} {product.unit || 'kg'}
        </span>
      </div>

      {/* Full-width button at bottom */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3">
        <Link to={`${basePath}/${product.id}`} className="block">
          <Button className="w-full bg-[#2E5A27] hover:bg-[#1e3d1a] text-white border-none py-2.5 h-auto text-[13px] font-semibold rounded-lg shadow-none">
            View Product Story
          </Button>
        </Link>
      </div>
    </div>
  )
}
