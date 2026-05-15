import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { usePostFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarmsIdOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Textarea } from '~/components/ui/textarea'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    farmId: '',
    cropCycleId: '',
    harvestOperationId: '',
    productName: '',
    category: '',
    quantityHarvested: '',
    unit: 'kg',
    harvestDate: '',
    qualityGrade: '',
    variety: '',
    suggestedPricePerUnit: '',
    priceCurrency: 'NGN'
  })

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setFormData({
      farmId: '',
      cropCycleId: '',
      harvestOperationId: '',
      productName: '',
      category: '',
      quantityHarvested: '',
      unit: 'kg',
      harvestDate: '',
      qualityGrade: '',
      variety: '',
      suggestedPricePerUnit: '',
      priceCurrency: 'NGN'
    })
    onClose()
  }

  // Fetch farms so the user can select which farm this product belongs to
  const { data: farmsResp, isLoading: isLoadingFarms } = useGetFarms({
    query: {
      enabled: isOpen,
    }
  })
  const farms = farmsResp?.data?.data || []

  // Fetch crop cycles for selected farm
  const { data: cropCyclesResp, isLoading: isLoadingCropCycles } = useGetFarmsIdCropCycles(formData.farmId, {
    query: {
      enabled: isOpen && !!formData.farmId,
    }
  })
  const cropCycles = cropCyclesResp?.data?.data || []

  // Fetch operations for selected farm
  const { data: operationsResp, isLoading: isLoadingOperations } = useGetFarmsIdOperations(formData.farmId, {
    query: {
      enabled: isOpen && !!formData.farmId,
    }
  })
  const harvestOperations = (operationsResp?.data?.data || []).filter((op: any) => op.operationType === 'harvesting')

  const queryClient = useQueryClient()
  const { mutate: createProduct, isPending } = usePostFarmersProducts({
    request: {
      headers: { 'X-Offline-Label': 'Create farmer product' }
    },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/farmers/products`] })
        toast.success('Product created successfully')
        handleClose()
      },
      onError: (err: any) => {
        console.error('Failed to create product:', err)
        toast.error(err.response?.data?.message || 'Failed to create product')
      }
    }
  })

  const submitProduct = () => {
    const productName = formData.productName.trim()
    const category = formData.category.trim()
    const qty = Number(formData.quantityHarvested)
    if (
      !formData.farmId ||
      !formData.cropCycleId ||
      !formData.harvestOperationId ||
      !productName ||
      !category ||
      !formData.quantityHarvested ||
      !formData.harvestDate
    ) {
      toast.error('Please fill in all required fields.')
      return
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      toast.error('Quantity harvested must be a positive number.')
      return
    }

    createProduct({
      data: {
        farmId: formData.farmId,
        cropCycleId: formData.cropCycleId,
        // The endpoint technically requires harvestOperationId according to your error
        // Because of code generation limits, we will append it dynamically or simply pass it along
        harvestOperationId: formData.harvestOperationId,
        productName,
        category,
        quantityHarvested: qty,
        unit: formData.unit || undefined,
        harvestDate: new Date(formData.harvestDate).toISOString(),
        qualityGrade: formData.qualityGrade || undefined,
        variety: formData.variety || undefined,
        suggestedPricePerUnit: formData.suggestedPricePerUnit ? Number(formData.suggestedPricePerUnit) : undefined,
        priceCurrency: formData.priceCurrency || undefined,
      } as any
    })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden outline-none duration-200 sm:max-w-xl"
        showCloseButton={false}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between p-6 pb-4">
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold text-brand">
                Add New Product
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Log harvested crops and products from your farms
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          {/* Form */}
          <div className="space-y-4 px-6 pb-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">
                Farm Origin <span className="text-red-500">*</span>
              </label>
              <Select value={formData.farmId} onValueChange={(val) => handleFieldChange('farmId', val)}>
                <SelectTrigger className="w-full py-5 text-gray-700 font-medium bg-gray-50/50">
                  <SelectValue placeholder={isLoadingFarms ? "Loading farms..." : "Select the originating farm"} />
                </SelectTrigger>
                <SelectContent>
                  {farms.length === 0 && !isLoadingFarms && (
                    <SelectItem value="none" disabled>No farms available</SelectItem>
                  )}
                  {farms.map((farm: any) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Crop Cycle <span className="text-red-500">*</span>
                </label>
                <Select value={formData.cropCycleId} onValueChange={(val) => handleFieldChange('cropCycleId', val)} disabled={!formData.farmId}>
                  <SelectTrigger className="w-full py-5 text-gray-700 font-medium bg-gray-50/50">
                    <SelectValue placeholder={isLoadingCropCycles ? "Loading..." : "Select Crop Cycle"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!formData.farmId ? (
                      <SelectItem value="none" disabled>Select farm first</SelectItem>
                    ) : cropCycles.length === 0 && !isLoadingCropCycles ? (
                      <SelectItem value="none" disabled>No crop cycles found</SelectItem>
                    ) : (
                      cropCycles.map((cycle: any) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.cropType} ({new Date(cycle.startDate).toLocaleDateString()})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Harvest Operation <span className="text-red-500">*</span>
                </label>
                <Select value={formData.harvestOperationId} onValueChange={(val) => handleFieldChange('harvestOperationId', val)} disabled={!formData.farmId}>
                  <SelectTrigger className="w-full py-5 text-gray-700 font-medium bg-gray-50/50">
                    <SelectValue placeholder={isLoadingOperations ? "Loading..." : "Select Logged Harvest"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!formData.farmId ? (
                      <SelectItem value="none" disabled>Select farm first</SelectItem>
                    ) : harvestOperations.length === 0 && !isLoadingOperations ? (
                      <SelectItem value="none" disabled>No harvest logs found</SelectItem>
                    ) : (
                      harvestOperations.map((op: any) => (
                        <SelectItem key={op.id} value={op.id}>
                          {new Date(op.operationDate).toLocaleDateString()}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Maize"
                  value={formData.productName}
                  onChange={(e) => handleFieldChange('productName', e.target.value)}
                  className="py-5"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={formData.category} onValueChange={(val) => handleFieldChange('category', val)}>
                  <SelectTrigger className="w-full py-5 text-gray-700 font-medium">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cereal">Cereal</SelectItem>
                    <SelectItem value="Tuber">Tuber</SelectItem>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Legume">Legume</SelectItem>
                    <SelectItem value="Spice">Spice</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Variety <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <Input
                  placeholder="e.g., Yellow Maize"
                  value={formData.variety}
                  onChange={(e) => handleFieldChange('variety', e.target.value)}
                  className="py-5"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Harvest Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleFieldChange('harvestDate', e.target.value)}
                  className="py-5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">
                    Quantity Harvested <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={formData.quantityHarvested}
                    onChange={(e) => handleFieldChange('quantityHarvested', e.target.value)}
                    className="py-5"
                  />
               </div>
               <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Unit</label>
                <Select value={formData.unit} onValueChange={(val) => handleFieldChange('unit', val)}>
                  <SelectTrigger className="w-full py-5 text-gray-700 font-medium">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tonnes">Tonnes</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="baskets">Baskets</SelectItem>
                  </SelectContent>
                </Select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Target Price <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.suggestedPricePerUnit}
                  onChange={(e) => handleFieldChange('suggestedPricePerUnit', e.target.value)}
                  className="py-5"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Quality Grade</label>
                <Select value={formData.qualityGrade} onValueChange={(val) => handleFieldChange('qualityGrade', val)}>
                  <SelectTrigger className="w-full py-5 text-gray-700 font-medium">
                    <SelectValue placeholder="Grade (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="A">Grade A (Premium)</SelectItem>
                    <SelectItem value="B">Grade B (Standard)</SelectItem>
                    <SelectItem value="C">Grade C (Processing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              Cancel
            </Button>

            <Button
              onClick={submitProduct}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-brand text-white hover:bg-black px-6 shadow-sm disabled:opacity-50"
            >
              {isPending ? 'Logging Product...' : 'Add Product'}
              {!isPending && (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
