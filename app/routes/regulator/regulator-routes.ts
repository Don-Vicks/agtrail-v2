import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

export const regulatorRoutes: RouteConfig = [
  layout('routes/regulator/layout.tsx', [
    ...prefix('regulator', [
      index('routes/regulator/dashboard.tsx'),
      route('violations', 'routes/regulator/violations.tsx'),
      route('regional-drilldown', 'routes/regulator/regional-drilldown.tsx'),
      route('inspection-report', 'routes/regulator/inspection-report.tsx'),
      route('reports', 'routes/regulator/reports.tsx'),
    ]),
  ]),
]
