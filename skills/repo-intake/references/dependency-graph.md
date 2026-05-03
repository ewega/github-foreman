# Dependency graph

Build dependency graphs before dispatch.

Signals:

- issue body markers: `Blocked by`, `Blocks`, `Depends on`, `Prerequisite`
- linked issues and PRs
- labels like `blocked`, `dependency`, `epic`, `milestone`
- comments from maintainers
- branch references
- checklists in issue bodies

Rules:

- Do not dispatch blocked work before dependencies are merged.
- If a blocker has an open PR and the dependent work must start, use the blocker's branch only with explicit plan approval.
- Prefer independent issues in a wave.
- Keep risky shared-surface issues in separate waves unless parallelism is clearly safe.
