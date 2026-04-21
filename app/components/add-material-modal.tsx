import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
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
import { Textarea } from '~/components/ui/textarea'
import { DatePicker } from '~/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { toast } from 'sonner'
import { Camera, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'

export interface NewMaterialData {
  materialName: string
  lotBatchNumber: string
  quantityPurchased: string
  unit: string
  supplierName: string
  supplierEmail: string
  originCountry: string
  originRegion: string
  supplierAddress: string
  purchaseDate: string
  receivedDate: string
  expiryDate: string
  pricePerUnit: string
  currency: string
  certifications: string
  qualityNotes: string
  materialPhoto: File | null
}

const acceptedPhotoTypes = ['image/png', 'image/jpeg', 'image/webp']
const maxPhotoSizeInBytes = 5 * 1024 * 1024

const externalMaterialSchema = z.object({
  materialName: z.string().trim().min(1, 'Material name is required.'),
  lotBatchNumber: z.string().trim(),
  quantityPurchased: z
    .string()
    .trim()
    .min(1, 'Quantity purchased is required.')
    .refine((value) => Number.parseFloat(value.replace(/,/g, '')) > 0, {
      message: 'Quantity purchased must be greater than 0.',
    }),
  unit: z.string().trim().min(1, 'Unit is required.'),
  supplierName: z.string().trim().min(1, 'Supplier name is required.'),
  supplierEmail: z
    .string()
    .trim()
    .refine((value) => !value || z.email().safeParse(value).success, {
      message: 'Enter a valid supplier email address.',
    }),
  originCountry: z.string().trim().min(1, 'Origin country is required.'),
  originRegion: z.string().trim(),
  supplierAddress: z.string().trim(),
  purchaseDate: z.string().trim().min(1, 'Purchase date is required.'),
  receivedDate: z.string().trim(),
  expiryDate: z.string().trim(),
  pricePerUnit: z
    .string()
    .trim()
    .refine((value) => !value || Number.parseFloat(value.replace(/,/g, '')) >= 0, {
      message: 'Price per unit cannot be negative.',
    }),
  currency: z.string().trim(),
  certifications: z.string().trim(),
  qualityNotes: z.string().trim(),
  materialPhoto: z
    .custom<File | null>(
      (value) =>
        value === null ||
        (typeof File !== 'undefined' && value instanceof File),
      'Invalid file.',
    )
    .refine(
      (value) => !value || acceptedPhotoTypes.includes(value.type),
      'Unsupported file type. Use PNG, JPG, or WEBP.',
    )
    .refine(
      (value) => !value || value.size <= maxPhotoSizeInBytes,
      'File is too large. Maximum size is 5MB.',
    ),
})

type ExternalMaterialFormValues = z.infer<typeof externalMaterialSchema>

const defaultValues: ExternalMaterialFormValues = {
  materialName: '',
  lotBatchNumber: '',
  quantityPurchased: '',
  unit: 'kg',
  supplierName: '',
  supplierEmail: '',
  originCountry: '',
  originRegion: '',
  supplierAddress: '',
  purchaseDate: '',
  receivedDate: '',
  expiryDate: '',
  pricePerUnit: '',
  currency: 'USD',
  certifications: '',
  qualityNotes: '',
  materialPhoto: null,
}

interface AddMaterialModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: NewMaterialData) => void
}

