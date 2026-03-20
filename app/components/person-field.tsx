import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'

import { useCallback, useState } from 'react'

// Mock personnel data - in a real app, this would come from an API or context
const mockPersonnel = [
  { id: '1', fullName: 'Olamide Olutekunbi', role: 'Farm Manager' },
  { id: '2', fullName: 'Grace Adebayo', role: 'Supervisor' },
  { id: '3', fullName: 'Ahmed Musa', role: 'Field Operator' },
]

interface PersonFieldProps {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  roleFilter?: string // Optional filter for specific roles like 'Operator', 'Supervisor'
}

export function PersonField({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = "Select personnel",
  className,
  roleFilter,
}: PersonFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')

  const handleChange = useCallback(
    (val: string | null) => {
      if (val === null) return;
      if (onChange) {
        onChange(val)
      }
      if (value === undefined) {
        setInternalValue(val)
      }
    },
    [onChange, value]
  )

  const inputValue = value !== undefined ? value : internalValue

  // Filter personnel based on role if specified
  const filteredPersonnel = roleFilter 
    ? mockPersonnel.filter(person => person.role.toLowerCase().includes(roleFilter.toLowerCase()))
    : mockPersonnel

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-900">
        {label}
      </Label>
      <Select
        id={id}
        value={inputValue}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredPersonnel.map((person) => (
            <SelectItem key={person.id} value={person.fullName}>
              {person.fullName} - {person.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
