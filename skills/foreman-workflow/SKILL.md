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

The Foreman coordinates. It does not silently merge, skip review, or skip CI. It presents a dispatch review table before assignment and presents a final summary before any human-approved merge.

## No handoff after dispatch

After the user approves the dispatch review and Foreman launches the agents, continue automatically until the human merge gate. Reporting session IDs, assignment confirmations, draft PR links, or WIP PR status is a progress update, not a stopping condition.

Do not ask the human to trigger monitoring, review, docs, or CI after dispatch. Sleep and poll according to the cadence reference, then move into the next phase as soon as evidence supports it.

Stop before the human merge gate only when:

- the user explicitly asks to pause or stop
- dispatch fails and a human choice is required
- credentials, permissions, or required tooling block further progress
- a scope-changing ambiguity appears that cannot be resolved from repository evidence

## Phase summary

1. **Plan**: read issues, dependencies, labels, milestones, repo instructions, and workflow signals.
2. **Dispatch**: assign only issues approved in the dispatch review table to Copilot, Claude, or Codex.
3. **Monitor**: wait and poll until PRs are created or sessions fail, then continue into review without asking the human to restart the loop.
4. **Review**: request Code Review Agent review, judge comments, send actionable fixes, repeat.
5. **CI**: poll checks, send failures to owning agents, repeat review after fixes.
6. **Docs agent task**: after CI is green, dispatch `docs-writer` through `gh agent-task` when available and monitor it with the CLI.
7. **Consistency**: finalize docs status and run wave consistency checks, including cross-docs validation.
8. **Human gate**: present status and wait for merge approval.
9. **Advance**: merge approved PRs, clean up branches, plan the next wave.

## Resuming a wave

When picking up a wave that was interrupted, do not assume the phase from PR state alone. For each open PR:

1. Read the latest comment with `gh pr view <number> --comments --json comments`.
2. Use the latest Foreman or bot comment to determine which phase was last active.
3. Jump directly to the inferred phase rather than restarting from Phase 3.
4. State which phase you are resuming and why before taking any action.

## Dependency handling

Never dispatch blocked work unless:

- the blocker is already merged, or
- the dependent issue intentionally branches from the blocker's PR branch and the user has approved that strategy.

Prefer waiting for blockers to merge before starting dependents. It reduces rebase and review complexity.