export function AddMaterialModal({ isOpen, onClose, onAdd }: AddMaterialModalProps) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sectionTitleClass = 'text-base font-bold text-gray-900 uppercase tracking-tight'
  const labelClass = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest'
  const inputClass = 'h-11 rounded-lg border border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand'
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ExternalMaterialFormValues>({
    resolver: zodResolver(externalMaterialSchema as any),
    defaultValues,
  })
  const selectedMaterialPhoto = watch('materialPhoto')

  const handleReset = () => {
    setDragOver(false)
    reset(defaultValues)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = (data: ExternalMaterialFormValues) => {
    onAdd(data)
    toast.success('Material added successfully')
    handleReset()
    onClose()
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setValue('materialPhoto', selectedFile, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearErrors('materialPhoto')
    const validation = externalMaterialSchema.shape.materialPhoto.safeParse(selectedFile)
    if (!validation.success) {
      const message = validation.error.issues[0]?.message || 'Invalid file.'
      setError('materialPhoto', { type: 'validate', message })
      toast.error(message)
      setValue('materialPhoto', null, { shouldDirty: true })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files?.[0] || null
    setValue('materialPhoto', droppedFile, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearErrors('materialPhoto')
    const validation = externalMaterialSchema.shape.materialPhoto.safeParse(droppedFile)
    if (!validation.success) {
      const message = validation.error.issues[0]?.message || 'Invalid file.'
      setError('materialPhoto', { type: 'validate', message })
      toast.error(message)
      setValue('materialPhoto', null, { shouldDirty: true })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleReset()
        onClose()
      }
    }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[980px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">Add External Material</DialogTitle>
          <DialogDescription>
            Record materials sourced from external suppliers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-3">
          <fieldset className="space-y-4">
            <legend className={sectionTitleClass}>Material Information</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="materialName" className={labelClass}>Material Name *</Label>
                <Input
                  id="materialName"
                  placeholder="e.g. Organic Wheat Flour"
                  {...register('materialName')}
                  className={inputClass}
                />
                {errors.materialName ? <p className="text-xs text-red-600">{errors.materialName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lotBatchNumber" className={labelClass}>Lot/Batch Number</Label>
                <Input
                  id="lotBatchNumber"
                  placeholder="e.g. LOT-2024-001"
                  {...register('lotBatchNumber')}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityPurchased" className={labelClass}>Quantity Purchased *</Label>
                <Input
                  id="quantityPurchased"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  {...register('quantityPurchased')}
                  className={inputClass}
                />
                {errors.quantityPurchased ? <p className="text-xs text-red-600">{errors.quantityPurchased.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className={labelClass}>Unit *</Label>
                <Select
                  value={watch('unit')}
                  onValueChange={(value) => {
                    setValue('unit', value || '', { shouldDirty: true, shouldValidate: true })
                  }}
                >
                  <SelectTrigger id="unit" className={inputClass}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="unit">unit</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unit ? <p className="text-xs text-red-600">{errors.unit.message}</p> : null}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-5">
            <legend className={sectionTitleClass}>Supplier & Origin Information</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplierName" className={labelClass}>Supplier Name *</Label>
                <Input
                  id="supplierName"
                  autoComplete="organization"
                  placeholder="e.g. ABC Agriculture Ltd"
                  {...register('supplierName')}
                  className={inputClass}
                />
                {errors.supplierName ? <p className="text-xs text-red-600">{errors.supplierName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierEmail" className={labelClass}>Supplier Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="supplier@example.com"
                  {...register('supplierEmail')}
                  className={inputClass}
                />
                {errors.supplierEmail ? <p className="text-xs text-red-600">{errors.supplierEmail.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="originCountry" className={labelClass}>Origin Country *</Label>
                <Input
                  id="originCountry"
                  autoComplete="country-name"
                  placeholder="Select country"
                  {...register('originCountry')}
                  className={inputClass}
                />
                {errors.originCountry ? <p className="text-xs text-red-600">{errors.originCountry.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="originRegion" className={labelClass}>Origin Region</Label>
                <Input
                  id="originRegion"
                  placeholder="e.g. Punjab State"
                  {...register('originRegion')}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="supplierAddress" className={labelClass}>Supplier Address</Label>
                <Textarea
                  id="supplierAddress"
                  autoComplete="street-address"
                  placeholder="Full supplier address..."
                  {...register('supplierAddress')}
                  className="min-h-20 resize-y rounded-lg border border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-5">
            <legend className={sectionTitleClass}>Dates & Quality Information</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate" className={labelClass}>Purchase Date *</Label>
                <DatePicker
                  value={watch('purchaseDate')}
                  onChange={(value) =>
                    setValue('purchaseDate', value || '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Select purchase date"
                  className={inputClass}
                />
                {errors.purchaseDate ? <p className="text-xs text-red-600">{errors.purchaseDate.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedDate" className={labelClass}>Received Date</Label>
                <DatePicker
                  value={watch('receivedDate')}
                  onChange={(value) =>
                    setValue('receivedDate', value || '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Select received date"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className={labelClass}>Expiry Date</Label>
                <DatePicker
                  value={watch('expiryDate')}
                  onChange={(value) =>
                    setValue('expiryDate', value || '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  placeholder="Select expiry date"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className={labelClass}>Price per Unit</Label>
                <Input
                  id="pricePerUnit"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...register('pricePerUnit')}
                  className={inputClass}
                />
                {errors.pricePerUnit ? <p className="text-xs text-red-600">{errors.pricePerUnit.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className={labelClass}>Currency</Label>
                <Select
                  value={watch('currency')}
                  onValueChange={(value) => {
                    setValue('currency', value || '', { shouldDirty: true, shouldValidate: true })
                  }}
                >
                  <SelectTrigger id="currency" className={inputClass}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications" className={labelClass}>Certifications</Label>
              <Input
                id="certifications"
                placeholder="e.g. Organic, Fair Trade, Non-GMO (comma separated)"
                  {...register('certifications')}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualityNotes" className={labelClass}>Quality Notes</Label>
              <Textarea
                id="qualityNotes"
                placeholder="Any quality observations, test results, or special handling requirements..."
                  {...register('qualityNotes')}
                className="min-h-24 resize-y rounded-lg border border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4 border-t pt-5">
            <legend className={sectionTitleClass}>Material Photo</legend>
            <div className="space-y-2">
              <Label htmlFor="materialPhoto" className={labelClass}>Material Receipt or Photo</Label>
              <label
                htmlFor="materialPhoto"
                className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all ${
                  dragOver
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'
                } ${errors.materialPhoto ? 'border-red-300 bg-red-50/40' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="rounded-full bg-white p-3 shadow-sm border border-gray-100 text-brand">
                    <Camera className="size-5" />
                  </div>
                  {selectedMaterialPhoto ? (
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selectedMaterialPhoto.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        {(selectedMaterialPhoto.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-gray-900">Click to select or drag and drop</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                        PNG, JPG or WEBP (Max 5MB)
                      </p>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700">
                    <Upload className="size-3.5" />
                    Choose File
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  id="materialPhoto"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              {errors.materialPhoto ? (
                <p className="text-xs font-medium text-red-600">{errors.materialPhoto.message as string}</p>
              ) : (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Accepted formats: PNG, JPG, WEBP. Max size: 5MB.</p>
              )}
            </div>
          </fieldset>

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
              Add Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
