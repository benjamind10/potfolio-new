---
type: feature
priority: high
created: 2026-03-29T00:00:00Z
status: reviewed
tags: portfolio, documentation, dx, ai-tooling
keywords: CLAUDE.md, project docs, architecture, conventions, onboarding, React, Vite, Tailwind, MQTT, UNS, Framer Motion, D3
patterns: component architecture, data flow, theme management, MQTT integration, UNS tree, build/lint/dev workflow
---

# FEATURE-001: Create CLAUDE.md and Project Documentation

## Description
Create a `CLAUDE.md` file at the project root and any necessary supporting documentation so that AI assistants (Claude Code) and human contributors can quickly understand the portfolio project's architecture, conventions, and how to work effectively in it.

## Context
The portfolio is a React 19 + TypeScript + Vite single-page application that showcases Industry 4.0 skills (Ignition, MQTT, UNS). The current README.md is the generic Vite template and provides zero project-specific guidance. There is no CLAUDE.md. This makes AI-assisted development slower and less accurate because the assistant must re-explore the codebase on every conversation.

## In Scope
- `CLAUDE.md` at project root covering: overview, tech stack, directory layout, dev commands, coding conventions, component architecture, key data flows, and known gotchas
- `docs/architecture.md` covering component tree, data/state flow, MQTT integration, UNS structure, and theming
- Update `README.md` to be project-specific (replaces generic Vite template content)

## Out of Scope
- No changes to source code or components
- No new features or bug fixes
- No CI/CD, deployment, or infrastructure documentation
- No API documentation (no backend)
- No contribution guidelines (solo project)

## Requirements

### Functional
- CLAUDE.md must be loadable by Claude Code at conversation start and provide enough context to skip exploratory searches
- Architecture doc must explain the UNS/MQTT data flows clearly enough to modify them without re-reading every file
- README must accurately describe the project and how to run it

### Non-Functional
- CLAUDE.md should be concise — each section scannable in under 30 seconds
- No duplication between CLAUDE.md and architecture.md; cross-link instead

## Current State
- `README.md` is the stock Vite + React template (generic, not project-specific)
- No `CLAUDE.md` exists
- No architecture documentation exists
- `.claude/` contains agent and skill definitions but no project context

## Desired State
- `CLAUDE.md` at root with project overview, commands, conventions, component map, and data flow summary
- `docs/architecture.md` with detailed component tree, MQTT integration pattern, UNS data structure, and theming system
- `README.md` updated to describe this specific portfolio project

## Research Context

### Keywords to Search
- `App.tsx` - root component and page section composition
- `useTheme.ts` - theme system entry point
- `useMqtt.ts` - MQTT hook and broker configuration
- `unsData.ts`, `unsTree.ts` - UNS data structures
- `MQTTExplorer.tsx` - live vs simulated MQTT mode
- `UNSExplorer.tsx`, `NamespaceExplorer.tsx` - two UNS visualization approaches
- `Demos.tsx` - tabbed demo container
- `vite.config.ts`, `tailwind.config.js` - build/style config
- `.env` - VITE_MQTTBROKER env var

### Patterns to Investigate
- Component composition pattern (how sections are assembled in App.tsx)
- MQTT simulated vs live data toggle pattern
- Dark/light theme toggle with localStorage
- Framer Motion FadeInWrapper usage pattern
- D3 integration in NamespaceExplorer
- UNS hierarchical data shape (unsData vs unsTree formats)

### Decisions Already Made
- Dark mode uses class-based Tailwind approach (not media query) — allows manual toggle
- MQTT broker is public HiveMQ WebSocket endpoint (wss://broker.hivemq.com:8884/mqtt)
- Two UNS data files exist for different visualization needs (tree vs list)
- Prettier enforces single quotes, 2-space indent, 80-char line width

## Success Criteria

### Automated Verification
- [ ] `npm run build` passes with no errors after docs are added
- [ ] `npm run lint` passes (no .ts/.tsx files changed)

### Manual Verification
- [ ] CLAUDE.md loads and gives a useful project summary in under 2 minutes of reading
- [ ] A new AI conversation can identify the correct file to edit for any section without additional exploration
- [ ] README accurately describes the project, stack, and how to run it

## Notes
- Keep CLAUDE.md under ~150 lines to stay within auto-load context budget
- Cross-reference `docs/architecture.md` from CLAUDE.md for deeper detail
- The `.env` file contains `VITE_MQTTBROKER` — document this requirement clearly
