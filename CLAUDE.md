# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # Type-check (vue-tsc) then bundle (Vite) → dist/
npm run preview   # Preview production build locally
```

No test runner is configured at the package level — the `dimensional-ui/` components have Jest test files but no test script in `package.json`.

## Architecture

This is a **Vue 3 + TypeScript + Vite** single-page landing site for Seb AI (RAG automation agency), deployed on Vercel.

### Page structure

`App.vue` composes the full page as a vertical stack of section components from `src/components/`:
`GeometricBg` → `NavbarSection` → `HeroSection` → `WhatSection` → `ServicesSection` → `PhilosophySection` → `AboutSection` → `CtaSection` → `FooterSection`

No router — it's a single scrollable page.

### Dimensional UI (internal component library)

`src/dimensional-ui/` is a self-contained design system used only by this app:

- **`components/`** — reusable Vue components (`DButton`, `DCard`, `DInput`, `DNavbar`, `DSideNavbar`, `DDropdown`, `DHamburgerButton`)
- **`composables/`** — `useTheme`, `useShadowEffects`, `useShadowUtils`, `useInteractiveStates`
- **`theme/`** — CSS custom properties loaded globally in `main.ts` (`base.css`, `utilities.css`, `tokens.css`)
- **`plugin.js`** — placeholder Vue plugin (not used)

The design language is bold/dimensional: black pixel-offset box shadows (2–5px), accent colors (pink `#FF004D`, yellow `#FFF455`), and "Archivo Black" / "Inter" fonts from Google Fonts.

### CSS loading order (main.ts)

1. `dimensional-ui/theme/base.css`
2. `dimensional-ui/theme/utilities.css`
3. `assets/global.css`

### State & data

- Pure Vue 3 Composition API (`ref`, `computed`) — no Pinia/Vuex
- No backend; form submission goes to Formspree (`https://formspree.io/f/xkoqlwev`) in `CtaSection.vue`
- Rate limiting on form submission uses `localStorage` (60-second cooldown)
- Responsive breakpoint: 768px (hamburger menu, flex layout changes)

### Deployment

Vercel is configured via `vercel.json` to run `npm install --registry=https://registry.npmjs.org/` (forced public registry) and `npm run build`, serving `dist/`.
