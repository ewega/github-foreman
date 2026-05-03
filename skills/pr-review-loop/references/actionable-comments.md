# Actionable comments

Bucket review comments internally:

- **Blocking**: security issues, logic errors, incorrect behavior, broken compatibility, data loss, or test failures.
- **Suggestions**: style, naming, refactoring, or maintainability improvements that may be useful but are not mandatory.
- **Informational**: questions, observations, minor notes, or comments that do not require code changes.

Only send fix requests for actionable comments that align with repository goals and do not introduce scope creep.

Do not blindly apply every suggestion. The Foreman is responsible for judgment.

Fix request template:

```md
@agent Please address the Code Review Agent finding from the latest review cycle:

- Finding: ...
- Why it matters: ...
- Requested change: ...
- Validation to run: ...
```

After posting a fix request:

1. Sleep 3 minutes / 180 seconds.
2. Poll every 2 minutes / 120 seconds for new commits.
3. Request a fresh Code Review Agent cycle after commits land.
