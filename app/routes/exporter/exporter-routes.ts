import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export const exporterRoutes: RouteConfig = [
  layout('routes/exporter/layout.tsx', [
    ...prefix('exporter', [
      index('routes/exporter/dashboard.tsx'),
      route('products', 'routes/exporter/products.tsx'),
      route('scan-qr', 'routes/exporter/scan-qr.tsx'),
      route('batch-details', 'routes/exporter/batch-details.tsx'),
      route('weight', 'routes/exporter/weight.tsx'),
    ]),
  ]),
]
