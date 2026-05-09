import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BadgeCheck,
  ExternalLink,
  FileText,
  History,
  Info,
  Layers,
  Leaf,
  MapPin,
  Package,
  ShieldCheck,
  Sprout,
  Users,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Globe,
  TrendingUp,
  Scale,
  Heart,
  Gavel,
  Check,
  Navigation,
  Sparkles,
  Tractor,
  Lightbulb
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { useTheme } from 'next-themes'

// --- Enhanced Mock Data ---
const mockJourney = [
  { stage: 'Transfer of Custody', date: 'Oct 12, 2025', details: 'Transferred to Processor - Agg_c5cf7741', isVerified: true },
  { stage: 'Transfer of Custody', date: 'Oct 11, 2025', details: 'Transferred to Aggregator - Agg_c5cf7741', isVerified: true },
  { stage: 'Transfer of Custody', date: 'Oct 11, 2025', details: 'Transferred to Aggregator - Agg_c5cf7741', isVerified: true },
  { stage: 'Harvesting', date: 'Oct 10, 2025 - Baba Beji Farms', details: 'Manual harvesting of 1,200kg of Rice.', 
    extra: { method: 'Manual', operator: 'John Doe', area: '2.5 Hectares' }, isVerified: true
  },
  { stage: 'Planting', date: 'Jun 15, 2025 - Baba Beji Farms', details: 'Sowing of 120kg of high-yield rice seeds.',
    extra: { method: 'Manual', operator: 'John Doe', area: '2.5 Hectares' }, isVerified: true
  },
  { stage: 'Land Preparation', date: 'Jun 01, 2025 - Baba Beji Farms', details: 'Clearing and tilling of 2.5 hectares.',
    extra: { method: 'Manual', operator: 'John Doe', area: '2.5 Hectares' }, isVerified: true
  }
]

const mockSafa = [
  {
    category: 'ENVIRONMENTAL',
    score: 42,
    icon: Leaf,
    color: 'emerald-500',
    metrics: [
      { label: 'CO2 Footprint (kg/ha)', value: '5.5' },
      { label: 'Water Conservation %', value: '85' },
      { label: 'Agro-Biodiversity Score', value: '87' },
      { label: 'Soil Organic Vitality', value: '88' },
      { label: 'Regenerative Purity', value: '0' }
    ]
  },
  {
    category: 'ECONOMIC',
    score: 100,
    icon: TrendingUp,
    color: 'emerald-500', // Matches screenshot indicating green for economic
    metrics: [
      { label: 'Financial Profitability', value: '100', trend: 'up' },
      { label: 'Market Access Score', value: '78', trend: 'up' },
      { label: 'Systemic Resilience', value: '65', trend: 'up' },
      { label: 'Resource Efficiency', value: '100', trend: 'up' }
    ]
  },
  {
    category: 'SOCIAL',
    score: 36,
    icon: Users,
    color: 'purple-500',
    metrics: [
      { label: 'Labor Ethics & Rights', value: '36' },
      { label: 'Local Community Impact', value: '82' },
      { label: 'Nutritional Security', value: '75' },
      { label: 'Fair Trade Adherence', value: 'NO' }
    ]
  },
  {
    category: 'GOVERNANCE',
    score: 30,
    icon: ShieldCheck,
    color: 'orange-500',
    metrics: [
      { label: 'Managerial Integrity', value: '30' },
      { label: 'Chain Transparency', value: '90' },
      { label: 'Stakeholder Audit', value: '85' },
      { label: 'Regulatory Compliance', value: '40' }
    ]
  }
]

