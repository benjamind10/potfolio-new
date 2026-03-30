---
name: bd-2-research
description: Codex wrapper for researching a ticket across docs and live code.
argument-hint: "<ticket>"
---

# bd-2-research

Canonical source: `.claude/skills/bd-2-research/SKILL.md`

## Use When

Use this skill to research a ticket across live code and repository documentation before planning implementation.

## Inputs

- Ticket path

## Shared Workflow Contract

- Consume the same ticket artifact Claude would consume.
- Produce a research artifact that Claude or Codex can both use for planning without translation.
- Default output path:
  - `docs/research/[date]_[slug].md`
- Update ticket status to `researched`.

## Source of Truth Rules

1. Live code and tests are primary truth.
2. Repository docs are supporting context.
3. Older docs are only supporting context unless validated against code.

## Required Workflow

1. Read the ticket fully.
2. Break the work into research areas such as components, flows, risks, and integrations.
3. Run phased discovery:
   - docs discovery
   - docs analysis
   - code location
   - code analysis and pattern lookup
4. When delegation helps, prefer Codex `explorer` agents for locator and analyzer subtasks.
5. Wait for each logical phase of evidence gathering before synthesizing findings.
6. Gather metadata such as date, branch, and commit when available.
7. Write or recommend the default research path:
   - `docs/research/[date]_[slug].md`

## Recommended Codex Delegation Pattern

1. `docs-locator`
2. `docs-analyzer`
3. `codebase-locator`
4. `codebase-analyzer` and `code-pattern-finder` in parallel
5. local synthesis by the parent agent

## Suggested Research Areas

- API and route behavior
- Service orchestration
- Data validation and persistence
- Messaging and event flow
- Configuration and feature flags
- Error handling and observability
- Existing tests and coverage gaps
- Build and deployment constraints

## Research Report Shape

```markdown
---
date: [ISO-8601 timestamp]
git_commit: [hash]
branch: [branch]
repository: [repo-name]
topic: "[Ticket title/topic]"
tags: [research, component-tags]
last_updated: [ISO-8601 timestamp]
---

## Ticket Synopsis

## Summary

## Detailed Findings

### [Area 1]
- Finding with evidence: `path/to/file:line`
- Impact on implementation

## Architecture Insights

## Historical Context (from documentation)

## Open Questions
```

## Completion Guidance

After the research artifact is created, the next Codex invocation should be:

`use bd-3-plan with [ticket path] [research path]`

## Notes

- Prefer exact file references over broad narrative.
- Use the agent role templates in `codex/agents/README.md` when you need Claude-agent-equivalent behavior.
