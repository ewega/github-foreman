# Docs writer agent task

After the code PR review loop is clean and Foreman has checked that all required CI checks are green, Foreman should dispatch the docs writer as a GitHub agent task when possible.

## Preflight

The `gh agent-task create --custom-agent` documentation describes custom agents as being defined in the target repository under:

```text
.github/agents/my-agent.md
```

Before using `--custom-agent docs-writer`, check whether the target repository exposes that agent:

```sh
gh api repos/OWNER/REPO/contents/.github/agents/docs-writer.agent.md --jq .path
```

If this succeeds, use the custom-agent path. If it fails, skip the docs task for this session and report the limitation to the user. Do not invoke `docs-writer` locally and do not silently create repo-local custom agent files.

## Create the docs task

Use a task file or stdin. The task should include:

- PR numbers and URLs in the wave
- summary of behavior changes
- files changed or subsystems touched
- repository instructions discovered during intake
- docs that should be checked
- acceptance criteria for the docs pass
- current PR commits and files after any CI-fix commits, so the docs pass reflects the latest behavior

```sh
gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent docs-writer -F docs-writer-task.md
```

or:

```sh
printf '%s\n' "$DOCS_WRITER_TASK" | gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent docs-writer -F -
```

## Monitor the task

Prefer session ID tracking:

```sh
gh agent-task view SESSION_ID --repo OWNER/REPO --json id,name,state,pullRequestNumber,pullRequestState,pullRequestTitle,pullRequestUrl,updatedAt --jq .
```

Outcomes:

- terminal success with no PR: record docs check complete
- terminal success with PR: add docs PR to wave tracking and include it in review/CI/human gate
- failure: summarize and either retry once or report the failed docs pass to the user
- running/pending: preserve Foreman sleep/poll cadence
