# Exametrics

Exametrics is a lightweight browser-based study application for building, importing, organizing, and reviewing multiple-choice study decks. It is designed as a static web app with no required backend, making it easy to run locally or deploy to any static hosting platform.

## Overview

The app focuses on fast exam preparation workflows:

- Create decks manually with a guided builder
- Import decks from plain-text files
- Use AI-generated deck content with a dedicated import/instructions flow
- Save decks locally in the browser for later use
- Study through multiple-choice sessions with progress tracking and answer recycling
- Export decks for backup or transfer between devices

## Core Features

- Study mode:
  Review one card at a time, remove mastered cards from circulation, and revisit missed cards later in the session.
- Quick Learn mode:
  Launch a shorter timed session for rapid review.
- Deck library:
  Browse, reopen, rename, and manage saved decks from a dedicated library page.
- Guided set builder:
  Create cards from term/definition pairs, including optional concept or section labels.
- Import and export:
  Move decks in and out of the app using text-based files.
- Local persistence:
  Store saved decks, drafts, and user preferences in the browser's `localStorage`.
- Installable web app:
  Includes a web manifest and service worker for a more app-like experience.

## How It Works

Exametrics is fully client-side. There is no database and no server-side account system in the current architecture.

- Saved decks are stored in the browser on the current device and origin.
- Draft content and builder state are also persisted locally.
- Study history for recent sessions is stored locally.
- To move decks between browsers or devices, export them from one environment and import them into another.

Because storage is local to the browser, clearing site data or switching browsers/profiles can remove access to previously saved decks.

## Running Locally

Because this project is a static site, it can be run with any simple local web server.

### Option 1: Use the included launcher

Run:

```bash
./scripts/start-local.command
```

Then open:

```text
http://localhost:4173
```

### Option 2: Start a simple server manually

From the project root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://localhost:4173
```

### Option 3: Deploy as a static site

This project can also be hosted on platforms such as GitHub Pages, Netlify, Vercel static hosting, or any standard web server that serves static files.

## Deck Format

Decks are text-based and separated by blank lines. Each card supports:

- An optional `concept:` or `section:` line
- A required `term:` or `definition:` prompt line
- Two or more answer options
- Exactly one correct answer marker

Example:

```text
concept: Cellular Respiration
definition: Water freezes at this temperature on the Celsius scale.
- * 0°C
- 100°C
- -10°C
- 32°C
```

Supported correct-answer markers include:

- `- * Correct answer`
- `- [correct] Correct answer`
- `- Correct answer *`

This format is used for imports, exports, and AI-generated deck content.

## Project Structure

- `index.html`: main app shell and study experience
- `pages/builder.html`: guided deck builder
- `pages/library.html`: saved deck library
- `pages/ai-builder.html`: AI-assisted deck import/instructions page
- `pages/transfer.html`: import/export workflow
- `css/styles.css`: application styling and responsive layout
- `js/shared.js`: shared storage, parsing, import/export, and data utilities
- `js/app.js`: main study-session logic and homepage interactions
- `js/builder.js`: builder flow and generated deck preview logic
- `js/library.js`: saved-deck library interactions
- `js/ai-builder.js`: AI builder page interactions
- `js/transfer.js`: import/export page logic
- `manifest.webmanifest`: installable web app metadata
- `service-worker.js`: offline/cache behavior
- `assets/icon.svg`: application icon
- `sample-decks/sample-deck.txt`: sample deck file
- `scripts/start-local.command`: helper script for local startup

## Technology

Exametrics is built with:

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage`
- Progressive Web App primitives (`manifest.webmanifest` and service worker)

No framework, package manager, or build step is required for the current version.

## Use Cases

Exametrics is a good fit for:

- Personal exam prep
- Vocabulary or terminology drills
- Definition-based review sets
- Lightweight classroom or tutoring materials
- Quick local prototypes for browser-based study tools

## Current Scope

The current project is intentionally simple and local-first. It does not currently include:

- User accounts
- Cloud sync
- Shared collaborative editing
- Server-side analytics
- Centralized deck storage

Those capabilities could be added later with a backend or hosted data layer if needed.
