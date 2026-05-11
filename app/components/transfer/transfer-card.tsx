import { Home, MapPin, QrCode, User } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { ProductTransfer } from '~/types/transfer'

interface TransferCardProps {
  transfer: ProductTransfer
  onAction?: (transfer: ProductTransfer) => void
}

export function TransferCard({ transfer, onAction }: TransferCardProps) {
  const isReadyForPickup = transfer.status === 'ready_for_pickup'

  return (
    <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand/20 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex size-16 items-center justify-center rounded-md bg-gray-50 text-gray-400 group-hover:bg-brand/5 group-hover:text-brand transition-colors">
          <QrCode className="size-10" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge className="bg-brand text-white px-3 py-1 text-sm font-bold rounded-md border-none shadow-sm">
            {transfer.quantity.toLocaleString()}{transfer.unit}
          </Badge>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-100">
            {transfer.batchId}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{transfer.productName}</h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-gray-600">
            <User className="size-4 shrink-0 text-brand" />
            <span className="text-xs font-semibold">{transfer.farmerName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-600">
            <Home className="size-4 shrink-0 text-brand" />
            <span className="text-xs font-semibold">{transfer.farmName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-400">
            <MapPin className="size-4 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">{transfer.location}</span>
          </div>
        </div>

        <Button
          onClick={() => onAction?.(transfer)}
          className={cn(
            "w-full h-11 uppercase tracking-widest text-[10px] font-black shadow-sm transition-all active:scale-[0.98] rounded-md",
            isReadyForPickup
              ? "bg-brand hover:bg-brand/90 text-white"
              : "bg-brand hover:bg-brand/90 text-white"
          )}
        >
          {isReadyForPickup ? 'Ready for pickup' : 'Initiate Product Transfer'}
        </Button>
      </div>
    </div>
  )
}
