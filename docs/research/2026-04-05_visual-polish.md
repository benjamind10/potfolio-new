---
date: 2026-04-05T00:00:00Z
git_commit: e8b08e0e2581f5e08fb09632e12daa5b74b3f26e
branch: main
repository: portfolio
topic: "Visual Polish — Tighter Spacing, Better Hierarchy, Professional Feel"
tags: [research, ui, polish, spacing, typography]
last_updated: 2026-04-05T00:00:00Z
---

## Ticket Synopsis

Refine the portfolio's visual presentation without redesigning it. The indigo
accent palette stays. Goals: reduce excessive whitespace, add visual section
separation, improve typography hierarchy, polish hover/focus states, ensure
consistency across light/dark mode and mobile. Fix the Contact.tsx label bug
as part of this pass.

---

## Summary

The codebase is well-structured but the page suffers from:

1. **Massive inter-section gap** — `space-y-32` (128px) in `App.tsx:13` makes
   the page feel stretched and empty on scroll.
2. **Flat, undifferentiated page** — every section renders on the same
   `bg-white dark:bg-gray-900` background with no visual rhythm between them.
3. **No typography scale system** — section titles are all `text-3xl font-bold`
   with no refinement; body text uses `text-md` (non-standard Tailwind class)
   and `text-lg` inconsistently; no letter-spacing or line-height tuning on
   headings.
4. **Section divider bar is repeated boilerplate** — the `w-20 h-1
   bg-indigo-500 rounded` pattern appears in 4 components verbatim; it is a
   candidate for a shared `<SectionHeader>` component.
5. **Inconsistent shadows** — `shadow-lg`, `shadow-xl`, `shadow-md`, and
   `shadow-sm` are all used without a coherent language.
6. **Contact form label bug** — `text-white` hardcoded on Subject (line 152)
   and Message (line 168) labels; invisible in light mode.
7. **Animation timing** — `FadeInWrapper` does not use an easing function
   (defaults to linear); `once: false` means sections re-animate on scroll
   back, which can feel jittery.
8. **Mobile responsiveness** — only `md:` breakpoints are used throughout; no
   `sm:` breakpoints exist, meaning there is a hard jump from mobile to ≥768px
   with no intermediate adjustment.

---

## Detailed Findings

### 1. Global Spacing

**App.tsx:13** — `<main className="space-y-32">` — 128px between every section.

Section-level top/bottom padding:

| Component | File | Line | Classes |
|-----------|------|------|---------|
| Hero | Hero.tsx | 149 | `pt-24 pb-12` (inside `min-h-screen`) |
| About | About.tsx | 10 | `pt-4 pb-20` |
| Experience | Experience.tsx | 62 | `pt-4 pb-20` |
| Demos | Demos.tsx | 22 | `pt-20 pb-20` |
| Contact | Contact.tsx | 42 | `pt-4 pb-20` |
| Footer | Footer.tsx | 7 | `mt-24` (on `<footer>` element, not `<section>`) |

**Observations:**
- About, Experience, Contact all use `pt-4` — effectively zero top padding
  after the 128px space-y gap, making the section title appear at the very top
  of the visible area.
- Demos uses `pt-20` which adds extra space on top of the already 128px gap —
  resulting in ~260px of whitespace before the Demos content.
- Footer `mt-24` adds yet more space after the Contact section on top of
  space-y-32.
- All sections use `px-6 max-w-6xl mx-auto` — padding and max-width are
  consistent. Good baseline to keep.
- Hero correctly uses `scroll-mt` is not set (it is the first section), but
  all others use `scroll-mt-24`.

### 2. Section Title Pattern

The `text-3xl font-bold` + `w-20 h-1 bg-indigo-500 rounded` divider pattern:

| Component | File | h2 line | divider line |
|-----------|------|---------|--------------|
| About | About.tsx | 14 | 17 |
| Experience | Experience.tsx | 64 | 67 |
| Demos | Demos.tsx | 24 | 27 |
| Contact | Contact.tsx | 46 | 49 |

All four are verbatim copies. Hero does not use the pattern (it is the landing
section). Experience's divider uses `<div ... />` self-closing; the others use
`<div ...></div>` — minor inconsistency.

