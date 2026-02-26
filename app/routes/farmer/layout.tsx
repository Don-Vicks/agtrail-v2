import { Outlet } from 'react-router'
import { Sidebar } from '~/components/layout/sidebar'
import { Topbar } from '~/components/layout/topbar'

export default function FarmerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
