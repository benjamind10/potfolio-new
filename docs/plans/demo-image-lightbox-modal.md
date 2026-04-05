# Demo Image Lightbox Modal — Implementation Plan

## Overview
Add a lightbox modal to `ImageCarousel.tsx` so clicking a demo screenshot opens it full-screen with prev/next navigation. Single-file change — no new dependencies, no changes to consumer components.

## Current State Analysis
- `ImageCarousel.tsx` (79 lines) renders an animated image carousel with `AnimatePresence` + `motion.img` and prev/next `ChevronLeft`/`ChevronRight` buttons.
- The carousel wrapper at line 42 has `overflow-hidden`, which will clip any overlay rendered inside it.
- `Navbar.tsx` uses `z-50` — modal must layer above it.
- `UNSSimulatorDemo` and `ScriptProfilerDemo` both pass `images` to `<ImageCarousel>` with no other props. Zero changes needed in either.

## Desired End State
Clicking a carousel image opens a full-viewport lightbox portaled to `document.body`. The lightbox shows the image at `max-h-[90vh] max-w-[90vw]`, has prev/next navigation, and closes via Escape, backdrop click, or X button. Page scroll is locked while open.

## What We Are Not Doing
- Zoom/pinch gestures
- Download button
- Alt-text/caption display in modal
- New npm dependencies
- Changes to `UNSSimulatorDemo.tsx` or `ScriptProfilerDemo.tsx`

## Implementation Approach
Single phase — all changes are in `src/components/common/ImageCarousel.tsx`. The modal is a `createPortal`-rendered overlay with its own `AnimatePresence` for enter/exit. It reuses the existing `index`, `direction`, and `variants` state for image transitions.

---

## Phase 1: Lightbox Modal in ImageCarousel.tsx

### Changes Required

**File: `src/components/common/ImageCarousel.tsx`**

#### 1. New imports
```ts
import { useEffect } from 'react';           // add to existing React import
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';             // add to existing Lucide import
```

#### 2. New state
```ts
const [modalOpen, setModalOpen] = useState(false);
```

#### 3. Escape key + body scroll lock effect
```ts
useEffect(() => {
  if (!modalOpen) return;
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setModalOpen(false);
  };
  document.addEventListener('keydown', onKey);
  return () => {
    document.body.style.overflow = prev;
    document.removeEventListener('keydown', onKey);
  };
}, [modalOpen]);
```

#### 4. Add `cursor-zoom-in` + `onClick` to carousel image
Add `onClick={() => setModalOpen(true)}` and `cursor-zoom-in` to the `<motion.img>` className.

#### 5. Render modal via portal
After the carousel `<div>`, conditionally render the lightbox through `createPortal`:

```tsx
{modalOpen &&
  createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
        onClick={() => setModalOpen(false)}   // backdrop click closes
      >
        {/* Close button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
        >
          <X size={24} />
        </button>

        {/* Prev/Next */}
        <button onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
        >
          <ChevronLeft size={28} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600"
        >
          <ChevronRight size={28} />
        </button>

        {/* Image with slide animation */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}  // don't close when clicking image
          />
        </AnimatePresence>

        {/* Counter */}
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-300">
          {index + 1} / {images.length}
        </span>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )}
```

Key implementation details:
- `z-[60]` ensures modal renders above the Navbar's `z-50`.
- `e.stopPropagation()` on prev/next/image clicks prevents backdrop-close from firing.
- Reuses the existing `prev()`, `next()`, `index`, `direction`, and `variants` — carousel and modal share one set of state, so they stay in sync.
- Counter in lightbox mirrors the inline counter for orientation.

### Success Criteria

#### Automated Verification
- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run lint` — no new warnings

Completed on 2026-04-05: `npm run build` and `npm run lint` executed — both passed.

#### Manual Verification
- [ ] Click carousel image → lightbox opens with full-size image
- [ ] Click backdrop → lightbox closes
- [ ] Press Escape → lightbox closes
- [ ] Click X button → lightbox closes
- [ ] Prev/next arrows in lightbox navigate images
- [ ] Carousel index matches after lightbox closes
- [ ] Page does not scroll while lightbox is open
- [ ] Light mode + dark mode both look correct
- [ ] Mobile viewport — image fits within 90vw/90vh
- [ ] Both UNS Simulator and Script Profiler carousels get the feature automatically

---

## Testing Strategy
- **Automated:** `npm run build` (TypeScript type check + Vite build), `npm run lint` (ESLint)
- **Manual:** Walk through every manual verification item above in Chrome + mobile responsive view
- No unit test framework is configured in this project, so no unit tests to add.

## Rollback/Mitigation Notes
- Single file changed (`ImageCarousel.tsx`). Revert with `git checkout -- src/components/common/ImageCarousel.tsx`.
- No schema, config, or infrastructure changes. No migration needed.

---

Implementation Complete: Demo Image Lightbox Modal

All phases are complete and recorded in this plan.

Changes Made:
- `src/components/common/ImageCarousel.tsx` — added `modalOpen` state, Escape key + body-scroll lock effect, `onClick` to open image, and a `createPortal` lightbox with prev/next/X/backdrop handlers.

Verification Status:
- Automated: passed — `npm run build` and `npm run lint` executed successfully on 2026-04-05.
- Manual: please perform the manual verification checklist in the "Manual Verification" section above.

NEXT STEP: Run full verification
Copy and run: /bd-5-verify docs/plans/demo-image-lightbox-modal.md
