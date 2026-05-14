import { format, isValid } from 'date-fns'
import { DatePicker } from '~/components/ui/date-picker'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

function parseValue(value?: string): { date: string; time: string } {
  if (!value?.trim()) return { date: '', time: '12:00' }
  const d = new Date(value)
  if (isValid(d)) {
    return {
      date: format(d, 'yyyy-MM-dd'),
      time: format(d, 'HH:mm'),
    }
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { date: value, time: '12:00' }
  return { date: '', time: '12:00' }
}

function toIso(dateStr: string, timeStr: string): string {
  const [y, mo, da] = dateStr.split('-').map((x) => Number(x))
  const [h, mi] = (timeStr || '12:00').split(':').map((x) => Number(x))
  if (!y || !mo || !da) return ''
  const dt = new Date(y, mo - 1, da, h || 0, mi || 0, 0, 0)
  return dt.toISOString()
}

interface DateTimePickerProps {
  value?: string
  onChange: (iso: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  className,
  placeholder = 'Pick date & time',
  disabled,
}: DateTimePickerProps) {
  const { date, time } = parseValue(value)

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3', className)}>
      <div className="min-w-0 flex-1">
        <DatePicker
          value={date}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(d) => {
            if (!d) {
              onChange('')
              return
            }
            onChange(toIso(d, time))
          }}
        />
      </div>
      <Input
        type="time"
        disabled={disabled}
        value={time}
        onChange={(e) => {
          const t = e.target.value
          if (!date) {
            return
          }
          onChange(toIso(date, t))
        }}
        className="h-12 w-full shrink-0 rounded-md border-gray-100 bg-white text-xs sm:w-[132px]"
      />
    </div>
  )
}
