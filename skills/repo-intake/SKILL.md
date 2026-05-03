---
name: repo-intake
description: Repository intake and dependency planning for GitHub Foreman. Use before planning waves, drafting issues, dispatching agents, or judging repo-specific review/CI behavior.
---

# GitHub Repo Intake

Use this skill before making repository-specific plans or dispatching work.

References:

- [Repository instructions](./references/repository-instructions.md)
- [Dependency graph](./references/dependency-graph.md)

## Intake checklist

Read available repository evidence:

1. `.github/copilot-instructions.md`
2. `AGENTS.md`
3. `README*`
4. `CONTRIBUTING*`
5. issue templates
6. pull request templates
7. `.github/workflows/*`
8. package/build/test manifests
9. docs near the affected code
10. recent related issues and PRs

Infer:

- primary language and framework
- validation commands
- branch and release conventions
- documentation structure
- review expectations
- risky shared surfaces

If guidance is missing, infer conventions from existing code and automation and state that inference clearly.

## Dependency planning

Build the issue dependency graph from:

- `Blocked by`
- `Blocks`
- linked issues
- linked PRs
- milestones
- labels
- issue body ordering
- comments from maintainers

Group issues into waves where every issue in a wave can run in parallel safely.
