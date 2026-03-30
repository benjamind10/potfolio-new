---
name: bd-5-verify
description: Codex wrapper for verifying implementation against the plan and producing a review artifact.
argument-hint: "<plan>"
---

# bd-5-verify

Canonical source: `.claude/skills/bd-5-verify/SKILL.md`

## Use When

Use this skill after implementation to validate that the work matches the plan, the expected verification steps, and repository quality expectations.

## Inputs

- Plan path

## Shared Workflow Contract

- Consume the same plan artifact Claude would consume.
- Review implementation produced by either Claude or Codex against the same plan.
- Produce a review artifact that either tool can use as the final validation record.
- Default output path:
  - `docs/reviews/[slug]-review.md`

## Required Workflow

1. Read the plan fully.
2. Identify expected changes and success criteria by phase.
3. Inspect the actual implementation and tests.
4. Run the plan's automated checks, or the nearest project-equivalent commands if needed.
5. Record deviations, risks, and follow-up actions.
6. Write or recommend the default review path:
   - `docs/reviews/[slug]-review.md`
7. Update ticket status to `reviewed` when verification is complete.

## Delegation Guidance

- Stay local by default so the final judgment stays centralized and consistent.

## Review Report Shape

```markdown
# Validation Report: [Plan Name]

## Implementation Status

## Automated Verification Results

## Findings

### Matches Plan

### Deviations from Plan

### Risks and Gaps

## Manual Validation Checklist

## Recommendation
```

## Completion Guidance

- report complete, partial, and incomplete phases
- summarize automated verification results
- classify issues by severity or urgency
- point to the review document path

## Notes

- Be explicit about drift between plan intent and actual implementation.
- Prefer evidence-backed findings over general summaries.
