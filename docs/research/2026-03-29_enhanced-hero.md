---
date: 2026-03-29T00:00:00Z
git_commit: 38c1c63f91e87f978dd522ea0d50ab2fe2253199
branch: main
repository: portfolio
topic: "FEATURE-001: Enhanced Hero Section — Animated Industrial Dashboard"
tags: research, hero, framer-motion, mqtt, uns, oee, animation, dark-mode, responsive
last_updated: 2026-03-29T00:00:00Z
---

## Ticket Synopsis

Redesign `Hero.tsx` to look like a living industrial dashboard: multiple animated data cards
(MQTT stream, OEE gauge, UNS path breadcrumb), subtle animated background, staggered
mount-triggered animations, scroll indicator, full dark/light and mobile support.

---

## Summary

The current Hero is a two-column mount-animated layout with one cycling MQTT card. The
project's existing data (`unsData.ts`) and animation stack (Framer Motion 12) already
support a rich multi-panel dashboard without adding any mandatory new dependencies. D3 is
already installed but dormant — it can be used for an OEE gauge SVG if needed. Particle
backgrounds (`@tsparticles/react`) would be the only likely new dependency and are
Vercel-safe (pure JS). All critical implementation constraints are known and low-risk.

---

## Detailed Findings

### 1. Current Hero.tsx State

- **File:** `src/components/Hero.tsx` (104 lines)
- Two-column flex layout: `flex-col md:flex-row items-center justify-between max-w-6xl mx-auto` (`Hero.tsx:34`)
- Left column: text copy + two CTA `<a>` anchors (`Hero.tsx:37-69`)
- Right column: single terminal card `bg-[#0e0f1a] text-green-400` (`Hero.tsx:83`)
- MQTT card cycles 4 states (`RUNNING/STOPPED/IDLE/ERROR`) on a 3-second `setInterval` (`Hero.tsx:4,24-28`)
- Both columns use `initial/animate` mount-triggered Framer Motion — **not** `whileInView` (`Hero.tsx:39-41,74-76`)
- Right card has `whileHover` spring: `y: -4, scale: 1.01, stiffness: 220, damping: 18` (`Hero.tsx:77-81`)
- Only `delay: 0.2` stagger between left and right. No multi-element stagger exists yet.
- No scroll indicator. No background animation.

### 2. Framer Motion Animation Patterns

Three distinct patterns are used across the codebase. Hero must use Pattern A only.

| Pattern | Trigger | Viewport once | Used in |
|---|---|---|---|
| A: `initial/animate` | Component mount | N/A | `Hero.tsx:39,74` |
| B: `FadeInWrapper` (whileInView) | Scroll | `once: false` | `About`, `Contact` |
| C: `whileInView` + index stagger | Scroll | `once: true` | `Experience.tsx:73-80` |

- **`AnimatePresence` is absent** — confirmed grep across all `.tsx` files. Safe to introduce for cycling content transitions if desired.
- **Spring config** for `whileHover` is established at `stiffness: 220, damping: 18` (`Hero.tsx:80-81`). Reuse verbatim on new cards.
- Stagger delay pattern: existing cards go to `delay: 0.2`. New cards should cascade: `delay: 0.3`, `0.4`, `0.5`.
- `FadeInWrapper` props: `delay?: number` (default 0), `yOffset?: number` (default 20), `className?: string`. **Do not use FadeInWrapper in Hero** — Hero is always visible on load; `whileInView` won't fire reliably.

### 3. Dark Mode Theming

- Mechanism: `darkMode: 'class'` (`tailwind.config.js:3`) + `@custom-variant dark (&:where(.dark, .dark *))` (`index.css:2`)
- `.dark` class is toggled on `document.documentElement` by `useTheme` (`useTheme.ts:19-24`)
- **`useTheme` must NOT be called in `Hero.tsx`** — it is consumed only by `Navbar.tsx`. Calling it a second time creates a second independent state instance with no effect on the real theme. All Hero dark/light styling must use `dark:` CSS class inheritance.

**Canonical color pairings** (light → dark):

| Role | Light | Dark |
|---|---|---|
| Page bg | `bg-white` | `dark:bg-gray-900` |
| Card/panel bg | `bg-white` | `dark:bg-gray-900` |
| Primary text | `text-gray-900` | `dark:text-white` |
| Secondary text | `text-gray-700` | `dark:text-gray-300` |
| Muted text | `text-gray-600` | `dark:text-gray-400` |
| Border | `border-gray-300` | `dark:border-gray-700` |
| Accent | `text-indigo-600` | `dark:text-indigo-400` |
| Skill pill | `bg-indigo-100 text-indigo-600` | `dark:bg-indigo-800 dark:text-indigo-100` |
| Secondary button | `bg-gray-200 text-gray-800` | `dark:bg-gray-800 dark:text-white` |

