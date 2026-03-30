---
name: bd-4-execute
description: Codex wrapper for executing exactly one phase of an approved implementation plan.
argument-hint: "<plan>"
---

# bd-4-execute

Canonical source: `.claude/skills/bd-4-execute/SKILL.md`

## Use When

Use this skill to execute exactly one approved implementation phase from a plan, verify it, and stop.

## Inputs

- Plan path

## Shared Workflow Contract

- Consume the same plan artifact Claude would consume.
- Update the existing plan rather than creating a Codex-specific execution record.
- Continue from the next incomplete phase so Claude or Codex can resume interchangeably.

## Required Workflow

1. Read the plan fully.
2. Determine the current phase:
   - resume from a checkpoint if one exists
   - otherwise start with the first incomplete phase
3. Read all files needed for the current phase before editing.
4. Implement only the current phase.
5. Run the automated verification specified for that phase.
6. Update plan progress markers or checklists.
7. Stop after the phase and report status.

## Delegation Guidance

- Stay local by default.
- Use a Codex `worker` only if the user explicitly wants delegation or the current phase can be split into disjoint write scopes.
- The parent agent remains responsible for integration, verification, and plan updates.

## Mismatch Protocol

If the plan and repository reality diverge:

1. Explain the mismatch clearly.
2. Propose a concrete adjustment.
3. Wait for approval before changing course.
4. Record the approved deviation in the plan.

## Completion Guidance

### Per Phase

- summarize changed files and behavior
- summarize automated verification result
- identify any manual verification still needed
- report progress as completed phases versus total phases

### Final Phase

When all phases are complete:

- update the ticket status to `implemented`
- recommend a verification pass
- next Codex invocation:
  - `use bd-5-verify with [plan path]`

## Notes

- This skill is intentionally phase-bounded.
- Codex should not silently roll into the next phase unless the user explicitly wants that behavior.
