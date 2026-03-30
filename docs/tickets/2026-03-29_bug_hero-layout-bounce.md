---
type: bug
priority: high
created: 2026-03-29T00:00:00Z
status: implemented
tags: portfolio, hero, animation, mobile
keywords: Hero.tsx, AnimatePresence, motion.div, setMessages, oeeIndex, unsIndex, layout shift, min-h, whileHover
patterns: animation-triggered layout shift, dynamic content height, mobile viewport stability
---

# BUG: Hero dashboard cards cause layout bounce when content cycles

## Description

All 3 animated dashboard cards in the Hero section (MQTT stream, OEE gauge, UNS path) cause a visible layout bounce/shift when their content updates on a timer. On mobile this is especially bad — the entire page jumps because the cards change height as content animates in/out.

## Context

The Hero section has 3 cards in the right column that cycle content on intervals (2.5s, 4s, 3.5s). Each uses Framer Motion `AnimatePresence` for transitions. When content swaps, the card height changes momentarily, causing everything below to shift. On mobile all 3 cards are now stacked vertically (we removed `hidden md:` classes), so the bounce compounds and affects the whole viewport.

## In Scope

- Fix all 3 Hero dashboard cards to have stable/fixed heights during content transitions
- Ensure no layout shift on both desktop and mobile
- Keep existing fade/slide animations — just prevent height changes

## Out of Scope

- Changing the animation style or timing intervals
- Modifying card content or data
- Removing cards or hiding them on mobile again
- Other sections beyond Hero

## Current State

- MQTT stream card: `min-h-[96px]` on the message container, but `AnimatePresence` exit animations cause height collapse
- OEE gauge card: `AnimatePresence mode="wait"` on the SVG causes height flicker during swap
- UNS path card: `AnimatePresence mode="wait"` on the breadcrumb causes height change during swap

## Desired State

- All 3 cards maintain a constant height during content transitions
- Animations (fade, slide) still play but within a fixed-size container
- No visible page jump on desktop or mobile

## Research Context

### Keywords to Search

- `AnimatePresence` — wraps all cycling content; its exit/enter flow causes the height shift
- `min-h-[96px]` — existing partial fix on MQTT card message container
- `setMessages` — MQTT card state update trigger (2.5s interval)
- `oeeIndex` / `unsIndex` — OEE and UNS card cycling triggers
- `whileHover` — hover scale effect may compound the shift

### Patterns to Investigate

- AnimatePresence with `mode="wait"` vs `mode="popLayout"` — wait removes old before adding new (height collapses)
- Using `position: absolute` for exiting elements so they don't affect layout
- Fixed height containers vs `overflow-hidden` to contain height changes
- Framer Motion `layout` prop interactions with AnimatePresence

### Decisions Already Made

- Keep animations — just fix the layout shift
- All 3 cards need fixing, not just the MQTT card

## Success Criteria

### Automated Verification

- [x] Build passes

### Manual Verification

- [ ] MQTT stream card: no visible bounce when messages cycle (desktop + mobile)
- [ ] OEE gauge card: no visible bounce when gauge data cycles
- [ ] UNS path card: no visible bounce when path cycles
- [ ] Page does not jump on mobile when any card updates
- [ ] Animations still play smoothly

## Notes

- The core issue is likely that `AnimatePresence mode="wait"` removes the old element (collapsing height) before inserting the new one. Switching to absolute positioning for the animated content within a fixed-height relative container is the standard fix.
- The MQTT card already has `min-h-[96px]` but this may not be tall enough for 3 messages, and the exit animation still collapses height within that space.
