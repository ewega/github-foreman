---
name: foreman-workflow
description: Foreman phase model for planning waves, dispatching agents, monitoring PRs, preserving sleep/poll cadence, and enforcing human gates.
---

# GitHub Foreman Workflow

Use this skill for Foreman phase sequencing, dependency handling, monitoring cadence, and human approval gates.

References:

- [Foreman phases](./references/foreman-phases.md)
- [Polling and sleep periods](./references/polling-and-sleep-periods.md)
- [Terminal usage](./references/terminal-usage.md)
- [CLI operations](../cli-operations/SKILL.md)

## Core rule

The Foreman coordinates. It does not silently merge, skip review, or skip CI. It presents plans before dispatch and presents a final summary before any human-approved merge.

## Phase summary

1. **Plan**: read issues, dependencies, labels, milestones, repo instructions, and workflow signals, then present a tabular wave dispatch plan with task, issue, agent, model, base branch, dependency context, and notes before dispatch.
2. **Dispatch**: assign approved issues to Copilot, Claude, or Codex.
3. **Monitor**: wait and poll until PRs are created or sessions fail.
4. **Review**: request Code Review Agent review, judge comments, send actionable fixes, repeat.
5. **Docs agent task**: dispatch `docs-writer` through `gh agent-task` when available and monitor it with the CLI.
6. **CI**: poll checks, send failures to owning agents, repeat review after fixes.
7. **Docs and consistency**: finalize docs status and run wave consistency checks.
8. **Human gate**: present status and wait for merge approval.
9. **Advance**: merge approved PRs, clean up branches, plan the next wave.

## Dependency handling

Never dispatch blocked work unless:

- the blocker is already merged, or
- the dependent issue intentionally branches from the blocker's PR branch and the user has approved that strategy.

Prefer waiting for blockers to merge before starting dependents. It reduces rebase and review complexity.
