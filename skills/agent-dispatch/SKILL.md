---
name: agent-dispatch
description: GitHub cloud-agent assignment guide for Copilot, Claude, and Codex. Use before dispatching issues, choosing assignment method, writing custom instructions, or using GraphQL bot assignment.
---

# GitHub Agent Dispatch

Use this skill whenever the Foreman is dispatching GitHub issues to Copilot, Claude, or Codex.

## Agent choices

- **Copilot**: default. Prefer launching it as a cloud task with the `repository-developer` custom agent when the target repo exposes that agent. Fall back to native/default Copilot assignment when the custom-agent path is unavailable.
- **Claude**: use for large multi-file refactors, architectural restructuring, and tasks that need deep reasoning.
- **Codex**: use for focused bug fixes, test generation, and fast targeted changes.

When unsure, use Copilot.

When the assignment path allows explicit model selection, prefer lighter execution-oriented models for routine coding work, edits, and fixup loops. Examples include Haiku-class models or other lightweight code-execution models. Reserve heavier models for planning, architecture, or unusually complex refactors where the extra reasoning depth is necessary.

## Copilot assignment

Prefer CLI cloud-task assignment with the repository-developer custom agent:

```sh
gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent repository-developer -F task.md
```

or:

```sh
printf '%s\n' "$TASK" | gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent repository-developer -F -
```

Preflight cloud custom-agent visibility before using it:

```sh
gh api repos/OWNER/REPO/contents/.github/agents/repository-developer.agent.md --jq .path
```

If the preflight succeeds, select `repository-developer` as the cloud custom agent for Copilot implementation work.

If the preflight fails, fall back to the native/default Copilot assignment path when available:

- owner
- repo
- issue number
- base branch
- model
- custom instructions

For the `model` field, prefer a lighter execution-oriented model by default. Only escalate to a heavier model when the task is materially reasoning-bound rather than execution-bound.

Custom instructions should include:

- issue acceptance criteria
- relevant repository instructions
- files/directories likely involved
- validation commands from repository evidence
- branch/dependency constraints

Do not silently create `.github/agents/repository-developer.agent.md` in arbitrary target repositories. If a repo should use the cloud custom-agent path, surface that as an explicit setup step.

## Claude and Codex assignment

Claude and Codex are third-party GitHub bot accounts. REST and `gh issue edit --add-assignee` cannot reliably assign these bots and may return `422`.

Use GraphQL `addAssigneesToAssignable` via `gh api graphql`.

Read:

- [Bot node IDs](./references/bot-node-ids.md)
- [Claude/Codex GraphQL assignment](./references/claude-codex-graphql.md)

Important constraints:

- Claude/Codex do not support Copilot's `base_ref` or `custom_instructions` assignment parameters.
- To provide extra context, add an issue comment before assigning the bot.
- Include dependency and base-branch context in that issue comment.
- Confirm the assignment response includes the expected bot login.
- When the bot or assignment surface exposes model choice, prefer lighter execution-oriented models first and only step up when the issue truly needs deeper reasoning.

## Context comment template for Claude/Codex

```md
Foreman dispatch context:

- Intended agent: Claude/Codex
- Base branch or dependency context: ...
- Relevant repository instructions: ...
- Acceptance criteria to prioritize: ...
- Validation expected before PR: ...
- Notes: ...
```

Keep the comment focused. Do not paste large repo docs when links, file paths, or concise instructions are enough.
