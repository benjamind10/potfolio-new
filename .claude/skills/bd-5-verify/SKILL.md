---
name: bd-5-verify
description: Verify implementation against the plan, document drift, and produce a review report.
argument-hint: "<plan>"
---

# Review Plan

Validate that implementation matches plan intent, success criteria, and project quality standards.

## Required Workflow

1. Read the plan fully.
2. Identify expected file changes and success criteria per phase.
3. Inspect actual changes in code and tests.
4. Run automated checks listed in plan (or closest project-equivalent commands).
5. Record deviations, risks, and follow-up actions.
6. Write report to a project-appropriate location (e.g., `docs/reviews/[plan-name]-review.md`).
7. Update ticket status to `reviewed` when review is complete.

## Review Report Template

```markdown
# Validation Report: [Plan Name]

## Implementation Status
- Phase 1: [complete/partial/missing]
- Phase 2: [complete/partial/missing]

## Automated Verification Results
- Command: `[command]` -> [pass/fail]

## Findings

### Matches Plan
- [Confirmed item]

### Deviations from Plan
- [Deviation]
- Impact: [low/medium/high]
- Recommendation: [action]

### Risks and Gaps
- [Risk or missing coverage]

## Manual Validation Checklist
- [ ] [manual test item]

## Recommendation
[Ready / needs fixes before merge]
```

## Completion Output

```text
Verification Complete: [Plan Name]

Implementation Status:
- Complete phases: [N]
- Partial phases: [N]
- Incomplete phases: [N]

Automated Verification:
- [command]: [pass/fail]
- [command]: [pass/fail]

Issues Found:
- Critical: [N]
- Warnings: [N]
- Improvements: [N]

Review Document:
- [path to review file]

NEXT STEP:
- If issues remain: fix and re-run /bd-5-verify
- If no critical issues: proceed to commit
```
