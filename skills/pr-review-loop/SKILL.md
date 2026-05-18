---
name: pr-review-loop
description: GitHub PR review and CI gate workflow. Use for requesting Code Review Agent reviews, judging review comments, sending agent fixes, and polling CI.
---

# GitHub PR Review Loop

Use this skill after dispatched agents create PRs.

References:

- [Code Review Agent](./references/code-review-agent.md)
- [Actionable comments](./references/actionable-comments.md)
- [CI gate](./references/ci-gate.md)
- [Docs writer agent task](../cli-operations/references/docs-writer-agent-task.md)

## Review loop

1. Mark draft PRs ready for review when appropriate.
2. Request a fresh Code Review Agent review, preferring `gh pr edit --add-reviewer "@copilot"` and falling back to `gh api -X POST repos/{owner}/{repo}/pulls/{n}/requested_reviewers --field "reviewers[]=copilot-pull-request-reviewer[bot]"` when needed.
3. Wait for submitted reviews.
4. Read review comments from the current cycle only.
5. Judge comments internally as blocking, suggestion, or informational.
6. Send focused fix requests only for actionable comments.
7. Wait for new commits.
8. Request a fresh review cycle after code changes.
9. Exit only when no actionable comments remain.
10. Move to the CI gate.

## Fix comments

Mention the agent that owns the PR:

- `@copilot`
- `@claude[agent]`
- `@codex[agent]`

Keep fix comments specific, concise, and grounded in reviewer evidence.

## CI loop

After the review loop is clean, poll checks. If checks fail, summarize the failure for the owning agent, request a fix, wait for new commits, then return to the review loop before trying CI again. When all required checks are green, dispatch the docs writer agent task.

## Docs writer task

After CI passes, dispatch the docs writer through `gh agent-task create --custom-agent docs-writer` when the target repository exposes that custom agent. Monitor it with `gh agent-task view --json`.

If the task creates a docs PR, add that PR to wave tracking and include it in the post-CI consistency report and the human gate. If required checks on a docs PR block merge, report that status at the gate or send a focused docs fix task as appropriate; do not move the docs writer ahead of code CI. If the custom-agent task path is unavailable, skip the docs task for this session, report the limitation, and do not invoke `docs-writer` locally.
