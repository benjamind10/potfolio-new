    ---

type: feature
priority: medium
created: 2026-03-29T00:00:00Z
status: implemented
tags: portfolio, about, experience, copy, agentic-ai
keywords: About.tsx, Experience.tsx, Fortune Brands Innovations, agentic AI, Claude Code, Codex, GitHub Copilot, agentic harness, workflows, professional summary
patterns: content placement in React components, concise portfolio copy updates, skill/tag emphasis, truthfulness of experience claims, section-level messaging consistency

---

# FEATURE-003: Add Agentic AI Messaging to About and Experience

## Description

Update the portfolio's About and Experience sections to reflect Ben's use of agentic AI in day-to-day engineering work. The change should specifically add relevant messaging to the About Me section and expand the Fortune Brands Innovations experience entry to mention agentic harnesses and workflows using tools such as Claude Code, Codex, and GitHub Copilot.

## Context

The current portfolio copy emphasizes industrial systems, Ignition Perspective, MQTT, UNS, and MES work, but it does not yet communicate how agentic AI fits into Ben's workflow. Adding that context will better represent current working methods and highlight modern engineering practices without changing the overall layout or design of the site.

## In Scope

- Update `src/components/About.tsx` copy to mention agentic AI as part of Ben's engineering approach
- Add or refine About section skill chips if needed to support the new messaging
- Update the Fortune Brands Innovations entry in `src/components/Experience.tsx`
- Mention agentic harnesses and agentic workflows where they fit naturally in the Fortune Brands description or tags
- Explicitly reference tooling/workflows such as Claude Code, Codex, and GitHub Copilot if the copy remains concise and believable
- Keep the new language aligned with the existing portfolio tone: practical, technical, and industry-focused

## Out of Scope

- Layout redesigns or animation changes in About or Experience
- Rewriting all experience entries to include AI/tooling references
- Adding new sections, case studies, or demos about AI tooling
- Introducing exaggerated or unverifiable claims about AI ownership, business impact, or company-wide adoption
- Changes to Hero, Navbar, Demos, Contact, Footer, or page structure
- Adding logos, external links, or vendor-specific branding treatments for Claude Code, Codex, or GitHub Copilot

## Requirements

### Functional

- About section includes a clear reference to agentic AI in Ben's professional summary
- Fortune Brands Innovations experience copy mentions use of agentic harnesses and workflows
- The Fortune Brands entry names Claude Code, Codex, and GitHub Copilot, or a carefully scoped subset of those tools if needed for readability
- New copy reads naturally alongside existing MES, MQTT, UNS, and industrial-software messaging
- If skill badges/tags are updated, they should support the new copy without overwhelming the section

### Non-Functional

- Copy must stay concise and recruiter-friendly
- Wording must remain truthful and avoid implying confidential implementation details
- Visual density should remain close to the current design; no multiline badge overflow or awkward wrapping on common screen sizes
- Existing dark/light styling and animations must remain unaffected

## Current State

- `src/components/About.tsx` currently describes Ben as a software engineer focused on industrial systems, specializing in Ignition Perspective, MQTT, and scalable architectures built on the UNS
- The About section skill chips currently list `Ignition`, `MQTT`, `SQL`, `UNS`, `Python`, `Java`, and `TypeScript`
- `src/components/Experience.tsx` includes a Fortune Brands Innovations entry with a generic MES-focused description and tags for `Ignition`, `Python`, `MQTT`, `MSSQL`, `UNS`, `Industry 4.0`, and `MES`
- No current copy mentions agentic AI, agentic harnesses, Claude Code, Codex, or GitHub Copilot

## Desired State

- The About section communicates that Ben applies agentic AI alongside industrial software engineering practices
- The Fortune Brands Innovations entry highlights that Ben uses agentic harnesses and workflows as part of MES/application delivery
- Claude Code, Codex, and GitHub Copilot are represented in a way that feels current, specific, and professional
- The updated About and Experience sections feel like a natural evolution of the existing portfolio rather than a separate AI-focused rewrite

## Research Context

### Keywords to Search

- `About.tsx`
- `Experience.tsx`
- `Fortune Brands Innovations`
- `agentic AI`
- `agentic harness`
- `Claude Code`
- `Codex`
- `GitHub Copilot`
- `jobs` array
- `tags` badges

### Patterns to Investigate

- How concise descriptive copy is structured in existing portfolio sections
- Whether the Fortune Brands entry should carry tooling names in `desc`, `tags`, or both
- How many additional badges can be added before layout becomes too busy
- Whether the About summary should mention agentic AI in one sentence or split across summary plus badges

### Decisions Already Made

- The update belongs in About and Experience only
- The Fortune Brands Innovations entry is the primary experience item to expand
- Agentic harnesses and workflows should be mentioned explicitly
- Claude Code, Codex, and GitHub Copilot are the target examples to include
- Scope should stay content-focused rather than becoming a broader portfolio redesign

## Success Criteria

### Automated Verification

- [ ] `npm run build` passes after the content update
- [ ] `npm run lint` passes after the content update

### Manual Verification

- [ ] About section visibly mentions agentic AI without feeling bloated
- [ ] Fortune Brands Innovations entry mentions agentic harnesses/workflows clearly
- [ ] Claude Code, Codex, and GitHub Copilot appear in the final Experience/About content if included in the approved wording
- [ ] Updated copy still reads professionally on desktop and mobile
- [ ] Badge/tag layout remains visually clean in both light and dark mode

## Notes

- Keep the phrasing grounded in personal workflow usage rather than broad organizational claims
- If tool names make the Fortune Brands entry too dense, prefer putting some of them in tags while keeping the description outcome-focused
- Preserve the existing industrial-systems emphasis so AI reads as an amplifier of engineering execution, not a replacement for core domain expertise
