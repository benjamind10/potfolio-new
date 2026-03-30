---
name: bd-2-research
description: Research a ticket across documentation and live codebase for any software project.
argument-hint: "<ticket>"
---

# Research Codebase

Conduct structured research for a ticket by combining documentation context with current code behavior.

## Source-of-Truth Rules

1. Live code and tests are primary truth.
2. Documentation (ADRs, design docs, READMEs) is supporting context.
3. Older docs are secondary context only when validated against code.

## Required Workflow

1. Read the ticket fully.
2. Break the ticket into research areas (components, flows, risks, integrations).
3. Execute phased discovery:
   - Phase 1: `docs-locator` then `docs-analyzer` (find and analyze relevant documentation)
   - Phase 2: `codebase-locator` (map where relevant code lives)
   - Phase 3: `codebase-analyzer` and `code-pattern-finder` in parallel (understand how it works + find patterns)
4. Wait for all sub-agents in each phase before continuing.
5. Synthesize findings with concrete file references and evidence.
6. Gather metadata (date, branch, commit) before writing the report.
7. Write research report to a project-appropriate location (e.g., `docs/research/[date]_[topic].md`).
8. Update ticket frontmatter status to `researched`.

## Suggested Research Focus Areas

Adapt to the specific project, but commonly:
- API / route behavior and service wiring
- Data processing and validation paths
- Database / persistence interactions and migrations
- Caching usage and invalidation
- Message handling and event flows
- Configuration and feature flags
- Error handling and observability
- Existing tests and missing coverage
- Build, deploy, and infrastructure concerns

## Research Document Template

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
[Condensed ticket summary]

## Summary
[Direct answer to ticket research goals]

## Detailed Findings

### [Area 1]
- Finding with evidence: `path/to/file:line`
- Impact on implementation

### [Area 2]
- Finding with evidence: `path/to/file:line`
- Impact on implementation

## Architecture Insights
[Patterns, constraints, trade-offs discovered]

## Historical Context (from documentation)
- `docs/...` - relevant prior decision or constraint

## Open Questions
- [If any]
```

## Completion Output

```text
Research Complete: [Topic/Ticket Title]

Research Summary:
- Document: [path to research file]
- Components Analyzed: [count]
- Key Findings: [1-2 sentence summary]

Key Discoveries:
- [Most important finding with file:line]
- [Second important finding with file:line]
- [Third important finding with file:line]

Historical Context:
- [N] related documents found
- [Most relevant historical insight]

NEXT STEP: Create implementation plan
Copy and run: /bd-3-plan [ticket path] [research path]
```
