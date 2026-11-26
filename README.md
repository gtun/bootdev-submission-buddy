# Boot.dev Submission Buddy

Work through [Boot.dev](https://www.boot.dev) courses with an AI coding
assistant without copying commands back and forth. Copy a lesson's ID in one
click, hand it to your assistant, and it checks your work with the Boot.dev CLI.
If every check passes, it submits the lesson for you.

> Not affiliated with or endorsed by Boot.dev.

## How it works

This repo has two parts that work together:

| Part | What it does |
| --- | --- |
| **Chrome extension** (`extension/`) | Adds a copy button to every Boot.dev lesson page. Click it to copy the lesson ID from the URL. |
| **`/submit` skill** (`skills/submit/`) | Tells your AI assistant to run `bootdev run <id>`. If every check passes, it runs `bootdev run <id> -s` to submit. If anything fails, it stops and shows you what failed. |

The copy button sits in the bottom-right corner of each lesson page:

<img src="docs/copy-button.png" alt="The gold-on-brown copy-to-clipboard button" width="60">

A typical loop:

1. Open a lesson on Boot.dev and write your solution (with or without AI help).
2. Click the copy button.
3. In your assistant, type `/submit ` and paste the ID:
   ```
   /submit c836a818-eb0b-4d65-94f5-d8fba46db0e1
   ```
4. The assistant runs the checks:
   - **All pass:** it submits the lesson and shows you the result.
   - **Any fail:** it does **not** submit. It shows which checks failed and
     what was expected vs. what you got, and leaves the fixing to you
     unless you ask for help.

### What is a lesson ID?

It's the UUID at the end of a lesson URL:

```
https://www.boot.dev/lessons/c836a818-eb0b-4d65-94f5-d8fba46db0e1
                             └──────────── lesson ID ─────────────┘
```

### Running `/submit` without an ID

You can also type `/submit` on its own. If
[Claude in Chrome](https://claude.com/chrome) is connected, Claude looks
through your open tabs for a Boot.dev lesson and takes the ID from its URL.
Before running anything, it shows you the lesson title and ID and waits for
your OK.

> [!WARNING]
> This is only a fallback. It can fail, or pick the wrong lesson, when:
>
> - you have more than one Boot.dev lesson tab open (Claude will stop and
>   ask, but only for tabs it can see),
> - the tab it finds isn't the lesson you just worked on, or
> - Claude in Chrome isn't installed, isn't connected yet, or hasn't
>   finished loading.
>
> If Claude can't find exactly one lesson tab, it asks you for the ID.
> **Passing the ID as an argument is the most reliable way**, and that's
> what the copy button is for.

## Requirements

- A Boot.dev account and a course that uses the CLI (most coding lessons do)
- The [Boot.dev CLI](https://github.com/bootdotdev/bootdev), installed and
  logged in (`bootdev login`)
- Google Chrome or another Chromium-based browser (Edge, Brave, Arc, …)
- An AI coding assistant that can run shell commands. The skill is written
  for [Claude Code](https://claude.com/claude-code); see
  [Other assistants](#other-assistants) if you use something else.
- *Optional:* [Claude in Chrome](https://claude.com/chrome), for running
  `/submit` without an ID

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

Start a new Claude Code session and type `/submit <lesson-id>` from your
course project's root.

The skill sets `disable-model-invocation: true`, so the assistant never
submits on its own. A lesson is only submitted when you type `/submit`.

### Other assistants

The skill is just a short set of instructions in
[`skills/submit/SKILL.md`](skills/submit/SKILL.md). For other assistants
(Cursor, Copilot, Codex, Aider, …), paste those steps into the assistant's
custom instructions or rules file. You can also simply tell it: *"Follow
the steps in SKILL.md for lesson `<id>`."* Finding the ID from an open tab
only works if your assistant can control the browser, so pass the ID
directly.

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
