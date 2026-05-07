import React from 'react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Download, Share2 } from 'lucide-react'

interface ReportLayoutProps {
  title: string
  subtitle: string
  breadcrumb: { label: string; href?: string }[]
  children: React.ReactNode
  actions?: React.ReactNode
}

export function ReportLayout({
  title,
  subtitle,
  breadcrumb,
  children,
  actions,
}: ReportLayoutProps) {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={breadcrumb}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-10 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Download className="size-4" />
              <span className="font-bold uppercase tracking-wide text-[10px]">Download PDF</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-10 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="size-4" />
              <span className="font-bold uppercase tracking-wide text-[10px]">Share</span>
            </Button>
            {actions}
          </div>
        }
      />

      <div className="px-1">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {children}
    </div>
  )
}
