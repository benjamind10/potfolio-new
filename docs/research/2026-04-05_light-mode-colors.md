---
date: 2026-04-05T00:00:00Z
git_commit: d5789e9
branch: main
repository: portfolio
topic: "BUG-008: Light mode colors broken across multiple components"
tags: [research, styling, theming, tailwind, dark-mode]
last_updated: 2026-04-05T00:00:00Z
---

## Ticket Synopsis
Multiple components render with dark-mode colors in light mode because they use hardcoded dark Tailwind classes (e.g., `bg-[#0e0f1a]`, `bg-gray-900`, `text-white`) without light-mode counterparts.

## Summary
The codebase has a well-established light/dark pattern (`bg-white dark:bg-gray-900`, `text-gray-900 dark:text-white`) used correctly in ~30 class strings across Navbar, App.tsx, About, and parts of Hero/Contact/Experience. However, **6 active components** contain hardcoded dark colors as base classes, totaling **~35 individual class violations**. The fix is mechanical: prepend a light-mode class before each dark-only class, using established patterns as templates.

## Detailed Findings

### 1. Footer (`src/components/Footer.tsx`)

**Line 7** — `<footer>` element:
```
bg-[#0f111a] border-t border-gray-700 mt-24
```
- `bg-[#0f111a]`: hardcoded near-black background, no light variant
- `border-gray-700`: dark border, no light variant

**Line 9** — wrapper div:
```
text-gray-400
```
- Base text color `text-gray-400` with no mode differentiation (acceptable for muted text but parent bg is the real issue)

**Fix pattern**: `bg-gray-100 dark:bg-[#0f111a] border-t border-gray-200 dark:border-gray-700`

---

### 2. Contact (`src/components/Contact.tsx`)

**Lines 92, 100, 106** — Social icon buttons (3 instances):
```
p-2 rounded-full bg-gray-800 text-gray-200 hover:text-indigo-400
```
- `bg-gray-800`: dark circle background
- `text-gray-200`: light icon color

**Line 119** — Form container:
```
p-6 rounded-xl border border-gray-700 bg-gray-900 space-y-4 shadow-xl
```
- `bg-gray-900`: dark form background
- `border-gray-700`: dark border

**Lines 123, 138, 155, 171** — Form labels (4 instances):
```
text-white
```
- White text on what should be a light background in light mode

**Lines 134, 149, 166, 182** — Form inputs (4 instances):
```
border border-gray-700 bg-gray-800 text-white
```
- All three classes are dark-only

**Fix pattern**:
- Social icons: `bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200`
- Form: `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700`
- Labels: `text-gray-900 dark:text-white`
- Inputs: `border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`

---

### 3. Hero Dashboard Cards (`src/components/Hero.tsx`)

**Lines 247, 300, 399** — All three cards (MQTT, OEE, UNS):
```
bg-[#0e0f1a] rounded-xl border border-gray-700 dark:border-gray-600
```
- `bg-[#0e0f1a]`: hardcoded dark hex, no light variant
- `border-gray-700`: already has `dark:border-gray-600` but base is still dark

**Line 288** — Cycle count text:
```
text-gray-300
```
- Light text, no mode variant

**Line 384** — Metric percentage:
```
text-gray-300
```
- Light text, no mode variant

**Internal text colors throughout cards** — `text-gray-500`, `text-indigo-300`, `text-indigo-400`, `text-cyan-400`, `text-gray-300`:
- These are terminal-aesthetic colors. In light mode, they need darker counterparts for readability on a light card background.

**Fix pattern**:
- Card bg: `bg-white dark:bg-[#0e0f1a]` or `bg-gray-50 dark:bg-[#0e0f1a]`
- Card border: `border-gray-200 dark:border-gray-700`
- Internal text: needs case-by-case pairing (e.g., `text-gray-700 dark:text-gray-300`, `text-indigo-600 dark:text-indigo-300`)

**Note on Hero card internal text**: The cards use many fine-grained text colors for the terminal/dashboard aesthetic (`text-gray-500`, `text-indigo-300`, `text-cyan-400`, `text-green-400`, `text-red-400`, `text-yellow-400`). The state colors (green/red/yellow) and accent colors (cyan, indigo) can likely stay the same in both modes since they're semantic. The gray text (`text-gray-500`, `text-gray-300`) needs dark counterparts for light backgrounds.

---

### 4. Experience Tags (`src/components/Experience.tsx`)

**Lines 101-102** — Job tags:
```
px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-medium border border-indigo-700/40
```
- `bg-indigo-900/50`: dark indigo background
- `text-indigo-300`: light indigo text
- `border-indigo-700/40`: dark indigo border

