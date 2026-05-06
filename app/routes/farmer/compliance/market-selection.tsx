import { Globe, LayoutDashboard, MapPin, Search, ChevronDown, CheckCircle2, ShieldCheck, FileText } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export function MarketSelectionPage() {
  const navigate = useNavigate()
  const [selectedMarket, setSelectedMarket] = useState('eu')

  const markets = [
    {
      id: 'eu',
      name: 'European Union (EU)',
      description: 'Compliance focused on EUDR (Deforestation) and ISO quality standards. High transparency requirements.',
      icon: <Globe className="size-5" />,
      active: true
    },
    {
      id: 'afcfta',
      name: 'African Continental Free Trade Area (AfCFTA)',
      description: 'Inter-continental trade with reduced tariffs. Requires Certificate of Origin documentation.',
      icon: <div className="size-5 border border-current rounded-sm flex items-center justify-center text-[10px] font-bold">III</div>,
      active: false
    },
    {
      id: 'usmca',
      name: 'North America (USMCA)',
      description: 'Labor and environmental standards focus. Requires specific phytosanitary certification.',
      icon: <Globe className="size-5" />,
      active: false
    }
  ]

  return (
    <div className="w-full space-y-8 pb-12 text-left">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/farmer' },
          { label: 'Compliance Check' },
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-brand tracking-tight">Select Target Market</h1>
        <p className="text-sm text-gray-500 font-medium">
          Choose your trade destination to automatically align documentation and logistics with regional trade agreements.
        </p>
      </div>

      {/* User Info Section */}
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-gray-900">Mr. Tunde Fashola</h2>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Kaduna, Nigeria</p>
        </div>
      </div>

      {/* Product Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
        <StatusItem label="PRODUCT" value="Maize" valueColor="text-[#2e7d32]" />
        <StatusItem label="BATCH NUMBER" value="BT19237320323" />
        <StatusItem label="TOTAL QUANTITY" value="1,340 MT" />
        <StatusItem label="MARKET READINESS" value="94%" valueColor="text-[#2e7d32]" />
      </div>

      {/* Market Selection List */}
      <div className="space-y-4">
        {markets.map((market) => (
            <div className={cn(
              "relative flex items-center gap-6 p-6 rounded-md border transition-all cursor-pointer group",
              selectedMarket === market.id 
                ? "border-brand bg-white shadow-sm ring-1 ring-brand/10" 
                : "border-gray-100 bg-white hover:border-gray-200"
            )}
          >
            <div className={cn(
              "size-12 rounded-md flex items-center justify-center border transition-colors",
              selectedMarket === market.id 
                ? "bg-brand-surface text-brand border-brand/20" 
                : "bg-gray-50 text-gray-400 border-gray-100"
            )}>
              {market.icon}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className={cn(
                  "text-base font-bold tracking-tight",
                  selectedMarket === market.id ? "text-gray-900" : "text-gray-500"
                )}>
                  {market.name}
                </h3>
                {market.id === 'eu' && (
                  <span className="bg-brand-surface text-brand text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-brand/10">
                    ACTIVE TRADE ZONE
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {market.description}
              </p>
            </div>

            <div className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center transition-all",
              selectedMarket === market.id 
                ? "border-brand bg-white" 
                : "border-gray-200"
            )}>
              {selectedMarket === market.id && (
                <div className="size-2.5 rounded-full bg-brand" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Specific Requirements Section */}
      <div className="pt-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="size-5 rounded-full bg-brand flex items-center justify-center text-white">
            <span className="text-[10px] font-black">i</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Specific Regulatory Requirements</h3>
        </div>
        
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MANDATORY FOR EUROPEAN UNION (EU)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RequirementItem 
            icon={<ShieldCheck className="size-5 text-brand" />}
            title="EU Deforestation-free regulation (EUDR)"
            description="Requires geolocation coordinates of the production plots."
          />
          <RequirementItem 
            icon={<FileText className="size-5 text-gray-400" />}
            title="ISO 22005:2007"
            description="Traceability in the food and feed chain certification."
          />
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, value, valueColor = "text-gray-900" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-xl font-bold tracking-tight", valueColor)}>{value}</p>
    </div>
  )
}

function RequirementItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-0.5">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h4>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

import { useState } from 'react'
