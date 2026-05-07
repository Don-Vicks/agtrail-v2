---
name: component-patterns
description: Component structure, TypeScript patterns, and code organization conventions
---

# Component Patterns

## File Organization

```
app/
├── components/          # Shared/reusable components
│   ├── ui/              # Generic UI primitives (Button, Input, Card, etc.)
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── [feature]/       # Feature-specific components
│       └── feature-card.tsx
├── routes/              # Route modules (registered in routes.ts)
├── lib/                 # Utilities, API clients, helpers
│   ├── utils.ts
│   └── api/
├── hooks/               # Custom React hooks
│   └── use-debounce.ts
├── types/               # Shared TypeScript types/interfaces
│   └── index.ts
└── constants/           # App-wide constants
    └── index.ts
```

## Component Template

```tsx
// app/components/ui/button.tsx

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
```

## Key Conventions

### Naming

- **Files**: kebab-case (`user-profile.tsx`, `use-auth.ts`)
- **Components**: PascalCase (`UserProfile`, `AuthProvider`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useDebounce`)
- **Utilities**: camelCase (`formatDate`, `cn`)

### Imports

- Always use the `~/` path alias for app-internal imports:
  ```tsx
  import { Button } from '~/components/ui/button'
  import { useAuth } from '~/hooks/use-auth'
  import { formatDate } from '~/lib/utils'
  ```

### TypeScript

- Use `interface` for component props (extendable, cleaner syntax)
- Use `type` for unions, intersections, and utility types
- Export types alongside components when they may be reused
- Prefer explicit return types on utility functions, implicit on components

### Server vs Client Code

- Place server-only code in `.server/` directories or `.server.ts` files
  ```
  app/lib/db.server.ts       # Only available on server
  app/components/.client/     # Only available on client
  ```
- This is enforced by the bundler — server code cannot be imported client-side

### Props Patterns

```tsx
// Discriminated unions for variant behavior
interface BaseCardProps {
  title: string
  description?: string
}

interface LinkCard extends BaseCardProps {
  variant: 'link'
  href: string
}

interface ActionCard extends BaseCardProps {
  variant: 'action'
  onClick: () => void
}

type CardProps = LinkCard | ActionCard
```

### Composition over Inheritance

```tsx
// Use children and render props, not deep inheritance
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
```

## Design Standards

- **Rounding**: Use `rounded-md` for all cards, buttons, inputs, and containers to ensure a consistent, professional, and balanced visual language.
- **Sizing & Density**: 
    - Use `h-9` for standard inputs, selects, and buttons to maintain a high-density, professional layout.
    - Reduce internal padding in KPI cards (typically `p-4`) to create a compact "at-a-glance" experience.
- **Typography**: 
    - Use uppercase with tracking for labels: `text-[9px] font-bold uppercase tracking-widest text-gray-400`.
    - Use bold, tight tracking for main values: `text-xl font-black text-gray-900 tracking-tight`.
- **Badges**: Use small, uppercase badges for status indicators: `text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md`.
