import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { getTenantSelectValue } from '~/lib/tenant'

interface SidebarRoleSwitcherProps {
  roleLabel: string
  activeRole: string
}

export function SidebarRoleSwitcher({ roleLabel, activeRole }: SidebarRoleSwitcherProps) {
  const navigate = useNavigate()

  const handleRoleChange = (role: string) => {
    const rolePath = role.toLowerCase().replace(/\s+/g, '-')
    navigate(`/${rolePath}`)
    toast.success(`Switched to ${role} Dashboard`)
  }

  return (
    <div className='mx-4 mb-3'>
      <div className='text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1'>
        {roleLabel} Controls
      </div>
      <div className='flex items-center gap-2 mb-1.5 ml-1.5'>
        <span className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
          View as:
        </span>
      </div>
      <Select
        value={getTenantSelectValue(activeRole)}
        onValueChange={(val: string | null) => handleRoleChange(val || '')}
      >
        <SelectTrigger className='w-full h-10 py-2 px-3.5 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer'>
          <SelectValue className='text-sm font-semibold text-gray-900' />
        </SelectTrigger>
        <SelectContent>
          {['Farmer', 'Processor', 'Cooperative', 'Aggregator', 'Transporter', 'Field Agent', 'Admin'].map((r) => (
            <SelectItem
              key={r}
              value={r}
              className='focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand'
            >
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
