# Code Review Agent

Prefer this deterministic CLI trigger:

```sh
gh pr edit PR_NUMBER --repo OWNER/REPO --add-reviewer "@copilot"
```

Use `github/request_copilot_review` only as a fallback when the CLI path is unavailable.

After requesting review:

1. Sleep 5 minutes / 300 seconds.
2. Poll every 2 minutes / 120 seconds.
3. Use review data to wait until the Code Review Agent has submitted a terminal review state such as `APPROVED`, `CHANGES_REQUESTED`, or `COMMENTED`.
4. Treat every fresh review request as a new timestamp-bounded cycle.
5. Judge only comments from the latest cycle.
6. When no actionable comments remain, move to the docs writer agent task before CI.
