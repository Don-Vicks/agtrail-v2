---
description: Build and typecheck the project for production
---

# Build & Typecheck

// turbo-all

1. Generate route types and run TypeScript type checking:

```bash
pnpm typecheck
```

2. Create the production build:

```bash
pnpm build
```

3. (Optional) Serve the production build locally:

```bash
pnpm start
```

The production server runs at `http://localhost:3000`.
