import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'
import { farmerRoutes } from './routes/farmer/farmer-routes'
import { processorRoutes } from './routes/processor/processor-routes'
import { cooperativeRoutes } from './routes/cooperative/cooperative-routes'
import { aggregatorRoutes } from './routes/aggregator/aggregator-routes'
import { fieldAgentRoutes } from './routes/field-agent/field-agent-routes'
import { transporterRoutes } from './routes/transporter/transporter-routes'
import { regulatorRoutes } from './routes/regulator/regulator-routes'
import { exporterRoutes } from './routes/exporter/exporter-routes'

// Triggering re-build for new routes - v3

export default [
  index('routes/home.tsx'),

  // Auth
  layout('routes/auth/layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('register/farmer', 'routes/auth/farmer-registration.tsx'),
  ]),

  route('unauthorized', 'routes/unauthorized.tsx'),
  route('dojah-test', 'routes/dojah-test.tsx'),
  route('passport/:id', 'routes/public/passport.tsx'),

  // Farmer tenant
  ...farmerRoutes as any,

  // Admin tenant
  layout('routes/admin/layout.tsx', [
    ...prefix('admin', [
      index('routes/admin/dashboard.tsx'),
    ]),
  ]),

  ...processorRoutes as any,
  ...cooperativeRoutes as any,
  ...aggregatorRoutes as any,
  ...fieldAgentRoutes as any,

  // Transporter tenant
  ...transporterRoutes as any,

  // Regulator tenant
  ...regulatorRoutes as any,

  // Exporter tenant
  ...exporterRoutes as any,
] satisfies RouteConfig
