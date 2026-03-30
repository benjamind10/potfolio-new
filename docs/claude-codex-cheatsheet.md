# Claude vs Codex Cheat Sheet

## Purpose

Use this page when you want the same BD workflow in either Claude or Codex without thinking about syntax differences.

For the shared Codex mapping and invocation guidance, see `docs/codex-claude-mapping.md` and `docs/codex-usage.md`.

## Core Rule

The workflow is the same in both tools:

1. `bd-1-ticket`
2. `bd-2-research`
3. `bd-3-plan`
4. `bd-4-execute`
5. `bd-5-verify`
6. `bd-git-commit`

Only the invocation style differs.

## Phase Commands

| Phase | Claude | Codex |
| --- | --- | --- |
| Ticket | `/bd-1-ticket [request]` | `use bd-1-ticket for [request]` |
| Research | `/bd-2-research [ticket path]` | `use bd-2-research with [ticket path]` |
| Plan | `/bd-3-plan [ticket path] [research path]` | `use bd-3-plan with [ticket path] [research path]` |
| Execute | `/bd-4-execute [plan path]` | `use bd-4-execute with [plan path]` |
| Verify | `/bd-5-verify [plan path]` | `use bd-5-verify with [plan path]` |
| Commit | `/bd-git-commit` | `use bd-git-commit for the current session changes` |

## Shared Artifacts

Both tools should read and write the same artifact shapes:

- Ticket: `docs/tickets/[date]_[type]_[slug].md`
- Research: `docs/research/[date]_[slug].md`
- Plan: `docs/plans/[slug].md`
- Review: `docs/reviews/[slug]-review.md`

Status progression:

- `created`
- `researched`
- `implemented`
- `reviewed`

## Research Agent Equivalents

| Claude specialist | Codex equivalent |
| --- | --- |
| `docs-locator` | `explorer` using the `docs-locator` role template |
| `docs-analyzer` | `explorer` using the `docs-analyzer` role template |
| `codebase-locator` | `explorer` using the `codebase-locator` role template |
| `codebase-analyzer` | `explorer` using the `codebase-analyzer` role template |
| `code-pattern-finder` | `explorer` using the `code-pattern-finder` role template |

Codex research shape:

1. docs discovery
2. docs analysis
3. code location
4. code analysis and pattern lookup
5. local synthesis into the research artifact

## Example End-to-End

### Claude

```text
/bd-1-ticket fix broker page not refreshing after reconnect
/bd-2-research docs/tickets/2026-03-29_bug_broker-refresh.md
/bd-3-plan docs/tickets/2026-03-29_bug_broker-refresh.md docs/research/2026-03-29_broker-refresh.md
/bd-4-execute docs/plans/broker-refresh.md
/bd-5-verify docs/plans/broker-refresh.md
```

### Codex

```text
use bd-1-ticket for fix broker page not refreshing after reconnect
use bd-2-research with docs/tickets/2026-03-29_bug_broker-refresh.md
use bd-3-plan with docs/tickets/2026-03-29_bug_broker-refresh.md docs/research/2026-03-29_broker-refresh.md
use bd-4-execute with docs/plans/broker-refresh.md
use bd-5-verify with docs/plans/broker-refresh.md
```

## Practical Difference

- Claude is the canonical source for skill and specialist-agent definitions.
- Codex uses repo-local skill wrappers plus native sub-agents to follow the same workflow.
- In Codex, research often uses `explorer` sub-agents; execution and verification usually stay local unless delegation is explicitly useful.
