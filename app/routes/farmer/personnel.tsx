import { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Breadcrumb } from '~/components/breadcrumb'
import { PersonField } from '~/components/person-field'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

const mockPersonnel = [
  {
    id: '1',
    fullName: 'Olamide Olutekunbi',
    phoneNumber: '+234 801 234 5678',
    emailAddress: 'olamide@example.com',
    role: 'Farm Manager',
    farmAssignments: ['Farm A', 'Farm B'],
    employmentType: 'Permanent',
    employeeId: 'EMP001',
    startDate: '2023-01-15',
    certifications: ['Pesticide License', 'Organic Farming Cert'],
    emergencyContactName: 'Adebayo Olutekunbi',
    emergencyContactPhone: '+234 802 345 6789',
    status: 'Active',
    notes: 'Experienced manager with 5+ years in agribusiness'
  },
  {
    id: '2',
    fullName: 'Grace Adebayo',
    phoneNumber: '+234 803 456 7890',
    emailAddress: 'grace@example.com',
    role: 'Supervisor',
    farmAssignments: ['Farm A'],
    employmentType: 'Permanent',
    employeeId: 'EMP002',
    startDate: '2023-03-01',
    certifications: ['Safety Training'],
    emergencyContactName: 'John Adebayo',
    emergencyContactPhone: '+234 804 567 8901',
    status: 'Active',
    notes: 'Dedicated supervisor focused on quality control'
  },
  {
    id: '3',
    fullName: 'Ahmed Musa',
    phoneNumber: '+234 805 678 9012',
    emailAddress: 'ahmed@example.com',
    role: 'Field Operator',
    farmAssignments: ['Farm B'],
    employmentType: 'Seasonal',
    employeeId: 'EMP003',
    startDate: '2024-01-01',
    certifications: [],
    emergencyContactName: 'Fatima Musa',
    emergencyContactPhone: '+234 806 789 0123',
    status: 'Active',
    notes: 'Seasonal worker specializing in maize cultivation'
  },
]

export function meta() {
  return [{ title: 'Personnel | Agtrail' }]
}

export default function FarmerPersonnel() {
  const [search, setSearch] = useState('')
  const [newPerson, setNewPerson] = useState('')
  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor') 
    ? '/processor' 
    : location.pathname.startsWith('/cooperative') 
      ? '/cooperative' 
      : '/farmer'

  const filtered = useMemo(() => {
    return mockPersonnel.filter((p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="space-y-6 pb-10">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: basePath },
          { label: 'Personnel' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-brand">Personnel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage farm operators and supervisors</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search personnel..."
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
            />
          </div>
          <PersonField
            id="new-person"
            label="Add New Person"
            value={newPerson}
            onChange={setNewPerson}
            placeholder="Enter name"
            className="w-full sm:w-80"
          />
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((person) => (
            <div key={person.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{person.fullName}</h3>
                    <Badge variant={person.status === 'Active' ? 'default' : 'secondary'}>
                      {person.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <p className="text-gray-900">{person.role}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">{person.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">{person.emailAddress}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Employee ID:</span>
                      <p className="text-gray-900">{person.employeeId}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Employment Type:</span>
                      <p className="text-gray-900">{person.employmentType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Start Date:</span>
                      <p className="text-gray-900">{person.startDate}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Farm Assignments:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.farmAssignments.map((farm) => (
                          <Badge key={farm} variant="outline" className="text-xs">
                            {farm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {person.certifications.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Certifications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {person.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Emergency Contact:</span>
                      <p className="text-gray-900">{person.emergencyContactName}</p>
                      <p className="text-gray-600">{person.emergencyContactPhone}</p>
                    </div>
                    {person.notes && (
                      <div>
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="text-gray-900 text-sm mt-1">{person.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-10">No personnel match your search.</div>
          )}
        </div>
      </div>
    </div>
  )
}
