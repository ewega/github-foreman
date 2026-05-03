# Claude and Codex GraphQL assignment

## Get the issue node ID

```sh
gh api graphql -f query='{ repository(owner:"OWNER", name:"REPO") { issue(number:ISSUE_NUMBER) { id } } }' --jq '.data.repository.issue.id'
```

Replace:

- `OWNER`
- `REPO`
- `ISSUE_NUMBER`

Store the returned value as `ISSUE_NODE_ID`.

## Assign Claude

```sh
gh api graphql -f query='mutation { addAssigneesToAssignable(input: { assignableId: "ISSUE_NODE_ID", assigneeIds: ["BOT_kgDODnPHJg"] }) { assignable { ... on Issue { number assignees(first: 5) { nodes { login } } } } } }'
```

## Assign Codex

```sh
gh api graphql -f query='mutation { addAssigneesToAssignable(input: { assignableId: "ISSUE_NODE_ID", assigneeIds: ["BOT_kgDODnSAjQ"] }) { assignable { ... on Issue { number assignees(first: 5) { nodes { login } } } } } }'
```

## Verification

The response should include the assigned bot login in:

```text
assignable.assignees.nodes[].login
```

If assignment fails:

1. Confirm third-party agents are enabled in Copilot policies.
2. Confirm the issue node ID is correct.
3. Confirm the bot node ID is correct.
4. Fall back to Copilot or local implementation if the bot cannot be assigned.
