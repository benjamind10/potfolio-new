# Codex Claude Mapping

## Purpose

This document records how canonical Claude assets in `.claude/` map to repo-local Codex wrappers and role templates.

Claude files remain the source of truth. Codex artifacts are compatibility mirrors for use in this repository.

Cross-tool wrapper usage and handoff guidance live in `docs/codex-usage.md` and `docs/claude-codex-cheatsheet.md`.

## Skill Mapping

| Claude Source | Codex Wrapper | Status | Trigger Phrase | Notes |
| --- | --- | --- | --- | --- |
| `.claude/skills/bd-1-ticket/SKILL.md` | `codex/skills/bd-1-ticket/SKILL.md` | native | `use bd-1-ticket` | Converts `argument-hint` into explicit inputs and deterministic output path defaults. |
| `.claude/skills/bd-2-research/SKILL.md` | `codex/skills/bd-2-research/SKILL.md` | native | `use bd-2-research` | Converts Claude command chaining into Codex invocation guidance and bounded sub-agent guidance. |
| `.claude/skills/bd-3-plan/SKILL.md` | `codex/skills/bd-3-plan/SKILL.md` | native | `use bd-3-plan` | Preserves phased planning structure and verification-first planning rules. |
| `.claude/skills/bd-4-execute/SKILL.md` | `codex/skills/bd-4-execute/SKILL.md` | native | `use bd-4-execute` | Preserves one-phase-per-run execution and mismatch protocol. |
| `.claude/skills/bd-5-verify/SKILL.md` | `codex/skills/bd-5-verify/SKILL.md` | native | `use bd-5-verify` | Preserves review structure, deviation reporting, and quality checks. |
| `.claude/skills/bd-git-commit/SKILL.md` | `codex/skills/bd-git-commit/SKILL.md` | native | `use bd-git-commit` | Converts `disable-model-invocation: true` into a behavioral note rather than metadata. |

## Agent Mapping

| Claude Source | Codex Role Template | Recommended Agent Type | Status | Notes |
| --- | --- | --- | --- | --- |
| `.claude/agents/codebase-locator.md` | `codex/agents/README.md#codebase-locator` | `explorer` | native-role | Locator behavior only; no runtime analysis. |
| `.claude/agents/codebase-analyzer.md` | `codex/agents/README.md#codebase-analyzer` | `explorer` | native-role | Deterministic, evidence-backed implementation tracing. |
| `.claude/agents/code-pattern-finder.md` | `codex/agents/README.md#code-pattern-finder` | `explorer` | native-role | Pattern lookup and evidence-backed examples only. |
| `.claude/agents/docs-locator.md` | `codex/agents/README.md#docs-locator` | `explorer` | native-role | Documentation discovery and ranking only. |
| `.claude/agents/docs-analyzer.md` | `codex/agents/README.md#docs-analyzer` | `explorer` | native-role | Decision-grade doc analysis with explicit confidence handling. |

## Intentional Drift

### Skill output paths

Claude skills refer to "project-appropriate" output locations. Codex wrappers standardize on these defaults:

- `docs/tickets/[date]_[type]_[slug].md`
- `docs/research/[date]_[slug].md`
- `docs/plans/[slug].md`
- `docs/reviews/[slug]-review.md`

This is intentional so Codex execution is decision-complete.

### Command chaining

Claude skill completion sections suggest slash-command follow-ups such as `/bd-2-research ...`.

Codex wrappers replace those with plain-language invocation guidance such as:

- `use bd-2-research with [ticket path]`
- `use bd-3-plan with [ticket path] [research path]`

### Agent implementation model

Claude agent markdown files are not executed directly by Codex. They are represented as Codex role templates and prompt conventions documented in `codex/agents/README.md`.

## Sync Rules

When a canonical Claude file changes:

1. Update the relevant `.claude/...` file first.
2. Update the matching `codex/skills/.../SKILL.md` wrapper or the agent mapping doc.
3. Update this file if trigger phrases, status, paths, or drift notes changed.

## Review Checklist

- Every BD skill has a wrapper entry.
- Every Claude agent has a role-template entry.
- Every wrapper cites one canonical Claude source file.
- All trigger phrases are consistent with `docs/codex-usage.md`.
- Shared artifact paths and phase boundaries stay aligned with `docs/codex-usage.md`.
