import { Label } from '~/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { useGetPersonnel } from '~/lib/api/generated/personnel/personnel'

import { useCallback, useState } from 'react'

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
  const { data } = useGetPersonnel()
  const personnel = data?.data?.data ?? []

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

  // Filter personnel based on role when possible; fall back to all active personnel if no match.
  const activePersonnel = personnel.filter((person) => person.status === 'active')
  const filteredByRole = roleFilter
    ? activePersonnel.filter((person) => {
        const roleText = `${person.designatedRole ?? ''} ${person.type ?? ''}`.toLowerCase()
        return roleText.includes(roleFilter.toLowerCase())
      })
    : activePersonnel
  const filteredPersonnel = filteredByRole.length > 0 ? filteredByRole : activePersonnel
  const selectedPerson = personnel.find((person) => person.id === inputValue)
  const selectedLabel = selectedPerson
    ? `${selectedPerson.fullName} - ${selectedPerson.designatedRole || selectedPerson.type}`
    : undefined

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
          <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredPersonnel.map((person) => (
            <SelectItem key={person.id} value={person.id}>
              {person.fullName} - {person.designatedRole || person.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={id} value={inputValue} />
    </div>
  )
}
