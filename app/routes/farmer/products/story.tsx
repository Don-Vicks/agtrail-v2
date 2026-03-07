import { useParams } from 'react-router'
import { Breadcrumb } from '~/components/breadcrumb'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { products } from '~/lib/mock-data/farmer'

/* ─── Deterministic QR-like SVG seeded from a string ─── */
function QRCode({ seed, className }: { seed: string; className?: string }) {
  const hash = Array.from(seed).reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const S = 9
  const cells: boolean[][] = []
  for (let r = 0; r < S; r++) {
    const row: boolean[] = []
    for (let c = 0; c < S; c++) {
      const tl = r < 3 && c < 3
      const tr = r < 3 && c >= S - 3
      const bl = r >= S - 3 && c < 3
      const ctr = r === 4 && c === 4
      row.push(tl || tr || bl || ctr || ((hash * (r + 2) * (c + 3) + r * 7 + c * 13) % 5 < 2))
    }
    cells.push(row)
  }
  return (
    <svg viewBox={`0 0 ${S + 2} ${S + 2}`} className={className ?? 'w-full h-full'} shapeRendering="crispEdges">
      <rect width={S + 2} height={S + 2} fill="white" />
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={1} height={1} fill="#1a1a1a" /> : null
        )
      )}
    </svg>
  )
}

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 140, label }: { score: number; size?: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex flex-col items-center justify-center`} style={{ width: size, height: size }}>
        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="text-[#2E5A27]" strokeWidth="3" strokeDasharray={`${score}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
        </svg>
        <span className="font-extrabold text-[32px] text-gray-900 relative leading-none mb-0.5">{score}</span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider relative">Score</span>
      </div>
      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">{label} <span className="inline-block size-3.5 rounded-full border border-gray-300 text-gray-400 text-[8px] flex items-center justify-center">?</span></p>
    </div>
  )
}

/* ─── Stat Card (top-right grid) ─── */
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm text-center flex flex-col items-center justify-center">
      <div className="mb-2 text-[#2E5A27]">{icon}</div>
      <div className="text-[28px] font-extrabold text-gray-900 leading-none mb-1">{value}</div>
      <div className="text-[11px] font-medium text-gray-500 tracking-wide">{label}</div>
    </div>
  )
}

/* ─── Performance Category Card (Impact tab) ─── */
function PerformanceCard({ icon, title, score, rating, color, description }: {
  icon: React.ReactNode; title: string; score: number; rating: string; color: string; description: string
}) {
  const ratingColor = rating === 'Excellent' ? 'text-green-600' : rating === 'Good' ? 'text-blue-600' : 'text-orange-500'
  const barColor = rating === 'Excellent' ? 'bg-green-500' : rating === 'Good' ? 'bg-blue-500' : 'bg-orange-400'
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#2E5A27]">{icon}</span>
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        </div>
        <span className="size-4 rounded-full border border-gray-300 text-gray-400 text-[8px] flex items-center justify-center">?</span>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-3">{score} <span className="text-sm font-medium text-gray-500">Score</span></p>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-500">Performance Score</span>
        <span className={`font-bold ${ratingColor}`}>{rating}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 mb-3">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-[11px] text-gray-400">{description}</p>
    </div>
  )
}

