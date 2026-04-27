import { type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import {
  Download,
  FileText,
  LayoutDashboard,
  MapPin,
} from 'lucide-react'
import type { Route } from './+types/compliance-report'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance Report | Agrolinking' },
    { name: 'description', content: 'EUDR Compliance Report for your agricultural products' },
  ]
}

function SectionButton({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${
        active ? 'bg-[#2e7d32] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default function ComplianceReportPage() {
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
          { label: 'Compliance Report' },
        ]}
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/compliance/readiness')}
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-[#2e7d32]">EUDR Compliance Report</h1>
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <MapPin className="size-3" /> Region: South America
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 text-[10px] font-bold uppercase tracking-widest border-gray-200">
            <Download className="size-4 mr-2" /> Download PDF
          </Button>
          <Button className="h-9 bg-[#2e7d32] text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90">
            <FileText className="size-4 mr-2" /> Export For Regulator
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_1fr_240px]">
        {/* Sidebar Nav */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm h-fit">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-2">Report Sections</p>
          <div className="space-y-1 text-sm">
            <SectionButton active>Overview</SectionButton>
            <SectionButton>Geolocation Data</SectionButton>
            <SectionButton>Deforestation Analysis</SectionButton>
            <SectionButton>Ownership Verification</SectionButton>
            <SectionButton>Ledger Proof</SectionButton>
          </div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/30 p-3">
            <p className="text-xs font-bold text-gray-900">Immutable Status</p>
            <p className="text-[11px] text-gray-500 mt-1">This document is hashed on the AgTrail Public Ledger.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Summary of Compliance</h3>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              This batch meets EU due-diligence requirements and no deforestation activity was detected after the Dec 31, 2020 cutoff date. All land tenure documents have been verified as authentic.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <PanelStat label="Target Market" value="European Union" />
            <PanelStat label="Product Type" value="Maize" />
            <PanelStat label="Issue Date" value="2026-04-26" />
            <PanelStat label="Status" value="Compliant" />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900">Geolocation Analysis</h4>
              <Button variant="ghost" className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-[#2e7d32]">
                Expand GIS View
              </Button>
            </div>
            <div className="h-44 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-900">Lat: -18.3515 | Lng: 46.2772</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Satellite Verified Polygon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Stats */}
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold uppercase tracking-tight text-gray-900">Risk Assessment</p>
            <div className="space-y-2">
              {['Deforestation', 'Human Rights', 'Tax Compliance'].map((line) => (
                <div key={line} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{line}</span>
                  <span className="font-bold text-[#2e7d32] bg-green-50 px-2 py-0.5 rounded-full">Passed</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Satellite Verification</p>
            <p className="text-3xl font-bold text-[#2e7d32] mt-1">100%</p>
            <p className="text-[11px] text-gray-500 mt-2 leading-tight">Field polygons validated across multiple satellite imagery providers.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