const mockCerts = [
  { name: 'GOOD AGRICULTURAL PRACTICE', type: 'NIGERIAN AGRICULTURAL DEVELOPMENT PROGRAMME', issue: 'Dec 28, 2025', expiry: 'Dec 28, 2026', id: 'NADP-GAP-2025-002', status: 'ACTIVE' },
  { name: 'GOOD AGRICULTURAL PRACTICE', type: 'NIGERIAN AGRICULTURAL DEVELOPMENT PROGRAMME', issue: 'Dec 28, 2025', expiry: 'Dec 28, 2026', id: 'NADP-GAP-2025-002', status: 'ACTIVE' },
  { name: 'ORGANIC CERTIFICATION', type: 'NIGERIAN ORGANIC AGRICULTURE NETWORK', issue: 'Jul 25, 2025', expiry: 'Jul 25, 2026', id: 'NOAN-2025-#17A-001', status: 'ACTIVE' },
  { name: 'ORGANIC CERTIFICATION', type: 'NIGERIAN ORGANIC AGRICULTURE NETWORK', issue: 'Jul 25, 2025', expiry: 'Jul 25, 2026', id: 'NOAN-2025-#17A-001', status: 'ACTIVE' },
  { name: 'ORGANIC CERTIFICATION', type: 'INTERNATIONAL FEDERATION OF ORGANIC AGRICULTURE', issue: 'Jun 20, 2025', expiry: 'Jun 20, 2026', id: 'IFOAM-2025-SP-004', status: 'ACTIVE' },
  { name: 'ORGANIC CERTIFICATION', type: 'INTERNATIONAL FEDERATION OF ORGANIC AGRICULTURE', issue: 'Jun 20, 2025', expiry: 'Jun 20, 2026', id: 'IFOAM-2025-SP-004', status: 'ACTIVE' }
]

const mockPeopleStats = [
  { label: 'Total\nPeople', count: '1', color: 'text-white' },
  { label: 'Farmers', count: '1', color: 'text-[#10b981]' },
  { label: 'Processors', count: '0', color: 'text-purple-400' },
  { label: 'Distributors', count: '0', color: 'text-orange-400' },
  { label: 'Workers', count: '0', color: 'text-blue-400' }
]

// --- Subcomponents ---

