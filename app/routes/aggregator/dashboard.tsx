import {
  History,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowUpRight,
  Eye,
  Thermometer,
  Droplets,
  Clock,
  ScanLine,
  Boxes,
  Truck,
  Plus
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'

export default function AggregatorDashboardPage() {
  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          { label: 'Dashboard' }
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9 px-4 text-xs font-bold text-gray-600 rounded-lg border-gray-200 gap-2">
              <Plus className="size-4" />
              Start Batch Scan
            </Button>
            <Button className="bg-brand hover:bg-brand/90 text-white rounded-lg h-9 px-4 text-xs font-bold gap-2">
              <Plus className="size-4" />
              Log Storage condition
            </Button>
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
          value="142"
          trend="+12% vs last Most"
          icon={<CheckCircle2 className="size-4" />}
          color="blue"
        />
        <KPIStatCard
          label="Active Lots In Storage"
          value="42"
          trend="84% Capacity"
          icon={<Clock className="size-4" />}
          color="red"
        />
        <KPIStatCard
          label="Pending Transfers"
          value="09"
          trend="Requires Signature"
          icon={<ArrowUpRight className="size-4" />}
          color="yellow"
        />
        <KPIStatCard
          label="Volume Rate"
          value="2.4K"
          trend="Unit Processed"
          icon={<Activity className="size-4" />}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Batches Table */}
        <div className='lg:col-span-2 rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm'>
          <table className='w-full text-left'>
            <thead>
              <tr className='border-b border-gray-50 bg-gray-50/30'>
                <th className='px-6 py-4 text-[10px] font-bold text-brand uppercase tracking-wider'>Batch Identifier</th>
                <th className='px-6 py-4 text-[10px] font-bold text-brand uppercase tracking-wider'>Weight (KG)</th>
                <th className='px-6 py-4 text-[10px] font-bold text-brand uppercase tracking-wider text-center'>Status</th>
                <th className='px-6 py-4 w-16'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              <BatchRow id="#BT - 98442" weight="1,240.00 Kg" status="Approved" />
              <BatchRow id="#BT - 98442" weight="1,240.00 Kg" status="Flagged" />
              <BatchRow id="#BT - 98442" weight="1,240.00 Kg" status="Approved" />
              <BatchRow id="#BT - 98442" weight="1,240.00 Kg" status="Approved" />
              <BatchRow id="#BT - 98442" weight="1,240.00 Kg" status="Flagged" />
            </tbody>
          </table>
        </div>

        {/* Audit Trail */}
        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-[10px] font-bold text-brand uppercase tracking-widest'>Audit Trail</h3>
          </div>
          <div className='space-y-6 relative pl-5 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100'>
            <AuditTrailItem
              title="QR Verification Success"
              description="Farmer Credentials For J. Doe verified and famr land firmly proved"
              color="green"
            />
            <AuditTrailItem
              title="Weight Flagged"
              description="Differnce od 12.5kg deteced between gate log and consolidation scale"
              color="gray"
            />
            <AuditTrailItem
              title="QR Verification Success"
              description="Farmer Credentials For J. Doe verified and famr land firmly proved"
              color="green"
            />
            <AuditTrailItem
              title="Weight Flagged"
              description="Differnce od 12.5kg deteced between gate log and consolidation scale"
              color="gray"
            />
            <AuditTrailItem
              title="Weight Flagged"
              description="Differnce od 12.5kg deteced between gate log and consolidation scale"
              color="gray"
            />
          </div>
        </div>
      </div>

      {/* Environmental Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <EnvStatCard
          label="Warehouse Temp"
          value="18.2"
          detail="Last Reading: 12 PM Institutional Sensor"
          icon={<Thermometer className="size-5" />}
          color="blue"
        />
        <EnvStatCard
          label="Relative Humidity"
          value="68.4"
          detail="Critical: Upper limit threshold breached at 12:42 pm"
          icon={<Droplets className="size-5" />}
          color="red"
        />
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
    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md group'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-[9px] font-bold text-gray-400 uppercase tracking-wider'>{label}</p>
          <div className={cn('size-8 rounded-lg flex items-center justify-center', iconColors[color])}>
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

function BatchRow({ id, weight, status }: { id: string, weight: string, status: 'Approved' | 'Flagged' }) {
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
            'px-4 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider',
            status === 'Approved' ? 'border-green-100 bg-green-50/50 text-green-700' : 'border-red-100 bg-red-50/50 text-red-700'
          )}>
            {status}
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

function EnvStatCard({ label, value, detail, icon, color }: { label: string, value: string, detail: string, icon: React.ReactNode, color: 'blue' | 'red' }) {
  const iconColors = {
    blue: 'text-blue-500 bg-blue-50',
    red: 'text-red-500 bg-red-50'
  }
  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm relative overflow-hidden group'>
      <div className='relative z-10 flex items-center justify-between'>
        <div className='space-y-4'>
          <div className='space-y-0.5'>
            <p className='text-[9px] font-bold text-gray-400 uppercase tracking-widest'>{label}</p>
            <h4 className={cn('text-4xl font-bold tracking-tight', color === 'red' ? 'text-red-500' : 'text-gray-900')}>{value}</h4>
          </div>
          <p className='text-[10px] font-semibold text-gray-400 leading-tight max-w-[200px]'>{detail}</p>
        </div>
        <div className={cn('size-14 rounded-2xl flex items-center justify-center', iconColors[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}