Contact uses `mb-2` after the h2 (vs `mb-4` in the others) and `mb-4` after
the divider bar (vs `mb-8` in the others) — giving Contact slightly tighter
title spacing.

This pattern is a strong candidate for a shared `<SectionHeader title="..." />`
component.

### 3. Background Colors

**Page-level backgrounds:**
- `App.tsx:11` — `bg-white dark:bg-gray-900` (root div)
- `src/index.css:5` — `body { @apply bg-white dark:bg-gray-900 }` (redundant
  with App.tsx but harmless)

**Section containers:** All sections are transparent — they inherit the root
background. There is no background alternation anywhere on the page.

**Cards and contained elements:**

| Element | Light bg | Dark bg | File:line |
|---------|---------|---------|-----------|
| Hero cards (all 3) | `bg-white` | `bg-[#0e0f1a]` | Hero.tsx:247, 300, 399 |
| Experience card | `bg-white` | `bg-gray-900` | Experience.tsx:69 |
| Contact form | `bg-white` | `bg-gray-900` | Contact.tsx:116 |
| Form inputs | `bg-gray-50` | `bg-gray-800` | Contact.tsx:131,146,163,179 |
| Demo description boxes | `bg-white/80` | `bg-gray-900/70` | UNSSimulatorDemo.tsx:20, ScriptProfilerDemo.tsx:14 |
| Footer | `bg-gray-100` | `bg-[#0f111a]` | Footer.tsx:7 |
| Navbar | `bg-white/80` | `bg-gray-900/80` | Navbar.tsx:18 |
| Navbar mobile dropdown | `bg-white` | `bg-gray-900` | Navbar.tsx:77 |

**Dark mode custom hex values:**
- `bg-[#0e0f1a]` — Hero cards dark background (slightly darker/bluer than
  gray-900)
- `bg-[#0f111a]` — Footer dark background (same family, slightly different)

These two custom hex values are close but different from each other and from
`dark:bg-gray-900`. This creates subtle inconsistency in dark mode. The Hero
cards are intended to look like terminal/dark panels, which explains the choice.

**Gap for alternating backgrounds:** The only section that already has a
different background is the Footer (`bg-gray-100` / `bg-[#0f111a]`). All
content sections (About, Experience, Demos, Contact) are fully transparent and
look identical.

### 4. Hover States

**Framer Motion `whileHover`:**

| Component | File:lines | Effect |
|-----------|-----------|--------|
| MQTT Stream card | Hero.tsx:241–244 | `y:-4, scale:1.01`, spring stiffness:220 damping:18 |
| OEE Gauge card | Hero.tsx:304–307 | `y:-4, scale:1.01`, spring stiffness:220 damping:18 |
| UNS Path card | Hero.tsx:403–406 | `y:-4, scale:1.01`, spring stiffness:220 damping:18 |

**Tailwind `hover:` classes (active components only):**

| Element | File:line | Classes |
|---------|-----------|---------|
| Skill tags | About.tsx:63 | `hover:scale-105 transition-transform` |
| Resume button (commented out) | About.tsx:73 | `hover:bg-indigo-700 active:scale-95` |
| Experience card wrapper | Experience.tsx:69 | `hover:shadow-xl transition-shadow duration-300` |
| Inactive tab buttons | Demos.tsx:38 | `hover:bg-gray-300 dark:hover:bg-gray-700 hover:border-indigo-500/30` |
| Social icons (Contact) | Contact.tsx:89, 97, 103 | `hover:text-indigo-400 hover:scale-110 transition-transform` |
| Send button | Contact.tsx:186 | `hover:bg-indigo-700` |
| Carousel prev/next buttons | ImageCarousel.tsx:77, 83 | `hover:bg-indigo-600` |
| Lightbox nav/close buttons | ImageCarousel.tsx:105, 111, 116 | `hover:bg-indigo-600` |
| Nav links | Navbar.tsx:42, 89 | `hover:text-indigo-500 dark:hover:text-indigo-400` |
| Nav theme toggle | Navbar.tsx:49, 60, 67 | `hover:bg-gray-200 dark:hover:bg-gray-800` |
| Hero CTA "View Demos" | Hero.tsx:219 | `hover:bg-indigo-700 active:scale-95` |
| Hero CTA "Contact" | Hero.tsx:225 | `hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95` |
| Footer social icons | Footer.tsx:30, 39, 46 | `hover:text-indigo-500` |

