---
name: cli-operations
description: CLI-first GitHub management for GitHub Foreman. Use when reading issues, PRs, checks, or managing agent tasks with gh instead of GitHub MCP tools.
---

# GitHub CLI Operations

Use this skill when Foreman needs to manage GitHub state through the `gh` CLI.

`gh agent-task` is in preview and may change without notice. Prefer CLI-first workflows for the experiment, but keep GitHub MCP tools as a fallback when the CLI surface is unavailable or ambiguous.

References:

- [Agent task CLI](./references/agent-task.md)
- [Issue and PR CLI](./references/issue-and-pr-cli.md)
- [Docs writer agent task](./references/docs-writer-agent-task.md)

## Policy

1. Prefer `gh` commands with `--json` and `--jq` for machine-readable state.
2. Use explicit `--repo OWNER/REPO` whenever the subcommand supports it.
3. Preserve Foreman's sleep/poll cadence instead of relying on indefinite watch commands.
4. Use GitHub MCP tools only as fallback while the CLI-first path is experimental.
5. Do not create real agent tasks during validation without an explicit target repository and approval.

## Common commands

Issue intake:

```sh
gh issue list --repo OWNER/REPO --json number,title,body,labels,milestone,state,updatedAt,url
gh issue view ISSUE --repo OWNER/REPO --json number,title,body,comments,labels,milestone,state,closedByPullRequestsReferences,updatedAt,url
```

PR discovery:

```sh
gh pr list --repo OWNER/REPO --json number,title,body,headRefName,baseRefName,author,isDraft,state,url,closingIssuesReferences,latestReviews,reviewDecision,statusCheckRollup,updatedAt
gh pr view PR --repo OWNER/REPO --json number,title,body,headRefName,baseRefName,isDraft,state,url,comments,reviews,latestReviews,reviewDecision,statusCheckRollup,commits,files,updatedAt
```

Checks:

```sh
gh pr checks PR --repo OWNER/REPO --json bucket,completedAt,description,event,link,name,startedAt,state,workflow
```

Agent tasks:

```sh
gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent repository-developer -F task.md
gh agent-task create --repo OWNER/REPO --base BASE_BRANCH --custom-agent AGENT_NAME -F task.md
gh agent-task view SESSION_ID --repo OWNER/REPO --json id,name,state,pullRequestNumber,pullRequestState,pullRequestTitle,pullRequestUrl,updatedAt --jq .
```

For Foreman's default Copilot implementation path, use `--custom-agent repository-developer` when the target repo exposes `.github/agents/repository-developer.agent.md`. If it does not, fall back to native/default Copilot assignment and state the fallback.
