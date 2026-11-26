---
name: submit
description: Check a Boot.dev lesson with bootdev run, and submit it only if every check passes.
argument-hint: "[lesson-id]"
disable-model-invocation: true
---

Lesson ID: $ARGUMENTS

1. Get the lesson ID:
   - If an ID was given, it must be a UUID (like `c836a818-eb0b-4d65-94f5-d8fba46db0e1`). If it isn't, stop and ask me for it.
   - If no ID was given, use the Chrome browser tools (`mcp__claude-in-chrome__*`) to list my open tabs and find the Boot.dev lesson tab. Take the UUID from its URL.
   - If the browser isn't connected, there's no Boot.dev lesson tab, or there's more than one, stop and ask me for the ID. Don't guess.
   - When the ID came from the browser, show me the lesson title and ID and wait for my OK before running anything.
2. From the project root, run `bootdev run <lesson-id>`.
3. If **every check passes**, run `bootdev run <lesson-id> -s` to submit, then tell me it was submitted and show the result.
4. If **anything fails**, do NOT submit. Show me which checks failed and what was expected vs. what we got. Don't fix anything, and don't propose a fix unless I ask.
