---
status: complete
checkpoint: done
ticket: docs/tickets/2026-03-29_feature_agentic-ai-about-and-experience-copy.md
research: docs/research/2026-03-29_agentic-ai-about-and-experience-copy.md
created: 2026-03-29T00:00:00Z
---

# Agentic AI About and Experience Copy Implementation Plan

## Overview

Add agentic AI messaging to the portfolio without changing layout, structure, or section behavior. The implementation is limited to concise copy updates in `src/components/About.tsx` and `src/components/Experience.tsx`, with one modest badge adjustment in About and one modest tag adjustment in the Fortune Brands entry.

## Current State Analysis

- `src/components/About.tsx` contains a single-paragraph professional summary and a local inline skill-badge array.
- `src/components/Experience.tsx` contains a local `jobs` array, and the Fortune Brands entry is the first object in that array.
- Both sections already support small copy-only changes cleanly because they do not depend on external data, props, or shared state.
- The current site voice is concise and technical. Hero and Contact both use short recruiter-facing paragraphs rather than long narrative copy.
- Research indicates the only meaningful risk is visual density, especially if too many tool names are moved into badge rows.

## Desired End State

- About communicates industrial-systems depth first and agentic AI workflow second.
- About gains one AI-related badge without making the badge row feel crowded.
- The Fortune Brands entry explicitly mentions agentic harnesses and workflows.
- The Fortune Brands description names `Claude Code`, `Codex`, and `GitHub Copilot`.
- The final copy remains believable, concise, and aligned with the existing Industry 4.0 tone.

## What We Are Not Doing

- No layout, spacing, animation, or styling refactors.
- No new sections, demos, logos, or vendor branding treatments.
- No rewrite of every job entry to include AI tooling.
- No broad claims about organizational AI strategy, confidential systems, or exaggerated impact.
- No changes to Hero, Navbar, Demos, Contact, Footer, routing, or data flow.

## Implementation Approach

Use the smallest possible code change set:

1. Update the About paragraph to two short sentences.
2. Add one About badge: `Agentic AI`.
3. Update only the Fortune Brands entry in the Experience `jobs` array.
4. Keep tool names in the Fortune Brands description, not as separate badges.
5. Add one Fortune Brands tag: `Agentic Workflows`.

This keeps AI language visible in both sections while avoiding an overloaded tag row.

---

## Phase 1: Update About Summary and Skills

**Phase status:** complete

### Changes Required

**File:** `src/components/About.tsx`

- Replace the current one-sentence bio with a two-sentence version.
- Preserve the current opening emphasis on industrial systems, Ignition Perspective, MQTT, and UNS.
- Add a second sentence that frames agentic AI as part of the engineering workflow.
- Add one new skill badge: `Agentic AI`.
- Keep the rest of the badge list unchanged unless minor ordering cleanup improves readability.

### Copy Direction

The final About copy should follow this structure:

- Sentence 1: industrial systems focus, including Ignition Perspective, MQTT, and UNS.
- Sentence 2: use agentic AI to accelerate software delivery and workflows, without making AI the main identity.

Suggested wording baseline:

`I'm a software engineer focused on industrial systems. I specialize in Ignition Perspective, MQTT, and scalable architectures built on the Unified Namespace (UNS), and I use agentic AI workflows to accelerate delivery across modern software projects.`

If that feels too long in the UI, split it into:

`I'm a software engineer focused on industrial systems. I specialize in Ignition Perspective, MQTT, and scalable architectures built on the Unified Namespace (UNS). I also use agentic AI workflows to accelerate delivery across modern software projects.`

Preferred execution choice:

- Use the two-sentence version if it fits comfortably.
- Do not mention `Claude Code`, `Codex`, or `GitHub Copilot` in About.

### Success Criteria

#### Automated Verification

- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification

- [ ] About summary reads cleanly on desktop and mobile
- [ ] The added sentence does not dominate the section
- [ ] The badge row still wraps cleanly after adding `Agentic AI`
- [ ] The section still reads industrial-first, not AI-first

### Execution Notes