- **Terminal card exception**: `bg-[#0e0f1a] text-green-400` — no dark variant, always dark. Intentional aesthetic. Any new "terminal"-style panels should reuse `bg-[#0e0f1a]` exactly. Dashboard-style panels (OEE, UNS path) can use a slightly different card bg (`bg-gray-800/90` or `bg-[#0e0f1a]`) with `text-gray-100` instead of green.

### 4. Responsive Layout Patterns

- Only `md:` breakpoints are used across the codebase — `sm:` is absent everywhere.
- Hero's base pattern: `flex-col` (stacked on mobile) → `md:flex-row` (side-by-side at 768px+)
- Each half: full-width on mobile → `md:w-1/2` on desktop
- Right panel adds `md:pl-10` to create visual separation from the left copy
- **Layout risk**: adding multiple stacked cards to `md:w-1/2` will make the right column significantly taller than the left text block. `items-center` on the parent flex row will center the shorter column, which looks awkward if height delta is large. Two mitigation options:
  1. Use `items-start` on the section flex row for multi-card layout
  2. Constrain card heights so total right-column height roughly matches left-column height
- Mobile strategy: show only the MQTT card on mobile (hide OEE + UNS cards with `hidden md:flex`), or stack all cards with compact sizing

### 5. MQTT Payload Cycling

**Current Hero pattern** (`Hero.tsx:4-28`):
```typescript
const mqttStates = ['RUNNING', 'STOPPED', 'IDLE', 'ERROR'];
// setInterval(3000ms) → random pick → formatMqttPayload(state) → <pre>
// Output: { topic: 'factory/line1/machineA/state', payload: { timestamp, value } }
```

**Enhancement opportunity**: `formatMqttPayload` can be extended to cycle through:
- Multiple realistic topics (borrowing from `MQTTExplorer.tsx:13-24` topic list)
- Richer payloads (temperature, cycle count, pressure) alongside state
- Multiple messages shown as a small stream buffer (array of last N messages) with `AnimatePresence` for smooth entry/exit

**MQTTExplorer's topic list** (`MQTTExplorer.tsx:13-24`) — 10 topics matching the UNS tree:
```
Enterprise/Richmond/Press/Line1/Machine1/state
Enterprise/Richmond/Press/Line1/Machine2/state
... (6 Press topics)
Enterprise/Richmond/Assembly/Line1/Station1/state
... (4 Assembly topics)
```

**Constraint**: do NOT import `useMqtt.ts` — it creates a module-level MQTT connection on import, causing a duplicate live broker connection alongside `MQTTExplorer`. Self-contained `setInterval` is the correct approach for Hero.

### 6. UNS Data — Full Structure

**Source**: `src/data/unsData.ts` — already fully populated with 10 leaf nodes.

```
Enterprise/Richmond/Press/Line1/Machine1   OEE: 0.8565  Avail: 0.92  Qual: 0.98  Perf: 0.95
Enterprise/Richmond/Press/Line1/Machine2   OEE: 0.7912  Avail: 0.88  Qual: 0.96  Perf: 0.94
Enterprise/Richmond/Press/Line2/Machine1   OEE: 0.9102  Avail: 0.95  Qual: 0.99  Perf: 0.97
Enterprise/Richmond/Press/Line2/Machine2   OEE: 0.8234  Avail: 0.91  Qual: 0.95  Perf: 0.95
Enterprise/Richmond/Press/Line3/Machine1   OEE: 0.7645  Avail: 0.85  Qual: 0.97  Perf: 0.93
Enterprise/Richmond/Press/Line3/Machine2   OEE: 0.8891  Avail: 0.93  Qual: 0.98  Perf: 0.98
Enterprise/Richmond/Assembly/Line1/Station1 OEE: 0.8312  Avail: 0.90  Qual: 0.97  Perf: 0.95
Enterprise/Richmond/Assembly/Line1/Station2 OEE: 0.7756  Avail: 0.87  Qual: 0.95  Perf: 0.94
Enterprise/Richmond/Assembly/Line2/Station1 OEE: 0.8978  Avail: 0.94  Qual: 0.99  Perf: 0.96
Enterprise/Richmond/Assembly/Line2/Station2 OEE: 0.8123  Avail: 0.89  Qual: 0.96  Perf: 0.95
```

OEE range: 0.76–0.91. OEE is a pre-computed field (not derived at runtime). All four fields always present on every leaf. `fullPath` values follow the `Enterprise/Richmond/.../NodeName` convention.

**Usage in Hero**: flat-map all leaves, cycle through them on `setInterval`, display OEE + `fullPath` in an animated gauge or counter.

### 7. Available Dependencies

**Runtime (already installed):**

