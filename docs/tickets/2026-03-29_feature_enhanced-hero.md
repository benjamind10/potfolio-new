---
type: feature
priority: high
created: 2026-03-29T00:00:00Z
status: reviewed
tags: portfolio, hero, animation, data-viz
keywords: Hero.tsx, MQTTExplorer, unsData, OEE, Framer Motion, animation, dashboard, gauges, UNS tree, MQTT card, scroll indicator
patterns: data flow from unsData.ts into Hero, MQTT payload cycling, Framer Motion animation composition, responsive layout, dark mode pairing
---

# FEATURE-001: Enhanced Hero Section — Animated Industrial Dashboard Feel

## Description

Redesign the Hero section to create a visually impactful first impression that communicates Ben's Industry 4.0 expertise at a glance. The current hero is a simple two-column layout (text left, single MQTT log card right) that undersells the portfolio's depth. The enhanced version should feel like a living industrial dashboard — multiple animated data elements, subtle animated background, and a polished data-visualization aesthetic.

## Context

This is a personal portfolio for an Industry 4.0 Software Engineer. The hero is the first thing recruiters and hiring managers see. It needs to immediately convey technical depth in MQTT, UNS, and industrial data systems — not just say it in text, but show it through animated, data-driven visuals. The project already has rich data (UNS tree with OEE payloads, MQTT topic structures) that can be leveraged to make the hero feel alive.

## In Scope

- Redesign Hero.tsx with an animated industrial dashboard aesthetic
- Evolve the existing MQTT log card into multiple animated cards/elements:
  - Mini MQTT message stream (evolved from current card)
  - Animated OEE gauge or metric visualization (sourcing data from unsData.ts)
  - Mini UNS topic tree snippet or breadcrumb trail
- Add a subtle animated background (network graph, particle mesh, gradient animation, or similar)
- Rework intro text/messaging for stronger impact (keep name, title, CTAs)
- Add animated scroll-down indicator (chevron/arrow) at bottom of hero
- Maintain full mobile responsiveness (graceful fallback for complex animations)
- Maintain dark/light mode support with proper Tailwind class pairing
- New dependencies are allowed if they deploy cleanly on Vercel (no native/binary deps)

## Out of Scope

- Changes to Navbar, About, Experience, Demos, Contact, or Footer components
- Duplicating the skills badges from About into Hero
- Adding routing or global state
- Backend or API changes
- Changes to page section order in App.tsx
- Heavy WebGL/canvas libraries that would bloat bundle significantly (prefer CSS/SVG/Framer Motion; lightweight canvas libs like tsparticles are acceptable)

## Requirements

### Functional

- Hero displays Ben's name, title ("Industry 4.0 Software Engineer"), and a compelling tagline
- At least 3 animated data elements visible on desktop (MQTT card, OEE metric, UNS path/tree snippet)
- MQTT card cycles through realistic payloads (evolve current `formatMqttPayload` pattern)
- OEE visualization pulls real values from `unsData.ts` and animates between them
- UNS element shows topic path hierarchy (e.g., `Enterprise/Richmond/Press/Line1/Machine1`)
- Animated background adds depth without distracting from content
- "View Demos" and "Contact" CTAs remain prominent
- Scroll-down indicator animates at bottom of hero viewport
- All elements animate in on mount with staggered timing (Framer Motion)

### Non-Functional

- Mobile responsive: on small screens, simplify to 1-2 data elements stacked vertically; background animation can be reduced or hidden
- Dark/light mode: all new elements must pair `text-gray-X dark:text-gray-Y` and `bg-X dark:bg-Y`
- Performance: animations should not cause jank on mid-range devices; use `will-change` and GPU-composited properties where appropriate
- Deployable on Vercel with zero config (no native modules, no server-side requirements)
- Accessible: animated elements should respect `prefers-reduced-motion`

## Current State

The hero is a two-column layout:
- **Left**: "Hello! I'm" label, "Ben Duran" heading, subtitle, tagline paragraph, two CTA buttons
- **Right**: Single dark MQTT log card that cycles through 4 states (`RUNNING`, `STOPPED`, `IDLE`, `ERROR`) every 3 seconds, displaying a JSON payload

