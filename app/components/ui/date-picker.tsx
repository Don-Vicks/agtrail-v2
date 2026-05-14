import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils"

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  className,
  placeholder = "Pick a date",
  disabled,
}: DatePickerProps) {
  const dateStr = value ? new Date(value) : undefined
  const date = dateStr && !isNaN(dateStr.getTime()) ? dateStr : undefined

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal border border-brand/20 bg-white hover:bg-gray-50 focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all shadow-sm rounded-md",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
