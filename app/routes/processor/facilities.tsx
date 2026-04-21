import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  Building2, 
  Layers, 
  Search, 
  Settings2, 
  ShieldCheck, 
  Wrench, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ArrowRight, 
  Activity,
  MapPin
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

type FacilityStatus = 'Operational' | 'Maintenance' | 'Inactive'

interface ProcessingFacility {
  id: string
  name: string
  location: string
  lineType: string
  monthlyCapacityTons: number
  utilization: number
  status: FacilityStatus
  manager: string
  lastMaintained?: string
}

const INITIAL_FACILITIES: ProcessingFacility[] = [
  {
    id: '1',
    name: 'Abuja Processing Hub',
    location: 'Gwagwalada, Abuja',
    lineType: 'Drying and Milling',
    monthlyCapacityTons: 240,
    utilization: 78,
    status: 'Operational',
    manager: 'Ibrahim Sani',
    lastMaintained: '2024-03-10'
  },
  {
    id: '2',
    name: 'Lagos Packaging Center',
    location: 'Ikeja, Lagos',
    lineType: 'Packaging and Storage',
    monthlyCapacityTons: 160,
    utilization: 64,
    status: 'Operational',
    manager: 'Adaobi Okeke',
    lastMaintained: '2024-02-15'
  },
  {
    id: '3',
    name: 'Kano Extraction Unit',
    location: 'Nasarawa, Kano',
    lineType: 'Oil Extraction',
    monthlyCapacityTons: 130,
    utilization: 0,
    status: 'Maintenance',
    manager: 'Musa Abdullahi',
    lastMaintained: '2024-04-01'
  },
]

