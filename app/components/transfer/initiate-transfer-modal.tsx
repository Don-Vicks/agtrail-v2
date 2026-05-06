import { useState } from 'react'
import { X, Calendar as CalendarIcon, Info } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { DatePicker } from '~/components/ui/date-picker'
import type { ProductTransfer } from '~/types/transfer'

interface InitiateTransferModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductTransfer | null
}

export function InitiateTransferModal({ isOpen, onClose, product }: InitiateTransferModalProps) {
  const [scheduledDate, setScheduledDate] = useState('')
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-xl">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-2xl font-extrabold text-[#1d3d1e] tracking-tight">
              Initiate Pickup Request
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500 font-medium leading-relaxed">
            Fill in the details to handover goods to the transporter and secure the batch on the blockchain.
          </DialogDescription>
          
          <div className="mt-4 p-3 bg-[#f0f9f0] rounded-lg border border-[#e0f0e0]">
            <span className="text-sm font-bold text-brand uppercase tracking-tight">
              #{product.batchId} {product.productName} ({product.quantity}{product.unit})
            </span>
          </div>
        </DialogHeader>

        <div className="p-8 pt-4 space-y-8">
          {/* Top Section: Quantity and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Quantity to Transfer*</Label>
              <Input placeholder="Enter Quantity Purchased" className="h-11 rounded-lg" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Available: {product.quantity}{product.unit}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Unit *</Label>
              <Select defaultValue={product.unit}>
                <SelectTrigger className="h-11 w-full rounded-lg">
                  <SelectValue placeholder="Select a Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="Tons">Tons</SelectItem>
                  <SelectItem value="Bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Destination & Buyer Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
              Destination & Buyer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Buyer *</Label>
                <Select>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder="Select Buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer1">John Doe Processing</SelectItem>
                    <SelectItem value="buyer2">Agro Export Ltd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Buyer Email</Label>
                <Input placeholder="Enter Supplier Email" className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Country *</Label>
                <Input placeholder="Enter Country" className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Region/State</Label>
                <Input placeholder="Enter Country Region" className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Contact Phone Number 1</Label>
                <Input placeholder="Enter Country Region" className="h-11 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Contact Phone Number 2</Label>
                <Input placeholder="Enter Country Region" className="h-11 rounded-lg" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Address</Label>
              <Input placeholder="Enter Country Region" className="h-11 rounded-lg" />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-[#fff9e6] rounded-xl border border-[#feeeb7] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-5 rounded-full bg-[#f59e0b] flex items-center justify-center text-white">
                <span className="text-[10px] font-bold">₦</span>
              </div>
              <h3 className="text-sm font-bold text-[#92400e] uppercase tracking-tight">Set Your Price</h3>
            </div>
            <p className="text-xs text-[#92400e] font-medium opacity-80">
              The processor will need to pay this amount to receive the products.
            </p>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-[#92400e]">Price (NGN) *</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                <Input placeholder="0.00" className="h-12 pl-8 rounded-lg bg-white border-[#feeeb7] focus:border-[#f59e0b] focus:ring-[#f59e0b]" />
              </div>
              <p className="text-[10px] text-[#92400e] font-bold uppercase tracking-tight opacity-70">Payment will be made to your bank wallet</p>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="space-y-6 pb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Pickup Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Scheduled Date *</Label>
                <DatePicker 
                  value={scheduledDate} 
                  onChange={setScheduledDate} 
                  className="h-11 w-full rounded-lg" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Price per Unit</Label>
                <Input placeholder="Enter Price" className="h-11 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button className="flex-1 h-12 bg-[#1d3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-xs rounded-lg shadow-sm">
              Dispatch Request
            </Button>
            <Button variant="outline" className="flex-1 h-12 border-brand text-brand font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-brand/5">
              Save as Draft
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
