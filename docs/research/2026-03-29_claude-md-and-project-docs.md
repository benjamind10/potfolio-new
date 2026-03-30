---
date: 2026-03-29T00:00:00Z
git_commit: 38c1c63
branch: main
repository: portfolio
topic: "Create CLAUDE.md and Project Documentation"
tags: research, documentation, architecture, react, mqtt, uns, theming
last_updated: 2026-03-29T00:00:00Z
---

## Ticket Synopsis
Create `CLAUDE.md`, `docs/architecture.md`, and update `README.md` so AI assistants and contributors understand the portfolio SPA without re-exploring the codebase each session.

## Summary
The portfolio is a React 19 + TypeScript + Vite SPA for Ben Duran — an Industry 4.0 engineer. It has no backend. Key complexity lives in three areas: (1) class-based dark/light theming with localStorage persistence, (2) a dual-mode MQTT Explorer (simulated vs live HiveMQ broker), and (3) two separate UNS data structures serving different visualizations (tree walk vs D3 graph). All page sections are flat imports in `App.tsx`. The `FadeInWrapper` component is the sole shared animation primitive. There are no tests, no router, and no state management library.

## Detailed Findings

### Component Architecture
- **Entry point**: `src/main.tsx` mounts `<App />` into `#root` (`index.html`)
- **Root**: `src/App.tsx:9-23` — flat import of all page sections; no routing; single scrollable page
- **Page sections** (order): `Navbar → Hero → About → Experience → Demos → Contact → Footer`
- **Each section** has an `id` attribute used by `react-scroll` for smooth navigation: `hero`, `about`, `experience`, `demos`, `contact`
- **Scroll offset**: All nav links use `offset={-96}` to account for the sticky navbar height
- **Max-width constraint**: All sections use `max-w-6xl mx-auto` for consistent centering

### Theme System
- Hook: `src/hooks/useTheme.ts:3-32`
- Reads from `localStorage.theme` first; falls back to `window.matchMedia('prefers-color-scheme: dark')`
- Applies class `dark` or `light` to `document.documentElement`
- Tailwind dark mode is class-based: `darkMode: 'class'` implied by `dark:` prefix usage
- Toggle function exported: `{ theme, toggle }` — consumed only by `src/components/Navbar.tsx:7`
- **Gotcha**: `useTheme` is instantiated only in `Navbar`. All other components rely on CSS class inheritance.

### MQTT Integration
- **Ambient hook** (`src/hooks/useMqtt.ts`): connects at module load time, subscribes to `#` (all topics), logs to console only. Not used by any component directly — appears to be a standalone connection experiment or placeholder.
- **MQTTExplorer component** (`src/components/MQTTExplorer.tsx`): has its own independent MQTT client instantiated in `useEffect`. Dual-mode:
  - **Simulated** (default): `setInterval` at 2000ms generates fake factory messages from `simulatedTopics` array (lines 13-17)
  - **Live**: connects to `import.meta.env.VITE_MQTTBROKER` (HiveMQ WSS), subscribes to `#`, parses JSON payloads
  - Messages capped at 50: `prev.slice(-49)` pattern (lines 48, 66)
  - Selected topic updated automatically on each new message
- **Env var**: `VITE_MQTTBROKER=wss://broker.hivemq.com:8884/mqtt` (`.env` file)
- **JSON rendering**: uses `react-json-view-lite` `<JsonView>` component

### UNS Data Structures
Two separate data files serve different consumers:

| File | Shape | Consumer | Purpose |
|------|-------|----------|---------|
| `src/data/unsData.ts` | `UnsNode` tree with `fullPath`, optional `payload` | `UNSExplorer.tsx` | Expandable click-to-drill tree UI |
| `src/data/unsTree.ts` | Simple `{ name, children[] }` | `NamespaceExplorer.tsx` | D3 hierarchy layout |

