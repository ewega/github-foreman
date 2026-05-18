# Foreman phases

## Phase 0: Setup

- Read any `SessionStart` hook context first.
- If the hook provided `.github/foreman/wave-state.json` with `active: true` or another in-flight status, use that as the primary resume signal.
- If hook context is missing, hooks are disabled, or the saved state is terminal (`active: false` or `status: completed`), treat that state as historical context only and continue normal setup unless the user explicitly asks to reopen the old wave.
- Preflight required custom agents and choose the working branch.
- Ask whether to work from the default branch or a feature branch. Record the result as `FOREMAN_BASE_BRANCH` and use it for all dispatches in the session.
- For a new feature branch, create it from the default branch tip before dispatching work.

## Phase 1: Plan

- Read open issues and issue bodies.
- Find dependency markers like `Blocked by`, `Blocks`, linked issues, linked PRs, labels, and milestones.
- Group all issues into waves based on dependencies and logical sequencing — plan multiple waves at once.
- For each issue, derive a working branch name (short kebab-case slug from the issue number and title) and select agent, model, and base branch.
- Present a **multi-wave dispatch review table** before dispatch. Show every planned wave in a single table using the format below.
- Wait for explicit approval before assigning any row. The user may approve all rows, modify rows, or hold rows back.
- Later-wave rows are shown for visibility only; they are not dispatched until their wave's prerequisites are complete.

### Dispatch review table format

| Wave | Issue | Title | Working branch | Agent | Model | Dispatch mechanism | Base branch | Dependency context | Validation focus | Notes/Risks |
|------|-------|-------|----------------|-------|-------|--------------------|-------------|--------------------|------------------|-------------|
| 1 | #12 | Add auth middleware | `feat/12-add-auth-middleware` | Copilot | `gpt-4.1` | `gh agent-task --custom-agent repository-developer` | `main` | unblocked | run tests, lint | — |
| 1 | #15 | Fix null deref in parser | `fix/15-null-deref-parser` | Codex | `o3` | GraphQL bot assignment | `main` | unblocked | unit tests pass | — |
| 2 | #18 | Add auth to API routes | `feat/18-auth-api-routes` | Copilot | `gpt-4.1` | `gh agent-task --custom-agent repository-developer` | `feat/12-add-auth-middleware` | blocked by #12 | integration tests | branches from Wave 1 PR |

Column notes:
- **Working branch**: kebab-case slug from issue number + title (e.g. `feat/42-short-title`).
- **Model**: specific identifier when known (`gpt-4.1`, `claude-sonnet-4-5`, `o3`); use `default/unknown` if not observable.
- **Dispatch mechanism**: `gh agent-task --custom-agent repository-developer`, `native Copilot`, or `GraphQL bot assignment`.
- **Dependency context**: `unblocked`, `blocked by #N`, or `branches from <branch>`.

## Phase 1b: Draft issues

- Inspect repository issue templates and recent issue style.
- Draft problem, solution, scope, acceptance criteria, dependencies, and references.
- Present the draft before creating it.

## Phase 2: Dispatch

- Assign only rows approved in the dispatch review table.
- Assign Copilot with native tooling.
- Assign Claude/Codex through GraphQL after adding issue-comment context.
- Dispatch independent issues in parallel.
- Track issue status.
- After dispatch succeeds, continue immediately to Phase 2b. Reporting session IDs or draft PRs is progress, not a handoff point.

## Phase 2b: Monitor

- Sleep before first poll.
- Poll job status and PR lists.
- Continue until every dispatch has a PR or failure.
- Do not stop while agents are merely running or PRs are draft/WIP. Continue automatically through review, CI, docs-writer, and consistency until Phase 6 human gate.
- Stop early only if the user asks to pause or stop, dispatch fails and requires a human choice, credentials/permissions/tooling block progress, or a scope-changing ambiguity cannot be resolved from repository evidence.
- If `SessionStart` hook context already provided active wave state, use that before doing any manual resume work.
- Otherwise, if `.github/foreman/wave-state.json` exists in the local workspace, read it and apply the same active-versus-terminal rules before inferring state from PR comments.
- For PRs that already exist (resumed waves), read the latest comment to determine the current phase:
  - Latest comment requests Code Review Agent → resume Phase 3 (review loop).
  - Latest comment is a fix request to a coding agent → wait for new commits, then return to review loop.
  - Latest comment is a CI failure summary or fix request for failing checks → resume Phase 4 (CI gate).
  - Latest comment is a docs writer dispatch or status update → resume Phase 4b (docs writer agent task).
  - Latest comment is a human gate summary → resume Phase 6 (human gate).
  - No recent Foreman comment → start from Phase 3 (review loop).

## Phase 3: Review loop

- Mark PRs ready when appropriate.
- Request Code Review Agent review.
- Wait for submitted reviews.
- Judge comments.
- Send actionable fixes.
- Repeat until clean.

## Phase 4: CI gate

- Poll checks.
- If red, send failure summary to owning agent and wait for commits.
- Return to review after code changes.
- If all required checks are green, continue to the docs writer agent task.

## Phase 4b: Docs writer agent task

- Run only after Foreman has checked CI and all required checks are green.
- Use the Phase 0 preflight result or re-check whether the target repo exposes `.github/agents/docs-writer.agent.md`.
- If available, create a docs task with `gh agent-task create --custom-agent docs-writer`.
- Build the docs task from current PR state, including any commits added during CI failure recovery.
- Monitor with `gh agent-task view --json`.
- If the task produces a PR, add it to wave tracking for consistency and the human gate.
- If the custom-agent task path is unavailable, skip the docs task, notify the user, and record the skip. Do not invoke `docs-writer` locally.

## Phase 5: Docs and consistency

- Confirm the docs writer task result is reflected in the wave status.
- Run one consistency review for multi-PR waves, including cross-docs validation.
- Use this report format:

```md
## Wave Consistency Report

### Shared Surface Conflicts
- [file or subsystem]: [finding]

### Contracts and Conventions
- [OK or issue]

### Validation and Workflow Impact
- [OK or issue]

### Docs Impact
- [OK or issue]

### Cross-Docs Consistency
- [docs file or subsystem]: [finding]
- Docs-writer output vs. code PR behavior: [OK or issue]
- Docs changes across PRs and README/instructions alignment: [OK or issue]

### Recommendation
- PASS / WARN / BLOCK
- brief rationale
```

- Only flag issues that matter for safe merging or post-merge correctness.

## Phase 6: Human gate

- Persist the current wave snapshot to the local `.github/foreman/wave-state.json` before presenting the human gate.
- Record `phase: human-gate`, `status: awaiting-merge-approval`, and `active: true` for an in-flight wave.
- If the `Stop` hook blocks completion, refresh the local state file and then stop.
- Present per-PR status, review outcome, CI outcome, docs status, consistency report, and links.
- Wait for explicit approval before merging.

## Phase 7: Advance

- Refresh the local `.github/foreman/wave-state.json` after approved merges.
- If no next wave starts immediately, write a terminal snapshot such as `status: completed` and `active: false` so later sessions do not resume a finished wave.
- Merge approved PRs.
- Delete branches when part of the approved merge flow.
- Identify the next unblocked wave.
