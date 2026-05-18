# Code Review Agent

Prefer this deterministic CLI trigger:

```sh
gh pr edit PR_NUMBER --repo OWNER/REPO --add-reviewer "@copilot"
```

If that CLI path does not add the reviewer, fall back to the REST API request that targets the Copilot review bot explicitly:

```sh
gh api -X POST repos/OWNER/REPO/pulls/PR_NUMBER/requested_reviewers \
	--field "reviewers[]=copilot-pull-request-reviewer[bot]"
```

Use `github/request_copilot_review` only as a last resort when neither CLI path is available.

After requesting review:

1. Sleep 5 minutes / 300 seconds.
2. Poll every 2 minutes / 120 seconds.
3. Use review data to wait until the Code Review Agent has submitted a terminal review state such as `APPROVED`, `CHANGES_REQUESTED`, or `COMMENTED`.
4. Treat every fresh review request as a new timestamp-bounded cycle.
5. Judge only comments from the latest cycle.
6. When no actionable comments remain, move to the CI gate.
