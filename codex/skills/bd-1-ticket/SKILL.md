---
name: bd-1-ticket
description: Codex wrapper for creating a scoped ticket from a user request.
argument-hint: "<request>"
---

# bd-1-ticket

Canonical source: `.claude/skills/bd-1-ticket/SKILL.md`

## Use When

Use this skill to create a scoped ticket for a bug, feature, or technical debt task before research or implementation begins.

## Inputs

- User request or problem statement

## Shared Workflow Contract

- Produce the same ticket artifact shape Claude would produce.
- Use the default ticket path Codex standardizes on:
  - `docs/tickets/[date]_[type]_[slug].md`
- Mark ticket status as `created`.

## Required Workflow

1. Determine whether the ticket is a `bug`, `feature`, or `debt`.
2. Ask focused questions only when needed to clarify intent, success criteria, and scope boundaries.
3. Probe scope boundaries at least twice so out-of-scope work is explicit.
4. Extract research hooks:
   - keywords such as components, symbols, endpoints, config keys, and errors
   - patterns such as data flow, lifecycle, caching, integration, and error handling
5. Recommend the default ticket path:
   - `docs/tickets/[date]_[type]_[slug].md`
6. Mark ticket status as `created`.

## Delegation Guidance

- Stay local by default.
- Do not use sub-agents unless the user explicitly wants separate discovery help before ticket creation.

## Question Focus

### Bug

- What fails?
- What happens instead?
- What should happen?
- How do we reproduce it?
- Is it environment-specific or a regression?

### Feature

- Which workflow is changing?
- Who consumes the change?
- What are acceptance criteria and non-goals?
- What compatibility requirements exist?

### Debt

- What area needs cleanup?
- What risk exists today?
- What target state should exist after cleanup?
- What compatibility or migration constraints apply?

## Ticket Shape

Use this structure:

```markdown
---
type: [bug|feature|debt]
priority: [high|medium|low]
created: [ISO-8601 timestamp]
status: created
tags: [project-name, area-tags]
keywords: [comma-separated research keywords]
patterns: [comma-separated investigation patterns]
---

# [TYPE-XXX]: [Descriptive Title]

## Description

## Context

## In Scope

## Out of Scope

## Requirements

### Functional

### Non-Functional

## Current State

## Desired State

## Research Context

### Keywords to Search

### Patterns to Investigate

### Decisions Already Made

## Success Criteria

### Automated Verification

### Manual Verification

## Notes
```

## Completion Guidance

After the ticket is created, the next Codex invocation should be:

`use bd-2-research with [ticket path]`

## Notes

- Keep the output decision-ready for downstream research.
- Codex cannot enforce file creation automatically from the skill alone; if asked to implement the workflow, create the ticket at the default path above.
