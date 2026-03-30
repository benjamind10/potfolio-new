---
name: bd-1-ticket
description: Create a scoped ticket for bug, feature, or technical debt work in any software project.
argument-hint: "<UserRequest>"
---

# Create Ticket

Create a high-quality ticket that downstream research and planning agents can execute with minimal ambiguity.

## Required Process

1. Determine ticket type: `bug`, `feature`, or `debt`.
2. Ask focused questions to clarify intent, acceptance criteria, and scope boundaries.
3. Run at least two rounds of scope-boundary probing to identify what is explicitly out of scope.
4. Extract research hooks:
   - keywords (components, symbols, endpoints, error messages, config keys)
   - patterns (data flow, service interaction, caching, lifecycle, error handling)
5. Write ticket file to a project-appropriate location (e.g., `docs/tickets/[date]_[type]_[slug].md` or similar).
6. Set frontmatter status to `created`.

## Question Bank

### Bug
1. Which component, endpoint, or workflow fails?
2. What is the exact observed behavior?
3. What is the expected behavior?
4. Reproduction steps with example inputs?
5. Is the failure environment-specific (local/staging/production/CI)?
6. Any logs, traces, stack traces, or response bodies?
7. Is this a regression? If yes, from which change window?

### Feature
1. Which workflow or system area is being added or changed?
2. Who consumes this behavior (user, API client, internal service)?
3. What are acceptance criteria and non-goals?
4. Which existing contracts or interfaces must remain backward-compatible?
5. Are schema, config, or infrastructure changes needed?
6. What performance or scalability constraints apply?
7. How should this be tested (unit/integration/e2e)?

### Debt
1. Which file, module, or area needs cleanup?
2. What current risk does it create (bugs, latency, operability, complexity)?
3. What target state should exist after cleanup?
4. Must behavior remain fully backward-compatible?
5. Any migration or data-impact concerns?
6. Which tests must be added or updated?

## Ticket Template

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
[Clear description]

## Context
[Business/technical context and impact]

## In Scope
- [Item]

## Out of Scope
- [Item]

## Requirements

### Functional
- [Requirement]

### Non-Functional
- [Performance/security/operability constraints]

## Current State
[What exists now]

## Desired State
[What should exist]

## Research Context

### Keywords to Search
- [keyword] - [reason]

### Patterns to Investigate
- [pattern] - [reason]

### Decisions Already Made
- [decision] - [rationale]

## Success Criteria

### Automated Verification
- [ ] [relevant test command]

### Manual Verification
- [ ] [manual step]

## Notes
[Anything else relevant]
```

## Completion Output

```text
Ticket Created: [TYPE-XXX]: [Title]

Ticket Details:
- Type: [bug|feature|debt]
- Priority: [high|medium|low]
- Location: [path to ticket file]
- Status: created

Scope Summary:
- [Key scope item]
- [Key scope item]

Research Hooks:
- Keywords: [top terms]
- Patterns: [top patterns]

NEXT STEP: Begin research phase
Copy and run: /bd-2-research [path to ticket file]
```