**Observations:**
- Social icon hover in Contact uses `hover:scale-110` but no color transition
  on the background — the pill-shaped bg-gray-200 does not change, making the
  hover feel incomplete.
- Footer social icons have no background, just `hover:text-indigo-500` — very
  minimal; inconsistent with Contact icons which have pill backgrounds.
- Experience card uses CSS transition `hover:shadow-xl` but no scale, while
  Hero cards use Framer Motion spring. Mixed approach.
- No `focus-visible:` states defined on buttons or links — accessibility gap.

### 5. Shadow Patterns

| Shadow class | Where used | File:line |
|-------------|-----------|-----------|
| `shadow-lg shadow-indigo-500/10` | Hero cards (all 3) | Hero.tsx:247, 300, 399 |
| `shadow-lg shadow-indigo-500/20` | About profile avatar | About.tsx:23 |
| `shadow-lg hover:shadow-xl` | Experience card | Experience.tsx:69 |
| `shadow-xl` | Contact form | Contact.tsx:116 |
| `shadow-md shadow-indigo-500/30` | Active tab button | Demos.tsx:37 |
| `shadow-sm` | Demo description boxes | UNSSimulatorDemo.tsx:20, ScriptProfilerDemo.tsx:14 |
| `shadow` (bare) | Hero CTA buttons | Hero.tsx:219, 225 |
| `shadow` (bare) | Resume download btn (commented) | About.tsx:73 |

**Summary of inconsistency:**
- Hero cards: `shadow-lg` + indigo tint
- Experience: `shadow-lg` → `shadow-xl` on hover, no tint
- Contact form: `shadow-xl` always, no tint
- Demo boxes: `shadow-sm`
- Avatar: `shadow-lg` + stronger indigo tint (`/20` vs `/10`)
- CTA buttons: bare `shadow`

No consistent shadow language. Proposal for plan phase: adopt two shadow
tokens — a "card" shadow (`shadow-md shadow-indigo-500/10`) and a "elevated"
shadow (`shadow-lg shadow-indigo-500/15`) for hover states.

### 6. Typography Scale

**Full font-size inventory (active components only):**

| Size | Where used | File:line |
|------|-----------|-----------|
| `text-[10px]` | Hero UNS card metrics | Hero.tsx:445 |
| `text-xs` | Hero card headers, scroll indicator, Experience tags | Hero.tsx:247+, 485; Experience.tsx:98 |
| `text-sm` | Nav links, CTA buttons, Experience dates, Contact labels, form text | Multiple |
| `text-md` | Hero body paragraph | Hero.tsx:211 |
| `text-base` | Not used anywhere in active components |  |
| `text-lg` | About bio, Experience job titles, Contact sub-headers | About.tsx:38; Experience.tsx:87; Contact.tsx:61 |
| `text-xl` | Navbar logo, Demo card titles, Footer logo | Navbar.tsx:26; UNSSimulatorDemo.tsx:21; ScriptProfilerDemo.tsx:15; Footer.tsx:12 |
| `text-2xl` | Hero subtitle (md breakpoint only) | Hero.tsx:208 |
| `text-3xl` | Section titles (About, Experience, Demos, Contact) | About.tsx:14; Experience.tsx:64; Demos.tsx:24; Contact.tsx:46 |
| `text-5xl` | Hero h1 "Ben Duran" | Hero.tsx:204 |

**Issues:**
- `text-md` (Hero.tsx:211) is **not a valid Tailwind class** — Tailwind uses
  `text-base` for the medium step. `text-md` will silently fall back to browser
  default (16px), which may accidentally work but is semantically wrong.
- `text-4xl` is entirely absent — the scale jumps from `text-3xl` (section
  titles) to `text-5xl` (Hero h1) with nothing in between.
