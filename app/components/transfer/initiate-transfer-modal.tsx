import { useState, useMemo, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox'
import { usePostTransfers } from '~/lib/api/generated/transfers/transfers'
import { useGetUsersByRole } from '~/lib/api/generated/users/users'
import { sortedNigeriaStates } from '~/lib/nigeria-geo-options'
import type { ProductTransfer } from '~/types/transfer'
import { toast } from 'sonner'
import { Loader2, User, Mail, MapPin, BadgeDollarSign, Truck, AlertCircle } from 'lucide-react'
import { cn } from '~/lib/utils'

interface InitiateTransferModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductTransfer | null
}

const RECIPIENT_ROLES = [
  { label: 'Processor', value: 'processor' },
  { label: 'Distributor', value: 'distributor' },
  { label: 'Retailer', value: 'retailer' },
  { label: 'Aggregator', value: 'aggregator' },
] as const;

const UNITS = ['KG', 'Tons', 'Bags', 'Crates', 'Litres', 'Units'] as const;

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const createTransferSchema = (maxQuantity: number) => z.object({
  recipientRole: z.string().min(1, 'Target role is required'),
  recipientId: z.string().min(1, 'Recipient user is required'),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Quantity must be greater than 0')
    .refine((val) => Number(val) <= maxQuantity, `Quantity cannot exceed available stock (${maxQuantity})`),
  unit: z.string().min(1, 'Unit is required'),
  pricePerUnit: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), 'Price must be 0 or greater'),
  destinationCountry: z.string().min(1, 'Country is required'),
  destinationRegion: z.string().min(1, 'Region/State is required'),
  destinationPhone1: z.string().min(1, 'Contact phone is required').regex(phoneRegex, 'Invalid phone number format'),
  destinationPhone2: z.string().optional().refine((val) => !val || phoneRegex.test(val), 'Invalid phone number format'),
  destinationAddress: z.string().min(1, 'Delivery address is required'),
  scheduledDate: z.date().optional(),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<ReturnType<typeof createTransferSchema>>;