function DimensionCard({ dim }: { dim: any }) {
  const getTextColor = (color: string) => {
    switch (color) {
      case 'emerald-500': return 'text-emerald-500';
      case 'purple-500': return 'text-purple-500';
      case 'orange-500': return 'text-orange-500';
      default: return 'text-white';
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
      case 'emerald-500': return 'bg-emerald-500';
      case 'purple-500': return 'bg-purple-500';
      case 'orange-500': return 'bg-orange-500';
      default: return 'bg-white';
    }
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 mb-4 shadow-sm text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("size-8 rounded-lg flex items-center justify-center bg-white/5", getTextColor(dim.color))}>
            <dim.icon className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight">{dim.category}</h3>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-0.5">DIMENSION</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-lg font-black tracking-tight", getTextColor(dim.color))}>{dim.score}</p>
          <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">SCORE</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-1 w-full bg-[#1a3824] rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full", getBgColor(dim.color))} 
            style={{ width: `${dim.score}%` }} 
          />
        </div>

        <div className="grid grid-cols-1 gap-2.5 pt-2">
          {dim.metrics.map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-white/70">{m.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white">{m.value}</span>
                {m.trend === 'up' && <TrendingUp className="size-3 text-[#10b981]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CertCard({ cert }: { cert: any }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 mb-4 relative overflow-hidden text-white shadow-sm">
      <ShieldCheck className="absolute -bottom-4 -right-4 size-24 text-white/5" />
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
             <h3 className="text-[11px] font-black uppercase tracking-tight">{cert.name}</h3>
             <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                <FileText className="size-2.5" />
                {cert.type}
             </p>
          </div>
          <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 text-[7px] font-black tracking-widest px-1.5 py-0">ACTIVE</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Calendar className="size-2.5 text-orange-400" />
              ISSUE
            </p>
            <p className="text-[9px] font-bold text-white">{cert.issue}</p>
          </div>
          <div>
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Clock className="size-2.5 text-orange-400" />
              EXPIRY
            </p>
            <p className="text-[9px] font-bold text-white">{cert.expiry}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mb-1">AUTHENTICATION ID</p>
            <p className="text-[9px] font-bold text-white/70">{cert.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function PassportPage() {
  const { id } = useParams()
  const [activeView, setActiveView] = useState('summary') 
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return (
    <div className="min-h-screen bg-[#050f08] text-white font-sans selection:bg-[#10b981]/20 pb-20 flex flex-col items-center !overflow-x-hidden">
      
      {/* Centered Main Container */}
      <div className="w-full max-w-[500px] px-5 pt-8 space-y-6 relative z-10">
        
        {/* Product Image Section */}
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0e1f14] border border-white/5 relative">
            <img 
              src="/assets/images/rice_burlap_sack.png" 
              alt="Rice" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050f08] via-transparent to-transparent opacity-80" />
            <h1 className="absolute bottom-4 left-5 text-2xl font-black text-white uppercase tracking-tighter">Rice</h1>
          </div>
        </div>
        
        {/* Impact Highlight Badge */}
        <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-4 flex items-center gap-4">
          <div className="size-10 rounded-lg bg-transparent flex items-center justify-center text-[#10b981] shrink-0 border border-[#10b981]/30">
            <Leaf className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[11px] font-bold text-[#10b981] uppercase tracking-wide">No Synthetic Materials</h3>
            <p className="text-[9px] text-[#10b981]/70 leading-tight">All recorded operations used organic or natural inputs</p>
          </div>
        </div>

        {/* Navigation Grid (3x2) */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'history', label: 'History', icon: Clock },
            { id: 'journey', label: 'Journey', icon: MapPin },
            { id: 'safa', label: 'Safa Assessment', icon: Activity },
            { id: 'quality', label: 'Quality', icon: ShieldCheck },
            { id: 'people', label: 'People', icon: Users },
            { id: 'summary', label: 'Summary', icon: FileText }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 text-center h-[85px]",
                activeView === item.id 
                  ? "bg-[#10b981] border-[#10b981] text-white shadow-lg shadow-[#10b981]/20 scale-100" 
                  : "bg-[#0e1f14] border-white/5 text-white/60 hover:border-[#10b981]/50 hover:text-white"
              )}
            >
              <item.icon className={cn("size-5", activeView === item.id ? "text-white" : "text-[#10b981]")} />
              <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-4 pt-2">
          
          {/* HISTORY (Timeline) */}
          {activeView === 'history' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-4">Product Journey</div>
               <div className="relative pl-6 space-y-8">
                  <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-[#1a3824]" />
                  {mockJourney.map((step, i) => (
                    <div key={i} className="relative group">
                       <div className="absolute -left-[28px] top-1 flex items-center justify-center size-[18px] rounded-full bg-[#0e1f14] border border-[#10b981] z-10">
                          <div className="size-2 rounded-full bg-[#10b981]" />
                       </div>
                       <div className="space-y-2.5">
                          <div className="flex flex-col gap-0.5">
                             <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{step.stage}</h4>
                                {step.isVerified && <BadgeCheck className="size-3 text-[#10b981]" />}
                             </div>
                             <p className="text-[10px] font-medium text-white/50">{step.date}</p>
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed">{step.details}</p>
                          
                          {step.extra && (
                            <div className="rounded-lg border border-white/5 bg-[#0e1f14] p-4 space-y-3 mt-2">
                               <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                  <BadgeCheck className="size-3 text-[#10b981]" />
                                  <span className="text-[9px] font-black text-[#10b981] uppercase tracking-widest">Verified Specs</span>
                               </div>
                               <div className="grid grid-cols-1 gap-2">
                                  <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Method:</span><span className="font-medium text-white/90">{step.extra.method}</span></div>
                                  <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Operator:</span><span className="font-medium text-white/90">{step.extra.operator}</span></div>
                                  <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Area:</span><span className="font-medium text-white/90">{step.extra.area}</span></div>
                               </div>
                            </div>
                          )}
                          
                          <button className="flex items-center gap-1.5 text-[9px] font-bold text-[#10b981] border border-[#10b981]/30 rounded-full px-3 py-1 hover:bg-[#10b981]/10 transition-colors mt-2">
                             <ExternalLink className="size-3" /> View On Blockchain <ChevronRight className="size-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SAFA ASSESSMENT */}
          {activeView === 'safa' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-6 flex flex-col gap-6 shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="relative size-20 shrink-0">
                       <svg className="size-full -rotate-90">
                          <circle className="text-[#1a3824]" strokeWidth="6" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" />
                          <circle className="text-[#10b981]" strokeWidth="6" strokeDasharray="226" strokeDashoffset="100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white">54</span>
                          <span className="text-[6px] font-bold text-white/50 uppercase tracking-widest mt-0.5">POINTS</span>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-white uppercase tracking-tight">SAFA PERFORMANCE</h3>
                          <Badge className="bg-[#1a3824] text-white/70 border-none text-[6px] px-1.5 py-0">FAO COMPLIANT</Badge>
                       </div>
                       <p className="text-[10px] text-white/60 leading-tight">
                          Sustainability Assessment verifies excellence across environmental, social, and economic indicators.
                       </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mb-0.5">GLOBAL STATUS</p>
                      <p className="text-sm font-black text-[#10b981] uppercase tracking-wide">EXCELLENT</p>
                    </div>
                    <div className="size-8 rounded-full bg-[#10b981] flex items-center justify-center text-[#050f08]">
                      <Info className="size-4" />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {mockSafa.map((dim, idx) => (
                    <DimensionCard key={idx} dim={dim} />
                  ))}
               </div>
            </div>
          )}

          {/* JOURNEY (Geographic Map) */}
          {activeView === 'journey' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex items-center justify-between px-1">
                 <h2 className="text-sm font-black text-white uppercase tracking-tight">Geographic Journey</h2>
                 <Info className="size-4 text-white/40" />
               </div>
               
               <div className="rounded-2xl border border-white/5 bg-[#0e1f14] overflow-hidden relative shadow-sm">
                  <div className="h-[350px] w-full relative">
                     <img 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                        alt="Map view" 
                        className="w-full h-full object-cover opacity-50 grayscale"
                        style={{ mixBlendMode: 'luminosity' }}
                     />
                     <div className="absolute inset-0 bg-[#050f08]/60" />
                     
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="size-2 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981]" />
                          <span className="text-xs font-bold text-white">Ibadan</span>
                        </div>
                     </div>
                     <div className="absolute top-1/3 left-1/3 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="size-1.5 rounded-full bg-[#10b981]/50" />
                          <span className="text-[10px] text-white/70">Olorisaoko</span>
                        </div>
                     </div>

                     <div className="absolute top-3 right-3">
                        <div className="size-8 bg-white text-black rounded shadow flex items-center justify-center">
                          <Maximize2 className="size-4" />
                        </div>
                     </div>
                     <div className="absolute bottom-3 right-3">
                        <div className="size-8 bg-white text-black rounded-full shadow flex items-center justify-center">
                          <Navigation className="size-4" />
                        </div>
                     </div>
                     
                     <div className="absolute bottom-3 left-3 text-white/50 text-xs font-bold flex gap-2">
                       Google <span className="text-[8px] bg-black/50 px-1 py-0.5 rounded">Keyboard shortcuts</span>
                     </div>
                  </div>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-4 flex items-center gap-4 shadow-sm">
                  <div className="size-10 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                     <MapPin className="size-5" />
                  </div>
                  <div>
                     <h4 className="text-xs font-black text-white uppercase tracking-tight">Baba Beji Farms</h4>
                     <p className="text-[10px] text-white/50">Farm</p>
                  </div>
               </div>
            </div>
          )}
          
          {/* QUALITY VIEW */}
          {activeView === 'quality' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                           <FileText className="size-4" />
                        </div>
                        <div>
                           <h2 className="text-[13px] font-black text-white uppercase tracking-tight">LAB VERIFICATIONS</h2>
                           <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">STANDARD ADHERENCE</p>
                        </div>
                     </div>
                     <Badge className="bg-[#1a3824] text-white/70 border-none text-[7px] px-2 py-0.5 tracking-widest">0 TESTS</Badge>
                  </div>
                  
                  <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 text-center shadow-sm">
                     <p className="text-[10px] text-white/40 italic">Standard procedural tests are in queue.</p>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                           <Award className="size-4" />
                        </div>
                        <div>
                           <h2 className="text-[13px] font-black text-white uppercase tracking-tight">CERTIFICATIONS</h2>
                           <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">OFFICIAL ACCREDITATIONS</p>
                        </div>
                     </div>
                     <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[7px] px-2 py-0.5 tracking-widest">6 ACTIVE</Badge>
                  </div>

                  <div className="space-y-3">
                     {mockCerts.map((cert, i) => (
                        <CertCard key={i} cert={cert} />
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* PEOPLE VIEW */}
          {activeView === 'people' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="text-center space-y-1.5 py-2">
                  <h2 className="text-[15px] font-black text-white uppercase tracking-tight">People Involved</h2>
                  <p className="text-white/60 text-[10px]">Everyone who contributed to this product's journey</p>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 flex items-center gap-4 shadow-sm">
                  <div className="size-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] border border-[#10b981]/20 shrink-0">
                     <Tractor className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-black text-white uppercase">Olamide Olutekunbi</h4>
                        <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-[8px] px-2 py-0">Farmer</Badge>
                     </div>
                     <p className="text-[10px] text-white/50">Baba Beji Farms</p>
                     <p className="text-[9px] text-white/40">Source farm details tracked via operations</p>
                  </div>
               </div>

               <div className="grid grid-cols-5 gap-2">
                  {mockPeopleStats.map((stat, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-[#0e1f14] py-4 px-1 text-center shadow-sm flex flex-col justify-center items-center h-[75px]">
                       <p className={cn("text-lg font-black mb-1", stat.color)}>{stat.count}</p>
                       <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest whitespace-pre-line text-center">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SUMMARY VIEW */}
          {activeView === 'summary' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
               
               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 shadow-sm relative overflow-hidden">
                 <Leaf className="absolute -right-4 -top-4 size-24 text-white/5" />
                 <p className="text-[11px] font-medium text-white/80 leading-relaxed relative z-10">
                    Grown by Olamide Olutekunbi in Nigeria using natural farming practices, this Rice batch represents a commitment to sustainable agriculture. With 13 total operations ensuring quality, this rice offers a traceable and responsibly grown grain for various culinary applications.
                 </p>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                     <div className="size-6 rounded bg-blue-500 flex items-center justify-center text-white shrink-0">
                        <Activity className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Nutrient Profile (Per 100g)</h3>
                  </div>

                  <div className="space-y-3">
                     <h4 className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">MACRONUTRIENTS</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Energy</span><span className="font-black text-white">360 <span className="text-[8px] text-white/40 font-normal">kcal</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Carbohydrate</span><span className="font-black text-white">80 <span className="text-[8px] text-white/40 font-normal">g</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Protein</span><span className="font-black text-white">7 <span className="text-[8px] text-white/40 font-normal">g</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Fat</span><span className="font-black text-white">1 <span className="text-[8px] text-white/40 font-normal">g</span></span></div>
                     </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                     <h4 className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">MICRONUTRIENTS</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Iron</span><span className="font-black text-white">1.2 <span className="text-[8px] text-white/40 font-normal">mg</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Magnesium</span><span className="font-black text-white">25 <span className="text-[8px] text-white/40 font-normal">mg</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Phosphorus</span><span className="font-black text-white">115 <span className="text-[8px] text-white/40 font-normal">mg</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Potassium</span><span className="font-black text-white">115 <span className="text-[8px] text-white/40 font-normal">mg</span></span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-white/60">Zinc</span><span className="font-black text-white">1 <span className="text-[8px] text-white/40 font-normal">mg</span></span></div>
                     </div>
                  </div>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="size-6 rounded bg-red-500 flex items-center justify-center text-white shrink-0">
                        <Heart className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Health & Wellness</h3>
                  </div>
                  <ul className="space-y-2 pl-2">
                     {["Good source of complex carbohydrates for sustained energy.",
                       "Provides essential minerals like iron, magnesium, phosphorus, and potassium.",
                       "Contributes to a balanced diet and supports overall well-being.",
                       "Naturally gluten-free."].map((text, i) => (
                        <li key={i} className="text-[10px] text-white/70 flex gap-2">
                          <span className="text-red-500 text-[12px] leading-none">•</span> {text}
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-5 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="size-6 rounded bg-[#10b981] flex items-center justify-center text-white shrink-0">
                        <Leaf className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Sustainability Practices</h3>
                  </div>
                  
                  <div className="space-y-4">
                     {[
                       { title: 'NATURAL FARMING', desc: 'Cultivated using natural practices, minimizing synthetic inputs.', icon: Leaf },
                       { title: 'SUSTAINABILITY SCORE', desc: 'Rated 54/100 for sustainable practices.', icon: ShieldCheck },
                       { title: 'REDUCED CHEMICAL USE', desc: 'Promotes soil health and biodiversity through reduced reliance on chemical fertilizers and pesticides.', icon: Sprout }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-3 items-start">
                         <item.icon className="size-3 text-[#10b981] mt-0.5 shrink-0" />
                         <div className="space-y-0.5">
                           <h4 className="text-[9px] font-bold text-[#10b981] uppercase tracking-widest">{item.title}</h4>
                           <p className="text-[10px] text-white/60 leading-tight">{item.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="size-6 rounded bg-orange-500 flex items-center justify-center text-white shrink-0">
                        <Users className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Community Impact</h3>
                  </div>
                  
                  <div className="rounded-lg bg-[#050f08] border border-white/5 p-4 flex items-center gap-4">
                     <div className="text-center shrink-0 border-r border-white/5 pr-4">
                       <p className="text-xl font-black text-orange-400 leading-none">1</p>
                       <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1">FARMERS</p>
                     </div>
                     <p className="text-[10px] text-white/80 leading-relaxed">
                       Supports the livelihood of Olamide Olutekunbi, a dedicated farmer committed to sustainable agriculture in Nigeria.
                     </p>
                  </div>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="size-6 rounded bg-purple-500 flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Traceability Assurance</h3>
                  </div>
                  <ul className="space-y-2 pl-2">
                     {[
                       "Single origin: Traceable to Olamide Olutekunbi's farm in Nigeria.",
                       "Quality control: Monitored through 13 total operations.",
                       "Natural practices: Grown without synthetic agrochemicals."
                     ].map((text, i) => (
                        <li key={i} className="text-[10px] text-white/70 flex gap-2">
                          <span className="text-purple-500 text-[12px] leading-none">•</span> {text}
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="rounded-xl border border-white/5 bg-[#0e1f14] p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="size-6 rounded bg-yellow-500 flex items-center justify-center text-white shrink-0">
                        <Lightbulb className="size-3" />
                     </div>
                     <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Significance</h3>
                  </div>
                  <p className="text-[10px] text-white/70 leading-relaxed">
                     Rice is a staple food crop in Nigeria, providing essential nutrition and supporting local food systems.
                  </p>
               </div>

            </div>
          )}

        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-5 z-50">
         <button className="size-12 rounded-full bg-[#1a3824] text-white shadow-lg border border-[#10b981]/20 flex items-center justify-center hover:bg-[#10b981] transition-colors">
            <MessageSquare className="size-5" />
         </button>
      </div>
      
      {/* Footer text matching screenshot */}
      <div className="py-12 text-center mt-10 w-full max-w-[500px] px-10">
         <p className="text-[6px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
            AGTRAIL SUSTAINABILITY STANDARD — AUDITED VIA<br/>BLOCKCHAIN TRACEABILITY
         </p>
      </div>

    </div>
  )
}
