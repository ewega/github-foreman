# Polling and sleep periods

Preserve this cadence from the original Foreman workflow unless the user explicitly asks for a different cadence.

| Situation | Sleep |
|-----------|-------|
| Initial wait after dispatch | 5 minutes / 300 seconds |
| Polling for PR creation | 2 minutes / 120 seconds |
| Wait after requesting Code Review Agent review | 5 minutes / 300 seconds |
| Polling for submitted review completion | 2 minutes / 120 seconds |
| Wait after posting actionable fix requests | 3 minutes / 180 seconds |
| Polling for commits after fix request | 2 minutes / 120 seconds |
| Polling docs writer agent task | 2 minutes / 120 seconds |
| Wait after posting CI failure fix request | 3 minutes / 180 seconds |
| CI polling | 2 minutes / 120 seconds |

Use `sleep` on macOS/Linux and `Start-Sleep` on Windows.

Do not ask the human to trigger the next phase after dispatch. Monitoring, review, and CI gates run automatically until the human gate.

Session IDs, assignment confirmations, draft PR URLs, and WIP PR status are progress updates only. They are not valid stopping points.

Run sleep and polling commands so Foreman can observe completion and continue. If a terminal command is still running or times out into the background, fetch its output and keep polling before ending the turn.

During long waits, Foreman may briefly summarize what it is waiting for, but it must not ask the human to say "continue" before the next poll.