- `text-base` is never used — its natural slot is occupied by the invalid
  `text-md`.
- No `leading-` (line-height) overrides on headings — only `leading-relaxed`
  on the About bio paragraph (About.tsx:38) and `leading-7` on Demo description
  paragraphs.
- No `letter-spacing` on headings except `tracking-widest` on the scroll
  indicator (Hero.tsx:485).

**Font weights used:** `font-extrabold` (Hero h1), `font-bold` (section titles,
job titles, nav logo), `font-semibold` (sub-section headers, tab labels, demo
card titles), `font-medium` (labels, tags, nav links), `font-mono` (Hero
terminal cards, scroll indicator).

**No custom font** — the entire site uses the Tailwind default system font
stack. The ticket explicitly allows adding a Google Font for headings.

### 7. FadeInWrapper & Animation Timing

**FadeInWrapper** (`src/components/common/FadeInWrapper.tsx`):
- `initial: { opacity: 0, y: yOffset }` — default yOffset = 20px
- `whileInView: { opacity: 1, y: 0 }`
- `viewport: { once: false }` — **re-triggers on scroll back up and down**
- `transition: { duration: 0.6, delay }` — **no easing specified; defaults to
  Framer Motion's linear easing for duration-based transitions**
- No `ease` prop — should be `ease: 'easeOut'` for a natural deceleration feel

**Used in:**
- About.tsx:13 (title block), About.tsx:22 (avatar), About.tsx:34 (bio+skills)
- Contact.tsx:45 (title block), Contact.tsx:59 (left column), Contact.tsx:113
  (right column/form)
- Footer.tsx:8 (entire footer content)

**Hero.tsx inline Framer Motion (mount-triggered, not scroll):**

| Element | initial | animate | transition |
|---------|---------|---------|------------|
| BG graph edges | `{pathLength:0, opacity:0}` | `{pathLength:1, opacity:1}` | `duration:1.5, delay:i*0.12, ease:'easeOut'` |
| BG graph nodes | `{scale:0, opacity:0}` | `{scale:[1,1.3,1], opacity:[0.6,1,0.6]}` | `delay:0.5+i*0.08, duration:3, repeat:Infinity, ease:'easeInOut'` |
| Left text block | `{opacity:0, x:-40}` | `{opacity:1, x:0}` | `duration:0.6` |
| Right cards block | `{opacity:0, x:40}` | `{opacity:1, x:0}` | `duration:0.6, ease:'easeOut', delay:0.2` |
| OEE Gauge card | `{opacity:0}` | `{opacity:1}` | `duration:0.5, ease:'easeOut', delay:0.4` |
| UNS Path card | `{opacity:0}` | `{opacity:1}` | `duration:0.5, ease:'easeOut', delay:0.6` |
| MQTT messages | `{opacity:0, y:-8}` | `{opacity:1, y:0}` | `duration: shouldAnimate ? 0.3 : 0` |
| Scroll indicator | `{opacity:0}` | `{opacity:1, y:[0,6,0]}` | opacity delay:1.2, y delay:1.8/duration:1.5/repeat:Infinity |

**Experience.tsx inline Framer Motion (`whileInView`, `viewport.once: true`):**
- Each job item: `initial:{opacity:0, y:30}`, `whileInView:{opacity:1, y:0}`,
  `transition:{duration:0.5, delay:index*0.1}` — no ease specified.

**ImageCarousel.tsx:**
- Slide transitions: `duration: 0.3` with variant system (x: ±300px, opacity)
- Lightbox backdrop: `duration` unspecified (Framer default)

**Inconsistency summary:**
- FadeInWrapper has no `ease` — feels linear/mechanical compared to Hero's
  `easeOut` transitions.
- `viewport.once: false` on FadeInWrapper vs `viewport.once: true` on
  Experience items — inconsistent re-trigger behavior.
- `duration: 0.6` on FadeInWrapper is slightly long; `0.45–0.5` with
  `easeOut` would feel snappier and more professional.

### 8. Contact Form Label Bug

**Exact lines with hardcoded `text-white`:**

