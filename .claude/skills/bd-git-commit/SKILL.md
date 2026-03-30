---
name: bd-git-commit
description: Commit Changes
disable-model-invocation: true
---

# Commit Changes

Create clean, logical git commits for this session's changes.

## Process

1. Review current state:
   - `git status`
   - `git diff`
   - `git diff --staged`
2. Group files into logical commits.
3. Use commit title format: `{type}: {short description}`.
   - Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `chore`, `revert`, `merge`
4. Present commit plan before executing:
   - files per commit
   - full commit message(s)
   - ask for confirmation
5. After approval:
   - stage exact files only
   - create commit(s)
   - show `git log --oneline -n [N]`

## Best Practices

- Prefer small, traceable commits aligned to logical units of work.
- Keep documentation-only updates in `docs` or `chore` commits unless behavior changed.
- Do not stage unrelated local artifacts (e.g., logs, temporary outputs, runtime dumps, IDE files).
- Avoid mixing unrelated refactors with feature/bug changes.

## Important

- Do not add co-authors or AI attribution.
- Commit messages should read as user-authored.