export function InitiateTransferModal({ isOpen, onClose, product }: InitiateTransferModalProps) {
  const [recipientSearchQuery, setRecipientSearchQuery] = useState('')
  const [lastSelectedUser, setLastSelectedUser] = useState<{ id: string, name: string, email: string, state: string | null, lga: string | null } | null>(null)
  const [stateSearchQuery, setStateSearchQuery] = useState('')

  const nigerianStates = useMemo(() => sortedNigeriaStates(), []);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(createTransferSchema(product?.quantity || 0)),
    defaultValues: {
      recipientRole: 'processor',
      recipientId: '',
      quantity: '',
      unit: product?.unit || 'KG',
      destinationCountry: 'Nigeria',
      destinationRegion: '',
      destinationPhone1: '',
      destinationPhone2: '',
      destinationAddress: '',
      notes: '',
    },
  });

  const { watch, setValue, control, handleSubmit, formState: { errors } } = form;
  
  const recipientRole = watch('recipientRole');
  const recipientId = watch('recipientId');
  const destinationCountry = watch('destinationCountry');
  const destinationRegion = watch('destinationRegion');
  const quantity = watch('quantity');
  const pricePerUnit = watch('pricePerUnit');
  const unit = watch('unit');

  // Server-side search logic
  const isUserSelected = lastSelectedUser && recipientSearchQuery === lastSelectedUser.name;
  const apiSearchName = (!isUserSelected && recipientSearchQuery.length >= 2) ? recipientSearchQuery : undefined;

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersByRole(
    { 
      role: recipientRole as any,
      name: apiSearchName
    },
    { query: { enabled: isOpen && !!recipientRole } }
  )

  const users = usersData?.data?.data || []

  const filteredStates = useMemo(() => {
    if (!stateSearchQuery) return nigerianStates;
    return nigerianStates.filter(state => 
      state.name.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );
  }, [nigerianStates, stateSearchQuery]);

  const { mutateAsync: initiateTransfer, isPending } = usePostTransfers()

  const onSubmit = async (values: TransferFormValues) => {
    if (!product) return;

    try {
      const qtyNum = Number(values.quantity);
      const priceNum = Number(values.pricePerUnit) || 0;
      
      const combinedDeliveryLocation = [
        values.destinationAddress,
        values.destinationRegion,
        values.destinationCountry
      ].filter(Boolean).join(', ');

      const phoneInfo = [
        values.destinationPhone1 ? `Primary: ${values.destinationPhone1}` : '',
        values.destinationPhone2 ? `Secondary: ${values.destinationPhone2}` : ''
      ].filter(Boolean).join(' | ');

      const finalNotes = [
        values.notes,
        phoneInfo ? `Contact Info - ${phoneInfo}` : ''
      ].filter(Boolean).join('\n\n');

      const payload: any = {
        productType: product.productType || 'farm_product',
        toUserId: values.recipientId,
        quantityTransferred: qtyNum,
        unit: values.unit,
        currency: 'NGN',
        pricePerUnit: priceNum || undefined,
        totalPrice: priceNum ? qtyNum * priceNum : undefined,
        deliveryLocation: combinedDeliveryLocation,
        expectedDeliveryDate: values.scheduledDate?.toISOString(),
        notes: finalNotes || undefined,
      };

      if (payload.productType === 'batch_product' || product.productType === 'processed_batch_product') {
        payload.batchProductId = product.id;
        payload.productType = 'batch_product';
      } else {
        payload.farmProductId = product.id;
        payload.productType = 'farm_product';
      }

      await initiateTransfer({
        data: payload
      })
      toast.success('Transfer initiated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to initiate transfer:', error)
      toast.error('Failed to initiate transfer. Please check all fields.')
    }
  }

  // Reset recipient when role changes
  useEffect(() => {
    setValue('recipientId', '');
    setRecipientSearchQuery('');
    setLastSelectedUser(null);
  }, [recipientRole, setValue]);

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-md">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-extrabold text-[#1d3d1e] tracking-tight">
            Initiate Product Transfer
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 font-medium leading-relaxed">
            Specify the recipient and logistics details to secure your product movement on the blockchain.
          </DialogDescription>

          <div className="mt-4 p-3 bg-brand/5 rounded-md border border-brand/10">
            <span className="text-sm font-black text-brand uppercase tracking-tight">
              #{product.batchId} {product.productName} ({product.quantity}{product.unit} Available)
            </span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-4 space-y-8">
          {/* Recipient Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <User className="size-4 text-brand" /> Recipient Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Target Role*</Label>
                <Controller
                  name="recipientRole"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={cn("h-11 w-full rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.recipientRole && "border-red-500")}>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECIPIENT_ROLES.map(role => (
                          <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recipientRole && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.recipientRole.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Recipient User*</Label>
                <Combobox
                  value={recipientId}
                  onValueChange={(val) => {
                    const id = val as string;
                    if (!id) return;
                    setValue('recipientId', id, { shouldValidate: true });
                    const user = users.find(u => u.id === id);
                    if (user) {
                      setLastSelectedUser(user);
                      setRecipientSearchQuery(user.name);
                    }
                  }}
                  onInputValueChange={(val) => {
                    const matchedUser = users.find((u) => u.id === val);
                    if (matchedUser) {
                      setRecipientSearchQuery(matchedUser.name);
                    } else {
                      setRecipientSearchQuery(val);
                    }
                  }}
                  inputValue={recipientSearchQuery}
                >
                  <ComboboxInput
                    placeholder={isLoadingUsers ? "Searching..." : "Type to search name..."}
                    className={cn("h-11 w-full rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.recipientId && "border-red-500")}
                    disabled={isLoadingUsers}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>{recipientSearchQuery.length < 2 ? "Type at least 2 characters" : "No users found."}</ComboboxEmpty>
                    <ComboboxList>
                      {users.map((user) => (
                        <ComboboxItem key={user.id} value={user.id}>
                          {user.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {errors.recipientId && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.recipientId.message}</p>}
              </div>
            </div>

            {lastSelectedUser && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md bg-gray-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Mail className="size-3.5 text-brand" />
                  {lastSelectedUser.email}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <MapPin className="size-3.5 text-brand" />
                  {lastSelectedUser.state || 'N/A'} {lastSelectedUser.lga ? `| ${lastSelectedUser.lga}` : ''}
                </div>
              </div>
            )}
          </div>

          {/* Transfer Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <BadgeDollarSign className="size-4 text-brand" /> Quantity & Pricing
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Quantity to Transfer*</Label>
                    <button 
                      type="button"
                      onClick={() => setValue('quantity', product.quantity.toString(), { shouldValidate: true })}
                      className="text-[10px] font-bold text-brand hover:text-brand-dark transition-colors uppercase tracking-tight"
                    >
                      Use Max ({product.quantity}{unit})
                    </button>
                  </div>
                  <Input
                    type="number"
                    {...form.register('quantity')}
                    placeholder="0.00"
                    className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.quantity && "border-red-500")}
                  />
                  {errors.quantity && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.quantity.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Unit*</Label>
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={cn("h-11 w-full rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.unit && "border-red-500")}>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.unit && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.unit.message}</p>}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-amber-50 rounded-md border border-amber-100 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-full bg-amber-500 flex items-center justify-center text-white">
                    <span className="text-[10px] font-black">₦</span>
                  </div>
                  <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Set Your Price</h3>
                </div>
                <p className="text-xs text-amber-800 font-medium opacity-80">
                  The recipient will need to pay this amount to receive the products.
                </p>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-amber-900">Price per Unit (NGN)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₦</span>
                    <Input
                      type="number"
                      {...form.register('pricePerUnit')}
                      placeholder="0.00"
                      className={cn("h-12 pl-8 rounded-md bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500 text-sm font-black text-amber-900", errors.pricePerUnit && "border-red-500")}
                    />
                  </div>
                  {errors.pricePerUnit && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.pricePerUnit.message}</p>}
                  <p className="text-[10px] text-amber-700 font-black uppercase tracking-tight opacity-70">Payment will be settled to your bank wallet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <Truck className="size-4 text-brand" /> Logistics & Delivery
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Destination Country*</Label>
                <Input 
                  {...form.register('destinationCountry')}
                  placeholder="e.g. Nigeria"
                  className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationCountry && "border-red-500")} 
                />
                {errors.destinationCountry && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destinationCountry.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Region/State*</Label>
                {destinationCountry?.toLowerCase() === 'nigeria' ? (
                  <Combobox
                    value={destinationRegion}
                    onValueChange={(val) => {
                      const stateName = val as string;
                      setValue('destinationRegion', stateName, { shouldValidate: true });
                      setStateSearchQuery(stateName);
                    }}
                    inputValue={stateSearchQuery}
                    onInputValueChange={setStateSearchQuery}
                  >
                    <ComboboxInput
                      placeholder="Search State..."
                      className={cn("h-11 w-full rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationRegion && "border-red-500")}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No states found.</ComboboxEmpty>
                      <ComboboxList>
                        {filteredStates.map((state) => (
                          <ComboboxItem key={state.id} value={state.name}>
                            {state.name}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                ) : (
                  <Input 
                    placeholder="e.g. California" 
                    {...form.register('destinationRegion')}
                    className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationRegion && "border-red-500")} 
                  />
                )}
                {errors.destinationRegion && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destinationRegion.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Scheduled Delivery Date</Label>
                <Controller
                  name="scheduledDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value as any}
                      onChange={field.onChange}
                      className="h-11 w-full rounded-md"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Contact Phone 1*</Label>
                <Input 
                  {...form.register('destinationPhone1')}
                  placeholder="Recipient phone number" 
                  className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationPhone1 && "border-red-500")} 
                />
                {errors.destinationPhone1 && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destinationPhone1.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Contact Phone 2</Label>
                <Input 
                  {...form.register('destinationPhone2')}
                  placeholder="Alternate phone number" 
                  className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationPhone2 && "border-red-500")} 
                />
                {errors.destinationPhone2 && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destinationPhone2.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Full Delivery Address*</Label>
                <Input 
                  {...form.register('destinationAddress')}
                  placeholder="Street, City, Landmark" 
                  className={cn("h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.destinationAddress && "border-red-500")} 
                />
                {errors.destinationAddress && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destinationAddress.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Additional Notes</Label>
            <Input 
              {...form.register('notes')}
              placeholder="Any specific instructions for the transfer..." 
              className="h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs" 
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-[10px] rounded-md shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Initiating...</span>
                </div>
              ) : 'Confirm & Initiate Transfer'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-12 border-gray-200 text-gray-500 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-gray-50 shadow-sm transition-all active:scale-95"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
