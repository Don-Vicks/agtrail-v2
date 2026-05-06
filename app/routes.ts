import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'
import { processorRoutes } from './routes/processor/processor-routes'
import { cooperativeRoutes } from './routes/cooperative/cooperative-routes'
import { aggregatorRoutes } from './routes/aggregator/aggregator-routes'
import { fieldAgentRoutes } from './routes/field-agent/field-agent-routes'

// Triggering re-build for new routes

export default [
  index('routes/home.tsx'),

  // Auth
  layout('routes/auth/layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('register/farmer', 'routes/auth/farmer-registration.tsx'),
  ]),

  // Farmer tenant
  layout('routes/farmer/layout.tsx', [
    ...prefix('farmer', [
      index('routes/farmer/dashboard.tsx'),
      route('farms', 'routes/farmer/farms.tsx'),
      route('crop-cycle', 'routes/farmer/crop-cycle.tsx'),
      route('products', 'routes/farmer/products/index.tsx'),
      route('products/:id', 'routes/farmer/products/story.tsx'),
      route('farms/:id', 'routes/farmer/farm-detail.tsx'),
      route('inventory', 'routes/farmer/inventory.tsx'),
      route('personnel', 'routes/farmer/personnel.tsx'),

      // Operations Routes
      route('operations/new', 'routes/farmer/record-operation.tsx'),
      route(
        'operations/new/:cropCycleId/land-prep',
        'routes/farmer/operations/land-prep.tsx',
      ),
      route(
        'operations/new/:cropCycleId/planting',
        'routes/farmer/operations/planting.tsx',
      ),
      route(
        'operations/new/:cropCycleId/fertilizer',
        'routes/farmer/operations/fertilizer.tsx',
      ),
      route(
        'operations/new/:cropCycleId/irrigation',
        'routes/farmer/operations/irrigation.tsx',
      ),
      route(
        'operations/new/:cropCycleId/weeding',
        'routes/farmer/operations/weeding.tsx',
      ),
      route(
        'operations/new/:cropCycleId/pest-control',
        'routes/farmer/operations/pest-control.tsx',
      ),
      route(
        'operations/new/:cropCycleId/pruning',
        'routes/farmer/operations/pruning.tsx',
      ),
      route(
        'operations/new/:cropCycleId/harvesting',
        'routes/farmer/operations/harvesting.tsx',
      ),
      route(
        'operations/new/:cropCycleId/sorting',
        'routes/farmer/operations/sorting.tsx',
      ),
      route(
        'operations/new/:cropCycleId/drying',
        'routes/farmer/operations/drying.tsx',
      ),
      route(
        'operations/new/:cropCycleId/processing',
        'routes/farmer/operations/processing.tsx',
      ),
      route(
        'operations/new/:cropCycleId/packaging',
        'routes/farmer/operations/packaging.tsx',
      ),
      route(
        'operations/new/:cropCycleId/storage',
        'routes/farmer/operations/storage.tsx',
      ),
      route(
        'certifications/product',
        'routes/farmer/certifications/product-certification.tsx',
      ),
      route(
        'certifications/farm',
        'routes/farmer/certifications/farm-certification.tsx',
      ),
      route(
        'certifications/view',
        'routes/farmer/certifications/view-certifications.tsx',
      ),
      route(
        'finance/record-purchase',
        'routes/farmer/finance/record-purchase.tsx',
      ),
      route('finance/receivables', 'routes/farmer/finance/receivables.tsx'),

      // Reports & Analytics
      route('reports', 'routes/farmer/reports/reports-analytics.tsx'),

      // Compliance Analysis
      // Compliance Analysis Workflow
      ...prefix('compliance', [
        index('routes/farmer/compliance/compliance-analysis.tsx'),
        route('market', 'routes/farmer/compliance/market-selection.tsx'),
        route('readiness', 'routes/farmer/compliance/readiness-check.tsx'),
        route('report', 'routes/farmer/compliance/compliance-report.tsx'),
      ]),

      // Settings
      route('settings', 'routes/farmer/settings/settings-root.tsx'),

      // Transfer
      route('transfer/product-transfer', 'routes/farmer/farmer-product-transfer.tsx'),
      route('transfer/pickup', 'routes/farmer/farmer-pickup.tsx'),
      route('transfer/history', 'routes/farmer/farmer-transfer-history.tsx'),
    ]),
  ]),

  // Future: buyer, admin tenants follow the same pattern
  // layout('routes/buyer/layout.tsx', [
  //   ...prefix('buyer', [
  //     index('routes/buyer/dashboard.tsx'),
  //   ]),
  // ]),

  ...processorRoutes as any,
  ...cooperativeRoutes as any,
  ...aggregatorRoutes as any,
  ...fieldAgentRoutes as any,

  // Transporter tenant
  layout('routes/transporter/layout.tsx', [
    ...prefix('transporter', [
      index('routes/transporter/dashboard.tsx'),
      route('transfer/product-transfer', 'routes/transporter/transporter-transfer-offers.tsx'),
      route('transfer/history', 'routes/transporter/transporter-transfer-history.tsx'),
    ]),
  ]),
] satisfies RouteConfig
