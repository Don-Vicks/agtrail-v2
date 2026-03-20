import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export interface NewMaterialData {
  material: string
  type: string
  materialSource: string
  quantity: string
  harvested: string
  received: string
}

interface AddMaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: NewMaterialData) => void
}

export function AddMaterialModal({ isOpen, onClose, onAdd }: AddMaterialModalProps) {
  const [material, setMaterial] = useState('')
  const [type, setType] = useState('Agricultural Product')
  const [materialSource, setMaterialSource] = useState('')
  const [quantity, setQuantity] = useState('')
  const [harvested, setHarvested] = useState('')
  const [received, setReceived] = useState('')

  const handleReset = () => {
    setMaterial('')
    setType('Agricultural Product')
    setMaterialSource('')
    setQuantity('')
    setHarvested('')
    setReceived('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      material,
      type,
      materialSource,
      quantity,
      harvested,
      received,
    })
    handleReset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleReset()
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add External Material</DialogTitle>
          <DialogDescription>
            Register a new raw material received from an external vendor or farm.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="material">Material Name</Label>
            <Input
              id="material"
              required
              placeholder="e.g. Soybeans"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Material Type</Label>
            <Select value={type} onValueChange={(val) => val && setType(val)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agricultural Product">Agricultural Product</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
                <SelectItem value="Additive">Additive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialSource">Vendor / Source Farm Name</Label>
            <Input
              id="materialSource"
              required
              placeholder="e.g. Sunrise Agro"
              value={materialSource}
              onChange={(e) => setMaterialSource(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (with unit)</Label>
            <Input
              id="quantity"
              required
              placeholder="e.g. 500kg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="harvested">Date Harvested</Label>
              <Input
                id="harvested"
                type="date"
                required
                value={harvested}
                onChange={(e) => setHarvested(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="received">Date Received</Label>
              <Input
                id="received"
                type="date"
                required
                value={received}
                onChange={(e) => setReceived(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset()
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1b4332] hover:bg-brand-dark text-white">
              Save Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
