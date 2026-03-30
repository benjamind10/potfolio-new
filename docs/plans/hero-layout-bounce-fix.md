---
status: complete
checkpoint: done
ticket: docs/tickets/2026-03-29_bug_hero-layout-bounce.md
research: docs/research/2026-03-29_hero-layout-bounce.md
created: 2026-03-29T00:00:00Z
---

# Hero Layout Bounce Fix — Implementation Plan

## Overview

All 3 Hero dashboard cards bounce when their content cycles on timers, causing layout shifts that are especially jarring on mobile. The fix stabilizes each card's height so animated content transitions happen within fixed containers.

## Current State Analysis

| Card | Bounce cause | Severity |
|------|-------------|----------|
| MQTT Stream | `exit={{ opacity: 0, height: 0 }}` collapses exiting messages in normal flow (line 268) | High |
| OEE Gauge | `mode="wait"` removes SVG between exit/enter; wrapper has no explicit size (line 323) | Low |
| UNS Path | `mode="wait"` removes breadcrumb from flow; card has no min-height (line 414) | Medium |

## Desired End State

- All 3 cards maintain constant height during content transitions
- Fade/slide animations still play smoothly
- No page jump on mobile or desktop

## What We Are Not Doing

- Changing animation timing or intervals
- Modifying card content or data sources
- Adding new dependencies

## Implementation — Single Phase

All changes are in one file: `src/components/Hero.tsx`

**Phase status:** complete

### Fix 1: MQTT Stream Card (lines 261-293)

**Problem:** `exit={{ height: 0 }}` animates height collapse in-flow.

**Change:** Replace the message container with a fixed-height `relative overflow-hidden` wrapper. Remove `height: 0` from exit — use opacity-only exit instead.

```
Line 261: Change message container div
  FROM: <div className="flex flex-col gap-1.5 min-h-[96px]">
  TO:   <div className="relative h-[120px] overflow-hidden">

Line 262-293: Render only the latest 3 messages absolutely positioned
  - Each message gets absolute positioning based on index
  - Exit: opacity-only (no height: 0)
```

Specific changes:
- Line 261: `"flex flex-col gap-1.5 min-h-[96px]"` → `"relative h-[120px] overflow-hidden"`
- Line 264-270: Each `motion.div` message needs positioning. Since messages are a list of 3, position them with `style={{ top: index * 40px }}` or use flex inside an absolute wrapper.
- Line 268: `exit={{ opacity: 0, height: 0 }}` → `exit={{ opacity: 0 }}`

**Simpler approach:** Keep flex layout but fix the container height and remove height animation from exit:
- Line 261: `"flex flex-col gap-1.5 min-h-[96px]"` → `"flex flex-col gap-1.5 h-[120px] overflow-hidden"`
- Line 268: `exit={{ opacity: 0, height: 0 }}` → `exit={{ opacity: 0 }}`

### Fix 2: OEE Gauge Card (line 323)

**Problem:** Gauge wrapper `<div className="relative flex-shrink-0">` has no explicit size — collapses briefly when SVG unmounts.

**Change:** Add explicit dimensions matching the SVG.

```
Line 323:
  FROM: <div className="relative flex-shrink-0">
  TO:   <div className="relative flex-shrink-0 w-[96px] h-[96px]">
```

Also make the animated SVG absolute so it doesn't affect the wrapper during transitions:

```
Line 325: Add className="absolute inset-0" to motion.svg
```

### Fix 3: UNS Path Card (lines 414-440)

**Problem:** `mode="wait"` removes the breadcrumb from flow between exit and enter, shrinking the card.

**Change:** Wrap the AnimatePresence in a fixed-height relative container; make the animated breadcrumb absolute.

```
Line 413-440: Wrap in a fixed-height container:
  <div className="relative h-5 overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        ...existing props...
        className="absolute inset-x-0 flex flex-wrap items-center gap-1 font-mono text-xs"
      >
        ...breadcrumb content unchanged...
      </motion.div>
    </AnimatePresence>
  </div>
```

## File Changes Summary

| File | Lines | Change |
|------|-------|--------|
| `src/components/Hero.tsx:261` | Message container | `min-h-[96px]` → `h-[120px] overflow-hidden` |
| `src/components/Hero.tsx:268` | MQTT exit animation | Remove `height: 0` from exit |
| `src/components/Hero.tsx:323` | Gauge wrapper | Add `w-[96px] h-[96px]` |
| `src/components/Hero.tsx:325` | Gauge SVG | Add `className="absolute inset-0"` |
| `src/components/Hero.tsx:413-440` | UNS breadcrumb area | Wrap in `relative h-5 overflow-hidden`, make breadcrumb `absolute` |

## Verification

### Automated
- [x] Build passes
  - Executed via local Node entrypoints because `npm`/`node` were not available on `PATH` in the sandboxed shell:
    - `node .\\node_modules\\typescript\\bin\\tsc -b`
    - `node .\\node_modules\\vite\\bin\\vite.js build`

### Manual
- [ ] Desktop: Watch each card cycle for 30s — no visible bounce
- [ ] Mobile (or devtools responsive mode): No page jump when any card updates
- [ ] All 3 card animations still play (fade transitions visible)
- [ ] Hover effect still works on all cards

## Execution Notes

- Implemented the simpler MQTT fix from this plan:
  - retained the flex column layout
  - changed the message viewport to fixed height with `overflow-hidden`
  - removed `height: 0` from the exit animation
- Implemented both fixed-container changes for the OEE gauge and UNS breadcrumb exactly as planned.

## Review Handoff

- Expected review artifact: `docs/reviews/hero-layout-bounce-fix-review.md`
- Next step: `use bd-5-verify with docs/plans/hero-layout-bounce-fix.md`

## Rollback

Single file change — `git checkout src/components/Hero.tsx` reverts everything.
