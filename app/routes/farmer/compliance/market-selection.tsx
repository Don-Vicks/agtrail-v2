import { LayoutDashboard, Globe, Landmark, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import type { Route } from './+types/market-selection'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Select Target Market | Agrolinking' },
    { name: 'description', content: 'Choose your trade destination for compliance alignment' },
  ]
}

export default function MarketSelectionPage() {
  const navigate = useNavigate()

  const markets = [
    {
      id: 'eu',
      name: 'European Union',
      description: 'Align with EUDR and ISO 22005:2007 standards for European trade.',
      icon: <Globe className="size-6 text-[#2e7d32]" />,
      badge: 'EUDR Compliant'
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      description: 'Meet UK deforestation-free and sustainability requirements.',
      icon: <Landmark className="size-6 text-[#2e7d32]" />,
      badge: 'Sustainability'
    },
    {
      id: 'us',
      name: 'United States',
      description: 'Compliance with US agricultural import regulations and safety acts.',
      icon: <ShieldCheck className="size-6 text-[#2e7d32]" />,
      badge: 'FDA Standards'
    },
    {
      id: 'asia',
      name: 'Asia Pacific',
      description: 'Export requirements for major Asian markets including China and Japan.',
      icon: <Globe className="size-6 text-[#2e7d32]" />,
      badge: 'Global Export'
    }
  ]

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
          { label: 'Market Selection' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-[#2e7d32]">Select Target Market</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose your trade destination to automatically align documentation and logistics with regional trade agreements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {markets.map((market) => (
          <div 
            key={market.id}
            className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#2e7d32] hover:shadow-md cursor-pointer"
            onClick={() => navigate('/farmer/compliance/readiness')}
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-[#e8f5e9] p-3 transition-colors group-hover:bg-[#2e7d32]/10">
                {market.icon}
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {market.badge}
              </span>
            </div>
            
            <div className="mt-5">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2e7d32] transition-colors">{market.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {market.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#2e7d32] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Continue to Readiness Check</span>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => navigate('/farmer/compliance')}
          className="h-10 border-gray-200 px-6 text-[10px] font-bold uppercase tracking-widest"
        >
          Back to Assessment
        </Button>
      </div>
    </div>
  )
}
