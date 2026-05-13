import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronsLeftRight,
  Circle,
  Clock,
  Eye,
  History,
  Plus,
  Loader2
} from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { useGetAggregatorLots, useGetAggregatorLotsDraft, useGetAggregatorNotifications } from '~/lib/api/generated/aggregator/aggregator'
import { cn } from '~/lib/utils'

export default function AggregatorDashboardPage() {
  const { data: lotsData, isLoading: isLoadingLots } = useGetAggregatorLots()
  const { data: draftData, isLoading: isLoadingDraft } = useGetAggregatorLotsDraft()
  const { data: notificationsData, isLoading: isLoadingNotifications } = useGetAggregatorNotifications()

  const lots = lotsData?.data?.data ?? []
  const draftBatches = (draftData?.data?.data as any)?.batches ?? []
  const notifications = notificationsData?.data?.data ?? []

  // KPI Calculations
  const verifiedBatchesCount = lots.reduce((acc, lot) => acc + (lot.compositionTree?.length ?? 0), 0)
  const activeLotsCount = lots.filter(l => l.status === 'finalised' || l.status === 'received').length
  const pendingTransfersCount = lots.filter(l => l.status === 'in_transit').length
  const totalVolume = lots.reduce((acc, lot) => acc + Number(lot.actualWeight || lot.declaredTotalWeight || 0), 0)

  const isLoading = isLoadingLots || isLoadingDraft || isLoadingNotifications

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
          },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Link to="/aggregator/batch-qr-scan">
              <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-md border-gray-200 gap-2">
                <Plus className="size-4" />
                Start Batch Scan
              </Button>
            </Link>
            <Link to="/aggregator/lot-storage">
              <Button className="bg-brand hover:bg-brand/90 text-white rounded-md h-9 px-4 text-xs font-bold gap-2">
                <Plus className="size-4" />
                Log Storage condition
              </Button>
            </Link>
          </div>
        }
      />

      <div className='space-y-1'>
        <h1 className='text-xl font-bold text-brand tracking-tight'>Aggregator Dashboard</h1>
        <p className='text-[12px] text-gray-500 font-medium'>Monitoring N:1 Merge Processes & Blockchain</p>
      </div>

      {/* KPI Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <KPIStatCard
          label="Verified Batches"
          value={verifiedBatchesCount.toString()}
          trend="Total Processed"
          icon={<CheckCircle2 className="size-4" />}
          color="blue"
        />
        <KPIStatCard
          label="Active Lots In Storage"
          value={activeLotsCount.toString()}
          trend="Currently Managed"
          icon={<Clock className="size-4" />}
          color="red"
        />
        <KPIStatCard
          label="Pending Transfers"
          value={pendingTransfersCount.toString()}
          trend="In Transit"
          icon={<ArrowUpRight className="size-4" />}
          color="yellow"
        />
        <KPIStatCard
          label="Volume Rate"
          value={`${(totalVolume / 1000).toFixed(1)}K`}
          trend="KG Processed"
          icon={<Activity className="size-4" />}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Lots Table */}
        <div className='lg:col-span-2 rounded-md border border-gray-100 bg-white overflow-hidden shadow-sm'>
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-brand uppercase tracking-wider">Recent Consolidated Lots</h3>
            <Link to="/aggregator/storage-history" className="text-[10px] font-bold text-brand hover:underline">View All</Link>
          </div>
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b border-gray-50 bg-gray-50/10'>
                <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Lot Identifier</th>
                <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Weight (KG)</th>
                <th className='px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center'>Status</th>
                <th className='px-6 py-3 w-16'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {lots.length > 0 ? (
                lots.slice(0, 5).map((lot) => (
                  <BatchRow 
                    key={lot.id} 
                    id={lot.lotId || `#LOT-${lot.id.slice(-6)}`} 
                    weight={`${Number(lot.actualWeight || lot.declaredTotalWeight || 0).toLocaleString()} Kg`} 
                    status={lot.status} 
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                    No lots found. Scan batches to create a lot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Trail */}
        <div className='rounded-md border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-[10px] font-bold text-brand uppercase tracking-widest'>Audit Trail</h3>
          </div>
          <div className='space-y-6 relative pl-5 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100'>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <AuditTrailItem
                  key={notification.id}
                  title={notification.title}
                  description={notification.body}
                  color={notification.type === 'alert' || notification.type === 'error' ? 'gray' : 'green'}
                />
              ))
            ) : (
              <p className="text-[10px] text-gray-400 font-medium italic">No recent activities.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action KPI Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
        <Link to="/aggregator/batch-qr-scan">
          <QuickActionCard
            title="QR Intake"
            subtitle="Scan New Batch"
            icon={<History className="size-5" />}
          />
        </Link>
        <Link to="/aggregator/lot-consolidation">
          <QuickActionCard
            title="Create New Lot"
            subtitle="Consolidate Batches"
            icon={<Boxes className="size-5" />}
          />
        </Link>
        <Link to="/aggregator/transfer">
          <QuickActionCard
            title="Transfer Custody"
            subtitle="Hand-off to a Processor"
            icon={<ChevronsLeftRight className="size-5" />}
          />
        </Link>
        <Link to="/aggregator/storage-history">
          <QuickActionCard
            title="History"
            subtitle="View Past Operations"
            icon={<Activity className="size-5" />}
          />
        </Link>
      </div>
    </div>
  )
}

