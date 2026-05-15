import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  BadgeCheck,
  ExternalLink,
  FileText,
  Info,
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
  Navigation,
  Sparkles,
  Tractor,
  Lightbulb,
  Loader2,
  Send,
  X,
  Bot,
  User,
  ArrowRight
} from 'lucide-react'
import { useMemo, useState, lazy, Suspense, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { useGetPublicPassportProductId } from '~/lib/api/generated/public-traceability/public-traceability'
import type { PassportResponseData } from '~/lib/api/generated/models/passportResponseData'
import type { PassportOperation } from '~/lib/api/generated/models/passportOperation'
import type { PassportCertification } from '~/lib/api/generated/models/passportCertification'
import type { PassportStats } from '~/lib/api/generated/models/passportStats'

const PassportMap = lazy(() => import('~/components/passport-map.client').then(m => ({ default: m.PassportMap })))

// --- Helper: build SAFA dimensions from stats ---
function buildSafaDimensions(stats: PassportStats) {
  return [
    {
      category: 'ENVIRONMENTAL', score: stats.environmentalScore ?? 0, icon: Leaf, color: 'emerald-500',
      metrics: [
        { label: 'CO2 Equivalent (kg)', value: String(stats.co2Equivalent ?? 0) },
        { label: 'Water Used (L)', value: String(stats.litersUsed ?? 0) },
        { label: 'Organic Inputs %', value: String(stats.organicInputsPercentage ?? 0) },
      ]
    },
    {
      category: 'ECONOMIC', score: stats.economicScore ?? 0, icon: TrendingUp, color: 'emerald-500',
      metrics: [
        { label: 'Compliance Score', value: String(stats.complianceScore ?? 0) },
        { label: 'Quality Score', value: String(stats.qualityScore ?? 0) },
      ]
    },
    {
      category: 'SOCIAL', score: stats.socialScore ?? 0, icon: Users, color: 'purple-500',
      metrics: [
        { label: 'Operations Count', value: String(stats.operationsCount ?? 0) },
        { label: 'Quality Tests Passed', value: `${stats.qualityTestsPassed ?? 0}/${stats.qualityTestsCount ?? 0}` },
      ]
    },
    {
      category: 'GOVERNANCE', score: stats.governanceScore ?? 0, icon: ShieldCheck, color: 'orange-500',
      metrics: [
        { label: 'Certifications', value: String(stats.certifications ?? 0) },
        { label: 'Sustainability Score', value: String(stats.sustainabilityScore ?? 0) },
      ]
    },
  ]
}

// --- Main Page Component ---

export default function PassportPage() {
  const { id } = useParams()
  const [activeView, setActiveView] = useState('summary')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { data: response, isLoading, isError } = useGetPublicPassportProductId(id ?? '')

  // Extract the passport data safely
  const passport = useMemo<PassportResponseData | null>(() => {
    if (!response?.data) return null
    const raw = response.data as any
    // Handle { success, data: PassportResponseData } wrapper
    if (raw.data && typeof raw.data === 'object' && 'product' in raw.data) return raw.data as PassportResponseData
    if ('product' in raw) return raw as PassportResponseData
    return null
  }, [response])

  const product = passport?.product
  const farm = passport?.farm
  const farmer = passport?.farmer
  const operations = passport?.operations ?? []
  const certifications = passport?.certifications ?? []
  const qualityTests = passport?.qualityTests ?? []
  const transfers = passport?.transfers ?? []
  const stats = passport?.stats
  const syntheticSummary = passport?.syntheticSummary

  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0 && passport) {
      setIsTyping(true)
      setTimeout(() => {
        setChatMessages([
          {
            role: 'assistant',
            text: `Hello! I'm your AgTrail Assistant. I have the full verified history of this ${passport.product.name}. How can I help you today?`
          }
        ])
        setIsTyping(false)
      }, 1000)
    }
  }, [isChatOpen, passport, chatMessages.length])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    const userMsg = inputValue.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInputValue('')
    setIsTyping(true)

    // Simple "AI" response logic
    setTimeout(() => {
      let responseText = ""
      const msg = userMsg.toLowerCase()

      if (msg.includes('sustainable') || msg.includes('score') || msg.includes('point')) {
        responseText = `This product has a sustainability score of ${stats?.sustainabilityScore}/100. It performs particularly well in ${stats?.environmentalScore && stats.environmentalScore > 70 ? 'environmental impact' : 'compliance and quality'}.`
      } else if (msg.includes('farm') || msg.includes('where') || msg.includes('origin') || msg.includes('locate')) {
        responseText = `This ${passport?.product.name} was grown at ${farm?.name} in ${farm?.state}, Nigeria. You can see the exact coordinates on the Geographic Journey tab.`
      } else if (msg.includes('synthetic') || msg.includes('material') || msg.includes('chemical') || msg.includes('organic')) {
        responseText = syntheticSummary?.hasSynthetic
          ? `Records show ${syntheticSummary.count} operation(s) used synthetic materials (${syntheticSummary.types?.join(', ')}).`
          : "Great question! All recorded operations for this batch used 100% organic or natural inputs."
      } else if (msg.includes('hello') || msg.includes('hi')) {
        responseText = `Hi there! I can tell you all about this ${passport?.product.name}'s journey, its quality tests, or its sustainability metrics. What would you like to know?`
      } else {
        responseText = `I see you're interested in this ${passport?.product.name}. Based on the verified data, it has passed ${stats?.qualityTestsPassed} out of ${stats?.qualityTestsCount} quality tests and has ${certifications.length} active certifications.`
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: responseText }])
      setIsTyping(false)
    }, 1500)
  }

  const safaDimensions = useMemo(() => stats ? buildSafaDimensions(stats) : [], [stats])
  const overallScore = stats?.sustainabilityScore ?? 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050f08] flex items-center justify-center">
        <Loader2 className="size-8 text-[#10b981] animate-spin" />
      </div>
    )
  }

  if (isError || !passport) {
    return (
      <div className="min-h-screen bg-[#050f08] flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <ShieldCheck className="size-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Passport Not Found</h2>
          <p className="text-sm text-white/50">The product passport for this ID could not be loaded.</p>
        </div>
      </div>
    )
  }

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
      <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 mb-4 shadow-sm text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("size-8 rounded-md flex items-center justify-center bg-white/5", getTextColor(dim.color))}>
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
      <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 mb-4 relative overflow-hidden text-white shadow-sm">
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

  // --- Render ---

  const productName = product?.name ?? 'Product'
  const productImage = product?.imageUrl ?? '/assets/images/rice_burlap_sack.png'
  const hasSynthetic = syntheticSummary?.hasSynthetic ?? false

  return (
    <div className="min-h-screen bg-[#050f08] text-white font-sans selection:bg-[#10b981]/20 pb-20 flex flex-col items-center overflow-x-hidden!">

      {/* Centered Main Container */}
      <div className="w-full max-w-[500px] px-5 pt-8 space-y-6 relative z-10">

        {/* Product Image Section */}
        <div className="relative">
          <div className="aspect-4/3 rounded-md overflow-hidden bg-[#0e1f14] border border-white/5 relative">
            <img
              src={passport?.product?.imageUrl || product?.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop'}
              alt={productName}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050f08] via-transparent to-transparent opacity-80" />
            <h1 className="absolute bottom-4 left-5 text-2xl font-black text-white uppercase tracking-tighter">{productName}</h1>
          </div>
        </div>

        {/* Impact Highlight Badge */}
        <div className="rounded-md border border-white/5 bg-[#0e1f14] p-4 flex items-center gap-4">
          <div className="size-10 rounded-md bg-transparent flex items-center justify-center text-[#10b981] shrink-0 border border-[#10b981]/30">
            <Leaf className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[11px] font-bold text-[#10b981] uppercase tracking-wide">
              {hasSynthetic ? 'Synthetic Materials Detected' : 'No Synthetic Materials'}
            </h3>
            <p className="text-[9px] text-[#10b981]/70 leading-tight">
              {hasSynthetic
                ? `${syntheticSummary?.count ?? 0} operation(s) used synthetic inputs: ${syntheticSummary?.types?.join(', ') ?? ''}`
                : 'All recorded operations used organic or natural inputs'}
            </p>
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
                "flex flex-col items-center justify-center p-4 rounded-md border transition-all duration-300 gap-2 text-center h-[85px]",
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
              {operations.length === 0 ? (
                <p className="text-[10px] text-white/40 italic text-center py-8">No operations recorded yet.</p>
              ) : (
                <div className="relative pl-6 space-y-8">
                  <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#1a3824]" />
                  {operations.map((op, i) => {
                    const materials = (op as any).materialsUsed as any[] | null
                    const operator = op.personnelResponsible || (op as any).operatorName
                    const area = (op as any).areaCovered ? `${(op as any).areaCovered} ${(op as any).areaUnit ?? ''}` : null
                    const quality = (op as any).qualityAssessment as any

                    return (
                      <div key={op.id ?? i} className="relative group">
                        <div className="absolute -left-[28px] top-1 flex items-center justify-center size-[18px] rounded-full bg-[#0e1f14] border border-[#10b981] z-10">
                          <div className="size-2 rounded-full bg-[#10b981]" />
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white uppercase tracking-tight">{op.operationType}</h4>
                              <BadgeCheck className="size-3 text-[#10b981]" />
                            </div>
                            <p className="text-[10px] font-medium text-white/50">
                              {new Date(op.operationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {farm?.name ? ` — ${farm.name}` : ''}
                            </p>
                          </div>
                          <p className="text-[10px] text-white/70 leading-relaxed">{op.description}</p>

                          {(operator || op.equipmentUsed?.length || op.weatherConditions || materials?.length || area || quality) && (
                            <div className="rounded-md border border-white/5 bg-[#0e1f14] p-4 space-y-3 mt-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                <BadgeCheck className="size-3 text-[#10b981]" />
                                <span className="text-[9px] font-black text-[#10b981] uppercase tracking-widest">Verified Specs</span>
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {operator && <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Operator:</span><span className="font-medium text-white/90">{operator}</span></div>}
                                {area && <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Area:</span><span className="font-medium text-white/90">{area}</span></div>}
                                {op.equipmentUsed?.length ? <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Equipment:</span><span className="font-medium text-white/90">{op.equipmentUsed.join(', ')}</span></div> : null}
                                {materials?.length ? (
                                  <div className="flex items-start gap-4 text-[10px]">
                                    <span className="text-white/40 w-16">Materials:</span>
                                    <div className="flex-1 space-y-1">
                                      {materials.map((m, mi) => (
                                        <div key={mi} className="text-white/90 font-medium">
                                          {m.name} ({m.quantity} {m.unit})
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                                {quality && (
                                  <div className="flex items-start gap-4 text-[10px]">
                                    <span className="text-white/40 w-16">Quality:</span>
                                    <div className="flex-1 space-y-1">
                                      {quality.grade && <div className="text-white/90 font-medium">Grade: {quality.grade}</div>}
                                      {quality.moisture_content && <div className="text-white/90 font-medium">Moisture: {quality.moisture_content}</div>}
                                      {quality.notes && <div className="text-white/70 italic text-[9px]">{quality.notes}</div>}
                                    </div>
                                  </div>
                                )}
                                {op.weatherConditions && <div className="flex items-center gap-4 text-[10px]"><span className="text-white/40 w-16">Weather:</span><span className="font-medium text-white/90">{op.weatherConditions}</span></div>}
                              </div>
                            </div>
                          )}

                          <a
                            href={(op as any).blockchainTxHash ? `https://stellar.expert/explorer/tx/${(op as any).blockchainTxHash}` : "https://stellar.expert/explorer/testnet/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[9px] font-bold text-[#10b981] border border-[#10b981]/30 rounded-full px-3 py-1 hover:bg-[#10b981]/10 transition-colors mt-2"
                          >
                            <ExternalLink className="size-3" /> View On Blockchain <ChevronRight className="size-3" />
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* SAFA ASSESSMENT */}
          {activeView === 'safa' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-6 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="relative size-20 shrink-0">
                    <svg className="size-full -rotate-90">
                      <circle className="text-[#1a3824]" strokeWidth="6" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" />
                      <circle className="text-[#10b981]" strokeWidth="6" strokeDasharray="226" strokeDashoffset="100" strokeLinecap="round" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white">{overallScore}</span>
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
                    <p className="text-sm font-black text-[#10b981] uppercase tracking-wide">{overallScore >= 70 ? 'EXCELLENT' : overallScore >= 40 ? 'GOOD' : 'NEEDS IMPROVEMENT'}</p>
                  </div>
                  <div className="size-8 rounded-full bg-[#10b981] flex items-center justify-center text-[#050f08]">
                    <Info className="size-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {safaDimensions.map((dim, idx) => (
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

              <div className="rounded-md border border-white/5 bg-[#0e1f14] overflow-hidden relative shadow-sm">
                <div className="h-[350px] w-full relative">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-[#050f08]/60">
                      <Loader2 className="size-6 text-[#10b981] animate-spin" />
                    </div>
                  }>
                    <PassportMap
                      gpsCoordinates={farm?.gpsCoordinates}
                      boundaries={farm?.boundaries}
                      farmName={farm?.name ?? undefined}
                      farmLocation={farm?.state ?? farm?.lga ?? undefined}
                    />
                  </Suspense>
                </div>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-4 flex items-center gap-4 shadow-sm">
                <div className="size-10 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight">{farm?.name ?? 'Farm'}</h4>
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
                    <div className="size-8 rounded-md bg-purple-500 flex items-center justify-center text-white">
                      <FileText className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-black text-white uppercase tracking-tight">LAB VERIFICATIONS</h2>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">STANDARD ADHERENCE</p>
                    </div>
                  </div>
                  <Badge className="bg-[#1a3824] text-white/70 border-none text-[7px] px-2 py-0.5 tracking-widest">{qualityTests.length} TESTS</Badge>
                </div>

                <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 shadow-sm">
                  {qualityTests.length === 0 ? (
                    <p className="text-[10px] text-white/40 italic text-center">Standard procedural tests are in queue.</p>
                  ) : (
                    <div className="space-y-3">
                      {qualityTests.map((t, i) => (
                        <div key={t.id ?? i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-[10px] font-bold text-white">{t.testName}</p>
                            <p className="text-[8px] text-white/40">{t.testType} — {t.laboratoryName ?? 'Lab'}</p>
                          </div>
                          <Badge className={cn('text-[7px] px-1.5 py-0', t.passFailStatus ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-red-500/10 text-red-400 border-red-500/30')}>
                            {t.passFailStatus ? 'PASS' : 'FAIL'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-md bg-orange-500 flex items-center justify-center text-white">
                      <Award className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-black text-white uppercase tracking-tight">CERTIFICATIONS</h2>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">OFFICIAL ACCREDITATIONS</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[7px] px-2 py-0.5 tracking-widest">{certifications.length} ACTIVE</Badge>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <CertCard key={cert.id ?? i} cert={{
                      name: cert.certificationTypeName,
                      type: cert.issuingBody ?? '',
                      issue: new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      expiry: cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
                      id: cert.certificateNumber,
                      status: cert.status,
                    }} />
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

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 flex items-center gap-4 shadow-sm">
                <div className="size-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] border border-[#10b981]/20 shrink-0">
                  <Tractor className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[12px] font-black text-white uppercase">{farmer?.name ?? 'Unknown Farmer'}</h4>
                    <Badge className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-[8px] px-2 py-0">Farmer</Badge>
                  </div>
                  <p className="text-[10px] text-white/50">{farm?.name ?? 'Farm'}</p>
                  <p className="text-[9px] text-white/40">Source farm details tracked via operations</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: 'Total\nPeople', count: farmer ? '1' : '0', color: 'text-white' },
                  { label: 'Farmers', count: farmer ? '1' : '0', color: 'text-[#10b981]' },
                  { label: 'Processors', count: String(transfers.filter(t => t.toUserName).length), color: 'text-purple-400' },
                  { label: 'Operations', count: String(stats?.operationsCount ?? 0), color: 'text-orange-400' },
                  { label: 'Transfers', count: String(transfers.length), color: 'text-blue-400' }
                ].map((stat, i) => (
                  <div key={i} className="rounded-md border border-white/5 bg-[#0e1f14] py-4 px-1 text-center shadow-sm flex flex-col justify-center items-center h-[75px]">
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

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 shadow-sm relative overflow-hidden">
                <Leaf className="absolute -right-4 -top-4 size-24 text-white/5" />
                <p className="text-[11px] font-medium text-white/80 leading-relaxed relative z-10">
                  {typeof product?.aiSummary === 'string' && product.aiSummary
                    ? product.aiSummary
                    : `Grown by ${farmer?.name ?? 'a local farmer'} at ${farm?.name ?? 'their farm'} in ${farm?.address || `${farm?.lga || ''}, ${farm?.state || 'Nigeria'}`}. Using ${stats?.isOrganic ? 'organic' : 'conventional'} farming practices, this ${productName} batch represents a commitment to sustainable agriculture. With ${stats?.operationsCount ?? 0} total operations ensuring quality, this product offers a traceable and responsibly grown commodity.`}
                </p>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <div className="size-6 rounded bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <Activity className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Product Stats</h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">KEY METRICS</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Sustainability Score</span><span className="font-black text-white">{stats?.sustainabilityScore ?? 0} <span className="text-[8px] text-white/40 font-normal">/ 100</span></span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Operations</span><span className="font-black text-white">{stats?.operationsCount ?? 0}</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Quality Score</span><span className="font-black text-white">{stats?.qualityScore ?? 0} <span className="text-[8px] text-white/40 font-normal">/ 100</span></span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Organic</span><span className="font-black text-white">{stats?.isOrganic ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <h4 className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">ENVIRONMENTAL</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">CO₂ Equivalent</span><span className="font-black text-white">{stats?.co2Equivalent ?? 0} <span className="text-[8px] text-white/40 font-normal">kg</span></span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Water Used</span><span className="font-black text-white">{stats?.litersUsed ?? 0} <span className="text-[8px] text-white/40 font-normal">L</span></span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-white/60">Compliance</span><span className="font-black text-white">{stats?.complianceScore ?? 0} <span className="text-[8px] text-white/40 font-normal">/ 100</span></span></div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded bg-red-500 flex items-center justify-center text-white shrink-0">
                    <Heart className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Health & Wellness</h3>
                </div>
                <ul className="space-y-2 pl-2">
                  {[
                    `${stats?.qualityTestsPassed ?? 0} out of ${stats?.qualityTestsCount ?? 0} quality tests passed.`,
                    `${stats?.certifications ?? 0} active certification(s).`,
                    stats?.isOrganic ? 'Produced using organic practices.' : 'Conventional farming methods applied.',
                    `Sustainability score: ${stats?.sustainabilityScore ?? 0}/100.`
                  ].map((text, i) => (
                    <li key={i} className="text-[10px] text-white/70 flex gap-2">
                      <span className="text-red-500 text-[12px] leading-none">•</span> {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded bg-[#10b981] flex items-center justify-center text-white shrink-0">
                    <Leaf className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Sustainability Practices</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { title: stats?.isOrganic ? 'ORGANIC FARMING' : 'CONVENTIONAL FARMING', desc: stats?.isOrganic ? 'Cultivated using organic practices, minimizing synthetic inputs.' : 'Conventional farming methods with tracked inputs.', icon: Leaf },
                    { title: 'SUSTAINABILITY SCORE', desc: `Rated ${stats?.sustainabilityScore ?? 0}/100 for sustainable practices.`, icon: ShieldCheck },
                    { title: hasSynthetic ? 'SYNTHETIC INPUTS DETECTED' : 'REDUCED CHEMICAL USE', desc: hasSynthetic ? `${syntheticSummary?.count ?? 0} operations used synthetic materials.` : 'Promotes soil health and biodiversity through reduced reliance on chemical fertilizers and pesticides.', icon: Sprout }
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

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-6 rounded bg-orange-500 flex items-center justify-center text-white shrink-0">
                    <Users className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Community Impact</h3>
                </div>

                <div className="rounded-md bg-[#050f08] border border-white/5 p-4 flex items-center gap-4">
                  <div className="text-center shrink-0 border-r border-white/5 pr-4">
                    <p className="text-xl font-black text-orange-400 leading-none">{farmer ? '1' : '0'}</p>
                    <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1">FARMERS</p>
                  </div>
                  <p className="text-[10px] text-white/80 leading-relaxed">
                    {farmer?.name ? `Supports the livelihood of ${farmer.name}, a dedicated farmer committed to sustainable agriculture in ${farm?.state ?? 'Nigeria'}.` : 'Farmer information not available.'}
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded bg-purple-500 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Traceability Assurance</h3>
                </div>
                <ul className="space-y-2 pl-2">
                  {[
                    `Single origin: Traceable to ${farmer?.name ?? 'farmer'}'s farm in ${farm?.state ?? 'Nigeria'}.`,
                    `Quality control: Monitored through ${stats?.operationsCount ?? 0} total operations.`,
                    stats?.isOrganic ? 'Organic practices: Grown without synthetic agrochemicals.' : 'Conventional practices with tracked inputs.'
                  ].map((text, i) => (
                    <li key={i} className="text-[10px] text-white/70 flex gap-2">
                      <span className="text-purple-500 text-[12px] leading-none">•</span> {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-white/5 bg-[#0e1f14] p-5 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded bg-yellow-500 flex items-center justify-center text-white shrink-0">
                    <Lightbulb className="size-3" />
                  </div>
                  <h3 className="text-[12px] font-black text-white uppercase tracking-tight">Significance</h3>
                </div>
                <p className="text-[10px] text-white/70 leading-relaxed">
                  {productName} is a tracked agricultural product, providing full supply chain transparency from farm to consumer.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Floating Action Assistant */}
      <div className="fixed bottom-8 right-5 z-50 flex flex-col items-end gap-4">
        {/* Chat Window */}
        {isChatOpen && (
          <div className="w-[320px] sm:w-[380px] h-[500px] bg-[#050f08] border border-white/10 rounded-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="p-4 bg-[#0e1f14] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                  <Bot className="size-4" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight">AgTrail Assistant</h4>
                  <div className="flex items-center gap-1">
                    <div className="size-1 rounded-full bg-[#10b981] animate-pulse" />
                    <span className="text-[8px] font-bold text-[#10b981]/70 uppercase tracking-widest">Always Verified</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-md hover:bg-white/5 transition-colors text-white/40"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "size-6 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'assistant' ? "bg-[#10b981]/10 text-[#10b981]" : "bg-white/10 text-white"
                  )}>
                    {msg.role === 'assistant' ? <Bot className="size-3" /> : <User className="size-3" />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-md text-[11px] leading-relaxed max-w-[80%]",
                    msg.role === 'assistant' ? "bg-white/5 text-white/90 rounded-tl-none" : "bg-[#10b981] text-white rounded-tr-none font-medium"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="size-6 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center shrink-0">
                    <Bot className="size-3" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-md rounded-tl-none flex gap-1">
                    <div className="size-1 rounded-full bg-white/40 animate-bounce" />
                    <div className="size-1 rounded-full bg-white/40 animate-bounce delay-75" />
                    <div className="size-1 rounded-full bg-white/40 animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0e1f14]/50 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about this product..."
                  className="w-full bg-white/5 border border-white/10 rounded-md py-2.5 pl-4 pr-12 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#10b981]/50 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-1.5 top-1.5 size-7 bg-[#10b981] rounded-md flex items-center justify-center text-white shadow-lg hover:bg-[#0da371] transition-colors"
                >
                  <Send className="size-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">Verified Product Intelligence</p>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "size-14 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-300 group relative overflow-hidden",
            isChatOpen
              ? "bg-white text-black border-white rotate-90"
              : "bg-[#1a3824] text-white border-[#10b981]/20 hover:scale-110 active:scale-95"
          )}
        >
          {isChatOpen ? <X className="size-6" /> : <MessageSquare className="size-6 group-hover:scale-110 transition-transform" />}
          {!isChatOpen && (
            <div className="absolute inset-0 bg-linear-to-tr from-[#10b981]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>

      {/* Footer text matching screenshot */}
      <div className="py-12 text-center mt-10 w-full max-w-[500px] px-10">
        <p className="text-[6px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
          AGTRAIL SUSTAINABILITY STANDARD — AUDITED VIA<br />BLOCKCHAIN TRACEABILITY
        </p>
      </div>

    </div>
  )
}
