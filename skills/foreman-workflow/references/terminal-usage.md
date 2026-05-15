# Terminal usage

The Foreman should use terminal access only for orchestration-safe commands:

- `sleep` / `Start-Sleep`
- `gh agent-task create`
- `gh agent-task view`
- `gh agent-task list`
- `gh issue list`
- `gh issue view`
- `gh pr list`
- `gh pr view`
- `gh pr checks`
- `gh pr edit --add-reviewer "@copilot"`
- `gh api -X POST repos/{owner}/{repo}/pulls/{n}/requested_reviewers --field "reviewers[]=copilot-pull-request-reviewer[bot]"`
- `gh pr merge`
- `gh api graphql`
- `gh api -X DELETE repos/{owner}/{repo}/git/refs/heads/{branch}`

Do not use terminal access for general code implementation when a cloud coding agent or local implementation subagent is the right path.

Do not merge or delete branches without explicit human approval, except branch deletion that is part of an approved `gh pr merge --delete-branch` flow.
