# CI gate

CI runs automatically on PR pushes. The Foreman should poll existing repository checks rather than inventing new validation.

Enter the CI gate after the review loop is clean. The docs writer agent task runs only after Foreman has checked that all required CI checks are green.

Process:

1. Poll checks every 2 minutes / 120 seconds until all required runs complete.
2. If all green, continue to the docs writer agent task.
3. If any check fails:
   - read the failing check details
   - summarize the failure
   - mention the owning coding agent with a focused fix request
   - sleep 3 minutes / 180 seconds
   - poll for new commits every 2 minutes / 120 seconds
   - return to the review loop

Do not advance to the human gate while checks are failing or pending unless the human explicitly instructs otherwise.