**Fix pattern** (from About.tsx skills tags, line 65):
```
bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40
```

---

### 5. Demos Tabs (`src/components/Demos.tsx`)

**Line 38** — Inactive tab buttons:
```
bg-gray-800 text-gray-300 hover:bg-gray-700 border border-transparent hover:border-indigo-500/30
```
- `bg-gray-800`: dark tab background
- `text-gray-300`: light text
- `hover:bg-gray-700`: dark hover

**Fix pattern**:
```
bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700
```

---

### 6. Dead Code Components (lower priority)

These components are currently unused (not imported by Demos.tsx) but have the same issues:
- **LogSimulator.tsx**: `bg-black`, `bg-gray-900`, `text-white`, `border-gray-700`
- **MQTTExplorer.tsx**: `bg-gray-900`, `bg-black`, `bg-gray-800`, `text-white`, `border-gray-700`
- **NamespaceExplorer.tsx**: `bg-gray-900`, `bg-gray-800`, `border-gray-700`
- **UNSExplorer.tsx**: `bg-black`, `bg-gray-900`, `text-white`, `border-gray-700`

**Recommendation**: Fix only active components. Dead code can be fixed if/when re-enabled.

---

## Architecture Insights

### Established Correct Patterns (use as templates)

**Text pairs:**
| Light (base) | Dark (`dark:`) | Usage |
|---|---|---|
| `text-gray-900` | `dark:text-white` | Headings |
| `text-gray-700` | `dark:text-gray-300` | Body text |
| `text-gray-600` | `dark:text-gray-400` | Secondary/muted text |
| `text-gray-800` | `dark:text-white` | Subheadings |

**Background pairs:**
| Light (base) | Dark (`dark:`) | Usage |
|---|---|---|
| `bg-white` | `dark:bg-gray-900` | Section/card backgrounds |
| `bg-white/80` | `dark:bg-gray-900/80` | Semi-transparent overlays (Navbar) |
| `bg-gray-100` | `dark:bg-gray-800` | Subtle contrast areas |
| `bg-gray-200` | `dark:bg-gray-800` | Interactive/button backgrounds |
| `bg-gray-50` | `dark:bg-gray-800` | Input backgrounds |

**Border pairs:**
| Light (base) | Dark (`dark:`) | Usage |
|---|---|---|
| `border-gray-200` | `dark:border-gray-700` | Card/section borders |
| `border-gray-200` | `dark:border-gray-800` | Subtle dividers |
| `border-gray-300` | `dark:border-gray-700` | Input/card borders |

**Badge/tag pairs:**
| Light (base) | Dark (`dark:`) | Usage |
|---|---|---|
| `bg-indigo-100` | `dark:bg-indigo-800` | Tag/badge background |
| `text-indigo-600` | `dark:text-indigo-100` | Tag/badge text |

**Hover pairs:**
| Light (base) | Dark (`dark:`) | Usage |
|---|---|---|
| `hover:bg-gray-200` | `dark:hover:bg-gray-800` | Button hover |
| `hover:bg-gray-300` | `dark:hover:bg-gray-700` | Stronger hover |

### Theme System
- `src/hooks/useTheme.ts`: toggles `dark` class on `document.documentElement`, persists to localStorage, detects system preference
- Tailwind v4 custom variant: `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`
- All components inherit from `App.tsx` root: `bg-white text-gray-900 dark:bg-gray-900 dark:text-white`

### Key Design Decisions
- Hero cards have a terminal/dashboard aesthetic — light mode should use `bg-white` or `bg-gray-50` with a border, preserving the card structure but not the dark background
- Semantic state colors (`text-green-400`, `text-red-400`, `text-yellow-400`) work on both light and dark backgrounds and can stay unchanged
- The OEE gauge SVG has `fill="white"` for text and `fill="#1f2937"` for track — these need light-mode alternatives too

## Open Questions
1. **Hero card terminal aesthetic**: Should light-mode Hero cards use `bg-white` (clean) or `bg-gray-50` (subtle contrast)? The ticket suggests either is acceptable.
2. **OEE gauge SVG fills**: The gauge uses hardcoded `fill="white"` and `fill="#1f2937"` — these can't use Tailwind's `dark:` utility directly. Options: use `currentColor` with Tailwind classes on the SVG element, or use CSS variables. This needs a slightly different approach than the className fixes.
3. **Dead code components**: Should we fix MQTTExplorer, UNSExplorer, NamespaceExplorer, LogSimulator now or defer?