The animation is limited to a simple slide-in from left/right on mount. The MQTT card has a hover lift effect. There is no background treatment, no scroll indicator, and only one data visualization element.

**Current file**: `src/components/Hero.tsx` (104 lines)

## Desired State

A hero section that feels like a glimpse into a live industrial control room:
- **Left column**: Refined typography with stronger visual hierarchy. Same CTAs but potentially restyled for more impact.
- **Right column / floating elements**: Multiple animated cards arranged in an overlapping or dashboard-grid layout:
  1. **MQTT Stream Card** — evolved version of current card, possibly showing multiple messages streaming
  2. **OEE Gauge/Metric** — circular gauge, animated number counter, or bar showing OEE percentage from unsData
  3. **UNS Breadcrumb/Path** — animated topic path that cycles through different nodes in the UNS tree
- **Background**: Subtle animated element (particle network, gradient mesh, or floating connection lines) that reinforces the "connected systems" theme
- **Scroll indicator**: Animated down-chevron or "scroll" indicator at viewport bottom
- **Staggered entrance**: Elements animate in sequentially for a polished reveal

## Research Context

### Keywords to Search

- `Hero.tsx` — current implementation to evolve
- `unsData.ts` — UNS tree data with OEE payloads to source metrics from
- `formatMqttPayload` — current MQTT payload generator to evolve
- `FadeInWrapper` — existing animation wrapper pattern to potentially reuse
- `motion.div` — Framer Motion usage patterns in the project
- `cn()` — classname utility for conditional classes
- `useTheme` — dark/light mode hook (consumed by Navbar, hero must respect theme)
- `tsparticles` / `@tsparticles/react` — potential dependency for particle background
- `framer-motion` layout animations — for staggered card reveals

### Patterns to Investigate

- How Framer Motion `initial/animate/transition` is composed across existing components
- How `unsData.ts` OEE values are structured and can be iterated for cycling display
- Dark mode class pairing pattern used across all components
- Responsive breakpoint patterns (`md:` prefix usage) for mobile fallback
- How `prefers-reduced-motion` can be integrated with Framer Motion's `useReducedMotion`

### Decisions Already Made

- Keep skills badges out of hero (avoid duplication with About section)
- New dependencies are allowed if Vercel-compatible (no native/binary)
- Mobile must be fully supported, not just a graceful degradation
- Background animation: yes, subtle, reinforcing "connected systems" theme
- Scroll indicator: yes, animated chevron at bottom

## Success Criteria

### Automated Verification

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] No TypeScript strict-mode violations

### Manual Verification

- [ ] Hero loads with staggered animation on desktop (Chrome, Firefox)
- [ ] At least 3 distinct animated data elements visible on desktop
- [ ] MQTT card cycles through payloads automatically
- [ ] OEE metric displays and animates with real values from unsData
- [ ] UNS path/breadcrumb cycles through tree nodes
- [ ] Background animation is visible but not distracting
- [ ] Scroll indicator animates at bottom of viewport
- [ ] Dark mode: all elements render correctly with proper contrast
- [ ] Light mode: all elements render correctly with proper contrast
- [ ] Mobile (375px): layout stacks cleanly, no overflow, reduced animation complexity
- [ ] Tablet (768px): layout adapts appropriately
- [ ] No visible jank or frame drops during animations
- [ ] `prefers-reduced-motion` disables or reduces animations
- [ ] "View Demos" and "Contact" buttons work (scroll to correct sections)
- [ ] Deploys successfully on Vercel

## Notes

- The `unsData.ts` tree has 10 leaf machines/stations, each with OEE, Availability, Quality, and Performance values. These can be cycled through for the OEE gauge element.
- The existing `mqttStates` array and `formatMqttPayload` function can be extended to show richer payloads (temperature, pressure, cycle count, etc.) for a more convincing MQTT stream.
- Consider using `AnimatePresence` from Framer Motion for smooth transitions when cycling data elements.
- The `unsTree.ts` file has a simpler `{name, children}` structure that could also be useful for the UNS path display.