| Package | Version | Relevance to Hero |
|---|---|---|
| `framer-motion` | ^12.12.2 | Primary animation engine — use for all transitions |
| `d3` | ^7.9.0 | **Dormant** — available for SVG OEE arc gauge if desired |
| `lucide-react` | ^0.511.0 | Icons — can use for scroll indicator, card labels |
| `react-scroll` | ^1.9.3 | Smooth scroll — CTAs in Hero use raw `<a>` anchors, not this |
| `react-json-view-lite` | ^2.4.1 | JSON rendering — already used in MQTTExplorer |
| `@emailjs/browser` | ^4.4.1 | Email — irrelevant to Hero |
| `mqtt` | ^5.13.0 | Live MQTT — do NOT use in Hero (see useMqtt constraint) |

**New dependency candidates (Vercel-safe, pure JS):**

| Package | Purpose | Vercel safe? | Bundle size |
|---|---|---|---|
| `@tsparticles/react` + `@tsparticles/slim` | Particle/network background | Yes | ~90KB gzipped |
| `react-countup` | Animated number counter for OEE % | Yes | ~10KB |
| None required | D3 arc gauge, Framer Motion counter | n/a | 0KB extra |

**Recommendation**: D3 is already installed — use it for an OEE arc gauge SVG rather than adding a new charting library. For animated number counting, Framer Motion's `useMotionValue` + `useTransform` can handle it without a new dep. Only add `@tsparticles/react` if a particle background is chosen; it is the lightest Vercel-safe option for that effect.

### 8. cn() Utility

`src/utils/cn.ts` — variadic `filter(Boolean).join(' ')`. Only imported in `MQTTExplorer.tsx:5` currently. Safe and ready to use in Hero for any conditional class joining. Not clsx — does not merge conflicting Tailwind classes, just concatenates. Avoid using it to join classes that conflict (e.g., two `text-*` colors) as the last one won't reliably win.

### 9. Scroll Indicator

No scroll indicator exists anywhere in the codebase. Common pattern: absolutely positioned `motion.div` at bottom of the section with an `animate={{ y: [0, 8, 0] }}` + `transition={{ repeat: Infinity, duration: 1.5 }}` loop. Use a `ChevronDown` icon from `lucide-react`. Should disappear or be hidden on very small screens to avoid covering content.

---

## Architecture Insights

1. **Mount-triggered only in Hero**: Hero is always the first visible section; `whileInView` will not fire reliably. All new animations must use `initial/animate`.
2. **Self-contained simulation**: Every component owns its own data lifecycle. No event bus, no context, no shared MQTT state. New Hero panels should follow the same `useState + setInterval` pattern.
3. **Right column height risk**: The biggest layout challenge. The current single-card right column has constrained height. Adding 2–3 stacked cards will create height imbalance. Best solution: wrap new panels in a `grid grid-cols-1 gap-3` or `flex flex-col gap-3` with `max-w-sm` constraints, and use `items-start` on the parent section flex row.
4. **No AnimatePresence in codebase**: Introducing it is safe and adds the cycling content transitions (fade-out old OEE node, fade-in new one). It should be used for MQTT message stream entries and OEE node cycling.
5. **D3 is available but dormant**: The `NamespaceExplorer` uses it for an SVG tree. An OEE arc gauge using D3's `arc()` path generator is a viable zero-dependency-addition approach for a gauge visualization.
6. **prefers-reduced-motion**: Not implemented anywhere in the codebase. Can be added in Hero via Framer Motion's `useReducedMotion()` hook — if true, skip `transition` animations and disable looping effects (scroll indicator, OEE counter). This is a non-breaking addition.

---

## Historical Context

- `docs/architecture.md` — confirms Hero uses `initial/animate` (not whileInView), and that `useTheme` is Navbar-only
- `docs/research/2026-03-29_ui-ux-enhancements.md` — proposed UNS data expansion and MQTT topic list, both already implemented in current code (verified against source)
- `docs/reviews/ui-ux-enhancements-review.md` — confirms prior UI/UX work is complete; Hero was explicitly noted as "still minimal" and a follow-up item

---

## Open Questions

1. **OEE display format**: Arc gauge (D3 SVG), animated number counter, or horizontal progress bar? D3 gauge is the richest but most complex to implement responsively.
2. **MQTT stream card evolution**: Single cycling payload (current) vs. a small scrolling stream buffer (e.g., last 3 messages with `AnimatePresence`)? Stream buffer is more impressive but requires more state management.
3. **Background animation**: Particle network (`@tsparticles/react`) vs. a pure CSS/Framer Motion gradient animation? Particles are more visually impactful but add a dependency.
4. **Left column text**: Keep current copy, or write stronger tagline that pairs with the dashboard aesthetic?
5. **Right column layout**: Grid of 2–3 cards (e.g., OEE top-right, UNS path bottom-right, MQTT card center) vs. a stacked vertical column of cards? Grid allows for denser information but is harder to make responsive.
