# Exametrics

Exametrics is a lightweight browser-based study application for building, importing, organizing, and reviewing multiple-choice study decks. It is designed to make exam prep faster, simpler, and more flexible for learners who want a focused alternative to heavier study platforms.

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

## Access

Exametrics is available online at [exametric.org](https://exametric.org).

The web app can be used directly in the browser without requiring users to install software or create an account in the current version.

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

## Future Potential

The current version is intentionally lightweight, but the product has room to expand into broader learning workflows. Potential future directions include:

- Shared or collaborative deck libraries
- Cross-device sync and cloud-backed storage
- Classroom, tutoring, or team distribution features
- Richer performance analytics and progress insights
- Smarter AI-assisted deck generation and editing
- Subject-specific templates for exam prep, certification study, and vocabulary training

## Current Scope

The current project is intentionally simple and local-first. It does not currently include:

- User accounts
- Cloud sync
- Shared collaborative editing
- Server-side analytics
- Centralized deck storage

Those capabilities could be added later with a backend or hosted data layer if needed.
