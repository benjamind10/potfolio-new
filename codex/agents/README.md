# Codex Agent Mapping

## Purpose

These role templates translate the canonical Claude agent files into Codex-compatible operating guidance. They are not executable agent definitions. They are prompt templates and behavior rules for use with Codex's built-in agent types, primarily `explorer`.

Claude source remains canonical.

Use these templates together with:

- `docs/codex-usage.md` for wrapper usage and phase sequencing
- `docs/codex-claude-mapping.md` for source-of-truth mappings and intentional drift notes

This keeps Codex phase outputs interoperable with Claude phase outputs.

## Workflow Role Map

### Research Phase

- `docs-locator` for document discovery
- `docs-analyzer` for decision-grade doc synthesis
- `codebase-locator` for implementation surface mapping
- `codebase-analyzer` for runtime behavior tracing
- `code-pattern-finder` for in-repo examples

Recommended Codex orchestration:

1. Run `docs-locator`
2. Run `docs-analyzer`
3. Run `codebase-locator`
4. Run `codebase-analyzer` and `code-pattern-finder` in parallel
5. Synthesize locally into the shared research artifact

### Plan Phase

- Stay local by default
- Use an `explorer` only to close a narrow evidence gap

### Execute Phase

- Stay local by default
- Use a `worker` only when the user explicitly wants delegation or the phase can be split into disjoint write scopes
- Parent agent owns integration, verification, and plan updates

### Verify Phase

- Stay local by default so final review judgment stays centralized

## Spawn Prompt Rules

When using a Codex sub-agent for one of these roles:

- identify the Claude-equivalent role by name
- bound the topic tightly
- require repository-relative paths or `file:line` evidence as appropriate
- tell the sub-agent not to critique or redesign unless the task explicitly asks for that
- keep final synthesis in the parent agent

## codebase-locator

- Claude source: `.claude/agents/codebase-locator.md`
- Recommended Codex agent type: `explorer`
- Use when: you need to find where code, configuration, tests, and docs live without analyzing runtime behavior.

### Prompt Template

```text
Locate the files and directories relevant to [topic].

Follow the codebase-locator role:
- only document what exists today
- do not analyze implementation behavior
- do not critique or recommend changes
- group results by role such as entry points, API/web, services, data, config, tests, and docs
- use repository-relative paths
- include nearest related locations if no direct match exists
```

Use this when the parent agent needs a fast repository map before tracing behavior.

### Expected Output

- Entry points
- API / Web Layer
- Service / Business Logic
- Data / Persistence
- Configuration
- Tests
- Documentation
- Related files

### Evidence Rules

- Use repository-relative paths.
- Keep role labels concise.
- Do not infer runtime behavior from filenames alone.

### Must Not Do

- No root cause analysis
- No implementation tracing
- No improvement suggestions
- No architecture critique

## codebase-analyzer

- Claude source: `.claude/agents/codebase-analyzer.md`
- Recommended Codex agent type: `explorer`
- Use when: you need deterministic, evidence-backed explanation of how code works today.

### Prompt Template

```text
Analyze how [component or workflow] works in this repository.

Follow the codebase-analyzer role:
- start from the most likely entry point
- trace the real execution path narrowly before expanding
- prefer code truth over docs
- include exact file:line references for every implementation claim
- use the deterministic section order from the role
- avoid advice unless explicitly requested
```

Use this after location work is done and the parent agent needs a deterministic explanation that can feed research or planning.

### Expected Output

- Overview
- Entry Points
- Core Types
- Core Implementation
- Data Flow
- Object Relationships
- Module and Dependency Boundaries
- Async and Resource Lifecycle
- Configuration and Runtime Inputs
- Error Handling
- Patterns Observed
- Language/Framework-Specific Notes
- Deterministic Summary
- Evidence Gaps

### Evidence Rules

- Every behavioral claim must cite at least one concrete `file:line`.
- Call out code-vs-doc conflicts explicitly.
- Put unconfirmed flow details in Evidence Gaps.

### Must Not Do

- No guessing about runtime behavior
- No unrelated module review
- No style critique
- No broad speculative architecture narrative

## code-pattern-finder

- Claude source: `.claude/agents/code-pattern-finder.md`
- Recommended Codex agent type: `explorer`
- Use when: you need real repository examples of an existing pattern, not a proposed new design.

### Prompt Template

```text
Find existing repository patterns for [pattern type].

Follow the code-pattern-finder role:
- document existing patterns only
- do not redesign or improve them
- find 1-3 strong examples
- include concise, evidence-backed snippets or references
- include a related test example when available
- report nearest alternatives if no direct match exists
```

Use this during research or planning when implementation should follow an existing in-repo shape.

### Expected Output

- Pattern 1
- Pattern 2 or nearest alternative
- Variation Notes
- Related Files
- Search Terms Used
- Evidence Gaps

### Evidence Rules

- Cite each example with concrete `path:line`.
- Keep examples short and representative.

### Must Not Do

- No invented patterns
- No idealized rewrites
- No design advice unless asked

## docs-locator

- Claude source: `.claude/agents/docs-locator.md`
- Recommended Codex agent type: `explorer`
- Use when: you need to find which documents matter before any deeper analysis.

### Prompt Template

```text
Locate documentation relevant to [topic].

Follow the docs-locator role:
- only discover, categorize, and rank documents
- do not deeply analyze contents
- include historical and archived documents when relevant
- group findings by relevance and category
- prepare the output so a downstream analyzer can choose what to read next
```

Use this before docs analysis. It is discovery only.

### Expected Output

- High Relevance
- Medium Relevance
- Low Relevance
- Notable Clusters
- Suggested Next Reads
- Search Summary

### Evidence Rules

- Use repository-relative paths.
- Prefer titles, headers, and filenames over deep summarization.

### Must Not Do

- No decision extraction
- No long summaries
- No quality evaluation

## docs-analyzer

- Claude source: `.claude/agents/docs-analyzer.md`
- Recommended Codex agent type: `explorer`
- Use when: you need a decision-grade synthesis from repository documents.

### Prompt Template

```text
Analyze [document or document set] for implementation-relevant decisions and constraints.

Follow the docs-analyzer role:
- extract only decision-grade signal
- distinguish confirmed, likely, uncertain, and deprecated items
- identify what is valid today versus historical context
- surface conflicts explicitly
- include file:line evidence for claims
- keep the output compressed and actionable
```

Use this after docs are identified and before final research synthesis.

### Expected Output

- Document Context
- Ground Truth (Use This Today)
- Key Decisions
- Critical Constraints
- Technical Specifications
- Actionable Insights
- Conflicts or Risks
- Still Open / Unresolved
- Deprecated / Ignore
- Deterministic Summary

### Evidence Rules

- Cite decision-grade claims with `path:line`.
- Prefer newer and more authoritative sources when conflicts exist.
- Mark uncertainty explicitly rather than guessing.

### Must Not Do

- No generic summarization
- No filler narrative
- No unsupported assumptions
- No architecture recommendations unless asked
