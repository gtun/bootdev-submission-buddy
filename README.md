# Boot.dev Submission Buddy

Work through [Boot.dev](https://www.boot.dev) courses with an AI coding
assistant without copying commands back and forth. Copy a lesson's ID in one
click, paste it and the lesson's checks into your assistant, and it runs your
code with the Boot.dev CLI. If every check passes, it submits the lesson for
you.

> Not affiliated with or endorsed by Boot.dev.

## How it works

This repo has two parts that work together:

| Part | What it does |
| --- | --- |
| **Chrome extension** (`extension/`) | Adds a copy button to every Boot.dev lesson page. Click it to copy the lesson ID from the URL. |
| **`/submit` skill** (`skills/submit/`) | Tells your AI assistant to run `bootdev run <id>` and compare the output against the lesson's checks. If every check passes, it runs `bootdev run <id> -s` to submit. If anything fails, it stops and shows you what failed. |

The copy button sits in the bottom-right corner of each lesson page:

<img src="docs/copy-button.png" alt="The gold-on-brown copy-to-clipboard button" width="60">

### Why you need to paste the checks

Boot.dev decides whether a lesson passes on its own servers. Running
`bootdev run <id>` without `-s` only shows your program's output. It
doesn't print PASS or FAIL. So the assistant needs the lesson's checks,
the block on the lesson page that starts with **"The CLI will run these
checks"**, to know what counts as passing. For example:

```
The CLI will run these checks:
  Run 'go run .'
    Expecting exit code: 0
    Expecting stdout to contain all of:
      - Hello, World!
```

The skill only treats a check as passed when it can confirm it exactly:

- **Exit code** checks pass only if the exit code matches exactly.
- **"stdout to contain all of"** checks pass only if every listed string
  appears in the output exactly, with the same case and spacing.
- Any other kind of check, or one too vague to compare exactly, isn't
  decided by the assistant. It shows you the check and the actual output
  and lets you decide.

It also checks that the lesson title `bootdev run` prints matches the
lesson your checks came from, so it doesn't compare against checks from
the wrong lesson.

### A typical loop

1. Open a lesson on Boot.dev and write your solution (with or without AI help).
2. Copy the lesson's **"The CLI will run these checks"** block and paste it
   into your assistant's chat.
3. Click the copy button, then type `/submit ` and paste the ID:
   ```
   /submit c836a818-eb0b-4d65-94f5-d8fba46db0e1
   ```
4. The assistant runs the lesson and goes through the checks one by one:
   - **All pass:** it submits the lesson and shows you the result.
   - **Any fail:** it does **not** submit. For each failed check, it shows
     the check as written in the lesson and the actual output, and leaves
     the fixing to you unless you ask for help.

You can paste the checks and the `/submit` command in either order, or
together. If the checks are missing, the assistant stops and asks for them
before running anything. If you've pasted checks for several lessons in one
session, it uses the most recent ones.

### What is a lesson ID?

It's the UUID at the end of a lesson URL:

```
https://www.boot.dev/lessons/c836a818-eb0b-4d65-94f5-d8fba46db0e1
                             └──────────── lesson ID ─────────────┘
```

The ID is required. If you run `/submit` without one, or with something
that isn't a UUID, the assistant asks you for it rather than guessing.

## Requirements

- A Boot.dev account and a course that uses the CLI (most coding lessons do)
- The [Boot.dev CLI](https://github.com/bootdotdev/bootdev), installed and
  logged in (`bootdev login`)
- Google Chrome or another Chromium-based browser (Edge, Brave, Arc, …)
- An AI coding assistant that can run shell commands. The skill is written
  for [Claude Code](https://claude.com/claude-code); see
  [Other assistants](#other-assistants) if you use something else.

## Installation

### 1. Chrome extension

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select the `extension/` folder.
4. Open or refresh any Boot.dev lesson page. The copy button appears in the
   bottom-right corner.

The button only shows up on `/lessons/<id>` pages. It follows you from
lesson to lesson without a page reload.

> **WSL users:** Windows Chrome can load the folder from
> `\\wsl$\<your-distro>\path\to\repo\extension`.

### 2. `/submit` skill (Claude Code)

Copy the skill into your personal skills folder so it works in every project:

```bash
mkdir -p ~/.claude/skills && cp -r skills/submit ~/.claude/skills/
```

To install it for just one course repo, copy it to
`<course-repo>/.claude/skills/submit/` instead.

Start a new Claude Code session from your course project's root, paste the
lesson's checks, and type `/submit <lesson-id>`.

The skill sets `disable-model-invocation: true`, so the assistant never
submits on its own. A lesson is only submitted when you type `/submit`.

### Other assistants

The skill is just a short set of instructions in
[`skills/submit/SKILL.md`](skills/submit/SKILL.md). For other assistants
(Cursor, Copilot, Codex, Aider, …), paste those steps into the assistant's
custom instructions or rules file. You can also simply paste the lesson's
checks and tell it: *"Follow the steps in SKILL.md for lesson `<id>`."*

## A note on learning

This tool removes busywork. It doesn't do the learning for you. The skill
deliberately doesn't fix failing code unless you ask, so you still see
every failure and decide what to do about it. Use the AI to explain things
and get unstuck, and make sure you understand what you submit.

## Repo layout

```
extension/
  manifest.json   Manifest V3 config; injects the button on boot.dev
  content.js      Button, ID extraction, clipboard copy
  content.css     Button and toast styling
skills/
  submit/
    SKILL.md      The /submit skill
docs/
  copy-button.png Screenshot of the copy button
```

## Contributing

Issues and pull requests are welcome, especially:

- Instructions for other AI assistants
- Firefox support
- A Chrome Web Store listing

## License

[MIT](LICENSE)
