import { MapPin, Phone } from 'lucide-react'
import { Button } from '~/components/ui/button'
import type { TransferOffer } from '~/types/transfer'

interface TransferOfferCardProps {
  offer: TransferOffer
  onAccept?: (offer: TransferOffer) => void
}

export function TransferOfferCard({ offer, onAccept }: TransferOfferCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md flex flex-col">
      <div className="flex justify-end mb-2">
        <span className="text-xl font-extrabold text-[#1d3d1e]">
          {offer.quantity.toLocaleString()}/{offer.unit}
        </span>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 flex-1">
        <div className="size-20 rounded-full overflow-hidden bg-gray-100 border-2 border-brand/10 shadow-inner">
          {offer.avatar ? (
            <img src={offer.avatar} alt={offer.transporterName} className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-brand bg-brand/5">
              <span className="text-2xl font-bold">{offer.transporterName.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-tight">
            {offer.transporterName}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] font-medium uppercase tracking-wider">
            <MapPin className="size-3" />
            {offer.location}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] font-bold">
            {offer.phone}
          </div>
        </div>

        <Button
          onClick={() => onAccept?.(offer)}
          variant="outline"
          className="w-full h-10 border-gray-200 text-brand font-bold text-xs uppercase tracking-widest hover:bg-brand/5 hover:border-brand/40 transition-all mt-auto"
        >
          Accept Offer
        </Button>
      </div>
    </div>
  )
}
