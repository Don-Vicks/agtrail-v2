---
description: How to add a new route to the application
---

# Add a New Route

## Steps

1. **Create the route module** in `app/routes/`:

```tsx
// app/routes/<name>.tsx
import type { Route } from './+types/<name>'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Page Title' },
    { name: 'description', content: 'Page description' },
  ]
}

export default function PageName() {
  return (
    <div>
      <h1>Page Title</h1>
    </div>
  )
}
```

2. **Register the route** in `app/routes.ts`:

```ts
import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('<path>', 'routes/<name>.tsx'), // Add this line
] satisfies RouteConfig
```

3. **Generate types** so the `./+types/<name>` import resolves:

// turbo

```bash
pnpm typecheck
```

## Adding a Route with a Loader

If the route needs to load data:

```tsx
// app/routes/<name>.tsx
import type { Route } from './+types/<name>'

export async function loader({ request, params }: Route.LoaderArgs) {
  // Fetch data here
  return { items: [] }
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: 'Page Title' }]
}

export default function PageName({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {loaderData.items.map((item: any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Adding a Nested Layout Route

1. Create the layout module:

```tsx
// app/routes/dashboard-layout.tsx
import { Outlet } from 'react-router'

export default function DashboardLayout() {
  return (
    <div>
      <nav>{/* sidebar / nav */}</nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

2. Register with children in `routes.ts`:

```ts
import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  layout('routes/dashboard-layout.tsx', [
    index('routes/dashboard/index.tsx'),
    route('settings', 'routes/dashboard/settings.tsx'),
  ]),
] satisfies RouteConfig
```
