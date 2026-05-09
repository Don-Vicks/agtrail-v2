import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  Download,
  Info,
  Layers,
  LayoutDashboard,
  MapPin,
  Package,
  Share2,
  QrCode,
  Droplets,
  Flame,
  Leaf,
  Users,
  ShieldCheck,
  ChevronRight,
  User,
  Clock,
  Sprout,
  Check
} from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useGetFarmersProductsId, getFarmersProductsIdQr } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetTraceBatchNumber } from '~/lib/api/generated/public-traceability/public-traceability'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ProductStoryPDF } from './product-story-pdf'
import { ShareQRModal } from './share-qr-modal'
import { cn } from '~/lib/utils'

interface ProductStoryPageProps {
  dashboardHref: string
  productsHref: string
}

function LoadingSkeleton() {
  return (
    <div className="space-y-12 animate-pulse px-4 md:px-6 lg:px-8 w-full">
      <div className="h-8 w-64 bg-gray-100 rounded-lg mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-10">
        <div className="rounded-3xl border border-gray-100 bg-white p-10 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-[360px] aspect-square rounded-3xl bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-8 py-4">
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-gray-100 rounded-xl" />
              <div className="h-4 w-1/3 bg-gray-100 rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-1/2 bg-gray-100 rounded-lg" />
              <div className="h-6 w-1/2 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-32 bg-gray-100 rounded-xl" />
              <div className="h-12 w-32 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, subValue }: { label: string; value: string; icon: React.ReactNode; subValue?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 md:gap-3">
      <div className="text-[#1d3d1e] opacity-80">
        {icon}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        {subValue && <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  )
}

function CircularGauge({ score, label, size = "large" }: { score: number; label: string; size?: "large" | "small" }) {
  const radius = size === "large" ? 45 : 35
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="relative inline-flex items-center justify-center">
        <svg className={cn(size === "large" ? "size-24 md:size-32" : "size-20 md:size-24", "-rotate-90")}>
          <circle
            className="text-gray-100"
            strokeWidth={size === "large" ? "8" : "6"}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-emerald-500 transition-all duration-1000 ease-out"
            strokeWidth={size === "large" ? "8" : "6"}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("font-bold text-gray-900 tracking-tight", size === "large" ? "text-2xl md:text-3xl" : "text-lg md:text-xl")}>{score}</span>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
        </div>
      </div>
      <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</p>
    </div>
  )
}

