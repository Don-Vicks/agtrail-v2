import {
  AlertTriangle,
  Award,
  Calendar,
  ClipboardList,
  Download,
  Droplets,
  Flame,
  Leaf,
  MapPin,
  QrCode,
  Share2,
  User
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '~/components/ui/button'
import { useAggregatorIncomingBatches } from '~/lib/aggregator/use-aggregator-data'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'
import { cn } from '~/lib/utils'

export default function BatchDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { batches } = useAggregatorIncomingBatches()
  const { addBatch, draftLotBatches } = useDraftLot()

  const [activeTab, setActiveTab] = useState('Journey')
  const [view, setView] = useState<'details' | 'weight'>('details')

  // Decode the ID in case it contains spaces or special characters
  const decodedId = id ? decodeURIComponent(id) : ''
  const batch = batches.find((b) => b.id === decodedId) || batches[0]

  const handleContinue = () => {
    setView('weight')
  }

  const handleSaveWeight = () => {
    if (batch && !draftLotBatches.some((existing) => existing.id === batch.id)) {
      addBatch(batch)
    }
    navigate('/aggregator/batch-qr-scan')
  }

  // If batch is not found, we can still render a placeholder based on the screenshot
  const commodityName = batch?.goodsType || 'CHERRY TOMATOES'
  const batchIdDisplay = batch?.batchIdentifier || 'BATCH-175683816381A2'
  const location = batch?.location || 'Zone 16, Kute, Iwo Road'
  const plantedDate = '3rd, January 2025' // Placeholder
  const fieldAgent = batch?.fieldAgentName || 'Sunday Abel'

  const tabs = ['Journey', 'Impact', 'Quality', 'People']

  const timelineEvents = [
    {
      title: 'Land Preparation',
      desc: 'Clearing and preparing the land for farming',
      date: '24th September 2025',
      time: '10:00 AM',
      details: 'This cycle on Plot 2 began with a strong focus on soil conservation and balanced fertility. Your choice of Minimum Tillage has already set this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a quality harvest and premium market access.',
      operations: {
        primaryTillage: 'Zero Tillage',
        conservation: 'Contour Ploughing',
        preparation: 'Pruning',
        clearing: 'Manual Clearing (Cutlass, Hoe)',
        equipment: 'Tractor'
      }
    },
    {
      title: 'Planting',
      desc: 'Clearing and preparing the land for farming',
      date: '24th September 2025',
      time: '12:00 AM',
      details: 'This cycle on Plot 2 began with a strong focus on soil conservation and balanced fertility. Your choice of Minimum Tillage has already set this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a quality harvest and premium market access.',
      operations: {
        primaryTillage: 'Zero Tillage',
        conservation: 'Contour Ploughing',
        preparation: 'Pruning',
        clearing: 'Manual Clearing (Cutlass, Hoe)',
        equipment: 'Tractor'
      }
    },
    {
      title: 'Land Preparation',
      desc: 'Clearing and preparing the land for farming',
      date: '24th September 2025',
      time: '12:00 AM',
      details: 'This cycle on Plot 2 began with a strong focus on soil conservation and balanced fertility. Your choice of Minimum Tillage has already set this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a quality harvest and premium market access.',
      operations: {
        primaryTillage: 'Zero Tillage',
        conservation: 'Contour Ploughing',
        preparation: 'Pruning',
        clearing: 'Manual Clearing (Cutlass, Hoe)',
        equipment: 'Tractor'
      }
    },
    {
      title: 'Land Preparation',
      desc: 'Clearing and preparing the land for farming',
      date: '24th September 2025',
      time: '12:00 AM',
      details: 'This cycle on Plot 2 began with a strong focus on soil conservation and balanced fertility. Your choice of Minimum Tillage has already set this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a quality harvest and premium market access.',
      operations: {
        primaryTillage: 'Zero Tillage',
        conservation: 'Contour Ploughing',
        preparation: 'Pruning',
        clearing: 'Manual Clearing (Cutlass, Hoe)',
        equipment: 'Tractor'
      }
    },
    {
      title: 'Certification Status',
      desc: 'Clearing and preparing the land for farming',
      date: '24th September 2025',
      time: '12:00 AM',
      details: 'This cycle on Plot 2 began with a strong focus on soil conservation and balanced fertility. Your choice of Minimum Tillage has already set this crop on a path to a high Sustainability Score. This report breaks down how your early actions are building a foundation for a quality harvest and premium market access.',
      operations: {
        primaryTillage: 'Zero Tillage',
        conservation: 'Contour Ploughing',
        preparation: 'Pruning',
        clearing: 'Manual Clearing (Cutlass, Hoe)',
        equipment: 'Tractor'
      }
    }
  ]

  if (view === 'weight') {
    return <WeightConfirmationForm onSave={handleSaveWeight} />
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header Back Link */}
      <div className="mb-4">
        <Link to="/aggregator/batch-qr-scan" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2">
          &larr; Back to Scanner
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Product Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm p-6">
            <div className="aspect-[4/3] rounded-md bg-gray-50/50 mb-6 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"
                alt="Cherry Tomatoes"
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-[900] text-[#1a4332] uppercase tracking-tight">{commodityName}</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{batchIdDisplay}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-[#2e7d32] shrink-0" />
                  <span className="text-sm font-bold text-gray-700">{location}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-[#2e7d32] shrink-0" />
                  <span className="text-sm font-bold text-gray-700">Planted: {plantedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <User className="size-5 text-[#2e7d32] shrink-0" />
                    <span className="text-sm font-bold text-gray-700">Field Agent: {fieldAgent}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-gray-200 text-[10px] font-bold text-green-700 uppercase tracking-widest">
                    Approved
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button className="w-full sm:flex-1 bg-[#1a4332] hover:bg-[#122e22] text-white rounded-md h-10 text-xs font-bold gap-2">
                  <QrCode className="size-4" />
                  QR Code
                </Button>
                <Button className="w-full sm:flex-1 bg-[#1a4332] hover:bg-[#122e22] text-white rounded-md h-10 text-xs font-bold gap-2">
                  <Download className="size-4" />
                  Download
                </Button>
                <Button className="w-full sm:flex-1 bg-[#1a4332] hover:bg-[#122e22] text-white rounded-md h-10 text-xs font-bold gap-2">
                  <Share2 className="size-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Timeline */}
        <div className="lg:col-span-7 space-y-6">

          {/* Deforestation Alert */}
          <div className="bg-[#fff8e6] border border-[#ffecb3] rounded-md p-5 flex items-start gap-4 shadow-sm">
            <div className="size-10 rounded-full bg-[#ffe082] flex items-center justify-center shrink-0">
              <AlertTriangle className="size-5 text-[#ff8f00]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[15px] font-[900] text-gray-900 tracking-tight">Deforestation Test Failed</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Recorded Variance of -2.70% is outside the 2% tolerance window. A discrepancy flag has been generated automatically
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4">
            <StatBox icon={<Leaf className="size-6 text-[#2e7d32]" />} value="56" label="Sustainability Score" />
            <StatBox icon={<Flame className="size-6 text-[#2e7d32]" />} value="0.0" label="kg CO₂ eq" />
            <StatBox icon={<Droplets className="size-6 text-[#2e7d32]" />} value="0" label="Liters Used" />
            <StatBox icon={<Award className="size-6 text-[#2e7d32]" />} value="2" label="Certifications" />
          </div>

          {/* Segmented Tabs */}
          <div className="flex p-1 space-x-1 bg-gray-100/80 rounded-md overflow-hidden mt-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2.5 text-[13px] font-bold rounded-md transition-all",
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {activeTab === 'Journey' && (
            <div className="pt-6 relative">
              <div className="absolute top-8 bottom-12 left-3 w-0.5 bg-[#2e7d32]/30" />

              <div className="space-y-8">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative pl-10">
                    {/* Timeline Dot */}
                    <div className="absolute left-1 top-6 size-4.5 rounded-full border-4 border-[#e8f5e9] bg-[#2e7d32] shadow-sm -ml-0.5 z-10" />

                    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-[900] text-gray-900 tracking-tight">{event.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{event.desc}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-center">
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                            <p className="text-[10px] font-[900] text-gray-900">{event.date}</p>
                          </div>
                          <div className="bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 text-center">
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Time</p>
                            <p className="text-[10px] font-[900] text-gray-900">{event.time}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 font-medium leading-relaxed mb-5">
                        {event.details}
                      </p>

                      <div className="space-y-3 pt-4 border-t border-gray-50">
                        <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operations Details</h5>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                          <DetailItem label="Primary Tillage" value={event.operations.primaryTillage} />
                          <DetailItem label="Conservation Structure" value={event.operations.conservation} />
                          <DetailItem label="Preparation Technique" value={event.operations.preparation} />
                          <DetailItem label="Clearing Method" value={event.operations.clearing} />
                          <DetailItem label="Equipment" value={event.operations.equipment} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pl-10">
                <Button
                  onClick={handleContinue}
                  className="w-full h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-[900] rounded-md shadow-md text-sm"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="mb-4">
        {icon}
      </div>
      <p className="text-3xl font-[900] text-gray-900 tracking-tighter mb-1">{value}</p>
      <p className="text-[11px] font-bold text-gray-500">{label}</p>
    </div>
  )
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-bold text-gray-900">{value}</span>
    </div>
  )
}

function WeightConfirmationForm({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-6 pb-20">
      <div className="mb-4">
        <Link to="/aggregator/batch-qr-scan" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-2">
          &larr; Back to Scanner
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#2e7d32]">Confirm Transfer Weight</h1>
        <p className="text-sm text-gray-500">Verify the delivered Batch against the sender declaration before accepting it into your inventory</p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 p-4 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="size-6 text-[#1a4332]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#1a4332]">Weight Details</h2>
        </div>

        <hr className="border-t border-dashed border-gray-200 mb-8" />

        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#2e7d32]">Received Weight (Kg)</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="00.000"
                  className="w-full h-12 rounded-md border border-gray-300 px-4 font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none transition-shadow"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">Kg</span>
              </div>
              <p className="text-[10px] text-gray-400">Calibration certificate must be valid.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#2e7d32]">Total Quantity (Unit)</label>
              <input
                type="text"
                placeholder="Enter quantity"
                className="w-full h-12 rounded-md border border-gray-300 px-4 font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#2e7d32]">Report Weight</label>
            <input
              type="text"
              defaultValue="1,680"
              readOnly
              className="w-full h-12 rounded-md border border-gray-300 bg-gray-50 px-4 font-medium text-gray-600 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#2e7d32]">Measured Weight</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="1,675"
                className="w-full h-12 rounded-md border border-gray-300 px-4 font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none transition-shadow"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">Kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#2e7d32]">Discrepancy Note</label>
            <textarea
              placeholder="WBR-####-####"
              className="w-full h-32 rounded-md border border-gray-300 p-4 font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none transition-shadow resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button className="h-12 rounded-md bg-[#dc2626] text-white font-bold text-sm shadow-sm hover:bg-[#b91c1c] transition-colors px-6">
              Flag Discrepancy
            </button>
            <button onClick={onSave} className="flex-1 h-12 rounded-md bg-[#1a4332] text-white font-bold text-sm shadow-sm hover:bg-[#122e22] transition-colors px-6">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
