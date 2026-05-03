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
