# Light Mode Colors Fix — Implementation Plan

## Overview
Fix hardcoded dark-mode colors across 5 active components so light mode renders with appropriate light backgrounds, dark text, and light borders. Dark mode must remain unchanged.

## Current State Analysis
Six components have hardcoded dark Tailwind classes (e.g., `bg-[#0e0f1a]`, `bg-gray-900`, `text-white`) as base classes without light-mode counterparts. The project already has well-established light/dark patterns in Navbar, App.tsx, and About.tsx that serve as templates.

## Desired End State
Every visible element uses paired `bg-light dark:bg-dark` / `text-dark dark:text-light` / `border-light dark:border-dark` classes. Light mode shows light backgrounds with dark text; dark mode is unchanged.

## What We Are Not Doing
- Color palette redesign
- Adding new components or layout changes
- Fixing dead/unused components (LogSimulator, MQTTExplorer, NamespaceExplorer, UNSExplorer)
- Accessibility audit beyond color contrast
- Functionality changes

## Implementation Approach
Mechanical class replacement in 5 files, one phase per component, using established patterns from About.tsx and Navbar as templates. Each phase is independently testable.

---

## Phase 1: Footer and Experience Tags
### Changes Required
- File: `src/components/Footer.tsx`
  - Line 7: `bg-[#0f111a]` → `bg-gray-100 dark:bg-[#0f111a]`
  - Line 7: `border-gray-700` → `border-gray-200 dark:border-gray-700`
  
- File: `src/components/Experience.tsx`
  - Lines 101-102: Tags `bg-indigo-900/50 text-indigo-300 border-indigo-700/40` → `bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40`

### Success Criteria
#### Automated Verification
- [x] `npm run build` passes (type-check + build)
- [x] `npm run lint` passes

#### Manual Verification
- [ ] Footer has light gray background in light mode, dark in dark mode
- [ ] Experience tags show light indigo in light mode, dark indigo in dark mode

---

## Phase 2: Contact Component
### Changes Required
- File: `src/components/Contact.tsx`
  - 3 social icon buttons: `bg-gray-800 text-gray-200` → `bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200`
  - Form container: `border-gray-700 bg-gray-900` → `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`
  - 4 labels: `text-white` → `text-gray-900 dark:text-white`
  - 4 inputs: `border-gray-700 bg-gray-800 text-white` → `border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`

### Success Criteria
#### Automated Verification
- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification
- [ ] Social icons have light gray circle in light mode
- [ ] Form has white/light background in light mode
- [ ] Input fields have light gray background with dark text in light mode
- [ ] Labels are dark in light mode, white in dark mode

---

## Phase 3: Demos Tabs
### Changes Required
- File: `src/components/Demos.tsx`
  - Inactive tab: `bg-gray-800 text-gray-300 hover:bg-gray-700` → `bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700`

### Success Criteria
#### Automated Verification
- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification
- [ ] Inactive tabs show light gray background in light mode
- [ ] Active tab (indigo) looks the same in both modes

---

## Phase 4: Hero Dashboard Cards
### Changes Required
- File: `src/components/Hero.tsx`
  - 3 card containers: `bg-[#0e0f1a]` → `bg-white dark:bg-[#0e0f1a]`; `border-gray-700 dark:border-gray-600` → `border-gray-200 dark:border-gray-600`
  - MQTT card internal text:
    - `text-gray-500` (timestamps): → `text-gray-600 dark:text-gray-500` (no change needed if already readable)
    - `text-indigo-300` (topics): → `text-indigo-600 dark:text-indigo-300`
    - `text-gray-300` (cycle count): → `text-gray-700 dark:text-gray-300`
    - `text-cyan-400` (temp): keep as-is (readable on white)
  - OEE card internal text:
    - `text-gray-500` (metric labels): keep as-is (readable on white)
    - `text-gray-300` (metric values): → `text-gray-700 dark:text-gray-300`
    - Gauge track `fill="#1f2937"`: → light-aware approach (replace with `fill` referencing a CSS variable or use a gray that works on both, e.g., `#e5e7eb` light / `#1f2937` dark — will use a className approach)
    - Gauge text `fill="white"`: → needs `fill` that adapts (use currentColor + text class, or set fill conditionally)
    - Metric bar bg `bg-gray-700`: → `bg-gray-200 dark:bg-gray-700`
  - UNS card internal text:
    - `text-indigo-300` (leaf segment): → `text-indigo-600 dark:text-indigo-300`
    - `text-gray-400` (other segments): keep as-is
    - `text-gray-600` (slash): keep as-is
    - `text-gray-300` (Avail/Qual values): → `text-gray-700 dark:text-gray-300`

### Success Criteria
#### Automated Verification
- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification
- [ ] All three Hero cards have white background in light mode
- [ ] Card borders are light gray in light mode
- [ ] Text inside cards is readable in both modes
- [ ] OEE gauge percentages and labels are readable in light mode
- [ ] Metric progress bars have light gray track in light mode
- [ ] State colors (green/red/yellow) still visible in both modes

---

## Testing Strategy
- Type check + build: `npm run build`
- Lint: `npm run lint`
- Visual: toggle theme via Navbar and inspect each section in both modes
- Run all: `npm run build && npm run lint`

## Rollback/Mitigation Notes
Each phase touches only class strings — no logic changes. Revert by restoring previous class values. Git provides per-file rollback.

---

## Progress
- [x] Phase 1: Footer and Experience Tags
- [x] Phase 2: Contact Component
- [x] Phase 3: Demos Tabs
- [x] Phase 4: Hero Dashboard Cards
