# Codex Usage Guide

## Purpose

This repository includes repo-local Codex wrappers for the canonical Claude BD workflow. Use the Codex wrappers when you want Codex to follow the same operating pattern without manually reading the `.claude/...` files.

Canonical source remains in `.claude/`.

For the cross-tool mapping and invocation reference, see `docs/codex-claude-mapping.md` and `docs/claude-codex-cheatsheet.md`.

## Available Codex Wrappers

- `bd-1-ticket`
- `bd-2-research`
- `bd-3-plan`
- `bd-4-execute`
- `bd-5-verify`
- `bd-git-commit`

## Default Invocation Style

Use the lowercase Claude-aligned skill names directly in your request.

Examples:

- `use bd-1-ticket for this bug report`
- `use bd-2-research with docs/tickets/2026-03-29_bug_mqtt-subscribe.md`
- `use bd-3-plan with docs/tickets/... docs/research/...`
- `use bd-4-execute with docs/plans/mqtt-fix.md`
- `use bd-5-verify with docs/plans/mqtt-fix.md`
- `use bd-git-commit for the current session changes`

These invocations are meant to be phase-compatible with Claude. A ticket, research artifact, plan, or review created in one tool should be consumable by the same phase or next phase in the other tool without conversion.

## Workflow Sequence

### 1. Ticket

Start with `bd-1-ticket` when the work needs a scoped problem statement, acceptance criteria, and explicit out-of-scope boundaries.

Default output:

- `docs/tickets/[date]_[type]_[slug].md`

### 2. Research

Use `bd-2-research` after a ticket exists and you need evidence-backed repository and documentation context.

Default output:

- `docs/research/[date]_[slug].md`

Delegation guidance:

- Prefer `explorer` agents for bounded discovery and analysis subtasks.
- Keep synthesis in the main Codex agent so the final research artifact remains coherent.

### 3. Plan

Use `bd-3-plan` after ticket and research artifacts exist and you want a practical implementation plan.

Default output:

- `docs/plans/[slug].md`

Delegation guidance:

- Stay local by default.
- Only use sub-agents to close narrow evidence gaps that do not block the current planning step.

### 4. Execute

Use `bd-4-execute` to implement a single plan phase, verify it, and stop.

Notes:

- It is intentionally phase-bounded.
- If code reality diverges from plan intent, document the mismatch and resolve it before continuing.
- Stay local by default unless the user explicitly wants delegation or the phase can be split into disjoint write scopes.

### 5. Verify

Use `bd-5-verify` after implementation to review plan adherence, verification status, and residual risks.

Default output:

- `docs/reviews/[slug]-review.md`

Delegation guidance:

- Prefer local review so the final implementation judgment stays centralized.

### 6. Commit

Use `bd-git-commit` once the work is reviewed and ready to be grouped into clean logical commits.

## Agent Role Conventions

For tasks that match the Claude agent roles, use the Codex role templates described in `codex/agents/README.md`.

Recommended phrasing:

- `use the codebase-locator role for [topic]`
- `use the codebase-analyzer role for [component]`
- `use the code-pattern-finder role for [pattern]`
- `use the docs-locator role for [topic]`
- `use the docs-analyzer role for [document]`

Typical research orchestration in Codex:

1. `docs-locator`
2. `docs-analyzer`
3. `codebase-locator`
4. `codebase-analyzer` and `code-pattern-finder` in parallel
5. local synthesis into `docs/research/...`

## Claude-First Sync Rule

When you update behavior:

1. Edit `.claude/...` first.
2. Mirror the change into the matching Codex wrapper or mapping doc.
3. Record any intentional drift in `docs/codex-claude-mapping.md`.

## Constraints

- Codex wrappers are compatibility guides, not a second canonical workflow definition.
- Claude agent markdown files are not executable by Codex as-is.
- Codex sub-agents should only be used when the wrapper explicitly recommends them and the task benefits from delegation.
- Artifact paths, status progression, and phase boundaries should remain stable across both tools.
