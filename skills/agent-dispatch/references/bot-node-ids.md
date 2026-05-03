# Bot node IDs

Third-party coding agents are GitHub bot accounts. The REST API and `gh issue edit --add-assignee` cannot reliably assign them.

Use these node IDs with GraphQL `addAssigneesToAssignable`:

| Agent | Bot login | Node ID |
|-------|-----------|---------|
| Claude | `Claude` | `BOT_kgDODnPHJg` |
| Codex | `Codex` | `BOT_kgDODnSAjQ` |

To discover or verify a bot node ID, query an issue, PR, or comment authored by the bot:

```sh
gh api "repos/OWNER/REPO/issues/NUMBER" --jq '.user.node_id'
```

The GraphQL `user()` query resolves human users only, not these bot accounts.
