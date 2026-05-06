import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  Layers,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  User,
  Wallet
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import { Input } from '~/components/ui/input'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetPaymentsReceivables } from '~/lib/api/generated/payments/payments'
import { normalizeReceivables } from '~/lib/receivables'


interface ReceivablesPageProps {
  dashboardHref: string
  dashboardLabel?: string
}

export function ReceivablesPage({ dashboardHref, dashboardLabel = 'Dashboard' }: ReceivablesPageProps) {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('0')
  const [farm, setFarm] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [description, setDescription] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetFarmersProducts()
  const { data: receivablesResponse, isLoading: isLoadingReceivables } = useGetPaymentsReceivables()

  const farms = farmsResponse?.data?.data || []
  const products = productsResponse?.data?.data || []
  const receivables = useMemo(
    () => normalizeReceivables(receivablesResponse?.data?.data, { farms, products }),
    [farms, products, receivablesResponse?.data?.data],
  )

  const isLoading = isLoadingFarms || isLoadingProducts || isLoadingReceivables

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amountNum = parseFloat(amount)
    const quantityNum = parseFloat(quantity)
    if (
      !date ||
      !farm ||
      !product ||
      Number.isNaN(amountNum) ||
      amountNum <= 0 ||
      Number.isNaN(quantityNum) ||
      quantityNum <= 0
    ) {
      toast.error('Enter a valid date, farm, product, and positive amount and quantity.')
      return
    }

    try {
      // TODO: Replace with actual API call when receivables creation endpoint is available
      // For now, simulate successful submission
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

      toast.success('Receivable logged successfully!')

      // Reset form
      setDate('')
      setAmount('0')
      setFarm('')
      setProduct('')
      setQuantity('0')
      setDescription('')
    } catch (error) {
      toast.error('Failed to log receivable. Please try again.')
    }
  }

  const filteredReceivables = useMemo(() => {
    return receivables.filter((r) => {
      const term = search.toLowerCase()
      return (
        r.productName.toLowerCase().includes(term) ||
        r.payer?.toLowerCase().includes(term) ||
        r.farm.toLowerCase().includes(term) ||
        r.amount.includes(term) ||
        r.batchId?.toLowerCase().includes(term)
      )
    })
  }, [receivables, search])

  const sortedReceivables = useMemo(() => {
    return [...filteredReceivables].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filteredReceivables])

  const totalPages = Math.max(1, Math.ceil(sortedReceivables.length / rowsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedReceivables = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedReceivables.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedReceivables, currentPage, rowsPerPage])


  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: dashboardLabel,
            href: dashboardHref,
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Finance', icon: <Wallet className="size-4 text-gray-400" /> },
          { label: 'Receivables' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Receivables</h1>
          <p className="text-sm text-gray-500 mt-1">Log and track expected payments from farm produce sales</p>
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
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 text-left">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
              <Plus className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Receivable Details</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Enter receivable information</p>
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
                className="h-11 w-full rounded-md border border-gray-100 bg-gray-50/50 px-4 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Wallet className="size-3 text-brand" /> Amount (₦) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-11 w-full rounded-md border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <LayoutDashboard className="size-3 text-brand" /> Farm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={farm}
                  onChange={(e) => setFarm(e.target.value)}
                  required
                  className="h-11 w-full flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                >
                  <option value="">Select farm unit...</option>
                  {farms.map((f: any) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Layers className="size-3 text-brand" /> Product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                  className="h-11 w-full flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                >
                  <option value="">Select commodity...</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.productName}>{p.productName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Net Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="h-11 w-full rounded-md border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User className="size-3 text-brand" /> Payer
              </label>
              <Input
                type="text"
                placeholder="ID (Optional)"
                className="h-11 w-full rounded-md border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add any relevant notes for this receivable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-100 bg-gray-50/50 p-4 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50 mt-8">
            <Button
              type="submit"
              className="bg-brand hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] h-12 px-10 shadow-lg shadow-brand/10 transition-all active:scale-[0.98] flex items-center gap-3"
            >
              <CheckCircle2 className="size-4" />
              Record Receivable
            </Button>
          </div>
        </form>
      </div>      {/* Audit History Card: Professional High Density */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between bg-white text-left gap-6">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <Receipt className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Receivables History</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">List of all expected payments</p>
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
                className="w-full h-10 rounded-md border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>
            <Button variant="outline" className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-gray-100">
              <Filter className="size-3.5 mr-2" />
              Advanced
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Activity className="size-10 text-brand animate-spin" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 italic">Loading records...</p>
            </div>
          ) : filteredReceivables.length === 0 ? (
            <EmptyState
              icon={<Receipt className="size-12 text-gray-100" />}
              title={search ? "No Records Found" : "No History"}
              description={search ? `No receivables found for search "${search}"` : "Historical logs will populate here once receivables are logged."}
              action={search ? { label: "Clear Search", onClick: () => setSearch('') } : undefined}
            />
          ) : (
            <div className="min-w-[800px]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Payer Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Quantity</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right pr-8">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedReceivables.map((receivable) => (
                    <tr key={receivable.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-900 tracking-tight uppercase">{receivable.date}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors">{receivable.payer || 'Unidentified Entry'}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic mt-0.5">Origin: {receivable.farm}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{receivable.productName}</span>
                          </div>
                          {receivable.batchId && <span className="text-[9px] font-bold text-gray-300 mt-1 uppercase tracking-widest">{receivable.batchId}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-brand/5 text-brand border-brand/10 shadow-none">
                          {receivable.quantity}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 text-right pr-8">
                        <span className="text-sm font-bold text-gray-900 tracking-tight">{receivable.amount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isLoading && filteredReceivables.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
              <span className="text-gray-900">Total Receivables: {filteredReceivables.length}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 italic">Rows per page</span>
                <select className="bg-transparent border-none outline-none text-gray-900 font-bold" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-300 lowercase">Page {currentPage} / {totalPages}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8 text-gray-300" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    <ArrowRight className="size-4 rotate-180" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-brand transition-all" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
