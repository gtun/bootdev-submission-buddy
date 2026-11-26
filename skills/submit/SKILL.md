---
name: submit
description: Check a Boot.dev lesson with bootdev run against the lesson's listed checks, and submit it only if every check passes.
argument-hint: "<lesson-id>"
disable-model-invocation: true
---

Lesson ID: $ARGUMENTS

1. Check the lesson ID:
   - The ID is required, and it must be a UUID (like `c836a818-eb0b-4d65-94f5-d8fba46db0e1`).
   - If no ID was given, or it isn't a UUID, stop and ask me for it. Don't look it up or guess it.
2. Get the lesson's checks:
   - Look in this conversation for the lesson's "The CLI will run these checks" block. Use the most recent one I pasted.
   - If it isn't there, stop and ask me to paste it. Don't run anything until I do.
   - `bootdev run` without `-s` does not print PASS or FAIL. The pasted checks are the only pass/fail criteria. Never judge from memory, from earlier runs, or from what the output "looks like".
3. From the project root, run `bootdev run <lesson-id>`.
   - Make sure the lesson title it prints matches the lesson the checks came from. If it doesn't, stop and tell me.
4. Compare the output against every check, one by one:
   - "Expecting exit code: N" passes only if the exit code is exactly N.
   - "Expecting stdout to contain all of" passes only if every listed string appears in stdout exactly (same case, same spacing).
   - If a check is any other kind, or is too vague to compare mechanically, don't decide it. Show it to me with the actual output and let me rule on it.
5. If **every check passes**, run `bootdev run <lesson-id> -s` to submit, then tell me it was submitted and show the result.
6. If **anything fails**, do NOT submit. For each failed check, show the check as written in the lesson and the actual output it was compared against. Don't fix anything, and don't propose a fix unless I ask.
