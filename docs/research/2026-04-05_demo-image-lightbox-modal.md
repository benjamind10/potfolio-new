---
date: 2026-04-05T00:00:00Z
git_commit: a379434a9020e44467b4f21b4b75a921fc5ceac8
branch: main
repository: portfolio
topic: "Demo Image Lightbox Modal on Click"
tags: [research, ImageCarousel, lightbox, modal, Framer Motion]
last_updated: 2026-04-05T00:00:00Z
---

## Ticket Synopsis
Add a click-to-expand lightbox modal to `ImageCarousel.tsx` so users can view demo screenshots at full size. All changes confined to the single shared carousel component.

## Summary
Implementation is straightforward — all required tools (Framer Motion, Lucide icons) are already imported. The one non-obvious constraint is that the carousel container uses `overflow-hidden`, which will clip any absolutely-positioned modal rendered inside it. A `createPortal` to `document.body` is required to escape the clipping context.

---

## Detailed Findings

### ImageCarousel.tsx — Current State
- **File:** `src/components/common/ImageCarousel.tsx`
- Already imports: `useState`, `motion`, `AnimatePresence` (Framer Motion), `ChevronLeft`, `ChevronRight` (Lucide)
- The outer carousel container at **line 42** uses `overflow-hidden` — any fixed/absolute overlay rendered as a child will be clipped by this. Modal **must** be portaled to `document.body`.
- No `onClick` handler on the image currently. Image is a `<motion.img>` inside `AnimatePresence`.
- `direction` and `variants` state already exist and can be reused for in-modal prev/next transitions.
- `index` and `setIndex` are local state — shared naturally between carousel and modal since they'll live in the same component.

### Navbar z-index — Stacking Context
- **File:** `src/components/Navbar.tsx:18`
- Navbar uses `z-50`. Modal must use `z-[60]` or higher to render above it.

### Consumer Components — No Changes Needed
- `UNSSimulatorDemo.tsx:29` — passes `images` array directly to `<ImageCarousel>`, no custom props
- `ScriptProfilerDemo.tsx:29` — same pattern, 2 images
- Neither component needs modification; the feature is entirely encapsulated in `ImageCarousel.tsx`

### Available Lucide Icons
- `X` icon: already imported in `Navbar.tsx` — available in the project's Lucide install
- `ChevronLeft` / `ChevronRight`: already imported in `ImageCarousel.tsx`
- Need to add `X` import to `ImageCarousel.tsx`

### Framer Motion Patterns in Use
- `AnimatePresence` with `mode="wait"` and `custom={direction}` for directional slide transitions
- `variants` object defines `enter`, `center`, `exit` with `x` offset + `opacity`
- Same pattern can be reused inside the modal for consistent feel

---

## Architecture Insights

1. **Portal is mandatory.** `overflow-hidden` on the carousel wrapper (`line 42`) will clip a fixed overlay if rendered in the normal component tree. Use `createPortal(modal, document.body)` from `react-dom`.

2. **State co-location is clean.** `index`, `direction`, `setIndex` already live in `ImageCarousel`. Adding `modalOpen: boolean` state keeps everything in one place — no prop drilling or context needed.

3. **Body scroll lock.** Use a `useEffect` tied to `modalOpen` to toggle `document.body.style.overflow`. Clean up on unmount.

4. **Escape key.** Add a `keydown` event listener in a `useEffect` that calls `setModalOpen(false)` on `'Escape'`. Must clean up with `removeEventListener`.

5. **Animation reuse.** The existing `variants` + `AnimatePresence` pattern from the carousel slides can be reused directly inside the modal for image transitions — no new animation logic needed.

---

## Historical Context (from documentation)
- `CLAUDE.md` — confirms Framer Motion 12 and Lucide React are project dependencies
- `CLAUDE.md` — confirms `z-50` is not explicitly reserved, but Navbar uses `z-50`; modal needs `z-[60]`
- `CLAUDE.md` — coding convention: pair light/dark variants; modal backdrop and close button must follow this

---

## Open Questions
- None. Implementation path is fully clear.
