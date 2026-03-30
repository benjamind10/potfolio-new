---
name: bd-3-plan
description: Create a practical implementation plan from a ticket and research for any software project.
argument-hint: "<ticket> <research>"
---

# Implementation Plan

Create a precise, phased implementation plan grounded in current code reality.

## Required Inputs

- Ticket file
- Research file

Read both fully before planning.

## Planning Principles

1. Verify assumptions directly in code before finalizing phases.
2. Keep phases small, testable, and reversible.
3. Explicitly list out-of-scope work.
4. Prefer established repository patterns over new abstractions.
5. Include verification commands appropriate to the project's test infrastructure.

## Suggested Plan Structure

```markdown
# [Feature/Task Name] Implementation Plan

## Overview
[What is changing and why]

## Current State Analysis
[What exists now, constraints, and observed behavior]

## Desired End State
[What should be true after implementation]

## What We Are Not Doing
- [Out-of-scope item]

## Implementation Approach
[High-level strategy]

## Phase 1: [Name]
### Changes Required
- File: `path/to/file`
- Change: [what and why]

### Success Criteria
#### Automated Verification
- [ ] [test command]

#### Manual Verification
- [ ] [manual scenario]

## Phase 2: [Name]
[repeat format]

## Testing Strategy
- Unit tests: [files and commands]
- Integration tests: [files and commands]
- E2E tests: [files and commands, if applicable]
- Run all: [command]

## Rollback/Mitigation Notes
[How to safely back out or mitigate]
```

## Required Output Location

Write plan to a project-appropriate location (e.g., `docs/plans/[descriptive_name].md`).

## Completion Output

```text
Plan Created: [Plan Title]

Plan Details:
- Location: [path to plan file]
- Phases: [count]
- Status: planned

Highlights:
- [Key design decision]
- [Key risk + mitigation]
- [Primary verification approach]

NEXT STEP: Execute phase 1
Copy and run: /bd-4-execute [plan path]
```