/* ─── Page ─── */
export default function ProductStory() {
  const { id } = useParams()
  const product = products.find(p => p.id === id) || products[0]

  // Mock data for people tab
  const people = [
    { name: 'Agrolinking Administrator', farm: 'IITA FCI4Afric Farm', description: 'Source farm details tracked via operations', role: 'Farmer', color: '#2E5A27' },
    { name: 'Fashola', operations: '4 operations: harvesting, fertilizing, planting, land_preparation', date: 'February 13th, 2026', role: 'Operator', color: '#6B7280' },
    { name: 'Olamide', operations: '3 operations: harvesting, planting, land_preparation', date: 'February 13th, 2026', role: 'Supervisor', color: '#2E5A27' },
    { name: 'Fashola', operations: '1 operations: fertilizing', date: 'February 13th, 2026', role: 'Supervisor', color: '#2E5A27' },
  ]

  // Mock certifications
  const certifications = [
    { name: 'rainforest', date: 'February 20th, 2026', expires: 'February 25th, 2026', status: 'Active' },
    { name: 'global_gap', date: 'February 11th, 2026', expires: 'February 24th, 2026', status: 'Active' },
    { name: 'food_safety', date: 'December 22nd, 2025', expires: '', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Products', href: '/farmer/products' },
          { label: 'Product Details' },
        ]}
      />

      {/* ── Top Section: QR + Info (left) | Stats Grid (right) ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: QR + Product Info */}
        <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="w-[200px] h-[200px] mx-auto sm:mx-0 rounded-lg border border-gray-200 p-2 bg-white mb-6">
            <QRCode seed={product.batchId} />
          </div>

          <h1 className="text-[28px] font-extrabold text-[#2E5A27] mb-1 leading-none">{product.name.toUpperCase()}</h1>
          <p className="text-xs text-gray-500 font-medium mb-4 tracking-wide">{product.batchId}</p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="size-4 text-[#2E5A27]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span>Planted: <span className="font-semibold text-gray-700">{product.plantedDate || 'Not set'}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 gap-2 rounded-lg h-11 shadow-none text-[13px] font-bold">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              QR Code
            </Button>
            <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 gap-2 rounded-lg h-11 shadow-none text-[13px] font-bold">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </Button>
            <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 gap-2 rounded-lg h-11 shadow-none text-[13px] font-bold">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share
            </Button>
          </div>
        </div>

        {/* Right: Stats Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4 lg:w-[340px] flex-shrink-0">
          <StatCard
            icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            value={product.metrics.sustainabilityScore}
            label="Sustainability Score"
          />
          <StatCard
            icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            value={product.metrics.carbonEquivalents}
            label="kg CO₂ eq"
          />
          <StatCard
            icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
            value={product.metrics.litersUsed}
            label="Liters Used"
          />
          <StatCard
            icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
            value={product.metrics.certifications}
            label="Certifications"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="journey" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-gray-100 border border-gray-200 p-1 rounded-lg h-auto grid grid-cols-4 w-full max-w-[500px]">
            <TabsTrigger value="journey" className="py-2.5 text-[13px] font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all">Journey</TabsTrigger>
            <TabsTrigger value="impact" className="py-2.5 text-[13px] font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all">Impact</TabsTrigger>
            <TabsTrigger value="quality" className="py-2.5 text-[13px] font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all">Quality</TabsTrigger>
            <TabsTrigger value="people" className="py-2.5 text-[13px] font-semibold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-md transition-all">People</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Journey Tab ── */}
        <TabsContent value="journey" className="m-0 border-none p-0 outline-none">
          <div className="max-w-3xl mx-auto space-y-4">
            {product.journey.map((node, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Header row */}
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="flex items-center gap-3">
                    <span className="inline-block rounded bg-[#2E5A27] px-2.5 py-1 text-[10px] font-bold text-white tracking-wide">Farm</span>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{node.title}</h4>
                      <p className="text-xs text-gray-500">{node.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Date</p>
                    <p className="text-sm font-bold text-gray-900">{node.date}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mt-1">Time</p>
                    <p className="text-sm font-bold text-gray-900">{node.time}</p>
                  </div>
                </div>

                {/* Verification icon */}
                <div className="px-5 py-2">
                  <div className="size-7 rounded-full bg-[#2E5A27] flex items-center justify-center">
                    <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 pb-5">
                  <p className="text-sm font-bold text-gray-900 mb-2">Details</p>
                  <div className="space-y-1">
                    {node.details.map((detail, j) => (
                      <p key={j} className="text-[13px] text-gray-600">
                        <span className="font-bold text-gray-800">{detail.label}:</span> {detail.value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Impact Tab ── */}
        <TabsContent value="impact" className="m-0 border-none p-0 outline-none">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* SAFA Header */}
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 mb-1">SAFA Sustainability Assessment</h2>
              <p className="text-sm text-gray-500">Comprehensive sustainability evaluation across four key dimensions</p>
            </div>

            {/* Large Ring */}
            <div className="flex justify-center py-4">
              <ScoreRing score={product.metrics.sustainabilityScore} size={180} label="" />
            </div>

            <p className="text-center text-xs text-gray-400 mb-4">
              Weighted across Environmental (40%), Economic (25%), Social (25%), Governance (10%) <span className="inline-block size-3.5 rounded-full border border-gray-300 text-[8px]">?</span>
            </p>

            {/* 4 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PerformanceCard
                icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                title="Environmental"
                score={60}
                rating="Good"
                color="blue"
                description="Carbon, water, biodiversity, and soil health"
              />
              <PerformanceCard
                icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
                title="Economic"
                score={90}
                rating="Excellent"
                color="green"
                description="Profitability, market access, and cost efficiency"
              />
              <PerformanceCard
                icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                title="Social"
                score={30}
                rating="Needs Improvement"
                color="orange"
                description="Labor conditions, community impact, and fair trade"
              />
              <PerformanceCard
                icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                title="Governance"
                score={100}
                rating="Excellent"
                color="green"
                description="Transparency, accountability, and compliance"
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Quality Tab ── */}
        <TabsContent value="quality" className="m-0 border-none p-0 outline-none">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Score Rings */}
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm flex flex-col items-center text-center">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Quality & Compliance</h3>
              <p className="text-xs text-gray-500 mb-8">Safety standards and regulatory compliance status</p>
              <div className="flex items-center justify-center gap-16 md:gap-24 mb-4">
                <ScoreRing score={product.metrics.qualityScore} label="Quality Score" />
                <ScoreRing score={product.metrics.complianceRate} label="Compliance Rate" />
              </div>
              <p className="text-[11px] text-gray-400 mt-4">Based on quality test results and certification status</p>
            </div>

            {/* Quality Test Results */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-2.5 border-b border-gray-100">
                <svg className="size-5 text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                <h4 className="font-bold text-base text-gray-900">Quality Test Results</h4>
              </div>
              <div className="p-6">
                {product.tests.length > 0 ? (
                  <div className="space-y-3">
                    {product.tests.map((test, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-1 rounded-full bg-[#E8F5E9] text-[#2E5A27]">
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{test.title}</p>
                            <p className="text-xs text-gray-500">{test.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 font-medium">No quality tests recorded yet</p>
                    <p className="text-xs text-gray-400 mt-1">Quality tests will appear here once they are conducted</p>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-2.5 border-b border-gray-100">
                <svg className="size-5 text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                <h4 className="font-bold text-base text-gray-900">Certifications</h4>
              </div>
              <div className="divide-y divide-gray-100">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 rounded-full bg-[#E8F5E9] text-[#2E5A27]">
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-500">• {cert.date}</p>
                        {cert.expires && <p className="text-xs text-gray-400">Expires: {cert.expires}</p>}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-600">{cert.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── People Tab ── */}
        <TabsContent value="people" className="m-0 border-none p-0 outline-none">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900 mb-1">People Involved</h2>
              <p className="text-sm text-gray-500">Everyone who contributed to this product's journey</p>
            </div>

            {/* People List */}
            <div className="space-y-3">
              {people.map((person, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-4">
                  <div className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: person.color }}>
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900">{person.name}</h4>
                    {person.farm && <p className="text-xs text-gray-500">{person.farm}</p>}
                    {person.description && <p className="text-xs text-gray-400">{person.description}</p>}
                    {person.operations && <p className="text-xs text-gray-500">{person.operations}</p>}
                    {person.date && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {person.date}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded flex-shrink-0 ${person.role === 'Farmer' ? 'text-[#2E5A27] bg-green-50' :
                      person.role === 'Operator' ? 'text-gray-600 bg-gray-100' :
                        'text-[#2E5A27] bg-green-50'
                    }`}>{person.role}</span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { value: 4, label: 'Total People', color: 'border-gray-200' },
                { value: 1, label: 'Farmers', color: 'border-green-200' },
                { value: 0, label: 'Processors', color: 'border-green-200' },
                { value: 0, label: 'Distributors', color: 'border-green-200' },
                { value: 3, label: 'Workers', color: 'border-green-200' },
              ].map((stat, i) => (
                <div key={i} className={`rounded-xl border-2 ${stat.color} bg-white p-4 text-center`}>
                  <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