- `Contact.tsx:152` — Subject label:
  ```tsx
  <label className="block text-sm font-medium mb-1 text-white">
    Subject
  </label>
  ```
- `Contact.tsx:168` — Message label:
  ```tsx
  <label className="block text-sm font-medium mb-1 text-white">
    Message
  </label>
  ```

**Comparison — correct labels:**
- Your Name label (Contact.tsx:120): `text-gray-900 dark:text-white` — correct
- Your Email label (Contact.tsx:135): `text-gray-900 dark:text-white` — correct
- Subject and Message labels are missing the light-mode class entirely.

**Fix:** Replace `text-white` with `text-gray-900 dark:text-white` on both
lines, matching the Name and Email labels.

### 9. Mobile Responsiveness

**Breakpoints used across active components:**

| Breakpoint | Where | File:line |
|-----------|-------|-----------|
| `md:flex-row` | About two-column layout | About.tsx:20 |
| `md:items-center` | About avatar align | About.tsx:20 |
| `md:w-1/2` | Hero left/right split | Hero.tsx:198, 234 |
| `md:flex-row` | Hero section layout | Hero.tsx:149 |
| `md:mt-0 md:pl-10 md:mx-0` | Hero right column | Hero.tsx:234 |
| `md:text-2xl` | Hero subtitle | Hero.tsx:208 |
| `md:flex` / `md:hidden` | Navbar desktop/mobile toggle | Navbar.tsx:32, 57 |
| `md:grid-cols-2` | Contact info/form layout | Contact.tsx:57 |
| `md:grid-cols-2` | Contact name/email row | Contact.tsx:118 |
| `md:flex-row` / `md:text-left` | Footer layout | Footer.tsx:9, 11, 19 |

**No `sm:` breakpoints anywhere.** The layout goes directly from full-mobile
to `md:` (768px). There is no intermediate adjustment for tablets (480–767px).

**Mobile-specific concerns:**
- Hero section: On mobile (< 768px), the left text and right dashboard cards
  stack vertically. The right column has `mt-10` on mobile which adds 40px
  between text and cards — this is reasonable.
- Hero section does NOT have `scroll-mt-24` (correct, it is the first section).
- About section on mobile: single column layout, avatar stacks above bio.
  `gap-8` (32px) between avatar and bio text — fine.
- Demos section `pt-20 pb-20` on mobile = 80px top+bottom padding each — this
  is the main offender for excess whitespace on small screens.
- The `space-y-32` in App.tsx applies at all viewport sizes — on mobile 375px
  this creates 128px gaps between every section, which is very prominent.
- No responsive spacing utilities (e.g., `md:space-y-32 space-y-16`) — the
  global gap is fixed regardless of screen size.

**Recommendation for plan:** Change `space-y-32` to `space-y-16 md:space-y-24`
and reduce section padding to `pt-12 pb-16` (or `pt-16 pb-20`) to make
mobile layout feel tighter.

### 10. Dependencies

From `package.json`:

**Relevant installed packages:**
- `framer-motion: ^12.12.2` — already installed, full API available including
  `useAnimationControls`, `useSpring`, `AnimatePresence`, `useReducedMotion`
- `tailwindcss: ^4.1.7` — v4, class-based dark mode via custom variant in
  `index.css`
- `@tailwindcss/vite: ^4.1.7` — Vite plugin for Tailwind v4
- `lucide-react: ^0.511.0` — icon library, includes `ArrowUp` (for
  back-to-top button if desired)

**No font packages installed.** Adding a Google Font (e.g. Inter or Plus
Jakarta Sans for headings) would require either:
1. A `<link>` tag in `index.html` (simplest for Vite)
2. The `@fontsource` npm package approach
3. A `@import` in `index.css`

The ticket explicitly allows adding a Google Font. Option 1 (index.html link)
is the lowest-friction approach with Vite.

**No CSS-in-JS, no design token library, no component library.** All styling
is pure Tailwind utility classes. Any new shared components would need to
follow the existing pattern of utility-class composition.

---

## Architecture Insights

