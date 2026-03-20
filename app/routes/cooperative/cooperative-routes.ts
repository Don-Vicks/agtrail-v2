import { type RouteConfig, layout, route } from '@react-router/dev/routes'

export const cooperativeRoutes: RouteConfig = [
  layout('routes/cooperative/layout.tsx', [
    route('cooperative', 'routes/cooperative/dashboard.tsx'),
    route('cooperative/farmers', 'routes/cooperative/farmers.tsx'),
    route('cooperative/farmers/:id', 'routes/cooperative/farmer-details.tsx'),
    route('cooperative/farmers/:id/farms', 'routes/cooperative/farmer-farms.tsx'),
    route('cooperative/farms', 'routes/cooperative/farms.tsx'),
    route('cooperative/farms/:id', 'routes/cooperative/farm-details.tsx'),
    route('cooperative/products', 'routes/cooperative/products/index.tsx'),
    route('cooperative/products/:id', 'routes/cooperative/products/story.tsx'),
    route('cooperative/operations/start', 'routes/cooperative/operations/start.tsx'),
    
    // Operations duplicated from farmer routes
    route('cooperative/operations/record', 'routes/cooperative/operations/record.tsx'),
    route('cooperative/operations/new/:cropCycleId/land-prep', 'routes/cooperative/operations/land-prep.tsx'),
    route('cooperative/operations/new/:cropCycleId/planting', 'routes/cooperative/operations/planting.tsx'),
    route('cooperative/operations/new/:cropCycleId/fertilizer', 'routes/cooperative/operations/fertilizer.tsx'),
    route('cooperative/operations/new/:cropCycleId/irrigation', 'routes/cooperative/operations/irrigation.tsx'),
    route('cooperative/operations/new/:cropCycleId/weeding', 'routes/cooperative/operations/weeding.tsx'),
    route('cooperative/operations/new/:cropCycleId/pest-control', 'routes/cooperative/operations/pest-control.tsx'),
    route('cooperative/operations/new/:cropCycleId/pruning', 'routes/cooperative/operations/pruning.tsx'),
    route('cooperative/operations/new/:cropCycleId/harvesting', 'routes/cooperative/operations/harvesting.tsx'),
    
    // Post-Harvest Operations
    route('cooperative/operations/new/:cropCycleId/sorting', 'routes/cooperative/operations/sorting.tsx'),
    route('cooperative/operations/new/:cropCycleId/drying', 'routes/cooperative/operations/drying.tsx'),
    route('cooperative/operations/new/:cropCycleId/processing', 'routes/cooperative/operations/processing.tsx'),
    route('cooperative/operations/new/:cropCycleId/packaging', 'routes/cooperative/operations/packaging.tsx'),
    route('cooperative/operations/new/:cropCycleId/storage', 'routes/cooperative/operations/storage.tsx'),
  ])
]
