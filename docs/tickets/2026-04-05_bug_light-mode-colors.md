---
type: bug
priority: high
created: 2026-04-05T00:00:00Z
status: reviewed
tags: [portfolio, styling, theming, tailwind]
keywords: [dark:, bg-gray-900, bg-gray-800, bg-[#0e0f1a], bg-[#0f111a], text-white, text-gray-300, text-gray-400, light mode, dark mode, theme toggle]
patterns: [hardcoded dark colors without light-mode counterpart, missing dark: prefix pairing, theme-unaware components]
---

# BUG-008: Light mode colors broken across multiple components

## Description
When the theme is toggled to light mode, several components retain dark-mode colors (dark backgrounds, light text on light backgrounds). The root cause is hardcoded dark color values (e.g., `bg-[#0e0f1a]`, `bg-gray-900`, `bg-gray-800`, `text-white`) used **without** corresponding `dark:` variant pairing — meaning they look the same in both modes.

## Context
The portfolio uses Tailwind class-based dark mode (`dark` class on `<html>`). The pattern is `bg-white dark:bg-gray-900`, but many components skip the light-mode class entirely and just use the dark value as the default. This makes light mode look almost identical to dark mode in affected areas.

## In Scope
- **Footer** (`Footer.tsx`): `bg-[#0f111a]`, `border-gray-700`, `text-gray-400` — all hardcoded dark, no light variants
- **Contact form** (`Contact.tsx`): `bg-gray-900`, `border-gray-700`, `bg-gray-800` inputs, `text-white` labels — entire form is dark-only
- **Contact social icons** (`Contact.tsx`): `bg-gray-800 text-gray-200` — dark-only
- **Hero dashboard cards** (`Hero.tsx`): all three cards use `bg-[#0e0f1a]`, `border-gray-700`, hardcoded dark text colors — no light variants
- **Experience tags** (`Experience.tsx`): `bg-indigo-900/50 text-indigo-300 border-indigo-700/40` — dark palette only
- **Demos tab buttons** (`Demos.tsx`): inactive tabs use `bg-gray-800 text-gray-300` — dark-only
- **Full app audit**: review all remaining components (Navbar, About, App.tsx, index.css) for similar issues

## Out of Scope
- Color palette redesign (keep existing indigo accent scheme)
- Adding new components or layout changes
- Functionality changes (form behavior, MQTT, animations)
- Accessibility audit beyond color contrast

## Requirements

### Functional
- Every visible element must have appropriate light-mode and dark-mode color pairings
- Light mode should use light backgrounds (white, gray-50, gray-100) with dark text (gray-800, gray-900)
- Dark mode should continue to look as it does now (no regressions)
- Follow existing project convention: `bg-light dark:bg-dark` pattern

### Non-Functional
- No new dependencies
- Maintain existing Tailwind class-based dark mode strategy
- Keep indigo-500/600 as the accent color in both modes

## Current State

### Footer (`Footer.tsx`)
- Line 7: `bg-[#0f111a]` — hardcoded near-black, no light variant
- Line 7: `border-gray-700` — dark border, no light variant
- Line 9: `text-gray-400` — always gray-400 regardless of mode

### Contact (`Contact.tsx`)
- Line 92-108: Social icon buttons `bg-gray-800 text-gray-200` — always dark
- Line 119: Form container `bg-gray-900 border-gray-700` — always dark
- Lines 123,138,155,171: Labels `text-white` — always white
- Lines 134,149,166,182: Inputs `bg-gray-800 border-gray-700 text-white` — always dark

### Hero (`Hero.tsx`)
- Lines 247,300,399: All three cards `bg-[#0e0f1a]` — hardcoded dark
- Lines 247,300,399: `border-gray-700` — dark border, no light variant
- Various text elements: `text-gray-500`, `text-gray-300`, `text-indigo-300` — no mode pairing

### Experience (`Experience.tsx`)
- Lines 101-102: Tags `bg-indigo-900/50 text-indigo-300 border-indigo-700/40` — dark palette only

### Demos (`Demos.tsx`)
- Line 38: Inactive tabs `bg-gray-800 text-gray-300` — dark-only

## Desired State
All components render with appropriate light-mode colors when the `dark` class is absent from `<html>`:
- Light backgrounds (white/gray-50/gray-100) as defaults, dark backgrounds via `dark:` prefix
- Dark text (gray-800/gray-900) as defaults, light text via `dark:` prefix
- Borders follow the same pattern: `border-gray-200 dark:border-gray-700`
- Tags/badges use light indigo variant in light mode: `bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300`

## Research Context

### Keywords to Search
- `bg-[#0e0f1a]` - hardcoded dark background on Hero cards
- `bg-[#0f111a]` - hardcoded dark background on Footer
- `bg-gray-900` - dark background without `dark:` prefix guard
- `bg-gray-800` - dark background on inputs/buttons without light pair
- `text-white` - white text without `dark:` prefix guard
- `border-gray-700` - dark borders without light pair

### Patterns to Investigate
- Components that use hardcoded hex colors instead of Tailwind dark mode utilities
- Elements with `text-white` or `text-gray-300` as the base (non-`dark:`) class
- Any `bg-gray-{700,800,900}` used without a lighter base class
- The About.tsx skills tags as a reference for the correct light/dark pattern (line 65: `bg-indigo-100 dark:bg-indigo-800`)

### Decisions Already Made
- Keep class-based dark mode (no CSS custom properties migration)
- Keep indigo as accent color
- About.tsx skills tags already have correct light/dark pairing — use as reference pattern

## Success Criteria

### Automated Verification
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes with no new warnings

### Manual Verification
- [ ] Toggle to light mode — Footer has light background, dark text, visible borders
- [ ] Toggle to light mode — Contact form has white/light background, dark labels, visible input borders
- [ ] Toggle to light mode — Contact social icons have light background
- [ ] Toggle to light mode — Hero dashboard cards have light backgrounds with appropriate contrast
- [ ] Toggle to light mode — Experience tags are readable with light indigo background
- [ ] Toggle to light mode — Demo tab buttons have light inactive style
- [ ] Toggle to dark mode — everything still looks as it did before (no regressions)
- [ ] No flash of wrong colors on page load in either mode

## Notes
- `About.tsx` skills tags (line 65) are already correctly paired: `bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-100` — use this as the canonical pattern for all similar elements
- The Hero cards intentionally have a "terminal" aesthetic — in light mode, consider using `bg-white dark:bg-[#0e0f1a]` or `bg-gray-50 dark:bg-[#0e0f1a]` with a subtle border to maintain the card feel without the jarring dark block
