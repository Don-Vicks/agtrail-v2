---
name: tailwind-v4
description: Tailwind CSS v4 patterns — CSS-first config, @theme blocks, and Vite plugin
---

# Tailwind CSS v4

## Setup in This Project

- **Vite plugin**: `@tailwindcss/vite` (configured in `vite.config.ts`)
- **CSS entry**: `app/app.css`
- **No `tailwind.config.js`** — all configuration is CSS-first

## CSS-First Configuration

Tailwind v4 replaces `tailwind.config.js` with CSS directives:

```css
/* app/app.css */
@import 'tailwindcss';

@theme {
  --font-sans:
    'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
```

### `@import "tailwindcss"`

- Single import replaces the old `@tailwind base/components/utilities` directives
- Must be at the top of the CSS file

### `@theme` Block

Use `@theme` to define design tokens (custom values available as utilities):

```css
@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;

  /* Fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing (extends default scale) */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Border radius */
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Shadows */
  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07);

  /* Breakpoints */
  --breakpoint-xs: 30rem;

  /* Animations */
  --animate-fade-in: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

These become usable as utilities:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--font-mono` → `font-mono`
- `--spacing-18` → `p-18`, `m-18`, `w-18`, `gap-18`
- `--radius-xl` → `rounded-md`
- `--animate-fade-in` → `animate-fade-in`

## Dark Mode

This project uses `prefers-color-scheme` (OS-level):

```css
html,
body {
  @apply bg-white dark:bg-gray-950;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

Use Tailwind's `dark:` variant in markup:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"></div>
```

## Custom Utilities with `@utility`

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}
```

Usage: `<div class="scrollbar-hidden">`

## Custom Variants with `@variant`

```css
@variant hocus (&:hover, &:focus);
```

Usage: `<button class="hocus:ring-2">`

## Key Differences from Tailwind v3

| v3                              | v4                                 |
| ------------------------------- | ---------------------------------- |
| `tailwind.config.js`            | `@theme` block in CSS              |
| `@tailwind base/components/...` | `@import "tailwindcss"`            |
| `@layer` for custom styles      | `@utility` / `@variant` directives |
| PostCSS plugin                  | Vite plugin (`@tailwindcss/vite`)  |
| `content` array for scanning    | Automatic detection (no config)    |
