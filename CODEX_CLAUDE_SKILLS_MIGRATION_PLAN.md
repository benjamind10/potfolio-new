# Codex Claude Skills Migration Plan

## Summary

This repository now carries a repo-local Codex compatibility layer for the BD workflow while keeping `.claude/skills` and `.claude/agents` as the canonical source of truth.

The migration is intentionally scoped to the first-wave BD workflow:

- `bd-1-ticket`
- `bd-2-research`
- `bd-3-plan`
- `bd-4-execute`
- `bd-5-verify`
- `bd-git-commit`

Codex-native wrappers live under `codex/skills/`. Human-readable mapping and usage documentation live under `docs/`.

## Deliverables

### Repo-local Codex wrappers

- `codex/skills/bd-1-ticket/SKILL.md`
- `codex/skills/bd-2-research/SKILL.md`
- `codex/skills/bd-3-plan/SKILL.md`
- `codex/skills/bd-4-execute/SKILL.md`
- `codex/skills/bd-5-verify/SKILL.md`
- `codex/skills/bd-git-commit/SKILL.md`

### Mapping and usage docs

- `docs/codex-claude-mapping.md`
- `docs/codex-usage.md`
- `docs/claude-codex-cheatsheet.md`
- `codex/agents/README.md`

## Canonical Source Rule

The `.claude/...` files remain canonical.

When behavior changes:

1. Update the canonical Claude file first.
2. Update the matching Codex wrapper or mapping doc.
3. Record intentional drift in `docs/codex-claude-mapping.md`.

## Deterministic Output Defaults

Codex wrappers use fixed default output paths so the workflow is decision-complete:

- Tickets: `docs/tickets/[date]_[type]_[slug].md`
- Research: `docs/research/[date]_[slug].md`
- Plans: `docs/plans/[slug].md`
- Reviews: `docs/reviews/[slug]-review.md`

## Agent Mapping Strategy

The Claude agent files are not converted into executable Codex agents. Instead, they are represented as Codex role templates that use Codex's built-in agent types, primarily `explorer`.

Mapped roles:

- `codebase-locator`
- `codebase-analyzer`
- `code-pattern-finder`
- `docs-locator`
- `docs-analyzer`

See `codex/agents/README.md` for the concrete prompt templates and constraints.

## Validation Checklist

- All six BD wrapper files exist under `codex/skills/`.
- Every wrapper cites exactly one canonical Claude source file.
- `docs/codex-claude-mapping.md` covers all six BD skills and all five Claude agents.
- `codex/agents/README.md` preserves the strongest behavior rules from the Claude agents.
- `docs/codex-usage.md` is sufficient for a new contributor to invoke the workflow without external context.

## Scope Notes

This migration does not attempt to:

- transpile arbitrary Claude skills automatically
- create new executable Codex agent definitions from Claude agent markdown
- migrate non-BD Claude skills beyond the first workflow wave

Future skills can follow the same pattern introduced here.
