# Exametrics

Exametrics is a lightweight browser study app built for fast exam prep:

- The user can build a set in the app, upload a text deck, or paste one from AI.
- Sets can be saved and reopened locally on the same machine.
- Sets can be imported and exported as files for manual backup or transfer.
- Each card shows either a term or a definition with multiple answer choices.
- Cards can optionally show a concept or section label for extra context during study.
- A built-in set builder can generate properly formatted deck text from raw term-definition pairs.
- Correct answers leave the queue.
- Missed answers come back later with a `Try this one again` badge.
- Progress is tracked with a live progress bar until every card is mastered.
- Auto advance can be turned on or off during study.

## Local-only behavior

This app is designed to stay local.

- Saved sets, the current raw-text draft, the builder draft, and the auto-advance preference are stored in this browser's `localStorage`.
- That means they are saved inside the browser profile on that machine, not as separate files next to the app source files.
- Those saved sets persist when the browser closes and reopens, as long as the same browser profile and the same app origin are being used.
- Nothing syncs to other devices unless you manually export and import files or build a real backend later.
- Exporting a set creates a real `.txt` file that the browser downloads, and that file can then be moved wherever the user wants.

## Storage notes

- `http://localhost:4173` and a hosted website URL are the most dependable ways to keep the same saved-set storage over time.
- Opening `file:///Users/.../index.html` often still works, but `file://` storage behavior can be more browser-dependent and is less ideal for long-term use.
- If a user clears browser site data, uses a different browser, or switches browser profiles, the locally saved sets will not follow automatically.

## Saved sets and library

- Use `Open Set Library` on the main page to browse every saved set on that machine.
- Use `Open AI Set Builder` when you want prompt guidance, concept-header tips, and a dedicated place to paste or upload AI-made decks.
- Uploaded text decks are saved into the local set library right away, then can be renamed and saved again if needed.
- Use the `Import or Export` dropdown on the main page when you want to move a set between devices manually.
- Use `Open Set Builder` if you want to create a set inside the app instead of writing raw deck text yourself.
- Exported `.txt` deck files can be imported on another device later if you want manual transfer without a backend.

## Builder flow

- The builder lets you enter one term-definition pair at a time.
- Each builder card can include an optional concept or section label.
- Each card can be marked as `definition` first or `term` first.
- Once you have at least 4 cards, the app auto-generates the final deck text and fills the extra multiple-choice options from the rest of the set.
- If a correct answer is `True` or `False`, that card stays a two-option true/false card.

## Run it

Because this app is fully client-side, you have three easy ways to use it:

1. Quickest preview:
Open `/Users/jackschroeder/Quizlet Knockoff/index.html` directly in a browser.

2. Best local setup:
Double-click `/Users/jackschroeder/Quizlet Knockoff/scripts/start-local.command`.
This starts a tiny local server and opens `http://localhost:4173`.

3. Terminal version:

```bash
cd "/Users/jackschroeder/Quizlet Knockoff"
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://localhost:4173`.

## Install it on your Mac like an app

The local-server version is the best one for this.

1. Start the app with `scripts/start-local.command`.
2. Open `http://localhost:4173` in Safari.
3. In Safari, use the Share button, then choose `Add to Dock`.
4. Name it `Exametrics` and save it.

After that, it behaves like a standalone Mac web app you can launch from the Dock or Spotlight.

## Put it on the web

This project is just static HTML, CSS, and JavaScript, so it can be hosted on simple static-site services.

The easiest route is GitHub Pages:

1. Create a new GitHub repository.
2. Upload the files from this folder.
3. Enable GitHub Pages for the repository.
4. Open the generated site URL.

Once it is online, you can open that URL from any device and also add it to your Mac Dock as a web app.

## Deck format

Separate cards with a blank line.

Recommended format:

```text
concept: Cellular Respiration
definition: Definition text here
- * Correct answer
- Wrong answer
- Wrong answer
- Wrong answer
```

You can also start a card with `term:` if the prompt should show a term and ask the user to choose the correct definition.
An optional `concept:` line can sit above the prompt line if you want extra context to show during study.

This raw format is mainly needed when you are importing a deck built outside the app.

Supported correct-answer markers:

- `- * Correct answer`
- `- [correct] Correct answer`
- `- Correct answer *`

Rules:

- Optionally start with `concept:` or `section:`.
- Then start the prompt line with `definition:` or `term:`.
- Put each answer choice on its own line starting with `-`.
- Use at least 2 options.
- Mark exactly 1 option as correct.

## Good ChatGPT prompt

You can paste this into ChatGPT when you want it to convert notes into a deck:

```text
Create a study deck in this exact format:

1. Start each card with an optional `concept:` line when a section or topic label would help.
2. Start the prompt line with `definition:` or `term:`.
3. Put 2 to 4 answer options below it, each starting with "- ".
4. Mark the correct answer with "- * ".
5. Separate each card with one blank line.
6. Propagate each pairing with a mixture of other real definitions or terms from nearby concepts and intentionally plausible, confusable answers.
7. Alter the pairing format if either the term or definition would be too obvious compared to the distractors.

Example:
concept: Cellular Respiration
definition: Definition text here
- * Correct answer
- Wrong answer
- Wrong answer
- Wrong answer
```

## Files

- `index.html`: the app shell and study screens
- `pages/builder.html`: dedicated page for building sets from term-definition pairs
- `pages/library.html`: dedicated page for browsing saved sets
- `pages/ai-builder.html`: dedicated page for AI-assisted deck import
- `css/styles.css`: layout, colors, responsive styling, and feedback states
- `js/shared.js`: saved-set storage, import/export, and deck parsing helpers
- `js/app.js`: study flow, auto advance, and main-page interactions
- `js/builder.js`: guided set-builder interactions and generated deck preview
- `js/library.js`: saved-set library page interactions
- `js/ai-builder.js`: AI import page interactions
- `assets/icon.svg`: installable app icon
- `sample-decks/sample-deck.txt`: example input deck
- `scripts/start-local.command`: local launcher script
