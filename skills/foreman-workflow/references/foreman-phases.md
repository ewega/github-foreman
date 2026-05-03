# Foreman phases

## Phase 1: Plan

- Read open issues and issue bodies.
- Find dependency markers like `Blocked by`, `Blocks`, linked issues, linked PRs, labels, and milestones.
- Group unblocked issues into waves.
- Select agent and base branch per issue.
- Present the plan before dispatch.

## Phase 1b: Draft issues

- Inspect repository issue templates and recent issue style.
- Draft problem, solution, scope, acceptance criteria, dependencies, and references.
- Present the draft before creating it.

## Phase 2: Dispatch

- Assign Copilot with native tooling.
- Assign Claude/Codex through GraphQL after adding issue-comment context.
- Dispatch independent issues in parallel.
- Track issue status.

## Phase 2b: Monitor

- Sleep before first poll.
- Poll job status and PR lists.
- Continue until every dispatch has a PR or failure.

## Phase 3: Review loop

- Mark PRs ready when appropriate.
- Request Code Review Agent review.
- Wait for submitted reviews.
- Judge comments.
- Send actionable fixes.
- Repeat until clean.

## Phase 3.5: Docs writer agent task

- Preflight whether the target repo exposes `.github/agents/docs-writer.agent.md`.
- If available, create a docs task with `gh agent-task create --custom-agent docs-writer`.
- Monitor with `gh agent-task view --json`.
- If the task produces a PR, add it to wave tracking.
- If the custom-agent task path is unavailable, fall back to the local docs writer subagent and record the fallback.

## Phase 4: CI gate

- Poll checks.
- If red, send failure summary to owning agent and wait for commits.
- Return to review after code changes.

## Phase 5: Docs and consistency

- Run cross-PR consistency review for multi-PR waves.
- Confirm the docs writer task result is reflected in the wave status.

## Phase 6: Human gate

- Present per-PR status, review outcome, CI outcome, docs status, consistency report, and links.
- Wait for explicit approval before merging.

## Phase 7: Advance

- Merge approved PRs.
- Delete branches when part of the approved merge flow.
- Identify the next unblocked wave.
