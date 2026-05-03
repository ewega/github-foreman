# `gh agent-task`

`gh agent-task` is a preview GitHub CLI surface for creating, listing, and viewing agent tasks.

Aliases:

- `gh agent`
- `gh agents`
- `gh agent-tasks`

## Create

```sh
gh agent-task create [TASK_DESCRIPTION] [flags]
```

Useful flags:

- `--repo OWNER/REPO`
- `--base BRANCH`
- `--custom-agent AGENT_NAME`
- `--from-file FILE`
- `--follow`

Examples:

```sh
gh agent-task create "Improve the performance of the data processing pipeline"
gh agent-task create "Implement issue #123" --repo OWNER/REPO --base main --custom-agent repository-developer
gh agent-task create "Update docs for PR #123" --repo OWNER/REPO --base main --custom-agent docs-writer
gh agent-task create --repo OWNER/REPO --base main --custom-agent docs-writer -F docs-writer-task.md
printf '%s\n' "$TASK" | gh agent-task create --repo OWNER/REPO --base main --custom-agent docs-writer -F -
```

## Foreman custom-agent convention

When Foreman selects **Copilot** as the cloud implementer, prefer `--custom-agent repository-developer`:

```sh
gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent repository-developer -F task.md
```

Preflight:

```sh
gh api repos/OWNER/REPO/contents/.github/agents/repository-developer.agent.md --jq .path
```

If the repo does not expose that custom agent, fall back to native/default Copilot assignment and report the fallback.

## View

```sh
gh agent-task view SESSION_OR_PR --repo OWNER/REPO --json completedAt,createdAt,id,name,pullRequestNumber,pullRequestState,pullRequestTitle,pullRequestUrl,repository,state,updatedAt,user --jq .
```

Use `view --json` for polling and state transitions. Avoid `--web` and `--log` for routine polling unless debugging.

## List

```sh
gh agent-task list --limit 30 --json completedAt,createdAt,id,name,pullRequestNumber,pullRequestState,pullRequestTitle,pullRequestUrl,repository,state,updatedAt,user --jq .
```

Current local help does not advertise `--repo` for `list`, so use it only in the current repository context unless the CLI later adds repo selection.

## Task identifiers

`gh agent-task view` can identify a task by:

- session ID
- PR number
- PR URL
- PR branch
- agent-session URL

For non-interactive Foreman workflows, prefer session ID because a PR can have multiple agent tasks.
