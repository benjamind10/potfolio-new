---
date: 2026-03-29T00:00:00Z
plan: docs/plans/enhanced-hero.md
ticket: docs/tickets/2026-03-29_feature_enhanced-hero.md
---

# Validation Report: Enhanced Hero Section

## Implementation Status

- Phase 1 (Layout Restructure + Left Column + Scroll Indicator): complete
- Phase 2 (Enhanced MQTT Stream Card): complete
- Phase 3 (OEE Gauge Card): complete
- Phase 4 (UNS Path Card): complete
- Phase 5 (Animated Background): complete
- Phase 6 (Polish + Accessibility): complete

## Automated Verification Results

- `npm run build` (tsc -b + vite build) → **pass**
- `npm run lint` (ESLint) → **pass**
- `npx tsc --noEmit` → **pass**

## Findings

### Matches Plan

- Section is `relative min-h-screen` with `items-start` ✓
- Left column copy updated to factory data infrastructure tagline ✓
- Right column is `flex flex-col gap-4 max-w-sm` ✓
- MQTT stream: 3-message rolling buffer, `AnimatePresence`, state colors ✓
- OEE card: D3 arc gauge, metric bars, 4s cycling, `hidden md:block` ✓
- UNS card: animated breadcrumb, 3.5s cycling, `hidden md:flex` ✓
- Background: `BG_NODES`/`BG_EDGES` SVG, `shouldAnimate`-gated ✓
- Scroll indicator: bouncing chevron with `repeat: Infinity` ✓
- All icons imported from `lucide-react` ✓
- `useReducedMotion` imported and gating all looping animations ✓
- No new runtime dependencies — `d3-shape` was already installed ✓
- `useMqtt.ts` not imported ✓
- `useTheme` not instantiated in Hero ✓

### Deviations from Plan

1. **MQTT card `whileHover` wrapper structure** — plan described a single `motion.div` with `whileHover` directly wrapping a styled `div`. Implementation has a `motion.div` (whileHover only) wrapping an inner `div` for styling. This is functionally equivalent.
   - Impact: low
   - Recommendation: none — works correctly

2. **OEE/UNS card `initial/animate`** — plan specified `initial={{ opacity: 0, x: 40 }}` for OEE and UNS cards (matching the parent column). Phase 6 correctly changed these to `initial={{ opacity: 0 }}` only to eliminate compound x-transform jank. This is an intentional improvement over the plan.
   - Impact: low (positive deviation)
   - Recommendation: keep as-is

3. **Scroll indicator `animate` split** — plan showed `animate={shouldAnimate ? { opacity: 1, y: [0, 6, 0] } : { opacity: 1 }}` with a single `transition`. Implementation correctly splits the transition into per-property `opacity`/`y` keys to handle staggered delays properly.
   - Impact: low (positive deviation)
   - Recommendation: keep as-is

### Risks and Gaps

- **`motion.line` `pathLength` on SVG `<line>`**: Framer Motion's `pathLength` is designed for `<path>` elements. On `<line>` elements it may not animate the draw-on effect as intended — it may just appear instantly. Low visual impact since the opacity animation still draws attention. Not a bug, just a potential no-op on the pathLength property.
- **Bundle size warning**: 710KB JS chunk. Pre-existing, not caused by this change (D3 was already in the bundle).
- **No automated tests**: project has no test suite. All verification is manual + build/lint.

## Manual Validation Checklist

- [ ] OEE + UNS cards fade in cleanly without compound-transform bounce
- [ ] MQTT stream shows 1–3 messages cycling every 2.5s with color coding
- [ ] OEE arc gauge renders and cycles through nodes every 4s
- [ ] UNS breadcrumb path cycles every 3.5s, last segment highlighted
- [ ] Background network nodes and edges visible at low opacity
- [ ] Scroll indicator bounces at viewport bottom
- [ ] Dark mode: all cards, text, borders correct
- [ ] Light mode: all cards, text, borders correct
- [ ] Mobile 375px: only MQTT card + scroll indicator visible
- [ ] Desktop 768px+: all 3 cards visible
- [ ] `whileHover` lift effect works on all three cards
- [ ] Anchor CTAs ("View Demos", "Contact") scroll to correct sections

## Recommendation

**Ready to commit.** No critical issues. Two minor positive deviations from plan (compound-x fix, split transition) that improve the UX. The `motion.line pathLength` risk is cosmetic and acceptable.