1. **No shared `<SectionHeader>` component exists** — the 4-component
   boilerplate repetition of `text-3xl font-bold` + `w-20 h-1 bg-indigo-500
   rounded` is the most actionable refactor opportunity in this ticket. Creating
   a `src/components/common/SectionHeader.tsx` component would reduce
   duplication and make global heading changes trivial.

2. **FadeInWrapper has no `ease`** — this is a one-line fix with outsized
   impact. Adding `ease: 'easeOut'` to the transition object will make all
   scroll-triggered animations feel more polished.

3. **`viewport: { once: false }` on FadeInWrapper** — sections re-animate when
   scrolling back up. This is intentional per the architecture doc ("Re-triggers
   on scroll back"), but it can feel jarring. The ticket's "smooth feel" goal
   may warrant changing to `once: true` or at minimum `amount: 0.1` to avoid
   partial-view triggering.

4. **`text-md` is not a Tailwind class** — Hero.tsx:211 uses this invalid
   class. It should be `text-base`. This likely renders correctly because the
   browser falls back to default font size, but it is a latent bug.

5. **Tailwind v4 custom dark variant** — `index.css:2` declares
   `@custom-variant dark (&:where(.dark, .dark *))`. This is the v4 way of
   declaring class-based dark mode. All `dark:` prefixes work correctly. Any
   new components must continue using this pattern.

6. **No `reduce-motion` handling in FadeInWrapper** — Hero.tsx correctly checks
   `useReducedMotion()` and gates all animations. FadeInWrapper does not check
   this. For accessibility compliance (ticket requirement), FadeInWrapper should
   also respect the reduced-motion preference.

---

## Historical Context

- The light-mode color work was completed just before this ticket
  (`2026-04-05_light-mode-colors.md` research exists). The section backgrounds
  and card colors are now properly paired for both modes. Any new background
  alternation must maintain these pairings.
- The Hero layout had a "bounce" issue fixed previously
  (`2026-03-29_hero-layout-bounce.md`). Care should be taken with any Hero
  spacing changes.
- The enhanced Hero was built as a significant feature
  (`2026-03-29_enhanced-hero.md`). The Hero section should not be structurally
  changed — only spacing/polish.
- Contact form was previously non-functional; a recent commit added EmailJS
  integration (`@emailjs/browser: ^4.4.1` in package.json, with a full
  `handleSubmit` in Contact.tsx). The form is now functional. The labels bug
  (lines 152, 168) pre-dates this integration and was not caught.

---

## Open Questions

1. **Background alternation strategy** — Should alternating sections use a
   subtle tint (`bg-gray-50 dark:bg-gray-800/50`) or a thin top-border divider,
   or both? The ticket says "alternating bg tints, thin dividers, or soft
   gradients." A decision is needed before implementation.

2. **Google Font selection** — If a display font is added for headings, which
   one? Candidates that fit the technical/industrial aesthetic: Inter (neutral,
   professional), Plus Jakarta Sans (modern geometric), Geist (developer-y).
   The plan agent should recommend one or defer to the user.

3. **`SectionHeader` component** — Should the new component accept `subtitle`
   as a prop to replace the Contact subtitle paragraph (`mb-12 max-w-2xl` text)?
   This would make it more flexible but more complex.

4. **`viewport.once`** — Change `FadeInWrapper` from `once: false` to
   `once: true`? The architecture doc notes the current behavior is intentional,
   but the ticket asks for "smooth feel." This is a UX judgment call.

5. **Back-to-top button** — The ticket mentions this as an optional addition.
   If added, it should appear after scrolling past the Hero and be positioned
   `fixed bottom-6 right-6` with `z-40`. Lucide's `ArrowUp` icon is available.

6. **`text-md` fix scope** — Correcting `text-md` → `text-base` in Hero.tsx:211
   may slightly alter font size rendering. Should this be treated as a separate
   bugfix commit or bundled into the polish work?

7. **Focus ring polish** — The ticket mentions "no focus ring animation" on the
   contact form. Tailwind's `focus-visible:ring-2 focus-visible:ring-indigo-500
   focus-visible:ring-offset-2` pattern should be applied consistently. Scope:
   all buttons, links, and form inputs.
