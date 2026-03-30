---
type: feature
priority: medium
created: 2026-03-29T00:00:00Z
status: created
tags: portfolio, demos, ui
keywords: Demos.tsx, ScriptProfilerDemo, TABS array, uns-sim, script-profiler, carousel, image gallery
patterns: tab-switching, component-import, asset-import, image-gallery
---

# FEATURE: Replace Interactive Demos with Image Gallery Demos

## Description

Replace all existing interactive demo tabs (UNS Explorer, MQTT Explorer, Script Profiler) with two image-based demo tabs:

1. **UNS Simulator** — carousel/slideshow of 5 screenshots (`uns-sim-1.png` through `uns-sim-5.png`)
2. **Ignition Java Module** — carousel/slideshow of 2 screenshots (`script-profiler-1.png`, `script-profiler-2.png`)

## Context

The portfolio currently has interactive demos (MQTT Explorer, UNS Explorer) and a static screenshot gallery (Script Profiler). The user wants to simplify the demo section to only showcase image-based demos with a carousel UI, removing the interactive components.

## In Scope

- Create a reusable image carousel/slideshow component (prev/next navigation, single image visible at a time)
- Create a UNS Simulator demo component using the 5 `uns-sim-*.png` images
- Update the Ignition Java Module demo to use the carousel pattern instead of vertical stack
- Replace the `TABS` array in `Demos.tsx` to only include these two demos
- Remove imports of `UNSExplorer` and `MQTTExplorer` from `Demos.tsx`

## Out of Scope

- Deleting the UNSExplorer, MQTTExplorer, or related files (they can remain as dead code)
- Adding new image assets (all images already exist in `src/assets/`)
- Changing the Demos section layout, heading, or overall structure beyond the tabs
- Auto-play, thumbnails, or advanced carousel features
- Captions or descriptions on individual images

## Requirements

### Functional

- Carousel shows one image at a time with prev/next navigation buttons
- Navigation wraps around (last → first, first → last) or disables at boundaries
- Active image indicator (dots or counter like "2 / 5")
- Images are responsive and maintain aspect ratio
- Both demo tabs use the same carousel component with different image sets

### Non-Functional

- Follow existing styling conventions: Tailwind, dark mode pairing, indigo accent
- Use Framer Motion for slide transitions (consistent with rest of site)
- Carousel component should be reusable (accepts an array of image imports)

## Current State

- `Demos.tsx` has 3 active tabs: UNS Explorer, MQTT Explorer, Script Profiler
- `ScriptProfilerDemo.tsx` renders images in a vertical stack (no carousel)
- 5 `uns-sim-*.png` images exist in `src/assets/` but are unused
- 2 `script-profiler-*.png` images exist and are used by `ScriptProfilerDemo.tsx`

## Desired State

- `Demos.tsx` has 2 tabs: UNS Simulator, Ignition Java Module
- Both tabs render an image carousel/slideshow component
- Carousel has prev/next buttons and an image indicator

## Research Context

### Keywords to Search

- `TABS` — the array in Demos.tsx that defines demo tabs
- `ScriptProfilerDemo` — existing image gallery pattern to refactor
- `uns-sim` — new image assets to incorporate
- `FadeInWrapper` — scroll animation wrapper used in demos section

### Patterns to Investigate

- Tab switching pattern in Demos.tsx
- Image import pattern in ScriptProfilerDemo.tsx
- Framer Motion animation patterns used across components

### Decisions Already Made

- Carousel/slideshow layout (not vertical stack or grid)
- Replace all existing tabs (not add alongside)
- Use existing script-profiler images for Ignition module demo
- No new images needed

## Success Criteria

### Automated Verification

- [ ] `npm run build` passes with no type errors
- [ ] `npm run lint` passes

### Manual Verification

- [ ] Demo section shows exactly 2 tabs: UNS Simulator, Ignition Java Module
- [ ] UNS Simulator tab shows carousel with 5 images and prev/next navigation
- [ ] Ignition Java Module tab shows carousel with 2 images and prev/next navigation
- [ ] Carousel transitions are smooth (Framer Motion)
- [ ] Image indicator shows current position
- [ ] Dark mode styling works correctly
- [ ] Responsive on mobile

## Notes

- The existing `ScriptProfilerDemo.tsx` can be refactored in place or replaced with a new component that uses the shared carousel
- Consider creating the carousel as `src/components/common/ImageCarousel.tsx` for reusability
