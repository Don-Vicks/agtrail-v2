import { type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  ClipboardCheck,
  Download,
  LayoutDashboard,
  Upload,
} from 'lucide-react'
import type { Route } from './+types/readiness-check'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Market Readiness | Agrolinking' },
    { name: 'description', content: 'View compliance readiness for your selected market' },
  ]
}

function StageMetric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`font-bold ${highlight ? 'text-[#2e7d32]' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">{label}</div>
  )
}

function RequirementCard({
  title,
  status,
  children,
}: {
  title: string
  status: 'verified' | 'action'
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-start justify-between rounded-lg bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="size-4 text-[#2e7d32]" />
          <p className="text-sm font-bold text-gray-900">{title}</p>
        </div>
        <Badge className={status === 'verified' ? 'bg-green-100 text-[10px] font-bold uppercase text-green-700' : 'bg-amber-100 text-[10px] font-bold uppercase text-amber-700'}>
          {status === 'verified' ? 'Verified' : 'Action Required'}
        </Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-3">{children}</div>
    </div>
  )
}

export default function ReadinessCheckPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { 
            label: 'Compliance Check',
            href: '/farmer/compliance'
          },
          { 
            label: 'Market Selection',
            href: '/farmer/compliance/market'
          },
          { label: 'Readiness Check' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[#2e7d32]">Compliance Readiness Review</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your documentation has been automatically aligned with European Union (EUDR) trade agreements.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm lg:grid-cols-4">
          <StageMetric label="Product" value="Maize" />
          <StageMetric label="Batch Number" value="BT19237320323" />
          <StageMetric label="Total Quantity" value="1,340 MT" />
          <StageMetric label="Market Readiness" value="94%" highlight />
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Overall readiness</p>
          <p className="text-3xl font-bold text-[#2e7d32]">94%</p>
          <div className="mt-2 h-2 rounded-full bg-gray-100">
            <div className="h-full w-[94%] rounded-full bg-[#2e7d32]" />
          </div>
        </div>
      </div>

      <RequirementCard title="EU Deforestation-free Regulation (EUDR)" status="verified">
        {['Geolocation Coordinates', 'Plot Ownership', 'Time of Harvest'].map((item) => (
          <CheckItem key={item} label={item} />
        ))}
      </RequirementCard>

      <RequirementCard title="ISO 22005:2007 (Traceability)" status="verified">
        <CheckItem label="Batch History" />
        <CheckItem label="Feed Source" />
      </RequirementCard>

      <RequirementCard title="Lab Report" status="action">
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2">
          <p className="text-sm text-gray-700">Pending Laboratory Result Upload</p>
          <Button className="h-8 bg-[#2e7d32] px-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90">
            Resolve
          </Button>
        </div>
      </RequirementCard>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-tight text-gray-900">Supporting Annex</h3>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-green-100 text-[#2e7d32]">
            <Upload className="size-5" />
          </div>
          <p className="text-sm font-bold text-gray-800">Drag and drop supporting documents</p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB each)</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate('/farmer/compliance/market')}
          className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest"
        >
          Back
        </Button>
        <Button
          onClick={() => navigate('/farmer/compliance/report')}
          className="h-9 bg-[#2e7d32] px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90"
        >
          Generate Report
        </Button>
      </div>
    </div>
  )
}
