---
name: react-router-v7
description: React Router v7 framework-mode patterns, route modules, data loading, and navigation
---

# React Router v7 (Framework Mode)

## Route Module API

Every route module in `app/routes/` can export these:

```tsx
import type { Route } from './+types/routename'

// Data loading (runs on server during SSR, or client on navigation)
export async function loader({ request, params }: Route.LoaderArgs) {
  return { data: 'value' }
}

// Form/mutation handling
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData()
  // process form data
  return { success: true }
}

// Page metadata
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: 'Page Title' },
    { name: 'description', content: 'Page description' },
  ]
}

// Stylesheets and preloads
export const links: Route.LinksFunction = () => [
  { rel: 'stylesheet', href: '/styles/page.css' },
]

// The page component (default export)
export default function PageComponent({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.data}</div>
}

// Error handling
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <div>Something went wrong</div>
}
```

## Typed Routes

- Types are auto-generated in `.react-router/types/`
- Run `pnpm typecheck` (which runs `react-router typegen && tsc`) to regenerate
- Import types from the `./+types/` virtual directory:
  ```tsx
  import type { Route } from './+types/home'
  ```
- `Route.LoaderArgs`, `Route.ActionArgs`, `Route.MetaArgs`, `Route.ComponentProps` are all available

## Registering Routes

Routes are registered in `app/routes.ts`:

```ts
import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from '@react-router/dev/routes'

export default [
  // Index route
  index('routes/home.tsx'),

  // Named route
  route('about', 'routes/about.tsx'),

  // Route with params
  route('users/:id', 'routes/user-detail.tsx'),

  // Layout wrapping child routes
  layout('routes/dashboard-layout.tsx', [
    index('routes/dashboard/index.tsx'),
    route('settings', 'routes/dashboard/settings.tsx'),
  ]),

  // Route prefix (no layout component)
  ...prefix('api', [route('health', 'routes/api/health.tsx')]),
] satisfies RouteConfig
```

## Data Patterns

### Loading data

```tsx
// In route module
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')
  const data = await fetchData(query)
  return { items: data }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <ul>
      {loaderData.items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### Form mutations

```tsx
import { Form, redirect } from 'react-router'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  await saveData(Object.fromEntries(formData))
  return redirect('/success')
}

export default function NewItem() {
  return (
    <Form method='post'>
      <input name='title' required />
      <button type='submit'>Create</button>
    </Form>
  )
}
```

## Navigation

```tsx
import { Link, NavLink, useNavigate } from "react-router";

// Declarative
<Link to="/about">About</Link>

// With active styling
<NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
  Dashboard
</NavLink>

// Programmatic
const navigate = useNavigate();
navigate("/home");
```

## Important Notes

- All imports come from `"react-router"` (NOT `"react-router-dom"`)
- `loader` and `action` run on the server when SSR is enabled
- Use `redirect()` from `"react-router"` for server-side redirects
- Use `Response` objects for custom status codes or headers
- The `headers` export controls caching: `export function headers() { return { "Cache-Control": "..." }; }`
