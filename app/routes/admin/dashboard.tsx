import { Construction } from 'lucide-react'
import { PageHeader } from '~/components/page-header'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-10 h-[calc(100vh-100px)] flex flex-col">
      <PageHeader
        items={[
          { label: 'Platform', href: '/admin' },
          { label: 'Admin Dashboard' },
        ]}
      />

      <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="size-20 rounded-full bg-brand/5 flex items-center justify-center text-brand border border-brand/10">
          <Construction className="size-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">
            Under Development
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            The Admin Command Center is currently being engineered. Access to global governance tools and system overrides will be available soon.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-md border border-gray-100 text-[10px] font-bold uppercase tracking-widest">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
           </span>
           System Status: Building Core Modules
        </div>
      </div>
    </div>
  )
}
