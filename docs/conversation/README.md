# Conversation log policy

Conversation logs are the durable record of user intent. Keep one append-only
Markdown file per working session or major thread. The newest relevant file for
the current branch/thread is the active log; create one when none exists.

## Required logging sequence

1. Before implementation or subagent dispatch, append the exact user prompt.
2. Log every follow-up, correction, constraint, approval, and scope change as a
   separate verbatim entry. A summary never replaces the original prompt.
3. Record timestamp, branch, and any user-supplied links with each entry.
4. After work completes, append the orchestrator outcome, decisions, assumptions,
   changed files/PR, validation, remaining risks, and follow-up questions.

The orchestrator is the only writer to the active conversation log. Subagents
report their results to the orchestrator; they never append concurrently. This
keeps the log ordered and prevents merge collisions.

## Entry shape

```markdown
## User prompt — short label

Logged: <ISO-8601 timestamp>  
Branch: `<branch>`

> Exact prompt, preserving wording and line breaks.

## Orchestrator outcome — short label

- Summary:
- Decisions/assumptions:
- Resulting files or PR:
- Validation:
- Remaining risks/questions:
```

Existing entries may predate this shape; do not rewrite them. Logs remain
append-only. If a completion summary needs correction, append a correction.

Do not record hidden system/developer instructions, chain-of-thought, secrets,
tokens, private keys, or unrelated personal data. If a user prompt contains a
secret, replace only the secret with `[REDACTED]` and note the redaction.
