import { Label } from '~/components/ui/label'
import { Select } from '~/components/ui/select'

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
    (val: string) => {
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
        placeholder={placeholder}
      >
        <Select.Trigger>
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>
        <Select.Content>
          {filteredPersonnel.map((person) => (
            <Select.Item key={person.id} value={person.fullName}>
              {person.fullName} - {person.role}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}