export default function ProcessorFacilitiesPage() {
  const [facilities, setFacilities] = useState<ProcessingFacility[]>(INITIAL_FACILITIES)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'utilization'>('name')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<ProcessingFacility | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredAndSorted = useMemo(() => {
    return facilities
      .filter((f) => {
        const matchesSearch = !search || 
          [f.name, f.location, f.lineType, f.manager].some(v => v.toLowerCase().includes(search.toLowerCase()))
        const matchesStatus = statusFilter === 'all' || f.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'capacity') return b.monthlyCapacityTons - a.monthlyCapacityTons
        if (sortBy === 'utilization') return b.utilization - a.utilization
        return 0
      })
  }, [facilities, search, statusFilter, sortBy])

  const stats = useMemo(() => {
    const total = facilities.length
    const operational = facilities.filter(f => f.status === 'Operational').length
    const maintenance = facilities.filter(f => f.status === 'Maintenance').length
    const avgUtil = total > 0 
      ? Math.round(facilities.reduce((sum, f) => sum + f.utilization, 0) / total) 
      : 0
    return { total, operational, maintenance, avgUtil }
  }, [facilities])

  const handleSaveFacility = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const location = String(formData.get('location') ?? '').trim()
    const lineType = String(formData.get('lineType') ?? '').trim()
    const manager = String(formData.get('manager') ?? '').trim()
    const monthlyCapacityTons = Number(formData.get('monthlyCapacityTons'))

    if (!name) {
      toast.error('Facility name is required.')
      return
    }
    if (!location) {
      toast.error('Location is required.')
      return
    }
    if (!lineType) {
      toast.error('Processing line type is required.')
      return
    }
    if (!manager) {
      toast.error('Facility manager is required.')
      return
    }
    if (!Number.isFinite(monthlyCapacityTons) || monthlyCapacityTons <= 0) {
      toast.error('Monthly capacity must be a positive number.')
      return
    }

    const data = {
      name,
      location,
      lineType,
      monthlyCapacityTons,
      status: formData.get('status') as FacilityStatus,
      manager,
      utilization: editingFacility ? editingFacility.utilization : 0,
    }

    if (editingFacility) {
      setFacilities(facilities.map(f => f.id === editingFacility.id ? { ...f, ...data } : f))
      toast.success('Facility updated successfully')
    } else {
      const newFacility: ProcessingFacility = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      }
      setFacilities([...facilities, newFacility])
      toast.success('Facility added successfully')
    }
    handleCloseModal()
  }

  const handleDeleteFacility = (id: string) => {
    setFacilities(facilities.filter(f => f.id !== id))
    toast.success('Facility deleted successfully')
  }

  const handleEditClick = (facility: ProcessingFacility) => {
    setEditingFacility(facility)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingFacility(null)
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/processor', icon: <Layers className="size-4 text-gray-400" /> },
          { label: 'Facilities management' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Processing Facilities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor operational status across all processing sites</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger render={
            <Button onClick={() => setEditingFacility(null)} className="bg-[#1d3d1e] hover:bg-black text-white h-11 px-6 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="size-4 mr-2" />
              <span className="font-bold uppercase tracking-wide text-xs">Add Facility</span>
            </Button>
          } />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveFacility} className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Facility Name</Label>
                  <Input id="name" name="name" defaultValue={editingFacility?.name} placeholder="e.g. Abuja Processing Hub" required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</Label>
                  <Input id="location" name="location" defaultValue={editingFacility?.location} placeholder="e.g. Gwagwalada, Abuja" required className="h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</label>
                    <Select name="status" defaultValue={editingFacility?.status || 'Operational'}>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operational">Operational</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyCapacityTons" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Capacity (Tons/Mo)</Label>
                    <Input id="monthlyCapacityTons" name="monthlyCapacityTons" type="number" defaultValue={editingFacility?.monthlyCapacityTons} placeholder="240" required className="h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineType" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Processing Line Type</Label>
                  <Input id="lineType" name="lineType" defaultValue={editingFacility?.lineType} placeholder="e.g. Drying and Milling" required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Facility Manager</Label>
                  <Input id="manager" name="manager" defaultValue={editingFacility?.manager} placeholder="Full Name" required className="h-10" />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button type="submit" className="bg-[#1d3d1e] hover:bg-black text-white px-8 font-bold uppercase tracking-widest text-[10px] shadow-md transition-all">
                  {editingFacility ? 'Save Changes' : 'Create Facility'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Sites" value={stats.total.toString()} icon={<Building2 className="size-4" />} />
        <StatCard title="Active Hubs" value={stats.operational.toString()} icon={<ShieldCheck className="size-4 text-emerald-500" />} />
        <StatCard title="Maintenance" value={stats.maintenance.toString()} icon={<Wrench className="size-4 text-amber-500" />} />
        <StatCard title="Utilization" value={`${stats.avgUtil}%`} icon={<Activity className="size-4 text-blue-500" />} />
      </div>

      <div className="rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Filter</span>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'all')}>
              <SelectTrigger className="h-10 w-[140px] bg-gray-50/50 border-gray-100 font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-gray-100 pl-4 h-6" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sort</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any || 'name')}>
              <SelectTrigger className="h-10 w-[140px] bg-gray-50/50 border-gray-100 font-medium">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="capacity">Capacity (High)</SelectItem>
                <SelectItem value="utilization">Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl border border-gray-100 bg-gray-50/50 animate-pulse" />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-12" />}
          title="No facilities matches your criteria"
          description="Try adjusting your filters or search query to find more results."
          className="py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((facility) => (
            <div
              key={facility.id}
              className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center transition-colors",
                    facility.status === 'Operational' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" :
                    facility.status === 'Maintenance' ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100" :
                    "bg-gray-50 text-gray-600 group-hover:bg-gray-100"
                  )}>
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-brand transition-colors">{facility.name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                      <MapPin className="size-3" />
                      {facility.location}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-gray-900 rounded-full h-8 w-8 hover:bg-gray-50">
                      <MoreVertical className="size-4" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg ring-1 ring-black/5">
                    <DropdownMenuItem onClick={() => handleEditClick(facility)} className="gap-2 cursor-pointer font-medium py-2">
                      <Edit2 className="size-3.5 text-blue-500" />
                      <span>Edit Site</span>
                    </DropdownMenuItem>
                    <div className="h-px bg-gray-50 my-1" />
                    <DropdownMenuItem onClick={() => handleDeleteFacility(facility.id)} className="gap-2 focus:bg-red-50 focus:text-red-600 cursor-pointer font-medium py-2">
                      <Trash2 className="size-3.5 text-red-500" />
                      <span>Delete Hub</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border-none",
                    facility.status === 'Operational' ? "bg-emerald-50 text-emerald-700" :
                    facility.status === 'Maintenance' ? "bg-amber-50 text-amber-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {facility.status}
                  </Badge>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{facility.lineType}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50/50 rounded-xl p-3 border border-transparent group-hover:border-gray-100 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Utilization</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{facility.utilization}%</span>
                      <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", facility.utilization > 70 ? "bg-brand" : "bg-blue-500")}
                          style={{ width: `${facility.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 rounded-xl p-3 border border-transparent group-hover:border-gray-100 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Monthly Capacity</p>
                    <p className="text-sm font-bold text-gray-900">{facility.monthlyCapacityTons} Tons</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand ring-2 ring-white">
                      {facility.manager.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="hidden sm:block">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Manager</p>
                       <p className="text-xs font-bold text-gray-700">{facility.manager}</p>
                    </div>
                  </div>
                  <Link to={`/processor/facilities/${facility.id}`}>
                    <Button variant="ghost" size="sm" className="text-brand hover:text-brand-dark hover:bg-brand/5 font-bold uppercase tracking-widest text-[10px] group/btn">
                      Details <ArrowRight className="size-3 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
