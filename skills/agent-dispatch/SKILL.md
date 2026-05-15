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

## Dispatch review before assignment

Before assigning any issue, present a compact Markdown table and wait for explicit human approval. The table is the pre-dispatch gate.

| Wave | Issue | Title | Agent | Model/Profile | Dispatch mechanism | Base branch | Dependency context | Validation focus | Notes/Risks |
|------|-------|-------|-------|---------------|--------------------|-------------|--------------------|------------------|-------------|
| ... | #... | ... | Copilot / Claude / Codex | repository-developer + model, native Copilot model, or bot profile | `gh agent-task --custom-agent`, native Copilot fallback, or GraphQL bot assignment | ... | unblocked / blocked by / branches from | ... | ... |

Rules:

- For Copilot custom-agent dispatch, show `Copilot` as the agent and `repository-developer` plus the selected model when known.
- For native/default Copilot fallback, label the fallback explicitly and show the requested model when known; use `default/unknown` if the model is not observable.
- For Claude and Codex, show the bot profile and state that base-branch and dependency context will be delivered through an issue comment.
- If any row lacks an issue, agent, model/profile, dispatch mechanism, base branch, or dependency context, ask for clarification before dispatching that row.
- After approval, dispatch independent approved rows in parallel when safe. Hold unapproved rows back.

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

Custom instructions should include:

- issue acceptance criteria
- relevant repository instructions
- files/directories likely involved
- validation commands from repository evidence
- branch/dependency constraints

Do not silently create `.github/agents/repository-developer.agent.md` in arbitrary target repositories. If a repo should use the cloud custom-agent path, surface that as an explicit setup step.

## Target repository custom-agent setup

During Foreman setup, preflight both target-repo agent files:

```sh
gh api repos/OWNER/REPO/contents/.github/agents/repository-developer.agent.md
gh api repos/OWNER/REPO/contents/.github/agents/docs-writer.agent.md
```

If either file is missing, tell the user which files are absent and what they enable. Ask whether Foreman should create them now.

- If the user approves, fetch the canonical agent content from `ewega/github-foreman` and commit each missing file to the target repository's default branch with the message `chore: add foreman agent files`.
- If the user declines, use native Copilot fallback for implementation dispatch and skip cloud docs-writer tasks until `.github/agents/docs-writer.agent.md` exists.

Never create or overwrite target-repo custom-agent files without explicit user approval.

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
