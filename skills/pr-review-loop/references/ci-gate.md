# CI gate

CI runs automatically on PR pushes. The Foreman should poll existing repository checks rather than inventing new validation.

Before entering the CI gate, the clean review loop should have dispatched and completed the docs writer agent task or explicitly fallen back to the local docs writer.

Process:

1. Poll checks every 2 minutes / 120 seconds until all required runs complete.
2. If all green, continue to docs and consistency.
3. If any check fails:
   - read the failing check details
   - summarize the failure
   - mention the owning coding agent with a focused fix request
   - sleep 3 minutes / 180 seconds
   - poll for new commits every 2 minutes / 120 seconds
   - return to the review loop

Do not advance to the human gate while checks are failing or pending unless the human explicitly instructs otherwise.
