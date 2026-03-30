---
date: 2026-03-29
git_commit: e03ac1d
branch: main
repository: portfolio
topic: "Hero dashboard cards layout bounce on content cycle"
tags: research, hero, animation, layout-shift, framer-motion
last_updated: 2026-03-29
---

## Ticket Synopsis

All 3 Hero dashboard cards (MQTT stream, OEE gauge, UNS path) cause layout bounce when their content cycles on timers. On mobile the bounce compounds and shifts the entire page.

## Summary

Each card has a distinct bounce mechanism. The MQTT card is the worst offender — it explicitly animates `height: 0` on exiting messages, collapsing them in-flow. The UNS path card uses `AnimatePresence mode="wait"` which removes the breadcrumb from the DOM between exit and enter, causing the card to shrink. The OEE gauge card has the lowest risk but can flash briefly between SVG swaps. The fix pattern is the same for all three: use a **relative-positioned fixed-height container** with **absolute-positioned animated content** so exiting elements don't affect layout flow.

## Detailed Findings

### Card 1: MQTT Stream (High bounce risk)

**Location:** `Hero.tsx:240-296`

- Message container at line 261: `<div className="flex flex-col gap-1.5 min-h-[96px]">`
- `min-h-[96px]` prevents collapse below 96px, but natural height with 3 messages exceeds this — no upper bound.
- `AnimatePresence` at line 262 uses default `"sync"` mode (entering + exiting coexist).
- **Exit animation at line 268:** `exit={{ opacity: 0, height: 0 }}` — this is the primary bounce source. The exiting message collapses its height from ~48px to 0 over 0.3s **in normal flow**, pushing siblings upward.
- Data flow (line 117-119): Every 2.5s, `setMessages(prev => [...prev.slice(-2), newMsg])` — maintains 3 messages, removing oldest.

**Fix approach:** Make the message list container `relative` with a fixed height, and position message items `absolute` so exits don't affect flow. Or simpler: remove `height: 0` from exit and use opacity-only exit within an `overflow-hidden` container.

### Card 2: OEE Gauge (Low bounce risk)

**Location:** `Hero.tsx:298-394`

- `AnimatePresence mode="wait"` at line 324 — old SVG exits fully before new one mounts.
- SVG has fixed dimensions: `width={96} height={96}` at line 327.
- Exit is opacity-only: `exit={{ opacity: 0 }}` — no height/y animation.
- **Bounce source:** The wrapper `<div className="relative flex-shrink-0">` at line 323 has no explicit dimensions — sized by its child SVG. During `mode="wait"`, there's a brief moment between unmount and mount where the wrapper has no children and could collapse to 0.
- Metric bars (lines 362-391) are outside AnimatePresence and update instantly.

**Fix approach:** Add explicit `w-[96px] h-[96px]` to the gauge wrapper div so it maintains size even with no children.

### Card 3: UNS Path (Medium bounce risk)

**Location:** `Hero.tsx:396-462`

- Card container has no fixed height, no min-height, no overflow-hidden.
- `AnimatePresence mode="wait"` at line 414 — breadcrumb exits before new one enters.
- Breadcrumb uses `flex-wrap` at line 417, so different paths could wrap to different heights.
- Exit: `exit={{ opacity: 0, y: -4 }}` — the `y` is a transform (no layout effect), but the element is **removed from flow** after exit completes.
- **Bounce source:** During the 0.35s exit + gap before mount, the breadcrumb row is absent from the card, shrinking it by ~20-40px.
- OEE preview section (lines 442-461) is outside AnimatePresence, no height change.

**Fix approach:** Make the breadcrumb area `relative` with a `min-h` and position the animated breadcrumb `absolute` within it. Or switch from `mode="wait"` to default mode with absolute positioning on both entering and exiting elements.

### whileHover scale: 1.01 — Not a Factor

All 3 cards use `whileHover={{ y: -4, scale: 1.01 }}`. Both `y` and `scale` are CSS transforms — they don't affect layout flow. Not a bounce contributor.

## Architecture Insights

### Recommended Fix Pattern (same for all 3 cards)

The standard Framer Motion pattern to avoid layout shift during AnimatePresence transitions:

```tsx
{/* Fixed-size relative container */}
<div className="relative h-[Xpx] overflow-hidden">
  <AnimatePresence mode="wait">
    <motion.div
      key={...}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* content */}
    </motion.div>
  </AnimatePresence>
</div>
```

Key principles:
1. **Relative container with explicit height** — never collapses
2. **Absolute positioned animated content** — exits don't affect flow
3. **overflow-hidden** — prevents visual overflow during transitions
4. **mode="wait"** — cleaner than sync for single-item swaps

### Per-Card Fix Specifics

| Card | Container fix | Content positioning | Height value |
|------|--------------|-------------------|-------------|
| MQTT Stream | Fixed height on message area | Remove `height: 0` from exit; use opacity-only | ~120px (3 messages) |
| OEE Gauge | Add `w-[96px] h-[96px]` to gauge wrapper | Already works (fixed SVG size) | 96px |
| UNS Path | Fixed min-height on breadcrumb area | Absolute position the animated breadcrumb | ~24px (single line) |

## Historical Context

- `docs/plans/enhanced-hero.md` — The Hero redesign plan created the 3-card layout but didn't address layout stability during transitions.
- `docs/architecture.md:151-170` — Animation conventions document FadeInWrapper and inline motion.div patterns but don't cover AnimatePresence layout stability.

## Open Questions

- What's the exact pixel height needed for the MQTT message container with 3 messages at all viewport widths? May need responsive height or a measured approach.
- Should the UNS breadcrumb container account for potential 2-line wrapping, or are all paths short enough for 1 line?