function KPIStatCard({ label, value, trend, icon, color }: { label: string, value: string, trend: string, icon: React.ReactNode, color: 'blue' | 'red' | 'yellow' | 'green' }) {
  const iconColors = {
    blue: 'text-blue-500 bg-blue-100/30',
    red: 'text-red-500 bg-red-100/30',
    yellow: 'text-yellow-500 bg-yellow-100/30',
    green: 'text-green-500 bg-green-100/30'
  }

  return (
    <div className='rounded-md border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md group'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-[9px] font-bold text-gray-400 uppercase tracking-wider'>{label}</p>
          <div className={cn('size-8 rounded-md flex items-center justify-center', iconColors[color])}>
            {icon}
          </div>
        </div>
        <div className='space-y-0.5'>
          <h4 className='text-3xl font-bold text-gray-900 tracking-tight'>{value}</h4>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wide'>{trend}</p>
        </div>
      </div>
    </div>
  )
}

function BatchRow({ id, weight, status }: { id: string, weight: string, status: string }) {
  const statusConfig = {
    finalised: {
      icon: CheckCircle2,
      label: 'Finalised',
      className: 'border-green-100 bg-green-50/50 text-green-700',
    },
    received: {
      icon: CheckCircle2,
      label: 'Received',
      className: 'border-blue-100 bg-blue-50/50 text-blue-700',
    },
    draft: {
      icon: Circle,
      label: 'Draft',
      className: 'border-amber-100 bg-amber-50/50 text-amber-700',
    },
    in_transit: {
      icon: Clock,
      label: 'In Transit',
      className: 'border-blue-100 bg-blue-50/50 text-blue-700',
    },
  } as const
  const config = (statusConfig as any)[status] || statusConfig.draft
  const StatusIcon = config.icon
  const StatusLabel = config.label

  return (
    <tr className='hover:bg-gray-50/30 transition-colors group'>
      <td className='px-6 py-4'>
        <span className='text-sm font-bold text-gray-900 tracking-tight'>{id}</span>
      </td>
      <td className='px-6 py-4 text-xs font-semibold text-gray-400 tracking-tight'>
        {weight}
      </td>
      <td className='px-6 py-4 text-center'>
        <div className='flex justify-center'>
          <div className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider',
            config.className
          )}>
            <StatusIcon className='size-3.5' />
            {StatusLabel}
          </div>
        </div>
      </td>
      <td className='px-6 py-4 text-right'>
        <button className='text-gray-300 hover:text-brand transition-colors'>
          <Eye className='size-4' />
        </button>
      </td>
    </tr>
  )
}

function AuditTrailItem({ title, description, color }: { title: string, description: string, color: 'green' | 'gray' }) {
  return (
    <div className='relative'>
      <div className={cn(
        'absolute -left-[24.5px] top-1 size-2 rounded-full border-2 border-white ring-2',
        color === 'green' ? 'bg-green-500 ring-green-50' : 'bg-gray-400 ring-gray-50'
      )} />
      <div className='space-y-0.5'>
        <h4 className='text-[12px] font-bold text-gray-900'>{title}</h4>
        <p className='text-[10px] font-medium text-gray-400 leading-relaxed max-w-[200px]'>{description}</p>
      </div>
    </div>
  )
}

function QuickActionCard({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <button
      type='button'
      className='w-full rounded-md border border-gray-200 bg-white p-5 text-left shadow-sm transition-colors hover:bg-gray-50'
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 text-gray-700'>
          {icon}
        </div>
        <div className='space-y-1'>
          <p className='text-lg font-medium text-gray-700 leading-tight'>{title}</p>
          <p className='text-md text-gray-500 leading-tight'>{subtitle}</p>
        </div>
      </div>
    </button>
  )
}