- Updated the About summary to include agentic AI workflow language while keeping the industrial-systems emphasis first.
- Added the `Agentic AI` badge to the existing skills row.
- Automated verification passed.
- Build and lint were executed via the local Node binary because `npm run ...` in this shell did not have a usable `node` on `PATH`.

---

## Phase 2: Update Fortune Brands Experience Copy

**Phase status:** complete

### Changes Required

**File:** `src/components/Experience.tsx`

- Update only the Fortune Brands Innovations object in the `jobs` array.
- Replace the current generic `desc` string with a more specific sentence that mentions:
  - MES application work
  - operational efficiency / continuous improvement
  - agentic harnesses and workflows
  - `Claude Code`, `Codex`, and `GitHub Copilot`
- Add one new tag to the Fortune Brands `tags` array: `Agentic Workflows`
- Leave all other job entries unchanged.

### Copy Direction

The final Fortune Brands description should stay outcome-focused first, with tooling called out as part of the workflow rather than as the main accomplishment.

Suggested wording baseline:

`Developed, maintained, and supported MES applications to improve operational efficiency and continuous improvement across facilities, using agentic harnesses and workflows with Claude Code, Codex, and GitHub Copilot.`

Execution rule:

- Keep all three tool names in the description.
- Do not add `Claude Code`, `Codex`, or `GitHub Copilot` as separate tags unless the approved plan changes later.
- Add only one AI-related tag: `Agentic Workflows`.

### Success Criteria

#### Automated Verification

- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification

- [ ] The Fortune Brands entry clearly mentions agentic harnesses/workflows
- [ ] `Claude Code`, `Codex`, and `GitHub Copilot` are visible in the description
- [ ] The first experience card remains readable without feeling overloaded
- [ ] The tag row still wraps cleanly after adding `Agentic Workflows`

### Execution Notes

- Updated only the Fortune Brands Innovations entry in the `jobs` array.
- Replaced the generic description with agentic harness/workflow language naming `Claude Code`, `Codex`, and `GitHub Copilot`.
- Added the `Agentic Workflows` tag and left all other job entries unchanged.
- Automated verification passed.

---

## Phase 3: Final Validation and Polish Pass

**Phase status:** complete

### Changes Required

- Re-read both edited sections in the browser or via code review for tone consistency.
- Tighten wording if either section feels too dense after implementation.
- Run final automated verification.
- When all phases are complete in execution, update the ticket status from `researched` to `implemented`.

### Final Review Rules

- Keep AI language grounded in personal workflow usage.
- Keep industrial domain expertise as the primary message.
- Prefer shorter wording over exhaustive wording if there is any layout tension.
- Do not expand scope into other jobs or other sections.

### Success Criteria

#### Automated Verification

- [x] `npm run build` passes
- [x] `npm run lint` passes

#### Manual Verification

- [ ] About and Experience feel like a natural copy refresh, not a redesign
- [ ] AI wording feels specific and truthful
- [ ] Desktop layout remains clean
- [ ] Mobile layout remains clean
- [ ] No awkward badge overflow appears in light or dark mode

### Execution Notes

- Split the About summary into the cleaner two-sentence form originally intended by the plan.
- Tightened the Fortune Brands description slightly while preserving all required agentic-tooling references.
- Final automated verification passed.
- Manual browser-based layout validation is still recommended for desktop and mobile.

---

## Testing Strategy

- Primary automated checks:
  - `npm run build`
  - `npm run lint`
- Primary manual checks:
  - review About copy for readability and sentence length
  - review Fortune Brands description for clarity and credibility
  - review badge/tag wrapping at desktop and mobile widths
  - verify no unintended changes to other experience entries

## Rollback / Mitigation Notes

- This plan changes only two files:
  - `src/components/About.tsx`
  - `src/components/Experience.tsx`
- Both changes are isolated string/array edits, so rollback is straightforward.
- If the new wording feels too dense, first shorten sentence length before removing the AI concept entirely.
- If the Experience card becomes visually crowded, keep the tool names in the description and remove the extra `Agentic Workflows` tag before changing broader layout.