- `unsData` models `Enterprise/Richmond/Press/Line1` with OEE metrics as leaf payload
- `unsTree` models `factory/line1/machine1/{state,infeed,outfeed}` — simpler, no payloads

### UNS Visualization Components
- **UNSExplorer** (`src/components/UNSExplorer.tsx`): pure React, expand/collapse via `Record<string, boolean>` state keyed by `node.fullPath`. Renders leaf payloads as `<pre>` JSON blocks.
- **NamespaceExplorer** (`src/components/NamespaceExplorer.tsx`): D3-powered SVG, 600×500px. Uses `d3.hierarchy` + `d3.tree` layout. Highlights random leaf node every 2000ms via `setInterval`. **Note**: `NamespaceExplorer` is NOT currently used in `Demos.tsx` — it is defined but not imported.

### Demos Tab System
- `src/components/Demos.tsx:7-16` defines `TABS` array with 3 active tabs: `uns`, `mqtt`, `profiler`
- `LogSimulator` and `NamespaceExplorer` are commented out
- Default active tab: `mqtt` (line 19)
- Tab switching: local `useState` — no URL state

### Animation Pattern
- `src/components/common/FadeInWrapper.tsx`: wraps Framer Motion `motion.div`
  - Props: `delay` (default 0), `yOffset` (default 20), `className`
  - Uses `whileInView` with `viewport={{ once: false }}` — re-animates on scroll back
  - Used in: `About.tsx`, `Contact.tsx`
  - Hero uses raw `motion.div` with `initial/animate` (not whileInView — plays on mount)
  - Experience uses raw `motion.div` with `whileInView` directly

### Styling Conventions
- **Framework**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` content array needed)
- **Dark mode**: `dark:` prefixes throughout; root div in `App.tsx` sets base: `bg-white text-gray-900 dark:bg-gray-900 dark:text-white`
- **Accent color**: `indigo-500` / `indigo-600` used consistently for interactive elements
- **Section divider**: `<div className="w-20 h-1 bg-indigo-500 rounded mb-8" />` pattern repeated in every section
- **cn utility**: `src/utils/cn.ts` — simple filter+join classname helper (not clsx/cn from shadcn)
- **Prettier**: single quotes, 2-space indent, 80-char width, ES5 trailing commas

### Build & Dev
```
npm run dev      # vite (HMR dev server)
npm run build    # tsc -b && vite build (type-checks first)
npm run lint     # eslint .
npm run preview  # vite preview (serve dist/)
```
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters` enabled in `tsconfig.app.json`
- Vite config minimal: just `react()` + `tailwindcss()` plugins
- No path aliases configured

### Assets
- `public/computer-chip.png` — favicon
- `src/assets/profile_pic.jpg` — About section photo
- `src/assets/script-profiler-1.png`, `script-profiler-2.png` — Java module demo screenshots
- `public/resume.pdf` — linked from About section download button (must exist in public/)

### Contact Form
- `src/components/Contact.tsx` — UI only, no form submission handler. Submit button does nothing currently.

## Architecture Insights
1. **No router** — single page, scroll-based navigation only
2. **No global state** — `useTheme` is the only cross-component state; everything else is local
3. **Two MQTT connections possible** — `useMqtt.ts` connects at module load (if imported) AND `MQTTExplorer` connects its own client. Currently `useMqtt.ts` is not imported anywhere in the component tree, so only one connection exists when live mode is active.
4. **NamespaceExplorer is dead code** — defined but not used in Demos tab
5. **Contact form is non-functional** — no submission handler or backend
6. **resume.pdf must exist** in `public/` or the download link 404s

## Historical Context (from documentation)
- No ADRs or design docs exist — this is the first documentation for the project
- `README.md` is stock Vite template (not project-specific)

## Open Questions
- Should `NamespaceExplorer` be re-enabled as a 4th demo tab?
- Should `LogSimulator` be re-enabled?
- Is `useMqtt.ts` intentionally unused or a future integration point?
- Does `public/resume.pdf` currently exist?
