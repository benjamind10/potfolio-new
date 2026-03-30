---
name: bd-3-plan
description: Codex wrapper for turning a ticket and research artifact into an implementation plan.
argument-hint: "<ticket> <research>"
---

# bd-3-plan

Canonical source: `.claude/skills/bd-3-plan/SKILL.md`

## Use When

Use this skill to turn a ticket and research artifact into a practical, phased implementation plan.

## Inputs

- Ticket path
- Research path

## Shared Workflow Contract

- Consume the same ticket and research artifacts Claude would consume.
- Produce a plan artifact that either tool can execute from the next incomplete phase.
- Default output path:
  - `docs/plans/[slug].md`

## Planning Principles

1. Verify assumptions in code before finalizing phases.
2. Keep phases small, testable, and reversible.
3. Explicitly list what is out of scope.
4. Prefer established repository patterns over new abstractions.
5. Include verification commands appropriate to the project.

## Required Workflow

1. Read the ticket and research files fully.
2. Confirm current-state constraints against code when needed.
3. Produce a phased plan with clear success criteria per phase.
4. Write or recommend the default plan path:
   - `docs/plans/[slug].md`

## Delegation Guidance

- Stay local by default.
- Use Codex `explorer` agents only for narrow evidence gaps that do not justify broad replanning.

## Plan Shape

```markdown
# [Feature/Task Name] Implementation Plan

## Overview

## Current State Analysis

## Desired End State

## What We Are Not Doing

## Implementation Approach

## Phase 1: [Name]
### Changes Required

### Success Criteria
#### Automated Verification
#### Manual Verification

## Phase 2: [Name]

## Testing Strategy

## Rollback/Mitigation Notes
```

## Completion Guidance

After the plan is created, the next Codex invocation should be:

`use bd-4-execute with [plan path]`

## Notes

- The plan should be decision-complete enough that the implementer does not need to invent missing behavior.
