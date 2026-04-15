import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { useGetCertifications } from '~/lib/api/generated/certifications/certifications'
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutDashboard, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Package,
  MapPin,
  ClipboardList,
  FileText
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Route } from './+types/index'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Certifications | Agtrail' },
    { name: 'description', content: 'Monitor compliance and certifications' },
  ]
}

/* ─── Mock Data ─── */
type CertType = 'Farm' | 'Product';
type CertStatus = 'Active' | 'Expired' | 'Pending';

interface CertificationInfo {
  id: string;
  title: string;
  subtitle: string;
  status: CertStatus;
  verified: boolean;
  certNo: string;
  issueDate: string;
  expiryDate: string;
  appliedTo: string;
  type: CertType;
}

export default function ViewCertificationsPage() {
  const { data: certsResp, isLoading } = useGetCertifications()
  const [activeTab, setActiveTab] = useState<'All' | 'Farm' | 'Product'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const certifications = useMemo(() => {
    const raw = certsResp?.data?.data
    if (!Array.isArray(raw)) return [] as CertificationInfo[]

    const normalizeStatus = (status: string, expiryDate: unknown): CertStatus => {
      const normalized = (status || '').toLowerCase()
      if (normalized.includes('expire')) return 'Expired'
      if (normalized.includes('pending') || normalized.includes('review')) return 'Pending'
      if (normalized.includes('active') || normalized.includes('valid') || normalized.includes('approved')) return 'Active'

      if (typeof expiryDate === 'string' && expiryDate) {
        const expiryTime = new Date(expiryDate).getTime()
        if (!Number.isNaN(expiryTime) && expiryTime < Date.now()) return 'Expired'
      }
      return 'Pending'
    }

    const formatDate = (value: unknown) => {
      if (typeof value !== 'string' || !value) return 'N/A'
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) return 'N/A'
      return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const mapType = (entityType: string): CertType => {
      const t = (entityType || '').toLowerCase()
      return t.includes('farm_product') || t.includes('product') || t.includes('batch') ? 'Product' : 'Farm'
    }

    return raw.map((cert: any) => ({
      id: cert.id,
      title: cert.certificationType || 'Unknown Certification',
      subtitle: cert.certifyingBody || 'Unknown Certifying Body',
      status: normalizeStatus(cert.status, cert.expiryDate),
      verified: !!cert.verificationDate,
      certNo: cert.certificateNumber || 'N/A',
      issueDate: formatDate(cert.issueDate),
      expiryDate: formatDate(cert.expiryDate),
      appliedTo: cert.entityId || 'N/A',
      type: mapType(cert.entityType),
    }))
  }, [certsResp])

  // Compute stats
  const totalCerts = certifications.length
  const activeCerts = certifications.filter(c => c.status === 'Active').length
  const expiredCerts = certifications.filter(c => c.status === 'Expired').length
  const pendingCerts = certifications.filter(c => c.status === 'Pending').length

  const farmCertsCount = certifications.filter(c => c.type === 'Farm').length
  const productCertsCount = certifications.filter(c => c.type === 'Product').length

  // Filter lists
  const filteredCerts = useMemo(() => {
    return certifications.filter(cert => {
      // Type Match
      if (activeTab === 'Farm' && cert.type !== 'Farm') return false;
      if (activeTab === 'Product' && cert.type !== 'Product') return false;

      // Status Match
      if (statusFilter && cert.status !== statusFilter) return false;

      // Search Match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !cert.title.toLowerCase().includes(query) &&
          !cert.certNo.toLowerCase().includes(query) &&
          !cert.appliedTo.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    })
  }, [activeTab, searchQuery, statusFilter, certifications])

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Compliance' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage compliance standards and certifications</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cooperative/certifications/farm">
            <Button variant="outline" className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
              <ClipboardList className="size-4" />
              Upload Farm Audit
            </Button>
          </Link>
          <Link to="/cooperative/certifications/product">
            <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
              <Plus className="size-4" />
              <span className="font-bold uppercase tracking-wide text-[11px]">Register Product Cert</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* High Density Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Certs"
          value={totalCerts.toString()}
          icon={<Award className="size-5 text-blue-500" />}
          trend={{ value: '2 Updated', isPositive: true }}
        />
        <StatCard
          label="Active Standards"
          value={activeCerts.toString()}
          icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          trend={{ value: 'Verified', isPositive: true }}
        />
        <StatCard
          label="Critical Expired"
          value={expiredCerts.toString()}
          icon={<AlertCircle className="size-5 text-red-500" />}
          trend={{ value: 'High Priority', isPositive: false }}
        />
        <StatCard
          label="Audit Pending"
          value={pendingCerts.toString()}
          icon={<Clock className="size-5 text-amber-500" />}
          trend={{ value: 'In Review', isPositive: true }}
        />
      </div>

      {/* Main Registry Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-50 pb-6">
          <div className="inline-flex rounded-xl bg-gray-50/80 p-1 border border-gray-100">
            {[
              { id: 'All', label: 'All', count: totalCerts },
              { id: 'Farm', label: 'Farm Units', count: farmCertsCount },
              { id: 'Product', label: 'Products', count: productCertsCount }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {tab.label} <span className="ml-2 opacity-40">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search standards, serials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none min-w-[140px]"
              >
                <option value="">Status: All</option>
                <option value="Active">Active Only</option>
                <option value="Pending">In Review</option>
                <option value="Expired">Archived</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Certification Registry Grid */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="rounded-2xl border border-gray-100 p-12 text-center text-sm text-gray-500">
              Loading certifications...
            </div>
          ) : filteredCerts.length > 0 ? (
            filteredCerts.map((cert) => (
              <div key={cert.id} className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center gap-8 shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 scale-125">
                  <ShieldCheck className="size-20 text-brand" />
                </div>

                <div className="shrink-0 size-16 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand relative z-10">
                  <Award className="size-8" />
                </div>

                <div className="flex-1 min-w-0 relative z-10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight truncate max-w-[280px]" title={cert.title}>
                          {cert.title.replace('_', ' ')}
                        </h3>
                        <Badge className={cn(
                          "px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border shadow-none",
                          cert.status === 'Active' ? 'bg-green-50 text-emerald-600 border-green-100' : 
                          cert.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-red-50 text-red-600 border-red-100'
                        )}>
                          {cert.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{cert.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="h-10 gap-2 text-[11px] font-bold uppercase tracking-wider text-brand hover:bg-brand/5">
                        <ExternalLink className="size-3.5" />
                        Verify Asset
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-50 uppercase font-bold tracking-tight text-[10px] text-gray-400">
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 italic text-gray-300"><ClipboardList className="size-3" /> Serial ID</span>
                      <span className="text-gray-900 block truncate">{cert.certNo}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 italic text-gray-300"><Clock className="size-3" /> Expiry</span>
                      <span className="text-gray-900 block">{cert.expiryDate}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 italic text-gray-300">
                        {cert.type === 'Farm' ? <MapPin className="size-3" /> : <Package className="size-3" />} 
                        Target
                      </span>
                      <span className="text-brand block truncate lowercase">{cert.appliedTo}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="flex items-center gap-2 italic text-gray-300"><FileText className="size-3" /> Standard</span>
                      <span className="text-gray-900 block">{cert.type} Unit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-100 p-20 flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
                <Search className="size-8 text-gray-200" />
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 italic">No Certifications Found</h3>
              <p className="text-[10px] text-gray-300 uppercase tracking-tight mb-8">No certifications match your current filters</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('') }} className="text-[10px] font-bold uppercase h-10 px-6 border-gray-100 hover:bg-gray-50">Reset Global Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
