import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { DatePicker } from '~/components/ui/date-picker'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { PostPurchasesBody, PostPurchasesBodyProductType } from '~/lib/api/generated/models'
import { useGetOrganizationsMembers } from '~/lib/api/generated/organizations-members/organizations-members'
import { usePostPurchases } from '~/lib/api/generated/purchases/purchases'
import { EmptyState } from '~/components/empty-state'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  ChevronDown, 
  Receipt, 
  Download, 
  LayoutDashboard, 
  Wallet, 
  ArrowRight,
  ClipboardList,
  FileText,
  Calendar,
  Users,
  Activity,
  CheckCircle2,
  Filter
} from 'lucide-react'

import { cn } from '~/lib/utils'
import type { Route } from './+types/purchase'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Purchase | Agtrail Finance' },
    { name: 'description', content: 'Log farm payments and purchases' },
  ]
}

export default function RecordPurchasePage() {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [pricePerUnit, setPricePerUnit] = useState('0')
  const [account, setAccount] = useState('')
  const [productType, setProductType] = useState<PostPurchasesBodyProductType>('crop')
  const [toUserId, setToUserId] = useState('')
  const [farmProductId, setFarmProductId] = useState('')
  const [description, setDescription] = useState('')

  const { data: farmsResponse } = useGetFarms()
  const farms = farmsResponse?.data?.data || []

  const { data: membersResponse } = useGetOrganizationsMembers()
  const members = membersResponse?.data?.data || []

  const { mutateAsync: submitPurchase, isPending } = usePostPurchases()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!toUserId || !quantity || !unit) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const purchaseData: PostPurchasesBody = {
        productType,
        toUserId,
        quantityTransferred: parseFloat(quantity),
        unit,
        pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : undefined,
        totalPrice: pricePerUnit && quantity ? parseFloat(pricePerUnit) * parseFloat(quantity) : undefined,
        currency: 'NGN',
        notes: description,
        ...(farmProductId && { farmProductId }),
        ...(date && { expectedDeliveryDate: date }),
      }

      await submitPurchase({ data: purchaseData })
      toast.success('Purchase recorded successfully')

      // Reset form
      setDate('')
      setQuantity('')
      setPricePerUnit('0')
      setAccount('')
      setToUserId('')
      setFarmProductId('')
      setDescription('')
    } catch (error) {
      console.error('Failed to record purchase:', error)
      toast.error('Failed to record purchase. Please try again.')
    }
  }

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Finance', icon: <Wallet className="size-4 text-gray-400" /> },
          { label: 'Register Purchase' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Register Purchase</h1>
          <p className="text-sm text-gray-500 mt-1">Log produce purchases from members into the records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200"
            onClick={() => document.getElementById('table-search')?.focus()}
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>


      {/* Entry Form Card: High Density Layout */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 text-left">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
              <Plus className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Purchase Details</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Enter purchase information</p>
            </div>
          </div>
        </div>
        
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Calendar className="size-3 text-brand" /> Date
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FileText className="size-3 text-brand" /> Product Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as PostPurchasesBodyProductType)}
                  required
                  className="h-11 w-full flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                >
                  <option value="crop">Crop</option>
                  <option value="livestock">Livestock</option>
                  <option value="aquaculture">Aquaculture</option>
                  <option value="dairy">Dairy</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Users className="size-3 text-brand" /> Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={toUserId}
                  onChange={(e) => setToUserId(e.target.value)}
                  required
                  className="h-11 w-full flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                >
                  <option value="">Select members...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.userId}>{member.userId}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Unit <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="KG"
                  className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Bid Price (₦)
              </label>
              <Input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="0.00"
                className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Payment Account
              </label>
              <Input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Central Treasury Ref"
                className="h-11 w-full rounded-lg border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add any relevant notes for this purchase..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50 mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brand hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] h-12 px-10 shadow-lg shadow-brand/10 transition-all active:scale-[0.98] flex items-center gap-3"
            >
              {isPending ? <Activity className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              {isPending ? 'Processing...' : 'Register Purchase'}
            </Button>
          </div>
        </form>
      </div>

      {/* Audit History Card: Professional High Density */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between bg-white text-left gap-6">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <ShoppingCart className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Purchase History</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">History of all produce purchases</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                id="table-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records..."
                className="w-full h-10 rounded-lg border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>
            <Button variant="outline" className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-gray-100">
              <Filter className="size-3.5 mr-2" />
              Advanced
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto min-h-[400px] flex flex-col">
          <EmptyState
            icon={<Receipt className="size-12 text-gray-100" />}
            title={search ? "No Records Found" : "No History"}
            description={search ? `No purchases found for search "${search}"` : "Your purchase history will appear here once you log a purchase."}
            action={search ? { label: "Clear Search", onClick: () => setSearch('') } : undefined}
          />
        </div>
        
        <div className="px-6 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
            <span className="text-gray-900">Total Purchases: 0</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:bg-white hover:text-brand transition-all gap-2">
              <Download className="size-3.5" /> Export PDF
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8 text-gray-300" disabled>
                <ArrowRight className="size-4 rotate-180" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-gray-300" disabled>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
