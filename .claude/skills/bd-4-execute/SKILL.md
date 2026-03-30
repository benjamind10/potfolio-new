---
name: bd-4-execute
description: Execute one phase of an approved implementation plan.
argument-hint: "<plan>"
---

# Implement Plan

Implement exactly one phase per invocation, verify it, update plan progress, then stop.

## Rules

1. Read the plan fully and determine current phase:
   - resume from checkpoint section if present
   - otherwise start at first unchecked phase
2. Read all referenced files for the current phase before editing.
3. Implement only the current phase.
4. Run automated verification for that phase.
5. Update phase checklist and progress markers in the plan.
6. Stop and return a completion summary.

## Verification

Run whatever verification commands the plan specifies for the current phase. Common patterns:
- Unit tests (fast, no external dependencies)
- Integration tests (may require running services)
- Linting / type checking
- Build verification

Use the project's actual test commands — check the plan, README, Makefile, package.json, or CI config for the correct commands.

## Mismatch Protocol

If plan intent and code reality diverge:
1. Explain mismatch clearly (expected vs found).
2. Propose a concrete adjustment.
3. Wait for user approval.
4. Record approved deviation in the plan under `## Deviations from Plan`.

## Completion Output (Per Phase)

```text
Phase Complete: [Phase N - Name]

Changes Made:
- [file + summary]
- [file + summary]

Verification Status:
- Automated: [passed/failed with command summary]
- Manual: [items requiring user verification]

Progress: [X] of [Y] phases complete

NEXT STEP: Continue implementation
Copy and run: /bd-4-execute [plan path]
```

## Final-Phase Completion Output

When all phases are done, also:
 - update ticket status to `implemented`
 - present final summary and recommend verification

```
Implementation Complete: [Plan Name]

All phases are complete and recorded in the plan.

NEXT STEP: Run full verification
Copy and run: /bd-5-verify [plan path]
```
