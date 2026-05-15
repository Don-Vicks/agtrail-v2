import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export const transporterRoutes: RouteConfig = [
  layout('routes/transporter/layout.tsx', [
    ...prefix('transporter', [
      index('routes/transporter/dashboard.tsx'),
      route('pickup', 'routes/transporter/pickup.tsx'),
      route('transit', 'routes/transporter/transit.tsx'),
      route('delivery', 'routes/transporter/delivery.tsx'),
      route('history', 'routes/transporter/history.tsx'),
      route('history/:id', 'routes/transporter/history-detail.tsx'),
      route('transfer/product-transfer', 'routes/transporter/transporter-transfer-offers.tsx'),
      route('transfer/history', 'routes/transporter/transporter-transfer-history.tsx'),
    ]),
  ]),
]
