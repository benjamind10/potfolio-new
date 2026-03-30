---
name: bd-git-commit
description: Codex wrapper for planning and creating clean git commits for the current session.
---

# bd-git-commit

Canonical source: `.claude/skills/bd-git-commit/SKILL.md`

## Use When

Use this skill to prepare clean, logical git commits for the current session's changes.

## Inputs

- Current repository worktree state

## Shared Workflow Contract

- Operate on the same git worktree state Claude would inspect.
- Treat the Claude metadata flag `disable-model-invocation: true` as a behavior rule, not Codex metadata.
- Never create commits without an explicit user request and approval of the proposed grouping.

## Behavioral Note

The canonical Claude skill includes `disable-model-invocation: true`. In Codex, treat that as a behavior rule:

- do not auto-commit without an explicit user request
- show the commit grouping plan before creating commits

## Delegation Guidance

- Stay local by default.
- Do not use sub-agents for commit planning or commit execution.

## Required Workflow

1. Review current state:
   - `git status`
   - `git diff`
   - `git diff --staged`
2. Group changed files into logical commits.
3. Use commit title format:
   - `{type}: {short description}`
4. Allowed types:
   - `feat`
   - `fix`
   - `refactor`
   - `docs`
   - `test`
   - `build`
   - `chore`
   - `revert`
   - `merge`
5. Present the commit plan before executing:
   - files per commit
   - full commit message(s)
6. After approval:
   - stage exact files only
   - create commit(s)
   - show recent commit history

## Completion Guidance

- summarize the commit grouping actually used
- list the commit message(s) created
- show the recent commit history that confirms the result

## Notes

- Prefer small, traceable commits.
- Do not stage unrelated artifacts.
- Do not add co-authors or AI attribution.
- Commit messages should read as user-authored.
