import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export const fieldAgentRoutes: RouteConfig = [
  layout('routes/field-agent/layout.tsx', [
    ...prefix('field-agent', [
      index('routes/field-agent/dashboard.tsx'),
      route('farms', 'routes/field-agent/farms.tsx'),
      route('farms/check-in', 'routes/field-agent/farms-check-in.tsx'),
      route('record-observation', 'routes/field-agent/record-observation.tsx'),
      route('record-observation/new/:id/:operation', 'routes/field-agent/record-observation/new.tsx'),
      route('harvest-approval', 'routes/field-agent/harvest-approval.tsx'),
    ]),
  ]),
]
