import { useParams } from 'react-router'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { products } from '~/lib/mock-data/farmer'

function StatCard({ icon, value, label, subtext }: { icon: React.ReactNode, value: number | string, label: string, subtext?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center flex flex-col items-center justify-center h-full">
      <div className="mb-2.5 text-[#2E5A27]">
        {icon}
      </div>
      <div className="text-[28px] font-extrabold text-gray-900 mb-1 leading-none">{value}</div>
      <div className="text-[11px] font-bold text-gray-500 tracking-wide uppercase">{label}</div>
      {subtext && <div className="text-[10px] text-gray-400 mt-1">{subtext}</div>}
    </div>
  )
}

export default function ProductStory() {
  const { id } = useParams()
  const product = products.find(p => p.id === id) || products[0]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Card Area */}
        <div className="flex flex-col gap-6 mb-8 max-w-4xl mx-auto">
          {/* Image & Header Card */}
          <div className="flex-1 rounded-xl border border-gray-100 bg-white p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col gap-8">
            <div className="h-64 md:h-80 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center relative shrink-0">
              <span className="text-[13px] font-bold tracking-widest text-gray-400 uppercase">{product.image} IMAGE</span>
            </div>

            <div className="flex-1 flex flex-col pt-1">
              <h1 className="text-[32px] font-extrabold text-[#2E5A27] mb-2 leading-none">{product.name.toUpperCase()}</h1>
              <p className="text-[11px] text-[#2E5A27]/80 font-bold mb-8 tracking-widest uppercase">{product.batchId}</p>

              <div className="space-y-4 flex-1 mb-8">
                <div className="flex items-center gap-3.5 text-[14px] font-medium text-gray-600">
                  <svg className="size-5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
                  <span className="truncate">{product.location}</span>
                </div>
                <div className="flex items-center gap-3.5 text-[14px] font-medium text-gray-600">
                  <svg className="size-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  <span>Planted: <span className="text-gray-900 font-bold">{product.plantedDate}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 relative gap-2 rounded-lg h-12 shadow-none text-[13px] font-bold">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  QR Code
                </Button>
                <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 relative gap-2 rounded-lg h-12 shadow-none text-[13px] font-bold">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </Button>
                <Button className="bg-[#2E5A27] hover:bg-[#20401b] text-white flex-1 relative gap-2 rounded-lg h-12 shadow-none text-[13px] font-bold">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-[#2E5A27] mb-4 ml-1">Statistics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                value={product.metrics.sustainabilityScore}
                label="Sustainability Score"
              />
              <StatCard
                icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" /></svg>}
                value={product.metrics.carbonEquivalents.toFixed(1)}
                label="kg CO₂ eq"
              />
              <StatCard
                icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                value={product.metrics.litersUsed}
                label="Liters Used"
              />
              <StatCard
                icon={<svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                value={product.metrics.certifications}
                label="Certifications"
              />
            </div>
          </div>

          {/* Bottom Tabs Area */}
          <Tabs defaultValue="journey" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#EAECE6] p-1 rounded-lg h-auto grid grid-cols-4 w-full max-w-[500px]">
                <TabsTrigger value="journey" className="py-2.5 text-[13px] font-bold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#2E5A27] data-[state=active]:shadow-sm rounded-md transition-all">Journey</TabsTrigger>
                <TabsTrigger value="impact" className="py-2.5 text-[13px] font-bold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#2E5A27] data-[state=active]:shadow-sm rounded-md transition-all">Impact</TabsTrigger>
                <TabsTrigger value="quality" className="py-2.5 text-[13px] font-bold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#2E5A27] data-[state=active]:shadow-sm rounded-md transition-all">Quality</TabsTrigger>
                <TabsTrigger value="people" className="py-2.5 text-[13px] font-bold text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#2E5A27] data-[state=active]:shadow-sm rounded-md transition-all">People</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="journey" className="m-0 border-none p-0 outline-none">
              <div className="max-w-[700px] mx-auto pl-4">
                {product.journey.map((node, i) => (
                  <div key={i} className="relative pl-12 pb-10 last:pb-0">
                    {/* Timeline Line */}
                    {i < product.journey.length - 1 && (
                      <div className="absolute left-3 top-7 bottom-[-24px] w-0.5 bg-[#EAECE6]" />
                    )}
                    {/* Node Dot */}
                    <div className="absolute left-[-1px] top-1.5 h-[26px] w-[26px] rounded-full bg-[#EAECE6] border-4 border-white flex items-center justify-center z-10 shadow-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#E67E22]" />
                    </div>

                    {/* Content Block */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex gap-4">
                          <div className="mt-1 p-2 rounded-lg bg-[#FFF5EE] text-[#E67E22] shrink-0 h-10 w-10 flex items-center justify-center">
                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <h4 className="text-[17px] font-bold text-gray-900 mb-0.5 leading-tight">{node.title}</h4>
                            <p className="text-[13px] font-medium text-gray-500">{node.description}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-10 border-l border-gray-100 pl-8 ml-4">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Date</p>
                            <p className="text-[13px] font-bold text-gray-900">{node.date}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Time</p>
                            <p className="text-[13px] font-bold text-gray-900">{node.time}</p>
                          </div>
                        </div>
                      </div>

                      {/* Details List */}
                      <div className="border border-gray-100 rounded-lg p-5 bg-[#FAFAFA]">
                        <p className="text-[12px] text-gray-500 mb-5 leading-relaxed font-medium">
                          This cycle of {product.name} began with a strong focus on soil conservation and balanced fertility. Your choice of minimum Tillage has already put this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a stable harvest and premium market access.
                        </p>
                        <h5 className="font-bold text-gray-900 text-[13px] mb-4 uppercase tracking-wider">Operations Details</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                          {node.details.map((detail, j) => (
                            <li key={j} className="text-[13px] flex items-start leading-snug">
                              <span className="font-bold text-gray-700 mr-2 min-w-[160px]">{detail.label}:</span>
                              <span className="text-gray-500 font-medium">{detail.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="impact" className="m-0 border-none p-0 outline-none">
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[10px] border border-gray-100 text-gray-500 font-medium h-64 shadow-sm text-center">
                <svg className="size-10 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <p>Impact assessment data is currently being calculated.</p>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="m-0 border-none p-0 outline-none">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Score Ring Charts */}
                <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-1.5">Quality & Compliance</h3>
                  <p className="text-xs font-medium text-gray-500 mb-10">Safety standards and regulatory compliance status</p>

                  <div className="flex items-center justify-center gap-16 md:gap-32 w-full mb-8">
                    {/* Quality Ring */}
                    <div className="relative size-[140px] flex flex-col items-center justify-center">
                      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-[#2E5A27]" strokeWidth="3" strokeDasharray={`${product.metrics.qualityScore}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
                      </svg>
                      <span className="font-extrabold text-[32px] text-gray-900 relative leading-none mb-1">{product.metrics.qualityScore}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider relative">Score</span>
                    </div>

                    {/* Compliance Ring */}
                    <div className="relative size-[140px] flex flex-col items-center justify-center">
                      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-[#2E5A27]" strokeWidth="3" strokeDasharray={`${product.metrics.complianceRate}, 100`} stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeLinecap="round" />
                      </svg>
                      <span className="font-extrabold text-[32px] text-gray-900 relative leading-none mb-1">{product.metrics.complianceRate}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider relative">Score</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#2E5A27]/80 font-bold tracking-wide">WEIGHTED ACROSS ENVIRONMENTAL (40%), ECONOMIC (25%), SOCIAL (25%), GOVERNANCE (10%)</p>
                </div>

                {/* Quality Tests List */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-6 py-5 flex items-center gap-2.5 border-b border-gray-100 bg-gray-50/30">
                    <svg className="size-[18px] text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg>
                    <h4 className="font-bold text-sm text-gray-900">Quality Test Results</h4>
                  </div>
                  <div className="p-5 space-y-4 bg-white">
                    {product.tests.map((test, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-white hover:border-[#2E5A27]/20 hover:shadow-sm transition-all group">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 p-1 rounded-full bg-[#E8F5E9] text-[#2E5A27] shrink-0">
                            <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 mb-1">{test.title}</p>
                            <p className="text-[11px] font-medium text-gray-500">{test.description}</p>
                          </div>
                        </div>
                        <button className="text-[11px] font-bold text-[#2E5A27] opacity-0 group-hover:opacity-100 transition-opacity">VIEW TEST</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance List */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="px-6 py-5 flex items-center gap-2.5 border-b border-gray-100 bg-gray-50/30">
                    <svg className="size-[18px] text-[#2E5A27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <h4 className="font-bold text-sm text-gray-900">Compliance Standards</h4>
                  </div>
                  <div className="p-5 space-y-4 bg-white">
                    {product.standards.map((standard, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-white hover:border-[#2E5A27]/20 hover:shadow-sm transition-all group">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 p-1 rounded-full bg-[#E8F5E9] text-[#2E5A27] shrink-0">
                            <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 mb-1">{standard.title}</p>
                            <p className="text-[11px] font-medium text-gray-500">{standard.description}</p>
                          </div>
                        </div>
                        <button className="text-[11px] font-bold text-[#2E5A27] opacity-0 group-hover:opacity-100 transition-opacity">VIEW STANDARD</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="people" className="m-0 border-none p-0 outline-none">
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[10px] border border-gray-100 text-gray-500 font-medium h-64 shadow-sm text-center">
                <svg className="size-10 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p>Workforce & Social data is currently being populated.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
