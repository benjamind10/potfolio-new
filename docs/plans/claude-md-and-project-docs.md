# CLAUDE.md and Project Documentation — Implementation Plan

## Overview
Create three documentation files — `CLAUDE.md` (project root), `docs/architecture.md`, and an updated `README.md` — to give AI assistants and contributors an accurate, scannable map of this portfolio SPA without re-exploring the codebase from scratch each session.

## Current State Analysis
- `README.md` is the stock Vite + React template (useless for this project)
- No `CLAUDE.md` exists; Claude Code auto-loads this file if present at project root
- No architecture documentation exists anywhere
- `.claude/` has agent/skill definitions but zero project context
- Codebase has no tests, no router, no global state library — simplifies docs considerably
- `NamespaceExplorer` and `LogSimulator` are dead code (commented out in Demos.tsx)
- `useMqtt.ts` is a standalone module not imported anywhere
- Contact form submit button is non-functional (UI only)

## Desired End State
- `CLAUDE.md` at root: ≤150 lines, scannable overview for AI/human onboarding
- `docs/architecture.md`: deep reference for component tree, data flows, theming, MQTT, UNS
- `README.md`: project-specific, accurate setup and run instructions
- Ticket status updated to `completed`

## What We Are Not Doing
- No source code changes
- No new features, bug fixes, or refactors
- No CI/CD or deployment docs
- No contribution guidelines
- No test scaffolding
- No API docs (there is no backend)

## Implementation Approach
Write all three files in dependency order: architecture doc first (most detailed, referenced by CLAUDE.md), then CLAUDE.md (references architecture doc), then README (standalone, user-facing). Update ticket status last.

---

## Phase 1: Create `docs/architecture.md`
Deep-reference document covering every major system. CLAUDE.md will cross-link here instead of duplicating.

### Changes Required
- **File**: `docs/architecture.md` (new)
- **Sections**:
  1. Component Tree — visual hierarchy from App.tsx down
  2. Page Sections — each section's id, scroll offset, file, and purpose
  3. Theming System — useTheme hook, localStorage, class toggling, consumer pattern
  4. MQTT Integration — useMqtt.ts (unused module) vs MQTTExplorer dual-mode pattern, env var
  5. UNS Data Structures — unsData (UnsNode tree) vs unsTree (D3 shape), which component uses which
  6. Animation Pattern — FadeInWrapper (whileInView) vs inline motion.div (animate on mount)
  7. Styling Conventions — Tailwind v4, dark: prefix, indigo accent, section divider pattern, cn utility
  8. Known Gaps & Dead Code — NamespaceExplorer (unused), LogSimulator (unused), contact form (no handler), useMqtt.ts (no consumer), resume.pdf dependency

### Success Criteria
#### Manual Verification
- [ ] File renders correctly in a markdown viewer
- [ ] All file references (e.g., `src/hooks/useTheme.ts`) are accurate paths
- [ ] UNS table correctly maps data file → consumer component

---

## Phase 2: Create `CLAUDE.md`
Concise AI-first project overview. ≤150 lines. Cross-links architecture.md for deep detail.

### Changes Required
- **File**: `CLAUDE.md` (new, project root)
- **Sections**:
  1. Project Overview — one-paragraph summary (Ben Duran, Industry 4.0, React SPA)
  2. Tech Stack — table: layer → technology
  3. Directory Layout — annotated tree of `src/`
  4. Dev Commands — all four npm scripts with descriptions
  5. Environment Setup — `.env` file requirement, `VITE_MQTTBROKER` var
  6. Component Map — flat list of every component file with one-line purpose
  7. Key Data Flows — 3 flows: Theme toggle, MQTT Explorer (sim/live), UNS Explorer
  8. Coding Conventions — Prettier settings, Tailwind patterns, cn() usage, FadeInWrapper usage
  9. Known Gotchas — 4 items from research (useMqtt unused, NamespaceExplorer dead code, contact form noop, resume.pdf must exist)
  10. Further Reading — link to `docs/architecture.md`

### Success Criteria
#### Manual Verification
- [ ] Word count ≤ 150 lines (`wc -l CLAUDE.md`)
- [ ] A new Claude conversation with this file loaded can name the correct file for any section edit without searching

---

## Phase 3: Update `README.md`
Replace stock Vite template content with project-specific information.

### Changes Required
- **File**: `README.md` (full replacement)
- **Sections**:
  1. Title + tagline (portfolio SPA, Industry 4.0)
  2. Live demo / screenshot placeholder
  3. Tech stack badges or list
  4. Prerequisites (Node ≥ 18, npm)
  5. Setup: clone → install → `.env` → `npm run dev`
  6. Build & preview commands
  7. Project structure (brief)
  8. Contact link

### Success Criteria
#### Manual Verification
- [ ] A new contributor can clone and run the project using only the README
- [ ] No Vite template content remains

---

## Phase 4: Update Ticket Status
### Changes Required
- **File**: `docs/tickets/2026-03-29_feature_claude-md-and-project-docs.md`
- Change frontmatter `status: researched` → `status: completed`
- Check all success criteria checkboxes

### Success Criteria
#### Automated Verification
- [ ] `npm run build` exits 0 (docs don't affect build, but confirms no regressions)
- [ ] `npm run lint` exits 0

---

## Testing Strategy
- No unit or integration tests apply (documentation only)
- Manual review: read each file top-to-bottom after writing, verify all file path references exist with Glob/Grep
- Build check: `npm run build` confirms no accidental source changes broke anything

## Rollback/Mitigation Notes
- All three target files are either new (CLAUDE.md, docs/architecture.md) or being replaced (README.md)
- README.md: current content is stock Vite template — safe to replace entirely; original recoverable from git if needed (`git show HEAD:README.md`)
- No source code touched — zero risk of runtime regression
