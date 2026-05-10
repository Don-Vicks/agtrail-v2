import { Navigate, useSearchParams } from 'react-router'

export function meta() {
  return [{ title: 'Farm Check-In | Field Agent' }]
}

export default function FieldAgentFarmCheckIn() {
  const [searchParams] = useSearchParams()
  const farmId = searchParams.get('farmId')
  const target = farmId
    ? `/field-agent/farms?checkInFarmId=${encodeURIComponent(farmId)}`
    : '/field-agent/farms'

  return <Navigate to={target} replace />
}
