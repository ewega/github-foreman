# Issue and PR CLI

Use `gh` with `--json` and `--jq` to make Foreman state reads deterministic.

## Issues

List issues:

```sh
gh issue list --repo OWNER/REPO --json number,title,body,labels,milestone,state,updatedAt,url
```

View one issue:

```sh
gh issue view ISSUE --repo OWNER/REPO --json number,title,body,comments,labels,milestone,state,closedByPullRequestsReferences,updatedAt,url
```

Useful issue fields:

- `number`
- `title`
- `body`
- `comments`
- `labels`
- `milestone`
- `state`
- `closedByPullRequestsReferences`
- `updatedAt`
- `url`

## Pull requests

List PRs:

```sh
gh pr list --repo OWNER/REPO --json number,title,body,headRefName,baseRefName,author,isDraft,state,url,closingIssuesReferences,latestReviews,reviewDecision,statusCheckRollup,updatedAt
```

View one PR:

```sh
gh pr view PR --repo OWNER/REPO --json number,title,body,headRefName,baseRefName,isDraft,state,url,comments,reviews,latestReviews,reviewDecision,statusCheckRollup,commits,files,updatedAt
```

Useful PR fields:

- `number`
- `title`
- `headRefName`
- `baseRefName`
- `isDraft`
- `state`
- `closingIssuesReferences`
- `latestReviews`
- `reviews`
- `reviewDecision`
- `statusCheckRollup`
- `commits`
- `files`
- `updatedAt`
- `url`

## Checks

```sh
gh pr checks PR --repo OWNER/REPO --json bucket,completedAt,description,event,link,name,startedAt,state,workflow
```

The `bucket` field groups checks into:

- `pass`
- `fail`
- `pending`
- `skipping`
- `cancel`

Keep Foreman's explicit polling cadence unless the user asks to use `gh pr checks --watch`.
