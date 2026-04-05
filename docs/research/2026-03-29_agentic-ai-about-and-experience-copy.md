---
date: 2026-03-29T00:00:00Z
git_commit: a379434
branch: main
repository: portfolio
topic: "Add Agentic AI Messaging to About and Experience"
tags: research, about, experience, copy, agentic-ai
last_updated: 2026-03-29T00:00:00Z
---

## Ticket Synopsis

Research the portfolio changes needed to add agentic AI messaging to the About section and the Fortune Brands experience entry, while keeping the existing industrial-systems emphasis and concise recruiter-facing tone.

## Summary

This is a low-risk, content-only change in two self-contained components: `src/components/About.tsx` and `src/components/Experience.tsx`. No routing, state flow, APIs, assets, or shared utilities need to change.

The main implementation decision is content placement, not code complexity. The strongest fit with the current site is:
- keep the About section to one compact paragraph plus a modest badge update
- keep the Fortune Brands description outcome-focused, but add a short clause about agentic harnesses/workflows
- name `Claude Code`, `Codex`, and `GitHub Copilot` in the Fortune Brands description rather than turning all three into extra badges

That recommendation matches the current site pattern of short, readable marketing copy and avoids overloading the existing badge rows.

## Detailed Findings

### 1. About is a single-paragraph summary with one badge row

- `About` is fully self-contained and has no props, external data, or shared state dependencies: `src/components/About.tsx:6`
- The current bio is one paragraph with a concise industrial-systems summary: `src/components/About.tsx:36`
- The current copy focuses on Ignition Perspective, MQTT, and UNS only; there is no AI/tooling language yet: `src/components/About.tsx:38`
- Skill chips are driven by a local inline array with seven items and rendered in a wrapping row: `src/components/About.tsx:46`
- The badge styling already supports moderate growth because the container uses `flex flex-wrap gap-2`: `src/components/About.tsx:46`

Impact on implementation:
- The easiest safe edit is replacing the current paragraph with a two-sentence version that keeps the industrial focus first and adds agentic AI second.
- Adding one general badge such as `Agentic AI` or `AI Workflows` is lower-risk than adding several vendor/tool-specific badges in About.

### 2. Experience data is a local array; Fortune Brands is a simple text-and-tags entry

- The timeline entries come from a local `jobs` array at the top of the file: `src/components/Experience.tsx:6`
- The Fortune Brands entry is the first object and currently has a generic one-sentence description: `src/components/Experience.tsx:8`
- The Fortune Brands tag set currently contains seven domain-focused badges: `src/components/Experience.tsx:11`
- Tags are rendered as wrapping chips, so additional items will display without structural changes: `src/components/Experience.tsx:90`
- The Experience section is otherwise presentation-only; no filtering, sorting, or layout logic depends on specific tag values: `src/components/Experience.tsx:72`

Impact on implementation:
- This is a straightforward string edit inside the first `jobs` object.
- The safest place to name `Claude Code`, `Codex`, and `GitHub Copilot` is the `desc` field, because the current badges read as core skills/domains rather than tool inventory.
- Adding all three tool names plus workflow nouns as badges is technically possible, but it will make the first card noticeably denser than the rest of the timeline.

### 3. The site’s content pattern favors concise, technical marketing copy

- The Hero section uses a short, high-signal paragraph rather than a long narrative: `src/components/Hero.tsx:211`
- The Contact section intro is also brief and conversational: `src/components/Contact.tsx:50`
- `CLAUDE.md` describes `About.tsx` as profile/skills content and `Experience.tsx` as a timeline, which supports keeping this change copy-focused rather than structural: `CLAUDE.md:99`
- The repository conventions emphasize preserving existing section wrappers and styling patterns such as the shared divider and max-width container: `CLAUDE.md:149`

Impact on implementation:
- The new AI language should read like an extension of the current technical summary, not a standalone AI pitch.
- One extra sentence in About and one revised sentence in Fortune Brands is consistent with the rest of the page.

### 4. Live code is the source of truth; docs are useful for conventions, not always current behavior

- The `bd-2-research` wrapper explicitly prioritizes live code over docs, which matters here because some older docs have drifted from implementation.
- Example: `CLAUDE.md` still describes the Contact form as non-functional, but the live component already imports EmailJS and handles submit state: `CLAUDE.md:161`, `src/components/Contact.tsx:3`, `src/components/Contact.tsx:17`
- For this ticket, the live About and Experience components are current and simple enough that planning should rely on code first: `src/components/About.tsx:6`, `src/components/Experience.tsx:54`

Impact on implementation:
- Planning should not over-index on older research docs or tickets for copy recommendations.
- The current component structure is stable and does not suggest any hidden integration risk.

### 5. Verification is limited to build/lint plus visual review

- The repo scripts include `build`, `lint`, and `preview`; there is no test script in `package.json`: `package.json:6`
- The ticket’s success criteria already frame this mostly as manual copy/layout verification, which matches the codebase reality.

Impact on implementation:
- Automated validation after the edit should be `npm run build` and `npm run lint`.
- Manual review should focus on sentence readability and badge wrapping in both desktop and mobile layouts.

## Architecture Insights

- `About.tsx` is the only place where the personal summary and top-level skill chips live, so it is the correct place for broad agentic AI positioning: `src/components/About.tsx:33`
- `Experience.tsx` centralizes all job copy in one local array, so Fortune Brands can be updated without touching the render structure: `src/components/Experience.tsx:6`
- Both sections already use layout/styling patterns that will absorb text-only changes cleanly: `src/components/About.tsx:10`, `src/components/Experience.tsx:58`
- Because badges already wrap, the practical constraint is visual balance, not implementation feasibility: `src/components/About.tsx:46`, `src/components/Experience.tsx:90`

## Historical Context (from documentation)

- Repo documentation frames `About` as profile/skills/resume content and `Experience` as the work timeline, which supports a narrow content update instead of a redesign: `CLAUDE.md:37`, `CLAUDE.md:38`
- Architecture docs confirm both sections use the standard section spacing and scroll conventions, so copy edits should preserve the current section shells: `docs/architecture.md:41`, `docs/architecture.md:42`
- Documentation is still useful for conventions like class-based dark mode and standard section wrappers, but not every behavior note is current: `docs/architecture.md:69`

## Recommended Planning Direction

- Revise the About paragraph into two short sentences:
  - sentence 1 keeps industrial systems, Ignition, MQTT, and UNS as the lead
  - sentence 2 introduces agentic AI as part of the engineering workflow
- Add at most one new About badge for the AI concept:
  - preferred: `Agentic AI` or `AI Workflows`
- Revise the Fortune Brands `desc` to mention agentic harnesses/workflows explicitly and name `Claude Code`, `Codex`, and `GitHub Copilot`
- Keep Fortune Brands tags mostly domain-oriented:
  - optional: add one general badge such as `Agentic Workflows`
  - avoid adding all three tool names as badges unless visual review shows the row still feels balanced

## Open Questions

- Should the Fortune Brands sentence name all three tools directly in the description, or should one of them move into tags to keep the sentence shorter?
- Does the preferred wording use `agentic AI`, `agentic workflows`, or `agentic harnesses` as the primary term in About?
