---
type: feature
priority: medium
created: 2026-04-05T00:00:00Z
status: reviewed
implemented: 2026-04-05T12:00:00Z
reviewed: 2026-04-05T00:00:00Z
tags: [portfolio, demos, ux]
keywords: [ImageCarousel, UNSSimulatorDemo, ScriptProfilerDemo, modal, lightbox, Framer Motion, AnimatePresence]
patterns: [modal overlay, click-to-expand, image lightbox, portal rendering, keyboard accessibility]
---

# FEATURE-001: Demo Image Lightbox Modal on Click

## Description
When a user clicks a demo screenshot in the image carousel, a full-screen lightbox modal should open showing the image at maximum readable size. The modal should be dismissible via keyboard (Escape), clicking the backdrop, or a close button.

## Context
The Demos section contains two image carousels (`UNSSimulatorDemo` and `ScriptProfilerDemo`). Screenshots are currently constrained to the carousel container width, making fine details hard to read. A lightbox pattern is the standard UX solution and requires no new dependencies — Framer Motion and Lucide are already in the stack.

## In Scope
- Clicking the current carousel image opens a centered modal overlay with the image at full/large size
- Modal is dismissible via: Escape key, clicking the backdrop, and an explicit close (X) button
- Modal uses Framer Motion `AnimatePresence` for enter/exit animation (consistent with existing carousel animation style)
- The close button and nav arrows (prev/next) use Lucide icons already in the project
- Lightbox should support carousel navigation (prev/next) so the user can browse images without closing
- Implementation lives in `ImageCarousel.tsx` — no changes needed to `UNSSimulatorDemo` or `ScriptProfilerDemo`

## Out of Scope
- No new npm dependencies
- No zoom/pinch gestures
- No download button
- No caption or alt-text display in the modal (image already has an `alt` attribute)
- No changes to the carousel's existing prev/next behavior outside the modal

## Requirements

### Functional
- Clicking the carousel image sets a `modalOpen: boolean` state flag in `ImageCarousel`
- Modal renders as a fixed full-viewport overlay (`position: fixed, inset-0, z-50`)
- Image is displayed centered with `max-h-[90vh] max-w-[90vw] object-contain`
- Backdrop is semi-transparent dark (`bg-black/80`)
- Close button (X icon from Lucide) is positioned top-right of the modal
- Pressing Escape closes the modal (`useEffect` keydown listener, cleaned up on unmount)
- Modal prev/next arrows allow navigating carousel images without closing
- Modal respects the same `direction` + `variants` animation pattern already used in the carousel

### Non-Functional
- Modal should not shift page scroll position (use `overflow-hidden` on `document.body` while open)
- Focus should be trapped or at minimum moved to the modal on open
- Animation must match the site's existing Framer Motion style (no jarring transitions)

## Current State
`ImageCarousel.tsx` renders a contained `<div>` with an animated `<motion.img>` and prev/next buttons. There is no click handler on the image and no modal/overlay exists.

## Desired State
`ImageCarousel.tsx` renders the same carousel, but the image is wrapped in a `<button>` or has an `onClick` that opens a Framer Motion modal overlay. The modal shows the full image with prev/next navigation and a close control.

## Research Context

### Keywords to Search
- `ImageCarousel` — the only component that needs to change
- `AnimatePresence` — already imported; reuse for modal enter/exit
- `motion.img`, `motion.div` — animation primitives already in use
- `X` (Lucide icon) — close button icon to import
- `useEffect` — needed for Escape key listener

### Patterns to Investigate
- How `AnimatePresence` + `mode="wait"` is used in the current carousel — modal should follow same pattern
- Body scroll lock pattern (`document.body.style.overflow = 'hidden'`) while modal is open
- `createPortal` from `react-dom` — consider rendering modal outside the carousel DOM tree to avoid stacking context issues

### Decisions Already Made
- Implementation confined to `ImageCarousel.tsx` — keeps changes minimal and consistent across both demo carousels
- No new dependencies — Framer Motion + Lucide cover all needs
- Cursor on the carousel image should change to `cursor-zoom-in` to signal clickability

## Success Criteria

### Automated Verification
- [ ] `npm run build` passes with no TypeScript errors
- [ ] `npm run lint` passes with no new warnings

### Manual Verification
- [ ] Click a demo screenshot → modal opens with full-size image
- [ ] Click backdrop → modal closes
- [ ] Press Escape → modal closes
- [ ] Click X button → modal closes
- [ ] Prev/next arrows inside modal navigate images correctly
- [ ] Carousel index stays in sync when modal closes
- [ ] Page does not scroll while modal is open
- [ ] Works in both light and dark mode
- [ ] Works on mobile viewport (image fits within 90vw/90vh)

## Notes
- Consider `cursor-zoom-in` on the carousel image to hint at clickability.
- The modal overlay should use `z-50` or higher to render above the sticky Navbar (`z-40` or similar).
- Check Navbar z-index in `Navbar.tsx` before choosing a z-index for the modal.