function TimelineItem({ title, description, date, time, isLast = false, details, note }: {
  title: string;
  description: string;
  date: string;
  time?: string;
  isLast?: boolean;
  details?: { label: string; value: string }[];
  note?: string;
}) {
  return (
    <div className="relative flex gap-4 md:gap-8 pb-10 md:pb-12">
      {!isLast && (
        <div className="absolute left-[11px] top-8 h-full w-[2px] bg-emerald-100" />
      )}
      <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-1 ring-emerald-100" />

      <div className="flex-1 rounded-xl border border-gray-100 bg-white p-5 md:p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase">{title}</h3>
            <p className="text-sm font-medium text-gray-500">{description}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[120px]">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
              <p className="text-xs font-bold text-gray-800">{date}</p>
            </div>
            <div className="flex-1 md:flex-none bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[90px]">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Time</p>
              <p className="text-xs font-bold text-gray-800">{time || '10:00 AM'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-50 space-y-6">
          {note && (
            <div className="rounded-xl bg-emerald-50/30 p-4 border border-emerald-100/50">
              <p className="text-xs text-gray-600 leading-relaxed italic font-medium">
                {note}
              </p>
            </div>
          )}

          {details && details.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <div className="size-1 bg-emerald-500 rounded-full" />
                Operations Details
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {details.map((detail, i) => (
                  <div key={i} className="text-[10px] text-gray-500 leading-relaxed">
                    <span className="font-bold text-gray-800 uppercase tracking-tight">{detail.label}:</span> {detail.value}
                    {i < details.length - 1 && <span className="ml-2 text-gray-300">|</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ImpactProgress({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {label === 'Environmental' && <Leaf className="size-4 text-emerald-500" />}
          {label === 'Economic' && <Activity className="size-4 text-blue-500" />}
          {label === 'Social' && <Users className="size-4 text-orange-500" />}
          {label === 'Governance' && <ShieldCheck className="size-4 text-purple-500" />}
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            label === 'Environmental' ? 'bg-emerald-500' :
              label === 'Economic' ? 'bg-blue-500' :
                label === 'Social' ? 'bg-orange-500' : 'bg-purple-500'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function PersonCard({ name, role, organization, details, date, icon: Icon }: {
  name: string;
  role: string;
  organization?: string;
  details?: string;
  date?: string;
  icon: any;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden gap-4">
      <div className="flex items-center gap-4 md:gap-6">
        <div className={cn(
          "size-14 md:size-16 rounded-full flex items-center justify-center shadow-inner ring-1 ring-gray-100 shrink-0",
          role === 'Farmer' ? 'bg-emerald-50 text-emerald-600' :
            role === 'Supervisor' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
        )}>
          <Icon className="size-6 md:size-7" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">{name}</h4>
            <Badge className={cn(
              "text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow-none",
              role === 'Farmer' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                role === 'Supervisor' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                  'bg-gray-100 text-gray-700 hover:bg-gray-100'
            )}>
              {role}
            </Badge>
          </div>
          {organization && <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{organization}</p>}
          {details && <p className="text-xs text-gray-400 font-medium leading-relaxed">{details}</p>}
          {date && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-widest pt-1">
              <Calendar className="size-3.5" />
              {date}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ count, label, color = "gray" }: { count: string; label: string; color?: string }) {
  const colors: any = {
    gray: 'bg-gray-50/50 border-gray-100 text-gray-900',
    green: 'bg-emerald-50/50 border-emerald-100 text-emerald-900',
    purple: 'bg-purple-50/50 border-purple-100 text-purple-900',
    orange: 'bg-orange-50/50 border-orange-100 text-orange-900',
    blue: 'bg-blue-50/50 border-blue-100 text-blue-900'
  }

  return (
    <div className={cn("rounded-2xl border p-6 md:p-8 text-center shadow-sm", colors[color])}>
      <p className="text-3xl md:text-4xl font-black tracking-tight">{count}</p>
      <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">{label}</p>
    </div>
  )
}

export function ProductStoryPage({ dashboardHref, productsHref }: ProductStoryPageProps) {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('journey')

  const { data: productResponse, isLoading: isLoadingProduct } = useGetFarmersProductsId(id ?? '', {
    query: {
      enabled: Boolean(id),
    },
  })

  const product = productResponse?.data?.data as any
  const farm = product?.farm
  const cropCycle = product?.cropCycle
  const harvestOp = product?.harvestOperation
  const certifications = product?.certifications || []
  const fieldOperations = cropCycle?.operations || product?.operations || []

  const getNote = (stepData: any) => {
    return stepData?.environmentalImpactNotes || stepData?.notes || product?.aiSummary || ""
  }

  const journeySteps = useMemo(() => {
    const steps = []

    if (fieldOperations.length > 0) {
      fieldOperations.forEach((op: any) => {
        steps.push({
          title: op.operationType || op.operationCategory,
          description: op.description || 'Field operation recorded.',
          date: new Date(op.operationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          time: op.operationTime || '10:00 AM',
          details: [
            { label: 'Category', value: op.operationCategory },
            { label: 'Operator', value: op.operatorName || 'N/A' },
            { label: 'Area', value: `${op.areaCovered} ${op.areaUnit}` }
          ],
          note: getNote(op)
        })
      })
    } else if (cropCycle) {
      steps.push({
        title: 'Planting',
        description: `Sowing ${cropCycle.variety} variety seeds.`,
        date: new Date(cropCycle.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: '08:30 AM',
        details: [
          { label: 'Variety', value: cropCycle.variety },
          { label: 'Area Planted', value: `${cropCycle.areaPlanted} ${cropCycle.areaUnit}` },
          { label: 'Season', value: cropCycle.season }
        ],
        note: cropCycle.notes || getNote(null)
      })
    }

    if (harvestOp) {
      steps.push({
        title: 'Harvesting',
        description: harvestOp.description || 'Harvesting operation completed.',
        date: new Date(harvestOp.operationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        time: harvestOp.operationTime || '09:00 AM',
        details: [
          { label: 'Quantity', value: `${product.quantityHarvested} ${product.unit}` },
          { label: 'Operator', value: harvestOp.operatorName },
          { label: 'Grade', value: harvestOp.qualityAssessment?.grade || 'N/A' }
        ],
        note: getNote(harvestOp)
      })
    }

    if (certifications.length > 0) {
      certifications.forEach((cert: any) => {
        steps.push({
          title: 'Certification Status',
          description: `${cert.certificationType?.name?.toUpperCase()} Certification Issued.`,
          date: new Date(cert.issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          time: '11:00 AM',
          details: [
            { label: 'Certificate No', value: cert.certificateNumber },
            { label: 'Status', value: cert.status }
          ],
          note: cert.verificationNotes || getNote(null)
        })
      })
    }

    return steps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [cropCycle, harvestOp, certifications, fieldOperations, product])

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    console.log('[DEBUG] ProductStoryPage ID:', id)
  }, [id])

  const handleDownloadQr = async () => {
    if (!id) return
    const toastId = toast.loading('Generating QR code...')
    try {
      const response = await getFarmersProductsIdQr(id)

      if (response.status === 200 && response.data) {
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = `product-qr-${product?.batchNumber || id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        toast.success('QR Code downloaded successfully!', { id: toastId })
      } else {
        throw new Error('Failed to download QR code')
      }
    } catch (error) {
      console.error('QR Download Error:', error)
      toast.error('Failed to download QR code. Please try again.', { id: toastId })
    }
  }

  if (isLoadingProduct) return <LoadingSkeleton />

  const sustainabilityScore = 56
  const qualityScore = harvestOp?.qualityAssessment?.grade === 'A' ? 95 : 56
  const complianceRate = certifications.length > 0 ? 100 : 56

  return (
    <div className="space-y-6 pb-20 text-left w-full">
      <PageHeader
        items={[
          { label: 'Dashboard', href: dashboardHref },
          { label: 'Products', href: productsHref },
          { label: 'Product View Story' },
        ]}
      />

      {!product ? (
        <div className="px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="size-12 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
            <p className="text-sm text-gray-500 mt-2">The requested product details could not be loaded for ID: {id}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 px-4 md:px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-12 flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-[360px] aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner group shrink-0">
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop'}
                  alt={product.productName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center py-2">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1d3d1e] tracking-tight uppercase leading-tight">{product.productName}</h1>
                    <p className="text-[11px] md:text-xs font-black text-gray-400 uppercase tracking-[0.25em] mt-3">BATCH: {product.batchNumber}</p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <MapPin className="size-5" />
                      </div>
                      <span className="text-sm md:text-base font-extrabold tracking-tight">{farm?.name || 'Local Farm'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Calendar className="size-5" />
                      </div>
                      <span className="text-sm md:text-base font-extrabold tracking-tight">Planted: {cropCycle?.plantingDate ? new Date(cropCycle.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <Button
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex-1 md:flex-none bg-[#1d3d1e] hover:bg-black text-white px-8 h-12 gap-2 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/10 rounded-xl"
                    >
                      <QrCode className="size-5" />
                      QR Code
                    </Button>

                    {isMounted ? (
                      <PDFDownloadLink
                        document={
                          <ProductStoryPDF
                            product={product}
                            farm={farm}
                            cropCycle={cropCycle}
                            journeySteps={journeySteps}
                            scores={{
                              sustainability: sustainabilityScore,
                              quality: qualityScore,
                              compliance: complianceRate,
                            }}
                          />
                        }
                        fileName={`product-story-${product?.batchNumber || id}.pdf`}
                        className="flex-1 md:flex-none"
                      >
                        {({ loading }) => (
                          <Button
                            variant="outline"
                            disabled={loading}
                            className="w-full h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl"
                          >
                            <Download className="size-5" />
                            {loading ? 'Preparing...' : 'Download'}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    ) : (
                      <Button variant="outline" className="flex-1 md:flex-none h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl">
                        <Download className="size-5" />
                        Download
                      </Button>
                    )}

                    <Button
                      onClick={() => setIsShareModalOpen(true)}
                      variant="outline"
                      className="w-full md:w-auto h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-2 rounded-xl"
                    >
                      <Share2 className="size-5" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <ShareQRModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              productId={id || ''}
              productName={product.productName}
              batchNumber={product.batchNumber}
            />

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5">
              <StatCard label="Sustainability Score" value={String(sustainabilityScore)} icon={<Leaf className="size-6 md:size-8" />} />
              <StatCard label="kg CO2, eq" value="0.0" icon={<Flame className="size-6 md:size-8" />} />
              <StatCard label="Liters Used" value="0" icon={<Droplets className="size-6 md:size-8" />} />
              <StatCard label="Certifications" value={String(certifications.length)} icon={<ShieldCheck className="size-6 md:size-8" />} />
            </div>
          </div>

          <div className="py-6 md:py-8 px-4 md:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl mx-auto flex flex-col items-center">
              <div className="w-full mb-8 md:mb-12">
                <TabsList className="!grid !grid-cols-2 !gap-1.5 !p-1.5 !bg-gray-100/80 !rounded-2xl !border-none !shadow-inner !h-fit !w-full">
                  {['Journey', 'Impact', 'Quality', 'People'].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab.toLowerCase()}
                      className="!h-11 md:!h-13 !rounded-xl !text-[10px] md:!text-[11px] !font-black !uppercase !tracking-[0.2em] data-[state=active]:!bg-white data-[state=active]:!text-[#1d3d1e] data-[state=active]:!shadow-lg transition-all flex items-center justify-center !border-none"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="w-full">
                <TabsContent value="journey" className="space-y-4 mt-0 outline-none">
                  <div className="max-w-5xl mx-auto py-2 md:py-6">
                    {journeySteps.length > 0 ? (
                      journeySteps.map((step: any, idx: number) => (
                        <TimelineItem
                          key={idx}
                          title={step.title}
                          description={step.description}
                          date={step.date}
                          time={step.time}
                          isLast={idx === journeySteps.length - 1}
                          details={step.details}
                          note={step.note}
                        />
                      ))
                    ) : (
                      <div className="rounded-3xl border border-dashed border-gray-200 p-12 md:p-20 text-center">
                        <Clock className="size-16 text-gray-100 mx-auto mb-6" />
                        <p className="text-lg text-gray-400 font-medium italic">No journey operations found for this batch yet.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="impact" className="mt-0 outline-none">
                  <div className="max-w-4xl mx-auto rounded-3xl border border-gray-100 bg-white p-8 md:p-16 shadow-sm">
                    <div className="text-center mb-10 md:mb-16">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">SAFA Sustainability Assessment</h2>
                      <p className="text-xs md:text-sm text-gray-500 mt-3 font-bold uppercase tracking-widest opacity-60">Comprehensive sustainability analysis across four key pillars.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
                      <CircularGauge score={sustainabilityScore} label="Total Score" />

                      <div className="flex-1 w-full max-w-md space-y-8 md:space-y-10">
                        <ImpactProgress label="Environmental" score={46} />
                        <ImpactProgress label="Economic" score={46} />
                        <ImpactProgress label="Social" score={46} />
                        <ImpactProgress label="Governance" score={46} />
                      </div>
                    </div>

                    <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-gray-50 text-center">
                      <p className="text-[10px] font-black text-brand uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-lg mx-auto">Weighted across: Environmental (40%), Economic (25%), Social (25%), Governance (10%)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="mt-0 outline-none">
                  <div className="max-w-4xl mx-auto rounded-3xl border border-gray-100 bg-white p-8 md:p-16 shadow-sm">
                    <div className="text-center mb-10 md:mb-16">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Quality & Compliance</h2>
                      <p className="text-xs md:text-sm text-gray-500 mt-3 font-bold uppercase tracking-widest opacity-60">Safety standards and regulatory compliance status.</p>
                    </div>

                    <div className="flex justify-center gap-12 md:gap-24 mb-12 md:mb-20">
                      <CircularGauge score={qualityScore} label="Quality Score" size="large" />
                      <CircularGauge score={complianceRate} label="Compliance Rate" size="large" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-tight">
                          <Activity className="size-5 md:size-6 text-emerald-500" />
                          Quality Test Results
                        </h3>
                        <div className="space-y-4">
                          {harvestOp?.qualityAssessment ? (
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all gap-6">
                              <div className="flex items-center gap-5">
                                <div className="size-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 shrink-0">
                                  <CheckCircle2 className="size-6" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Moisture Content: {harvestOp.qualityAssessment.moisture_content}</h4>
                                  <p className="text-[11px] text-gray-500 mt-1 font-bold italic opacity-70">"{harvestOp.qualityAssessment.notes}"</p>
                                </div>
                              </div>
                              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 gap-2 w-full md:w-auto h-10">
                                View Details
                                <ChevronRight className="size-4" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-gray-50">
                        <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-tight">
                          <ShieldCheck className="size-5 md:size-6 text-blue-500" />
                          Compliance Standards
                        </h3>
                        <div className="space-y-4">
                          {certifications.map((cert: any) => (
                            <div key={cert.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all gap-6">
                              <div className="flex items-center gap-5">
                                <div className="size-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 shrink-0">
                                  <ShieldCheck className="size-6" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{cert.certificationType?.name?.toUpperCase()} Certification</h4>
                                  <p className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-widest opacity-60">Issuing Body: {cert.certificationType?.issuingBody || 'Authorized Authority'}</p>
                                </div>
                              </div>
                              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 gap-2 w-full md:w-auto h-10">
                                View Certificate
                                <ChevronRight className="size-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="people" className="mt-0 outline-none">
                  <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
                    <div className="text-center mb-10 md:mb-12">
                      <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">People Involved</h2>
                      <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Everyone who contributed to this product's journey</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                      <PersonCard
                        name={farm?.ownerName || 'Agrolinking Administrator'}
                        role="Farmer"
                        organization={farm?.name}
                        details="Source farm details tracked via operations"
                        icon={Sprout}
                      />
                      {harvestOp?.operatorName && (
                        <PersonCard
                          name={harvestOp.operatorName}
                          role="Operator"
                          organization={farm?.name}
                          details={`${harvestOp.operationType} performed successfully on the field.`}
                          date={new Date(harvestOp.operationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          icon={User}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 pt-10 md:pt-12">
                      <SummaryCard count="2" label="Total People" />
                      <SummaryCard count="1" label="Farmers" color="green" />
                      <SummaryCard count="0" label="Processors" color="purple" />
                      <SummaryCard count="0" label="Distributors" color="orange" />
                      <SummaryCard count="1" label="Workers" color="blue" />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
