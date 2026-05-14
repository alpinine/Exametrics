# GitHub Copy Bundle

These are the full current contents of the altered files.

## `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exametrics</title>
    <meta name="theme-color" content="#0f7b6c" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="description"
      content="A lightweight study app for building, importing, and studying multiple-choice decks."
    />
    <link rel="icon" href="assets/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="manifest.webmanifest" />
    <link rel="stylesheet" href="css/styles.css" />
    <script src="js/shared.js" defer></script>
    <script src="js/app.js" defer></script>
  </head>
  <body>
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">Fast exam prep</p>
        <h1>Exametrics</h1>
        <p class="hero-copy">
          Build a set, bring one in, or jump back into a recent deck.
          Study one card at a time, clear what you know, and recycle what you miss.
        </p>
      </header>

      <main class="main-panel">
        <section id="setup-view" class="view">
          <div class="home-dashboard">
            <div class="home-actions-grid" aria-label="Main navigation">
              <a href="pages/library.html" class="home-action-button">Library</a>
              <a href="pages/builder.html" class="home-action-button">New</a>
              <a href="pages/ai-builder.html" class="home-action-button">AI Set Instructions</a>
              <a href="pages/transfer.html" class="home-action-button">Import/Export</a>
            </div>

            <section class="editor-panel recent-panel">
              <div class="section-heading section-heading-inline">
                <h2>Recent Decks</h2>
              </div>
              <div id="recent-sets-list" class="recent-sets-list"></div>
            </section>

            <details class="tool-menu">
              <summary>Storage Disclaimer</summary>

              <div class="tool-menu-panel storage-panel">
                <p class="menu-note">
                  Your sets are saved in this browser on this device. They usually stay there until
                  you delete them, clear browser data, or switch to a different browser, device, or website address.
                </p>
                <p class="menu-note">
                  Even if someone uses the same Safari account on a MacBook and an iPhone, those
                  devices still keep separate copies here. To move sets over, export them on one
                  device and import them on the other.
                </p>

                <div class="faq-list">
                  <div class="faq-item">
                    <h3>Why do my sets not show up on my phone?</h3>
                    <p class="guide-copy">
                      This app saves sets locally inside each browser, so your phone keeps its own copy.
                    </p>
                  </div>
                  <div class="faq-item">
                    <h3>How do I move sets to another device or browser?</h3>
                    <p class="guide-copy">
                      Go to `Import/Export`, export the set as a file, then import that file on the other device or browser.
                    </p>
                  </div>
                  <div class="faq-item">
                    <h3>How long do sets stay saved?</h3>
                    <p class="guide-copy">
                      They usually stay there until you remove them, clear site data, or stop using that browser on that device.
                    </p>
                  </div>
                </div>
              </div>
            </details>

            <section class="legacy-store" hidden aria-hidden="true">
              <button id="paste-toggle-button" type="button"></button>
              <div id="deck-status-card">
                <h3 id="deck-status-title"></h3>
                <p id="deck-status-detail"></p>
              </div>
              <section id="paste-panel" hidden>
                <button id="sample-button" type="button"></button>
                <textarea id="deck-input" spellcheck="false"></textarea>
              </section>
              <input id="set-name-input" type="text" maxlength="80" />
              <input id="file-input" type="file" accept=".txt,.md,text/plain" />
              <button id="save-set-button" type="button"></button>
              <button id="start-button" type="button"></button>
              <button id="edit-builder-button" type="button"></button>
              <details id="set-tools-menu"></details>
              <button id="export-current-set-button" type="button"></button>
              <input
                id="import-set-input"
                type="file"
                accept=".json,.txt,.md,application/json,text/plain"
              />
              <p id="setup-message" aria-live="polite"></p>
            </section>
          </div>
        </section>

        <section id="study-view" class="view" hidden>
          <div class="progress-panel">
            <div class="progress-copy">
              <span id="progress-label">0 / 0 mastered</span>
              <span id="queue-label">0 cards still in circulation</span>
            </div>
            <div class="progress-track" aria-hidden="true">
              <div id="progress-fill" class="progress-fill"></div>
            </div>
            <div class="progress-controls">
              <div class="session-status">
                <span id="session-badge" class="pill" hidden>Quick Learn</span>
                <div id="timer-panel" class="timer-panel" hidden>
                  <span class="timer-label">Time left</span>
                  <span id="timer-value" class="timer-value">3:00</span>
                </div>
              </div>
              <label class="toggle-field" for="auto-advance-toggle">
                <span class="toggle-copy">
                  <span class="toggle-label">Auto advance</span>
                  <span id="auto-advance-status" class="toggle-help">
                    Show feedback briefly, then move on
                  </span>
                </span>
                <span class="toggle-switch">
                  <input id="auto-advance-toggle" type="checkbox" />
                  <span class="toggle-slider"></span>
                </span>
              </label>
            </div>
          </div>

          <article id="study-card" class="study-card">
            <div class="card-topline">
              <button
                id="back-button"
                class="back-button"
                type="button"
                aria-label="Go back one question"
                title="Go back one question"
                hidden
              >
                ←
              </button>
              <span id="question-count" class="pill">Question 1</span>
              <span id="retry-pill" class="pill pill-warn" hidden>Try this one again</span>
            </div>

            <p id="concept-label" class="concept-label" hidden></p>
            <p id="prompt-kind-label" class="definition-label">Definition</p>
            <h2 id="definition-text" class="definition-text"></h2>

            <div id="options-grid" class="options-grid" role="group" aria-label="Answer options"></div>

            <div class="feedback-row">
              <p id="feedback-text" class="feedback-text" aria-live="polite"></p>
              <button id="next-button" class="button button-primary" type="button" hidden>
                Next
              </button>
            </div>
          </article>
        </section>

        <section id="finish-view" class="view" hidden>
          <div class="finish-card">
            <p class="section-kicker">Session complete</p>
            <h2 id="finish-title">All terms cleared.</h2>
            <p id="finish-summary" class="finish-summary"></p>
            <div class="finish-actions">
              <button id="study-again-button" class="button button-primary" type="button">
                Study Again
              </button>
              <button id="done-button" class="button button-ghost" type="button">
                Done
              </button>
            </div>
          </div>
        </section>

        <section id="history-panel" class="history-card" hidden>
          <div class="history-header">
            <div class="section-heading">
              <p class="section-kicker">Recent performance</p>
              <h2 id="history-title">Last 10 Learn sessions</h2>
            </div>
            <p id="history-summary" class="history-summary"></p>
          </div>

          <p id="history-empty" class="history-empty">
            No study data yet. Finish a session and your score trend will appear here.
          </p>
          <div id="history-chart" class="history-chart" hidden></div>
          <p id="history-note" class="history-note">
            Score = correct answers divided by total answer attempts. The line runs oldest to newest, with time spent shown for Learn and time left shown for Quick Learn.
          </p>
        </section>
      </main>
    </div>
  </body>
</html>

```

## `css/styles.css`

```css
:root {
  --bg-top: #fff5d6;
  --bg-bottom: #f4f0e8;
  --panel: rgba(255, 252, 244, 0.92);
  --panel-strong: #fffdf8;
  --text: #1b2a2f;
  --muted: #5d6f75;
  --accent: #0f7b6c;
  --accent-dark: #0a5f53;
  --accent-soft: rgba(15, 123, 108, 0.14);
  --warn-soft: #fff1b8;
  --border: rgba(27, 42, 47, 0.1);
  --shadow: 0 24px 70px rgba(53, 40, 10, 0.14);
  --success: #1f8f5f;
  --success-soft: #dff6ea;
  --error: #ba3f2d;
  --error-soft: #fde5df;
}

* {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: "Avenir Next", "Trebuchet MS", "Gill Sans", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(255, 220, 122, 0.8), transparent 35%),
    radial-gradient(circle at top right, rgba(15, 123, 108, 0.18), transparent 28%),
    linear-gradient(180deg, var(--bg-top), var(--bg-bottom));
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 90%);
}

.app-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.hero {
  max-width: 760px;
  margin-bottom: 28px;
}

.eyebrow,
.section-kicker {
  margin: 0 0 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--accent-dark);
  font-weight: 700;
}

h1,
h2,
h3 {
  font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
  margin: 0;
}

h1 {
  font-size: clamp(2.75rem, 5vw, 4.6rem);
  line-height: 0.95;
  margin-bottom: 14px;
}

.hero-copy,
.guide-copy,
.finish-summary,
.setup-message,
.feedback-text,
.progress-copy,
summary,
textarea,
button,
label,
select,
input,
a {
  font-size: 1rem;
  line-height: 1.55;
}

.hero-copy {
  max-width: 620px;
  margin: 0;
  color: var(--muted);
}

.main-panel {
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  box-shadow: var(--shadow);
  padding: 28px;
  backdrop-filter: blur(16px);
}

.view {
  animation: rise-in 260ms ease;
}

.setup-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(290px, 0.9fr);
  gap: 24px;
}

.setup-grid-single {
  grid-template-columns: 1fr;
}

.guide-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.editor-panel,
.guide-card,
.study-card,
.finish-card,
.progress-panel {
  background: var(--panel-strong);
  border: 1px solid var(--border);
  border-radius: 24px;
}

.editor-panel,
.guide-card,
.finish-card {
  padding: 24px;
}

.section-heading {
  margin-bottom: 16px;
}

.section-heading-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-heading-subtle {
  margin-top: 20px;
  margin-bottom: 12px;
}

.section-heading-subtle h3 {
  font-size: 1.05rem;
}

.section-heading h2 {
  font-size: clamp(1.45rem, 3vw, 2rem);
}

.home-dashboard {
  display: grid;
  gap: 18px;
}

.home-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.home-action-button {
  min-height: 136px;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  border: 1px solid rgba(27, 42, 47, 0.1);
  background: #fffdfa;
  box-shadow: 0 14px 28px rgba(27, 42, 47, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  text-align: center;
  text-decoration: none;
  color: var(--text);
  font-weight: 800;
  font-size: clamp(1.22rem, 2.2vw, 1.45rem);
  line-height: 1.15;
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}

.home-action-button:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 123, 108, 0.24);
  box-shadow: 0 18px 34px rgba(27, 42, 47, 0.1);
}

.home-action-button:focus-visible {
  outline: 3px solid rgba(15, 123, 108, 0.2);
  outline-offset: 2px;
}

.launcher-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.launch-card {
  appearance: none;
  width: 100%;
  border: 1px solid rgba(27, 42, 47, 0.1);
  border-radius: 22px;
  background: #fffdfa;
  color: var(--text);
  text-decoration: none;
  padding: 18px;
  min-height: 132px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(27, 42, 47, 0.06);
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}

.launch-card:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 123, 108, 0.24);
  box-shadow: 0 18px 34px rgba(27, 42, 47, 0.1);
}

.launch-card:focus-visible {
  outline: 3px solid rgba(15, 123, 108, 0.2);
  outline-offset: 2px;
}

.launch-card-title {
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.25;
}

.launch-card-copy {
  color: var(--muted);
}

.deck-status-card,
.deck-input-panel {
  background: #fbf8f0;
  border: 1px solid rgba(27, 42, 47, 0.08);
  border-radius: 22px;
  padding: 18px;
}

.deck-status-card {
  margin-bottom: 18px;
}

.deck-status-card h3 {
  font-size: clamp(1.25rem, 2.6vw, 1.65rem);
  margin-bottom: 8px;
}

.deck-status-card .section-kicker {
  margin-bottom: 8px;
}

.deck-input-panel {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-inline-heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 14px;
}

.panel-inline-heading h3 {
  font-size: 1.25rem;
}

textarea {
  width: 100%;
  min-height: 420px;
  resize: vertical;
  border-radius: 18px;
  border: 1px solid rgba(27, 42, 47, 0.12);
  padding: 18px;
  background: #fffdfa;
  color: var(--text);
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
}

textarea:focus {
  outline: 3px solid rgba(15, 123, 108, 0.18);
  border-color: rgba(15, 123, 108, 0.34);
}

.save-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.set-name-input {
  flex: 1 1 260px;
  min-width: 0;
  border-radius: 999px;
  border: 1px solid rgba(27, 42, 47, 0.12);
  padding: 12px 16px;
  background: #fffdfa;
  color: var(--text);
  font-size: 1rem;
}

.set-name-input:focus {
  outline: 3px solid rgba(15, 123, 108, 0.18);
  border-color: rgba(15, 123, 108, 0.34);
}

.tool-menu {
  margin-top: 18px;
  padding-top: 0;
  border-top: none;
  border: 1px solid rgba(27, 42, 47, 0.08);
  border-radius: 22px;
  background: #fbf8f0;
  overflow: hidden;
}

.tool-menu summary {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
}

.tool-menu summary::-webkit-details-marker {
  display: none;
}

.tool-menu summary::after {
  content: "+";
  font-size: 1.25rem;
  color: var(--accent-dark);
}

.tool-menu[open] summary::after {
  content: "-";
}

.tool-menu-panel {
  display: grid;
  gap: 12px;
  padding: 0 18px 18px;
  border-top: 1px solid rgba(27, 42, 47, 0.08);
}

.menu-label,
.toggle-label {
  font-weight: 700;
}

.menu-label {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
}

.menu-select {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(27, 42, 47, 0.12);
  background: #fffdfa;
  color: var(--text);
  padding: 12px 14px;
}

.menu-select:focus {
  outline: 3px solid rgba(15, 123, 108, 0.18);
  border-color: rgba(15, 123, 108, 0.34);
}

.menu-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.menu-note {
  margin: 0;
  color: var(--muted);
}

.builder-page {
  display: grid;
  gap: 20px;
}

.builder-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.95fr);
  gap: 24px;
}

.builder-form {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.builder-textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  border-radius: 18px;
  border: 1px solid rgba(27, 42, 47, 0.12);
  padding: 14px 16px;
  background: #fffdfa;
  color: var(--text);
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
}

.builder-textarea:focus {
  outline: 3px solid rgba(15, 123, 108, 0.18);
  border-color: rgba(15, 123, 108, 0.34);
}

.builder-count-note {
  margin: 12px 0 0;
}

.builder-entry-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.builder-preview {
  min-height: 260px;
}

.recent-panel {
  padding: 18px 20px;
}

.recent-sets-list {
  display: grid;
  gap: 10px;
}

.recent-set-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8f4ea;
  border: 1px solid rgba(27, 42, 47, 0.08);
}

.recent-set-copy {
  min-width: 0;
  flex: 1 1 220px;
}

.recent-set-title {
  margin: 0 0 4px;
  font-size: 1rem;
  line-height: 1.2;
}

.recent-set-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent-empty {
  margin: 0;
  color: var(--muted);
}

.setup-actions,
.finish-actions,
.feedback-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.setup-actions {
  margin-top: 16px;
}

.button {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease,
    color 140ms ease;
  text-align: center;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button:focus-visible {
  outline: 3px solid rgba(15, 123, 108, 0.2);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 14px 28px rgba(15, 123, 108, 0.22);
}

.button-primary:hover {
  background: var(--accent-dark);
}

.button-secondary {
  background: rgba(27, 42, 47, 0.08);
  color: var(--text);
}

.button-ghost {
  background: transparent;
  color: var(--accent-dark);
  border: 1px solid rgba(15, 123, 108, 0.2);
}

.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.button-compact {
  padding: 10px 14px;
  font-size: 0.94rem;
}

.setup-message {
  min-height: 1.6em;
  margin: 12px 0 0;
  color: var(--muted);
}

.setup-message.error {
  color: var(--error);
}

.guide-panel pre {
  margin: 18px 0;
  padding: 16px;
  border-radius: 18px;
  background: #f7f4eb;
  overflow-x: auto;
  border: 1px solid rgba(27, 42, 47, 0.08);
}

.guide-panel code {
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
  font-size: 0.95rem;
}

.guide-steps {
  margin: 0 0 18px;
  padding-left: 22px;
  display: grid;
  gap: 8px;
}

.upload-strip {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.upload-wide-button {
  width: 100%;
  min-height: 54px;
}

.upload-strip-note {
  margin: 0;
  color: var(--muted);
}

.saved-sets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.saved-sets-empty,
.saved-set-meta {
  margin: 0;
  color: var(--muted);
}

.saved-set-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  background: #f8f4ea;
  border: 1px solid rgba(27, 42, 47, 0.08);
}

.saved-set-copy {
  min-width: 0;
  flex: 1 1 220px;
}

.saved-set-title {
  margin: 0 0 4px;
  font-size: 1.1rem;
  line-height: 1.2;
}

.saved-set-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.saved-set-actions .button {
  padding-inline: 14px;
}

.icon-button {
  width: 46px;
  height: 46px;
  padding: 0;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-dark);
}

.icon-button svg {
  width: 19px;
  height: 19px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-button-danger {
  color: var(--error);
  border-color: rgba(186, 63, 45, 0.2);
}

.storage-panel {
  gap: 14px;
}

.faq-list {
  display: grid;
  gap: 12px;
}

.faq-item {
  padding: 14px 16px;
  border-radius: 18px;
  background: #fffdfa;
  border: 1px solid rgba(27, 42, 47, 0.08);
}

.faq-item h3 {
  margin: 0 0 6px;
  font-size: 1.02rem;
}

.faq-item p {
  margin: 0;
}

details {
  border-top: 1px solid rgba(27, 42, 47, 0.08);
  padding-top: 14px;
}

summary {
  cursor: pointer;
  font-weight: 700;
}

.progress-panel {
  padding: 18px 20px;
  margin-bottom: 18px;
}

.progress-copy {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  color: var(--muted);
  margin-bottom: 10px;
}

.progress-track {
  width: 100%;
  height: 14px;
  border-radius: 999px;
  background: rgba(27, 42, 47, 0.08);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #13a989, #f0ae33);
  transition: width 220ms ease;
}

.progress-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 14px;
}

.session-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.timer-panel {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(27, 42, 47, 0.06);
  border: 1px solid rgba(27, 42, 47, 0.1);
}

.timer-panel.is-warning {
  background: rgba(240, 174, 51, 0.16);
  border-color: rgba(240, 174, 51, 0.3);
}

.timer-label {
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.timer-value {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.toggle-field {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.toggle-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.toggle-help {
  color: var(--muted);
  font-size: 0.92rem;
  text-align: right;
}

.toggle-switch {
  position: relative;
  width: 54px;
  height: 32px;
  flex: 0 0 auto;
}

.toggle-switch input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(27, 42, 47, 0.18);
  transition: background-color 180ms ease;
}

.toggle-slider::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 14px rgba(27, 42, 47, 0.18);
  transition: transform 180ms ease;
}

.toggle-switch input:focus-visible + .toggle-slider {
  outline: 3px solid rgba(15, 123, 108, 0.2);
  outline-offset: 2px;
}

.toggle-switch input:checked + .toggle-slider {
  background: var(--accent);
}

.toggle-switch input:checked + .toggle-slider::after {
  transform: translateX(22px);
}

.study-card {
  padding: 28px;
}

.card-topline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.back-button {
  appearance: none;
  border: 1px solid rgba(27, 42, 47, 0.12);
  background: rgba(27, 42, 47, 0.05);
  color: rgba(27, 42, 47, 0.68);
  border-radius: 999px;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

.back-button:hover:not(:disabled) {
  background: rgba(27, 42, 47, 0.09);
  border-color: rgba(27, 42, 47, 0.18);
  color: var(--text);
  transform: translateY(-1px);
}

.back-button:focus-visible {
  outline: 3px solid rgba(15, 123, 108, 0.18);
  outline-offset: 2px;
}

.back-button:disabled {
  opacity: 0.45;
  cursor: default;
  transform: none;
}

.pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(15, 123, 108, 0.12);
  color: var(--accent-dark);
  font-weight: 700;
  font-size: 0.9rem;
}

.pill-warn {
  background: var(--warn-soft);
  color: #7b5200;
}

.concept-label {
  margin: 0 0 8px;
  color: var(--accent-dark);
  font-weight: 700;
  font-size: 0.94rem;
  letter-spacing: 0.04em;
}

.definition-label {
  margin: 0 0 8px;
  color: var(--muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.78rem;
}

.definition-text {
  font-size: clamp(1.8rem, 3.8vw, 3rem);
  line-height: 1.1;
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.option-button {
  border: 1px solid rgba(27, 42, 47, 0.1);
  border-radius: 22px;
  background: #fffdfa;
  color: var(--text);
  padding: 18px;
  text-align: left;
  min-height: 94px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease,
    background-color 120ms ease;
}

.option-button:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(15, 123, 108, 0.28);
  box-shadow: 0 14px 28px rgba(27, 42, 47, 0.08);
}

.option-button:disabled {
  cursor: default;
}

.option-button.correct {
  background: var(--success-soft);
  border-color: rgba(31, 143, 95, 0.28);
  color: #14583b;
}

.option-button.incorrect {
  background: var(--error-soft);
  border-color: rgba(186, 63, 45, 0.28);
  color: #842b20;
}

.feedback-row {
  justify-content: space-between;
  margin-top: 18px;
}

.feedback-text {
  margin: 0;
  color: var(--muted);
  flex: 1 1 340px;
}

.feedback-text.success {
  color: var(--success);
}

.feedback-text.error {
  color: var(--error);
}

.finish-card {
  text-align: center;
}

.finish-card h2 {
  font-size: clamp(2rem, 5vw, 3.3rem);
  margin-bottom: 10px;
}

.finish-summary {
  max-width: 560px;
  margin: 0 auto 22px;
  color: var(--muted);
}

.finish-actions {
  justify-content: center;
}

.history-card {
  margin-top: 18px;
  padding: 24px;
  background: var(--panel-strong);
  border: 1px solid var(--border);
  border-radius: 24px;
}

.history-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.history-summary,
.history-empty,
.history-note {
  margin: 0;
  color: var(--muted);
}

.history-summary {
  max-width: 420px;
  text-align: right;
}

.history-chart {
  margin: 14px 0 10px;
}

.history-line-wrapper {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}

.history-line-svg {
  display: block;
  width: 100%;
  min-width: 360px;
  height: auto;
}

.history-grid-line {
  stroke: rgba(27, 42, 47, 0.1);
  stroke-dasharray: 4 6;
}

.history-axis-line {
  stroke: rgba(27, 42, 47, 0.18);
  stroke-width: 1.3;
}

.history-axis-label {
  fill: var(--muted);
  font-size: 10px;
}

.history-axis-label-bottom {
  font-size: 9.5px;
}

.history-axis-label-session {
  font-size: 9px;
  letter-spacing: 0.08em;
}

.history-line-path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.history-point {
  fill: #fffdfa;
  stroke: #f0ae33;
  stroke-width: 2.35;
}

.history-point-value {
  fill: var(--accent-dark);
  font-size: 10.5px;
  font-weight: 700;
}

.history-bar-item {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.history-bar-value {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--accent-dark);
}

.history-bar-track {
  width: min(48px, 100%);
  height: 160px;
  border-radius: 18px;
  background: #f4efe1;
  border: 1px solid rgba(27, 42, 47, 0.08);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.history-bar-fill {
  width: 100%;
  min-height: 8%;
  border-radius: 16px;
  background: linear-gradient(180deg, #f0ae33, #13a989);
  transition: height 220ms ease;
}

.history-bar-label {
  font-size: 0.82rem;
  color: var(--muted);
}

.library-page {
  display: grid;
  gap: 16px;
}

.library-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.library-toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.library-list {
  gap: 14px;
}

.library-empty {
  background: #fffdf8;
  border: 1px solid rgba(27, 42, 47, 0.08);
  border-radius: 24px;
  padding: 24px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 920px) {
  .setup-grid {
    grid-template-columns: 1fr;
  }

  .builder-grid {
    grid-template-columns: 1fr;
  }

  .home-actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .app-shell {
    width: min(100% - 18px, 1000px);
    padding: 18px 0 28px;
  }

  .main-panel,
  .study-card,
  .editor-panel,
  .guide-card,
  .finish-card,
  .history-card {
    padding: 20px;
  }

  textarea {
    min-height: 320px;
  }

  .launcher-grid {
    grid-template-columns: 1fr;
  }

  .home-actions-grid {
    grid-template-columns: 1fr;
  }

  .save-row {
    flex-direction: column;
  }

  .progress-copy,
  .feedback-row,
  .history-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .progress-controls {
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
  }

  .toggle-copy {
    align-items: flex-start;
  }

  .toggle-help {
    text-align: left;
  }

  .history-summary {
    text-align: left;
  }

  .saved-set-item {
    align-items: flex-start;
  }

  .recent-set-card {
    align-items: flex-start;
  }

  .saved-set-actions {
    width: 100%;
  }

  .recent-set-actions {
    width: 100%;
  }

  .icon-button {
    width: 44px;
    height: 44px;
  }

  .menu-actions,
  .library-toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .builder-entry-topline {
    gap: 6px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .option-button {
    min-height: 76px;
  }
}

```

## `js/app.js`

```js
const sampleDeck = `concept: Cell Biology
definition: The powerhouse of the cell.
- * Mitochondria
- Nucleus
- Ribosome
- Golgi apparatus

concept: Early American Government
definition: An agreement among states that created the first U.S. national government.
- * Articles of Confederation
- Bill of Rights
- Federalist Papers
- Emancipation Proclamation

concept: Plant Processes
term: Photosynthesis
- * The process plants use to convert light energy into chemical energy
- The division of a cell into two daughter cells
- The movement of water across a membrane
- The breakdown of glucose for ATP

concept: Scientific Statements
definition: Water freezes at 0°C.
- * True
- False`;

const autoAdvanceDelayMs = 1800;
const quickLearnQuestionCap = 20;
const quickLearnSecondsPerQuestion = 9;

const elements = {
  setupView: document.getElementById("setup-view"),
  studyView: document.getElementById("study-view"),
  finishView: document.getElementById("finish-view"),
  pasteToggleButton: document.getElementById("paste-toggle-button"),
  deckStatusTitle: document.getElementById("deck-status-title"),
  deckStatusDetail: document.getElementById("deck-status-detail"),
  pastePanel: document.getElementById("paste-panel"),
  deckInput: document.getElementById("deck-input"),
  setNameInput: document.getElementById("set-name-input"),
  fileInput: document.getElementById("file-input"),
  importSetInput: document.getElementById("import-set-input"),
  saveSetButton: document.getElementById("save-set-button"),
  startButton: document.getElementById("start-button"),
  editBuilderButton: document.getElementById("edit-builder-button"),
  sampleButton: document.getElementById("sample-button"),
  setToolsMenu: document.getElementById("set-tools-menu"),
  exportCurrentSetButton: document.getElementById("export-current-set-button"),
  setupMessage: document.getElementById("setup-message"),
  progressLabel: document.getElementById("progress-label"),
  queueLabel: document.getElementById("queue-label"),
  progressFill: document.getElementById("progress-fill"),
  sessionBadge: document.getElementById("session-badge"),
  timerPanel: document.getElementById("timer-panel"),
  timerValue: document.getElementById("timer-value"),
  autoAdvanceToggle: document.getElementById("auto-advance-toggle"),
  autoAdvanceStatus: document.getElementById("auto-advance-status"),
  backButton: document.getElementById("back-button"),
  questionCount: document.getElementById("question-count"),
  retryPill: document.getElementById("retry-pill"),
  conceptLabel: document.getElementById("concept-label"),
  promptKindLabel: document.getElementById("prompt-kind-label"),
  definitionText: document.getElementById("definition-text"),
  optionsGrid: document.getElementById("options-grid"),
  feedbackText: document.getElementById("feedback-text"),
  nextButton: document.getElementById("next-button"),
  finishTitle: document.getElementById("finish-title"),
  finishSummary: document.getElementById("finish-summary"),
  historyPanel: document.getElementById("history-panel"),
  historyTitle: document.getElementById("history-title"),
  historySummary: document.getElementById("history-summary"),
  historyEmpty: document.getElementById("history-empty"),
  historyChart: document.getElementById("history-chart"),
  historyNote: document.getElementById("history-note"),
  recentSetsList: document.getElementById("recent-sets-list"),
  studyAgainButton: document.getElementById("study-again-button"),
  doneButton: document.getElementById("done-button"),
};

const state = {
  questions: [],
  sourceQuestions: [],
  questionBank: new Map(),
  queue: [],
  currentItem: null,
  currentQuestion: null,
  renderedOptions: [],
  answered: false,
  answerHistory: [],
  masteredIds: new Set(),
  stats: {
    attempts: 0,
    misses: 0,
  },
  savedSets: [],
  attemptHistory: [],
  selectedSetId: "",
  sessionMode: "learn",
  autoAdvanceEnabled: true,
  autoAdvanceTimeoutId: null,
  timerIntervalId: null,
  timeRemainingSeconds: 0,
  quickLearnTimedOut: false,
  sessionStartedAt: 0,
  sessionCompletedAt: 0,
  pastePanelOpen: false,
  deckSourceKind: "empty",
  sessionHistoryRecorded: false,
};

initialize();

function initialize() {
  registerServiceWorker();

  elements.deckInput.value = RecallLoopStore.loadDraft();
  state.savedSets = RecallLoopStore.loadSavedSets();
  state.attemptHistory = RecallLoopStore.loadAttemptHistory();
  state.autoAdvanceEnabled = RecallLoopStore.loadAutoAdvanceEnabled();
  state.pastePanelOpen = false;

  bindEvents();
  syncAutoAdvancePreference();
  renderHistoryPanel();
  renderRecentSets();

  if (elements.deckInput.value.trim()) {
    setDeckStatus(
      "Draft deck ready",
      "This deck text was restored from this browser on this machine. Open the text box if you want to review or edit it.",
      "draft",
    );
  } else {
    setEmptyDeckStatus();
  }

  syncSetupState();
  applyPendingAction();
}

function bindEvents() {
  elements.pasteToggleButton.addEventListener("click", togglePastePanel);
  elements.startButton.addEventListener("click", startSessionFromInput);
  elements.editBuilderButton.addEventListener("click", openCurrentDeckInBuilder);
  elements.sampleButton.addEventListener("click", loadSampleDeck);
  elements.fileInput.addEventListener("change", handleDeckUpload);
  elements.importSetInput.addEventListener("change", handleSetImport);
  elements.saveSetButton.addEventListener("click", saveCurrentSet);
  elements.exportCurrentSetButton.addEventListener("click", exportCurrentSet);
  elements.autoAdvanceToggle.addEventListener("change", handleAutoAdvanceToggle);
  elements.backButton.addEventListener("click", goBackOneQuestion);
  elements.nextButton.addEventListener("click", advanceToNextCard);
  elements.studyAgainButton.addEventListener("click", restartSession);
  elements.doneButton.addEventListener("click", returnToSetup);
  elements.deckInput.addEventListener("input", handleDeckInput);
}

function applyPendingAction() {
  const pendingAction = RecallLoopStore.consumePendingAction();
  if (!pendingAction || !pendingAction.setId) {
    return;
  }

  const matchingSet = state.savedSets.find((set) => set.id === pendingAction.setId);
  if (!matchingSet) {
    showSetupMessage("That saved set is no longer available on this device.", true);
    setEmptyDeckStatus();
    syncSetupState();
    return;
  }

  loadSetIntoEditor(matchingSet, "saved");
  showSetupMessage(`Loaded "${matchingSet.name}" from your set library.`);

  if (pendingAction.type === "study") {
    markSetAsUsed(matchingSet.id);
    startSessionFromInput();
    return;
  }

  if (pendingAction.type === "quickLearn") {
    markSetAsUsed(matchingSet.id);
    startSessionFromInput({ mode: "quickLearn" });
  }
}

function handleDeckInput() {
  RecallLoopStore.saveDraft(elements.deckInput.value);

  if (!elements.deckInput.value.trim()) {
    state.selectedSetId = "";

    if (state.pastePanelOpen) {
      setDeckStatus(
        "Text editor open",
        "Paste a pre-made deck below. This draft stays in this browser on this machine until you replace it or clear site data.",
        "draft",
      );
    } else {
      setEmptyDeckStatus();
    }

    syncSetupState();
    return;
  }

  if (state.deckSourceKind === "empty" || state.deckSourceKind === "draft") {
    setDeckStatus(
      "Deck text ready",
      "This draft stays in this browser on this machine until you replace it, save it, or clear site data.",
      "draft",
    );
  }

  syncSetupState();
}

function persistDraft() {
  RecallLoopStore.saveDraft(elements.deckInput.value);
  syncSetupState();
}

function togglePastePanel() {
  state.pastePanelOpen = !state.pastePanelOpen;

  if (state.pastePanelOpen) {
    if (!elements.deckInput.value.trim() && state.deckSourceKind === "empty") {
      setDeckStatus(
        "Text editor open",
        "Paste a pre-made deck below. This draft stays in this browser on this machine until you replace it or clear site data.",
        "draft",
      );
    }
  } else if (!elements.deckInput.value.trim() && state.deckSourceKind === "draft") {
    setEmptyDeckStatus();
  }

  syncSetupState();

  if (state.pastePanelOpen) {
    elements.deckInput.focus();
  }
}

function setEmptyDeckStatus() {
  setDeckStatus(
    "Nothing loaded yet",
    "Upload a deck, build one inside the app, or open the text editor if you want to paste in an AI-made set.",
    "empty",
  );
}

function setDeckStatus(title, detail, kind = "custom") {
  state.deckSourceKind = kind;
  elements.deckStatusTitle.textContent = title;
  elements.deckStatusDetail.textContent = detail;
}

function syncSetupState() {
  elements.pastePanel.hidden = !state.pastePanelOpen;
  elements.exportCurrentSetButton.disabled = !elements.deckInput.value.trim();
  elements.editBuilderButton.disabled = !elements.deckInput.value.trim();
  updatePasteToggleCard();
}

function updatePasteToggleCard() {
  const titleElement = elements.pasteToggleButton.querySelector(".launch-card-title");
  const copyElement = elements.pasteToggleButton.querySelector(".launch-card-copy");

  if (!titleElement || !copyElement) {
    return;
  }

  if (state.pastePanelOpen) {
    titleElement.textContent = "Hide Raw Editor";
    copyElement.textContent = "Collapse the text editor once you are done hand-editing the deck.";
    return;
  }

  titleElement.textContent = "Edit Raw Deck Text";
  copyElement.textContent =
    "Open the plain text editor when you want to hand-edit a deck directly.";
}

function loadSampleDeck() {
  elements.deckInput.value = sampleDeck;
  elements.setNameInput.value = "Sample Deck";
  state.selectedSetId = "";
  state.pastePanelOpen = true;
  persistDraft();
  setDeckStatus(
    "Sample deck ready",
    "This sample lives only in this browser draft until you save it. Rename it below if you want your own local copy.",
    "sample",
  );
  showSetupMessage("Sample deck loaded. You can edit it, save it, or start studying.");
}

async function handleDeckUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    const suggestedName = RecallLoopStore.stripFileExtension(file.name);

    elements.deckInput.value = content;
    elements.setNameInput.value = suggestedName;
    state.selectedSetId = "";
    state.pastePanelOpen = false;
    persistDraft();

    try {
      RecallLoopStore.parseDeck(content);
    } catch (error) {
      state.pastePanelOpen = true;
      setDeckStatus(
        `Uploaded "${file.name}"`,
        "The file text is loaded below, but it needs a quick format fix before it can be saved locally.",
        "draft",
      );
      syncSetupState();
      showSetupMessage(
        `"${file.name}" loaded, but it needs a quick fix before it can be saved: ${error.message}`,
        true,
      );
      return;
    }

    const savedSet = saveSetToLibrary({
      name: suggestedName,
      content,
    });

    if (savedSet) {
      loadSetIntoEditor(savedSet, "upload", { fileName: file.name });
      showSetupMessage(
        `Loaded and saved "${savedSet.name}" from "${file.name}". Change the name below and click Save Set if you want to rename it.`,
      );
    } else {
      setDeckStatus(
        `Uploaded "${file.name}"`,
        "The deck is loaded, but this browser could not save it locally yet. You can still study it or try Save Set again.",
        "upload",
      );
      showSetupMessage("This browser couldn't save that uploaded deck locally.", true);
    }
  } catch (error) {
    showSetupMessage("I couldn't read that file. Try a plain text `.txt` or `.md` deck.", true);
  } finally {
    event.target.value = "";
  }
}

async function handleSetImport(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    const importedSet = await RecallLoopStore.importSetFile(file);
    RecallLoopStore.parseDeck(importedSet.content);

    const savedSet = saveSetToLibrary(importedSet);
    if (!savedSet) {
      elements.deckInput.value = importedSet.content;
      elements.setNameInput.value = importedSet.name;
      state.selectedSetId = "";
      state.pastePanelOpen = false;
      persistDraft();
      setDeckStatus(
        `Imported "${importedSet.name}"`,
        "The deck is loaded, but this browser could not save it locally yet. You can still study it or try Save Set again.",
        "import",
      );
      showSetupMessage("This browser couldn't save the imported set locally.", true);
      return;
    }

    loadSetIntoEditor(savedSet, "import");
    showSetupMessage(`Imported and saved "${savedSet.name}".`);
    closeSetToolsMenu();
  } catch (error) {
    showSetupMessage(error.message || "I couldn't import that set file.", true);
  } finally {
    event.target.value = "";
  }
}

function saveCurrentSet() {
  const content = elements.deckInput.value.trim();
  const name = elements.setNameInput.value.trim();

  if (!name) {
    showSetupMessage("Give the set a name before saving it locally.", true);
    elements.setNameInput.focus();
    return;
  }

  if (!content) {
    showSetupMessage("Load, build, or paste a deck before saving it.", true);
    if (!state.pastePanelOpen) {
      state.pastePanelOpen = true;
      syncSetupState();
    }
    elements.deckInput.focus();
    return;
  }

  try {
    RecallLoopStore.parseDeck(content);
  } catch (error) {
    state.pastePanelOpen = true;
    syncSetupState();
    showSetupMessage(`Fix the deck before saving it: ${error.message}`, true);
    return;
  }

  const savedSet = saveSetToLibrary({
    id: state.selectedSetId,
    name,
    content,
  });

  if (!savedSet) {
    showSetupMessage("This browser couldn't save the set locally.", true);
    return;
  }

  loadSetIntoEditor(savedSet, "saved");
  showSetupMessage(`Saved "${savedSet.name}" on this device.`);
}

function saveSetToLibrary({ id = "", name, content }) {
  const result = RecallLoopStore.upsertSet(state.savedSets, {
    id,
    name,
    content,
  });

  if (!RecallLoopStore.saveSavedSets(result.sets)) {
    return null;
  }

  state.savedSets = result.sets;
  state.selectedSetId = result.set.id;
  return result.set;
}

function exportCurrentSet() {
  const content = elements.deckInput.value.trim();
  const name = elements.setNameInput.value.trim() || "study-set";

  if (!content) {
    showSetupMessage("Load, build, or paste a deck before exporting it.", true);
    return;
  }

  try {
    RecallLoopStore.parseDeck(content);
  } catch (error) {
    state.pastePanelOpen = true;
    syncSetupState();
    showSetupMessage(`Fix the deck before exporting it: ${error.message}`, true);
    return;
  }

  RecallLoopStore.downloadDeckText(name, content);
  showSetupMessage(`Exported "${name}".`);
  closeSetToolsMenu();
}

function loadSetIntoEditor(set, sourceKind = "saved", meta = {}) {
  state.selectedSetId = set.id || "";
  elements.setNameInput.value = set.name;
  elements.deckInput.value = set.content;
  state.pastePanelOpen = false;
  persistDraft();

  if (sourceKind === "upload") {
    setDeckStatus(
      `Uploaded "${meta.fileName || `${set.name}.txt`}"`,
      `Saved in this browser as "${set.name}". Change the name below and click Save Set if you want a different label.`,
      "upload",
    );
    return;
  }

  if (sourceKind === "import") {
    setDeckStatus(
      `Imported "${set.name}"`,
      "This study set is now saved in this browser on this machine and is also available in Set Library.",
      "import",
    );
    return;
  }

  setDeckStatus(
    `Loaded "${set.name}"`,
    "This saved set lives in this browser on this machine and is also available in Set Library.",
    "saved",
  );
}

function closeSetToolsMenu() {
  elements.setToolsMenu.open = false;
}

function openCurrentDeckInBuilder() {
  const rawDeck = elements.deckInput.value.trim();

  if (!rawDeck) {
    showSetupMessage("Load, build, or paste a deck before opening it in the builder.", true);
    return;
  }

  try {
    const builderDraft = RecallLoopStore.createBuilderDraftFromDeck(
      elements.setNameInput.value.trim(),
      rawDeck,
    );
    RecallLoopStore.saveBuilderDraft(builderDraft);
    window.location.href = "./pages/builder.html";
  } catch (error) {
    state.pastePanelOpen = true;
    syncSetupState();
    showSetupMessage(`I couldn't open that deck in the builder yet: ${error.message}`, true);
  }
}

function startSessionFromInput(options = {}) {
  clearAutoAdvanceTimeout();
  clearQuickLearnTimer();
  const rawDeck = elements.deckInput.value.trim();
  const sessionMode = options.mode === "quickLearn" ? "quickLearn" : "learn";

  if (!rawDeck) {
    showSetupMessage("Load, build, or paste a deck before starting.", true);
    return;
  }

  try {
    const parsedQuestions = RecallLoopStore.parseDeck(rawDeck);
    const sessionQuestions =
      sessionMode === "quickLearn"
        ? selectQuickLearnQuestions(parsedQuestions)
        : parsedQuestions;

    state.sessionMode = sessionMode;
    state.sourceQuestions = parsedQuestions;
    state.questions = sessionQuestions;
    state.questionBank = new Map(sessionQuestions.map((question) => [question.id, question]));
    resetSessionState();
    state.sessionStartedAt = Date.now();
    showSetupMessage("");
    showView("study");

    if (state.sessionMode === "quickLearn") {
      startQuickLearnTimer(state.questions.length);
    }

    syncSessionChrome();
    advanceToNextCard();
  } catch (error) {
    state.pastePanelOpen = true;
    syncSetupState();
    showSetupMessage(error.message, true);
  }
}

function resetSessionState() {
  clearAutoAdvanceTimeout();
  clearQuickLearnTimer();
  state.queue = shuffleArray(
    state.questions.map((question) => ({
      questionId: question.id,
      retryCount: 0,
    })),
  );
  state.currentItem = null;
  state.currentQuestion = null;
  state.renderedOptions = [];
  state.answered = false;
  state.answerHistory = [];
  state.masteredIds = new Set();
  state.stats = {
    attempts: 0,
    misses: 0,
  };
  state.timeRemainingSeconds = 0;
  state.quickLearnTimedOut = false;
  state.sessionStartedAt = 0;
  state.sessionCompletedAt = 0;
  state.sessionHistoryRecorded = false;
}

function advanceToNextCard() {
  clearAutoAdvanceTimeout();

  if (state.queue.length === 0) {
    finishSession();
    return;
  }

  state.currentItem = state.queue.shift();
  state.currentQuestion = state.questionBank.get(state.currentItem.questionId);
  state.renderedOptions = shuffleArray(
    state.currentQuestion.options.map((option, index) => ({
      ...option,
      originalIndex: index,
    })),
  );
  state.answered = false;

  renderProgress();
  renderCurrentCard();
}

function renderCurrentCard() {
  const shouldShowRetry =
    state.sessionMode === "learn" && Number(state.currentItem?.retryCount ?? 0) > 0;

  elements.questionCount.textContent = getQuestionCountLabel();
  elements.retryPill.hidden = !shouldShowRetry;
  elements.retryPill.style.display = shouldShowRetry ? "inline-flex" : "none";
  elements.conceptLabel.hidden = !state.currentQuestion.concept;
  elements.conceptLabel.textContent = state.currentQuestion.concept
    ? `Concept · ${state.currentQuestion.concept}`
    : "";
  elements.promptKindLabel.textContent = capitalizePromptType(state.currentQuestion.promptType);
  elements.definitionText.textContent = state.currentQuestion.definition;
  elements.feedbackText.textContent = "";
  elements.feedbackText.className = "feedback-text";
  elements.nextButton.hidden = true;
  elements.optionsGrid.innerHTML = "";
  updateBackButton();

  state.renderedOptions.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option.text;
    button.addEventListener("click", () => handleAnswer(option.originalIndex));
    elements.optionsGrid.appendChild(button);
  });
}

function handleAnswer(selectedIndex) {
  if (state.answered) {
    return;
  }

  state.answered = true;
  state.stats.attempts += 1;

  const buttons = Array.from(elements.optionsGrid.querySelectorAll(".option-button"));
  const correctIndex = state.currentQuestion.options.findIndex((option) => option.isCorrect);
  const wasCorrect = selectedIndex === correctIndex;

  buttons.forEach((button, position) => {
    const option = state.renderedOptions[position];
    button.disabled = true;

    if (option.originalIndex === correctIndex) {
      button.classList.add("correct");
    }

    if (option.originalIndex === selectedIndex && selectedIndex !== correctIndex) {
      button.classList.add("incorrect");
    }
  });

  if (wasCorrect) {
    state.masteredIds.add(state.currentQuestion.id);
    elements.feedbackText.textContent = getCorrectFeedback(state.currentItem.retryCount);
    elements.feedbackText.classList.add("success");
  } else {
    state.stats.misses += 1;

    if (state.sessionMode === "learn") {
      state.queue.push({
        questionId: state.currentQuestion.id,
        retryCount: state.currentItem.retryCount + 1,
      });
    }

    const correctAnswer = state.currentQuestion.options[correctIndex].text;
    elements.feedbackText.textContent = getIncorrectFeedback(correctAnswer);
    elements.feedbackText.classList.add("error");
  }

  state.answerHistory.push({
    questionId: state.currentQuestion.id,
    retryCount: state.currentItem.retryCount,
    wasCorrect,
  });

  if (state.queue.length === 0) {
    state.sessionCompletedAt = Date.now();

    if (state.sessionMode === "quickLearn") {
      clearQuickLearnTimer();
    }
  }

  renderProgress();
  updateBackButton();

  if (state.autoAdvanceEnabled) {
    elements.nextButton.hidden = true;
    scheduleAutoAdvance();
    return;
  }

  syncNextButton();
}

function getCorrectFeedback(retryCount) {
  if (state.sessionMode === "quickLearn") {
    return state.autoAdvanceEnabled
      ? "Correct. Moving to the next question..."
      : "Correct.";
  }

  if (state.autoAdvanceEnabled) {
    return retryCount > 0
      ? "Correct. That retry card is now cleared. Moving to the next card..."
      : "Correct. This card leaves the queue. Moving to the next card...";
  }

  return retryCount > 0
    ? "Correct. That retry card is now cleared."
    : "Correct. This card leaves the queue.";
}

function getIncorrectFeedback(correctAnswer) {
  if (state.sessionMode === "quickLearn") {
    return state.autoAdvanceEnabled
      ? `Not quite. The correct answer is "${correctAnswer}". Moving to the next question...`
      : `Not quite. The correct answer is "${correctAnswer}".`;
  }

  if (state.autoAdvanceEnabled) {
    return `Not quite. The correct answer is "${correctAnswer}". You'll see this card again, then we'll move on.`;
  }

  return `Not quite. The correct answer is "${correctAnswer}". You'll see this card again.`;
}

function renderProgress() {
  const totalQuestions = state.questions.length;
  const activeCards = state.queue.length + (state.answered ? 0 : 1);
  const correctAnswers = state.stats.attempts - state.stats.misses;
  let percent = 0;

  if (state.sessionMode === "quickLearn") {
    percent = totalQuestions === 0 ? 0 : (state.stats.attempts / totalQuestions) * 100;
    elements.progressLabel.textContent = `${correctAnswers} / ${totalQuestions} correct`;
    elements.queueLabel.textContent = `${activeCards} question${activeCards === 1 ? "" : "s"} left in this sprint`;
  } else {
    const mastered = state.masteredIds.size;
    percent = totalQuestions === 0 ? 0 : (mastered / totalQuestions) * 100;
    elements.progressLabel.textContent = `${mastered} / ${totalQuestions} mastered`;
    elements.queueLabel.textContent = `${activeCards} card${activeCards === 1 ? "" : "s"} still in circulation`;
  }

  elements.progressFill.style.width = `${percent}%`;
}

function handleAutoAdvanceToggle() {
  state.autoAdvanceEnabled = elements.autoAdvanceToggle.checked;
  RecallLoopStore.saveAutoAdvanceEnabled(state.autoAdvanceEnabled);
  syncAutoAdvancePreference();

  if (!state.answered) {
    return;
  }

  if (state.autoAdvanceEnabled) {
    elements.nextButton.hidden = true;
    scheduleAutoAdvance();
    return;
  }

  clearAutoAdvanceTimeout();
  syncNextButton();
}

function syncAutoAdvancePreference() {
  elements.autoAdvanceToggle.checked = state.autoAdvanceEnabled;
  elements.autoAdvanceStatus.textContent = state.autoAdvanceEnabled
    ? "Feedback shows briefly, then the next card appears"
    : "Answers wait for you until you click Next";
}

function finishSession() {
  clearAutoAdvanceTimeout();
  clearQuickLearnTimer();
  const totalQuestions = state.questions.length;
  const { attempts, misses } = state.stats;
  const correctAnswers = attempts - misses;
  let summary = "";

  if (state.sessionMode === "quickLearn") {
    const timeLeft = formatTimerValue(state.timeRemainingSeconds);
    const answeredAllSelected = attempts >= totalQuestions;

    if (state.quickLearnTimedOut && !answeredAllSelected) {
      elements.finishTitle.textContent = "Time is up.";
      summary =
        attempts === 0
          ? `The timer ended before any questions were answered. Try again with the same quick set whenever you're ready.`
          : `Time ran out after ${attempts} of ${totalQuestions} questions. You got ${correctAnswers} right, for a ${formatPercent(
              attempts === 0 ? 0 : correctAnswers / attempts,
            )} quick score.`;
    } else {
      elements.finishTitle.textContent = "Quick Learn complete.";
      summary =
        misses === 0
          ? `Perfect run. You answered all ${totalQuestions} quick questions correctly with ${timeLeft} left.`
          : `You finished all ${totalQuestions} quick questions with ${correctAnswers} correct and ${timeLeft} left on the clock.`;
    }
  } else {
    elements.finishTitle.textContent = "All terms cleared.";
    summary =
      misses === 0
        ? `You mastered all ${totalQuestions} cards without missing any answers.`
        : `You mastered all ${totalQuestions} cards in ${attempts} attempts, and ${misses} miss${misses === 1 ? "" : "es"} were recycled until you got them right.`;
  }

  recordSessionHistory();
  elements.finishSummary.textContent = summary;
  showView("finish");
}

function goBackOneQuestion() {
  if (state.answered || state.answerHistory.length === 0 || !state.currentItem) {
    return;
  }

  clearAutoAdvanceTimeout();

  const previousAnswer = state.answerHistory.pop();
  state.queue.unshift({
    questionId: state.currentItem.questionId,
    retryCount: state.currentItem.retryCount,
  });

  state.stats.attempts = Math.max(0, state.stats.attempts - 1);

  if (previousAnswer.wasCorrect) {
    state.masteredIds.delete(previousAnswer.questionId);
  } else {
    state.stats.misses = Math.max(0, state.stats.misses - 1);

    if (state.sessionMode === "learn") {
      removeQueuedRetry(previousAnswer);
    }
  }

  state.currentItem = {
    questionId: previousAnswer.questionId,
    retryCount: previousAnswer.retryCount,
  };
  state.currentQuestion = state.questionBank.get(previousAnswer.questionId);

  if (!state.currentQuestion) {
    advanceToNextCard();
    return;
  }

  state.renderedOptions = shuffleArray(
    state.currentQuestion.options.map((option, index) => ({
      ...option,
      originalIndex: index,
    })),
  );
  state.answered = false;
  renderProgress();
  renderCurrentCard();
}

function restartSession() {
  clearAutoAdvanceTimeout();

  if (state.sourceQuestions.length === 0 && state.questions.length === 0) {
    returnToSetup();
    return;
  }

  if (state.sessionMode === "quickLearn") {
    const sourceQuestions = state.sourceQuestions.length > 0 ? state.sourceQuestions : state.questions;
    state.questions = selectQuickLearnQuestions(sourceQuestions);
    state.questionBank = new Map(state.questions.map((question) => [question.id, question]));
  }

  resetSessionState();
  state.sessionStartedAt = Date.now();
  showView("study");

  if (state.sessionMode === "quickLearn") {
    startQuickLearnTimer(state.questions.length);
  }

  syncSessionChrome();
  advanceToNextCard();
}

function returnToSetup() {
  clearAutoAdvanceTimeout();
  clearQuickLearnTimer();
  state.savedSets = RecallLoopStore.loadSavedSets();
  renderRecentSets();
  showView("setup");
  showSetupMessage("Ready for another deck.");
}

function showView(viewName) {
  const viewMap = {
    setup: elements.setupView,
    study: elements.studyView,
    finish: elements.finishView,
  };

  Object.entries(viewMap).forEach(([name, element]) => {
    element.hidden = name !== viewName;
  });

  elements.historyPanel.hidden = viewName === "setup";
  if (viewName !== "setup") {
    renderHistoryPanel();
  }
  updateBackButton();
}

function showSetupMessage(message, isError = false) {
  elements.setupMessage.textContent = message;
  elements.setupMessage.classList.toggle("error", isError);
}

function capitalizePromptType(promptType) {
  return promptType.charAt(0).toUpperCase() + promptType.slice(1);
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function scheduleAutoAdvance() {
  clearAutoAdvanceTimeout();
  state.autoAdvanceTimeoutId = window.setTimeout(() => {
    state.autoAdvanceTimeoutId = null;
    advanceToNextCard();
  }, autoAdvanceDelayMs);
}

function selectQuickLearnQuestions(questions) {
  if (questions.length <= quickLearnQuestionCap) {
    return shuffleArray(questions);
  }

  return shuffleArray(questions).slice(0, quickLearnQuestionCap);
}

function startQuickLearnTimer(questionCount) {
  clearQuickLearnTimer();
  state.quickLearnTimedOut = false;
  state.timeRemainingSeconds = Math.max(
    quickLearnSecondsPerQuestion,
    questionCount * quickLearnSecondsPerQuestion,
  );
  updateTimerDisplay();

  state.timerIntervalId = window.setInterval(() => {
    state.timeRemainingSeconds = Math.max(0, state.timeRemainingSeconds - 1);
    updateTimerDisplay();

    if (state.timeRemainingSeconds === 0) {
      handleQuickLearnTimeout();
    }
  }, 1000);
}

function handleQuickLearnTimeout() {
  if (state.quickLearnTimedOut) {
    return;
  }

  state.quickLearnTimedOut = true;
  state.sessionCompletedAt = Date.now();
  clearQuickLearnTimer();
  finishSession();
}

function clearQuickLearnTimer() {
  if (state.timerIntervalId === null) {
    return;
  }

  window.clearInterval(state.timerIntervalId);
  state.timerIntervalId = null;
}

function clearAutoAdvanceTimeout() {
  if (state.autoAdvanceTimeoutId === null) {
    return;
  }

  window.clearTimeout(state.autoAdvanceTimeoutId);
  state.autoAdvanceTimeoutId = null;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!window.isSecureContext || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.warn("Unable to register the offline study cache.", error);
    }
  });
}

function recordSessionHistory() {
  if (state.sessionHistoryRecorded || state.questions.length === 0 || state.stats.attempts === 0) {
    return;
  }

  const totalAttempts = state.stats.attempts;
  const correctAnswers = totalAttempts - state.stats.misses;
  const nextHistory = RecallLoopStore.appendAttemptHistory({
    setName: elements.setNameInput.value.trim() || "Untitled Set",
    totalCards: state.questions.length,
    totalAttempts,
    correctAnswers,
    sessionMode: state.sessionMode,
    elapsedSeconds: getSessionElapsedSeconds(),
    timeRemainingSeconds: state.sessionMode === "quickLearn" ? state.timeRemainingSeconds : 0,
  });

  if (nextHistory) {
    state.attemptHistory = nextHistory;
    renderHistoryPanel();
  }

  state.sessionHistoryRecorded = true;
}

function renderHistoryPanel() {
  const activeMode = state.sessionMode === "quickLearn" ? "quickLearn" : "learn";
  const history = state.attemptHistory
    .filter((entry) => (entry.sessionMode || "learn") === activeMode)
    .slice(-10);
  elements.historyChart.innerHTML = "";
  elements.historyTitle.textContent = `Last 10 ${getSessionModeLabel(activeMode)} sessions`;

  if (history.length === 0) {
    elements.historySummary.textContent = "";
    elements.historyEmpty.textContent =
      activeMode === "quickLearn"
        ? "No Quick Learn data yet. Finish a quick session and your score trend will appear here."
        : "No Learn data yet. Finish a Learn session and your score trend will appear here.";
    elements.historyEmpty.hidden = false;
    elements.historyChart.hidden = true;
    elements.historyNote.hidden = true;
    return;
  }

  const mostRecent = history[history.length - 1];
  elements.historySummary.textContent = `Most recent: ${formatPercent(
    mostRecent.accuracy,
  )} on "${mostRecent.setName}" • ${getSessionModeLabel(
    mostRecent.sessionMode,
  )} • ${formatHistoryMetricLong(mostRecent)} (${mostRecent.correctAnswers}/${mostRecent.totalAttempts} correct)`;
  elements.historyNote.textContent =
    activeMode === "quickLearn"
      ? "Score = correct answers divided by total answer attempts. The line runs oldest to newest, with time left shown under each Quick Learn session."
      : "Score = correct answers divided by total answer attempts. The line runs oldest to newest, with time spent shown under each Learn session.";
  elements.historyEmpty.hidden = true;
  elements.historyChart.hidden = false;
  elements.historyNote.hidden = false;
  renderHistoryLineChart(history);
}

function formatPercent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}

function formatSessionTimestamp(isoDate) {
  const sessionDate = new Date(isoDate);
  if (Number.isNaN(sessionDate.getTime())) {
    return "recently";
  }

  return sessionDate.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderRecentSets() {
  if (!elements.recentSetsList) {
    return;
  }

  elements.recentSetsList.innerHTML = "";
  const recentSets = state.savedSets.filter((set) => Boolean(set.lastUsedAt)).slice(0, 2);

  if (recentSets.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "recent-empty";
    emptyState.textContent = "No recent decks yet. Start one from Library and it will show up here.";
    elements.recentSetsList.appendChild(emptyState);
    return;
  }

  recentSets.forEach((set) => {
    const card = document.createElement("article");
    card.className = "recent-set-card";

    const copy = document.createElement("div");
    copy.className = "recent-set-copy";

    const title = document.createElement("h3");
    title.className = "recent-set-title";
    title.textContent = set.name;

    const meta = document.createElement("p");
    meta.className = "saved-set-meta";
    meta.textContent = `Used ${RecallLoopStore.formatSavedDate(set.lastUsedAt)} • ${RecallLoopStore.countCards(set.content)} cards`;

    copy.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "recent-set-actions";
    actions.append(
      createRecentActionButton("Study", "button button-primary button-compact", () =>
        launchSavedSet(set.id, "learn"),
      ),
      createRecentActionButton("Quick Learn", "button button-secondary button-compact", () =>
        launchSavedSet(set.id, "quickLearn"),
      ),
    );

    card.append(copy, actions);
    elements.recentSetsList.appendChild(card);
  });
}

function createRecentActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function launchSavedSet(setId, mode = "learn") {
  const matchingSet = state.savedSets.find((set) => set.id === setId);
  if (!matchingSet) {
    showSetupMessage("That saved set is no longer available on this device.", true);
    state.savedSets = RecallLoopStore.loadSavedSets();
    renderRecentSets();
    return;
  }

  loadSetIntoEditor(matchingSet, "saved");
  markSetAsUsed(setId);
  startSessionFromInput({ mode });
}

function markSetAsUsed(setId) {
  const result = RecallLoopStore.touchSetUsage(state.savedSets, setId);
  if (!result.set || !RecallLoopStore.saveSavedSets(result.sets)) {
    return;
  }

  state.savedSets = result.sets;
  renderRecentSets();
}

function getSessionElapsedSeconds() {
  if (!state.sessionStartedAt) {
    return 0;
  }

  const endTime = state.sessionCompletedAt || Date.now();
  return Math.max(0, Math.round((endTime - state.sessionStartedAt) / 1000));
}

function formatHistoryMetric(entry) {
  if (entry.sessionMode === "quickLearn") {
    return {
      value: formatClock(entry.timeRemainingSeconds),
      label: "left",
    };
  }

  return {
    value: formatClock(entry.elapsedSeconds),
    label: "spent",
  };
}

function formatHistoryMetricLong(entry) {
  const metric = formatHistoryMetric(entry);
  return `${metric.value} ${metric.label}`;
}

function renderHistoryLineChart(history) {
  const width = Math.max(380, history.length * 76 + 84);
  const height = 216;
  const paddingLeft = 52;
  const paddingRight = 18;
  const paddingTop = 12;
  const paddingBottom = 56;
  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const yTicks = [0, 25, 50, 75, 100];
  const xStep = history.length > 1 ? innerWidth / (history.length - 1) : 0;
  const points = history.map((entry, index) => {
    const x = history.length === 1 ? paddingLeft + innerWidth / 2 : paddingLeft + xStep * index;
    const y = paddingTop + innerHeight - innerHeight * Math.max(0, Math.min(1, entry.accuracy));
    return { x, y, entry };
  });
  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const gridLines = yTicks
    .map((tick) => {
      const y = paddingTop + innerHeight - innerHeight * (tick / 100);
      return `
        <line class="history-grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}"></line>
        <text class="history-axis-label" x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end">${tick}%</text>
      `;
    })
    .join("");
  const circles = points
    .map((point, index) => {
      const metric = formatHistoryMetric(point.entry);
      const title = escapeSvgText(
        `${point.entry.setName} • ${getSessionModeLabel(point.entry.sessionMode)} • ${formatPercent(
          point.entry.accuracy,
        )} • ${metric.value} ${metric.label} • ${point.entry.correctAnswers}/${point.entry.totalAttempts} correct • ${formatSessionTimestamp(
          point.entry.completedAt,
        )}`,
      );

      return `
        <g>
          <circle class="history-point" cx="${point.x}" cy="${point.y}" r="4.5">
            <title>${title}</title>
          </circle>
          <text class="history-point-value" x="${point.x}" y="${point.y - 12}" text-anchor="middle">${formatPercent(
            point.entry.accuracy,
          )}</text>
          <text class="history-axis-label history-axis-label-bottom" x="${point.x}" y="${height - 26}" text-anchor="middle">
            <tspan x="${point.x}" dy="0">${escapeSvgText(metric.value)}</tspan>
            <tspan x="${point.x}" dy="13">${escapeSvgText(metric.label)}</tspan>
          </text>
          <text class="history-axis-label history-axis-label-session" x="${point.x}" y="${height - 6}" text-anchor="middle">S${index + 1}</text>
        </g>
      `;
    })
    .join("");

  elements.historyChart.innerHTML = `
    <div class="history-line-wrapper">
      <svg class="history-line-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Recent study performance line chart">
        ${gridLines}
        <line class="history-axis-line" x1="${paddingLeft}" y1="${paddingTop + innerHeight}" x2="${width - paddingRight}" y2="${paddingTop + innerHeight}"></line>
        ${points.length > 1 ? `<polyline class="history-line-path" points="${polylinePoints}"></polyline>` : ""}
        ${circles}
      </svg>
    </div>
  `;
}

function updateBackButton() {
  const canGoBack =
    !elements.studyView.hidden && !state.answered && state.answerHistory.length > 0;

  elements.backButton.hidden = !canGoBack;
  elements.backButton.disabled = !canGoBack;
}

function removeQueuedRetry(answerSnapshot) {
  const retryIndex = [...state.queue]
    .map((item, index) => ({ ...item, index }))
    .reverse()
    .find(
      (item) =>
        item.questionId === answerSnapshot.questionId &&
        item.retryCount === answerSnapshot.retryCount + 1,
    )?.index;

  if (typeof retryIndex !== "number") {
    return;
  }

  state.queue.splice(retryIndex, 1);
}

function syncNextButton() {
  elements.nextButton.textContent = state.queue.length === 0 ? "Finish" : "Next";
  elements.nextButton.hidden = false;
}

function syncSessionChrome() {
  const isQuickLearn = state.sessionMode === "quickLearn";
  elements.sessionBadge.hidden = !isQuickLearn;
  elements.timerPanel.hidden = !isQuickLearn;
  elements.timerPanel.classList.toggle("is-warning", false);

  if (isQuickLearn) {
    elements.sessionBadge.textContent = "Quick Learn";
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  if (state.sessionMode !== "quickLearn") {
    return;
  }

  elements.timerValue.textContent = formatTimerValue(state.timeRemainingSeconds);
  elements.timerPanel.classList.toggle("is-warning", state.timeRemainingSeconds > 0 && state.timeRemainingSeconds <= 30);
}

function getQuestionCountLabel() {
  const questionNumber = state.stats.attempts + 1;

  if (state.sessionMode === "quickLearn") {
    return `Question ${questionNumber} of ${state.questions.length}`;
  }

  return `Question ${questionNumber}`;
}

function formatTimerValue(totalSeconds) {
  return formatClock(totalSeconds);
}

function getSessionModeLabel(sessionMode) {
  return sessionMode === "quickLearn" ? "Quick Learn" : "Learn";
}

function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

```

## `js/shared.js`

```js
const RecallLoopStore = (() => {
  const draftStorageKey = "recall-loop-last-deck";
  const savedSetsStorageKey = "recall-loop-saved-sets";
  const builderDraftStorageKey = "recall-loop-builder-draft";
  const pendingActionStorageKey = "recall-loop-pending-action";
  const autoAdvanceStorageKey = "recall-loop-auto-advance";
  const attemptHistoryStorageKey = "recall-loop-attempt-history";

  function loadDraft() {
    try {
      return window.localStorage.getItem(draftStorageKey) || "";
    } catch (error) {
      console.warn("Unable to read the saved draft.", error);
      return "";
    }
  }

  function saveDraft(value) {
    try {
      window.localStorage.setItem(draftStorageKey, value);
    } catch (error) {
      console.warn("Unable to save the current draft.", error);
    }
  }

  function loadBuilderDraft() {
    try {
      const rawDraft = window.localStorage.getItem(builderDraftStorageKey);
      if (!rawDraft) {
        return getEmptyBuilderDraft();
      }

      return normalizeBuilderDraft(JSON.parse(rawDraft));
    } catch (error) {
      console.warn("Unable to load the builder draft.", error);
      return getEmptyBuilderDraft();
    }
  }

  function saveBuilderDraft(draft) {
    try {
      window.localStorage.setItem(
        builderDraftStorageKey,
        JSON.stringify(normalizeBuilderDraft(draft)),
      );
      return true;
    } catch (error) {
      console.warn("Unable to save the builder draft.", error);
      return false;
    }
  }

  function loadSavedSets() {
    try {
      const rawSets = window.localStorage.getItem(savedSetsStorageKey);
      if (!rawSets) {
        return [];
      }

      const parsedSets = JSON.parse(rawSets);
      return Array.isArray(parsedSets)
        ? sortSavedSets(parsedSets.filter(isValidSavedSet).map(normalizeSavedSet))
        : [];
    } catch (error) {
      console.warn("Unable to load saved sets.", error);
      return [];
    }
  }

  function saveSavedSets(sets) {
    try {
      window.localStorage.setItem(
        savedSetsStorageKey,
        JSON.stringify(sortSavedSets(sets).map(normalizeSavedSet)),
      );
      return true;
    } catch (error) {
      console.warn("Unable to persist saved sets.", error);
      return false;
    }
  }

  function loadAttemptHistory() {
    try {
      const rawHistory = window.localStorage.getItem(attemptHistoryStorageKey);
      if (!rawHistory) {
        return [];
      }

      const parsedHistory = JSON.parse(rawHistory);
      if (!Array.isArray(parsedHistory)) {
        return [];
      }

      return parsedHistory
        .filter(isValidAttemptHistoryEntry)
        .map(normalizeAttemptHistoryEntry)
        .slice(-10);
    } catch (error) {
      console.warn("Unable to load study history.", error);
      return [];
    }
  }

  function saveAttemptHistory(history) {
    try {
      const normalizedHistory = Array.isArray(history)
        ? history.filter(isValidAttemptHistoryEntry).map(normalizeAttemptHistoryEntry).slice(-10)
        : [];

      window.localStorage.setItem(
        attemptHistoryStorageKey,
        JSON.stringify(normalizedHistory),
      );
      return true;
    } catch (error) {
      console.warn("Unable to persist study history.", error);
      return false;
    }
  }

  function appendAttemptHistory(entry) {
    const nextHistory = [...loadAttemptHistory(), normalizeAttemptHistoryEntry(entry)].slice(-10);
    if (!saveAttemptHistory(nextHistory)) {
      return null;
    }

    return nextHistory;
  }

  function upsertSet(existingSets, incomingSet) {
    const name = incomingSet.name.trim();
    const content = incomingSet.content.trim();
    const incomingId =
      typeof incomingSet.id === "string" && incomingSet.id.trim()
        ? incomingSet.id.trim()
        : "";
    const updatedAt = new Date().toISOString();
    const sets = [...existingSets];
    const normalizedName = normalizeSetName(name);
    let existingIndex = -1;

    if (incomingId) {
      existingIndex = sets.findIndex((set) => set.id === incomingId);
    }

    if (existingIndex < 0) {
      existingIndex = sets.findIndex((set) => normalizeSetName(set.name) === normalizedName);
    }

    let savedSet;
    if (existingIndex >= 0) {
      savedSet = {
        ...normalizeSavedSet(sets[existingIndex]),
        name,
        content,
        updatedAt,
      };
      sets[existingIndex] = savedSet;
    } else {
      savedSet = {
        id: incomingId || createSetId(),
        name,
        content,
        updatedAt,
        lastUsedAt:
          typeof incomingSet.lastUsedAt === "string" ? incomingSet.lastUsedAt : "",
      };
      sets.unshift(savedSet);
    }

    return {
      sets: sortSavedSets(sets),
      set: savedSet,
    };
  }

  function deleteSet(existingSets, setId) {
    const deletedSet = existingSets.find((set) => set.id === setId) || null;
    return {
      sets: existingSets.filter((set) => set.id !== setId),
      deletedSet,
    };
  }

  function touchSetUsage(existingSets, setId, usedAt = new Date().toISOString()) {
    const sets = existingSets.map((set) =>
      set.id === setId
        ? {
            ...normalizeSavedSet(set),
            lastUsedAt: usedAt,
          }
        : normalizeSavedSet(set),
    );
    const updatedSet = sets.find((set) => set.id === setId) || null;

    return {
      sets: sortSavedSets(sets),
      set: updatedSet,
    };
  }

  function setPendingAction(action) {
    try {
      window.localStorage.setItem(pendingActionStorageKey, JSON.stringify(action));
    } catch (error) {
      console.warn("Unable to queue the pending set action.", error);
    }
  }

  function consumePendingAction() {
    try {
      const rawAction = window.localStorage.getItem(pendingActionStorageKey);
      window.localStorage.removeItem(pendingActionStorageKey);

      if (!rawAction) {
        return null;
      }

      const parsedAction = JSON.parse(rawAction);
      if (
        parsedAction &&
        typeof parsedAction.type === "string" &&
        typeof parsedAction.setId === "string"
      ) {
        return parsedAction;
      }
    } catch (error) {
      console.warn("Unable to read the pending set action.", error);
    }

    return null;
  }

  function loadAutoAdvanceEnabled() {
    try {
      const rawValue = window.localStorage.getItem(autoAdvanceStorageKey);
      if (rawValue === null) {
        return true;
      }

      return rawValue === "true";
    } catch (error) {
      console.warn("Unable to read the auto-advance setting.", error);
      return true;
    }
  }

  function saveAutoAdvanceEnabled(enabled) {
    try {
      window.localStorage.setItem(autoAdvanceStorageKey, String(Boolean(enabled)));
    } catch (error) {
      console.warn("Unable to save the auto-advance setting.", error);
    }
  }

  async function importSetFile(file) {
    const rawText = await file.text();
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".json")) {
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (error) {
        throw new Error("That JSON file couldn't be parsed.");
      }

      if (!parsed || typeof parsed.name !== "string" || typeof parsed.content !== "string") {
        throw new Error("That JSON file isn't in the expected exported set format.");
      }

      return {
        name: parsed.name.trim() || stripFileExtension(file.name),
        content: parsed.content,
      };
    }

    return {
      name: stripFileExtension(file.name),
      content: rawText,
    };
  }

  function downloadSet(set) {
    downloadDeckText(set.name, set.content);
  }

  function downloadDeckText(name, content) {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = `${slugify(name)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  function countCards(rawDeck) {
    try {
      return parseDeck(rawDeck).length;
    } catch (error) {
      return rawDeck
        .split(/\r?\n\s*\r?\n/g)
        .map((block) => block.trim())
        .filter(Boolean).length;
    }
  }

  function parseDeck(rawDeck) {
    const blocks = rawDeck
      .split(/\r?\n\s*\r?\n/g)
      .map((block) => block.trim())
      .filter(Boolean);

    if (blocks.length === 0) {
      throw new Error("No cards were found. Separate each card with a blank line.");
    }

    return blocks.map((block, blockIndex) => parseCardBlock(block, blockIndex));
  }

  function extractBuilderEntriesFromDeck(rawDeck) {
    return parseDeck(rawDeck).map((card, index) => {
      const correctOption = card.options.find((option) => option.isCorrect);
      const promptType = card.promptType === "term" ? "term" : "definition";

      return {
        id: createBuilderEntryId(index),
        concept: card.concept || "",
        term: promptType === "term" ? card.definition : correctOption.text,
        definition: promptType === "term" ? correctOption.text : card.definition,
        promptType,
      };
    });
  }

  function createBuilderDraftFromDeck(setName, rawDeck) {
    return {
      setName: typeof setName === "string" ? setName : "",
      entries: extractBuilderEntriesFromDeck(rawDeck),
    };
  }

  function generateDeckFromBuilderEntries(entries) {
    const normalizedEntries = entries.map(normalizeBuilderEntry).filter(hasUsableBuilderEntry);

    if (normalizedEntries.length < 4) {
      throw new Error("Add at least 4 complete cards before generating a study set.");
    }

    return normalizedEntries
      .map((entry, index) => formatGeneratedCard(generateCardFromEntry(entry, index, normalizedEntries)))
      .join("\n\n");
  }

  function parseCardBlock(block, blockIndex) {
    const lines = block
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean);

    const definitionLines = [];
    const optionLines = [];
    let optionsStarted = false;

    lines.forEach((line) => {
      if (line.startsWith("-")) {
        optionsStarted = true;
        optionLines.push(line);
        return;
      }

      if (optionsStarted) {
        throw new Error(
          `Card ${blockIndex + 1} has text after the answer choices. Keep the definition first, then only option lines.`,
        );
      }

      definitionLines.push(line);
    });

    if (definitionLines.length === 0) {
      throw new Error(`Card ${blockIndex + 1} is missing its definition text.`);
    }

    if (optionLines.length < 2) {
      throw new Error(`Card ${blockIndex + 1} needs at least 2 answer choices.`);
    }

    const { concept, promptLines } = extractConcept(definitionLines, blockIndex);
    const { promptType, promptText } = extractPromptType(promptLines, blockIndex);

    const options = optionLines.map((line) => parseOptionLine(line, blockIndex));
    const correctOptions = options.filter((option) => option.isCorrect);

    if (correctOptions.length !== 1) {
      throw new Error(
        `Card ${blockIndex + 1} must have exactly 1 correct answer marked with "- * " or "[correct]".`,
      );
    }

    return {
      id: `card-${blockIndex + 1}`,
      concept,
      promptType,
      definition: promptText,
      options,
    };
  }

  function parseOptionLine(line, blockIndex) {
    let text = line.replace(/^-+\s*/, "").trim();
    let isCorrect = false;

    if (/^\*\s+/.test(text)) {
      isCorrect = true;
      text = text.replace(/^\*\s+/, "");
    } else if (/^\[correct\]\s+/i.test(text)) {
      isCorrect = true;
      text = text.replace(/^\[correct\]\s+/i, "");
    } else if (/\s+\*$/.test(text)) {
      isCorrect = true;
      text = text.replace(/\s+\*$/, "");
    } else if (/\s+\[correct\]$/i.test(text)) {
      isCorrect = true;
      text = text.replace(/\s+\[correct\]$/i, "");
    }

    if (!text) {
      throw new Error(`Card ${blockIndex + 1} contains an empty answer choice.`);
    }

    return {
      text,
      isCorrect,
    };
  }

  function extractConcept(definitionLines, blockIndex) {
    const [firstLine, ...restLines] = definitionLines;
    const match = firstLine.match(/^(concept|section)\s*:\s*(.*)$/i);

    if (!match) {
      return {
        concept: "",
        promptLines: definitionLines,
      };
    }

    const concept = match[2].trim();
    if (!concept) {
      throw new Error(`Card ${blockIndex + 1} is missing text after "${match[1].toLowerCase()}:".`);
    }

    if (restLines.length === 0) {
      throw new Error(`Card ${blockIndex + 1} needs prompt text after the concept line.`);
    }

    return {
      concept,
      promptLines: restLines,
    };
  }

  function extractPromptType(definitionLines, blockIndex) {
    const [firstLine, ...restLines] = definitionLines;
    const match = firstLine.match(/^(term|definition)\s*:\s*(.*)$/i);

    if (!match) {
      return {
        promptType: "definition",
        promptText: definitionLines.join(" "),
      };
    }

    const promptType = match[1].toLowerCase();
    const firstPromptLine = match[2].trim();
    const promptParts = [firstPromptLine, ...restLines].filter(Boolean);

    if (promptParts.length === 0) {
      throw new Error(`Card ${blockIndex + 1} is missing text after "${promptType}:".`);
    }

    return {
      promptType,
      promptText: promptParts.join(" "),
    };
  }

  function normalizeSetName(name) {
    return name.trim().toLowerCase();
  }

  function getEmptyBuilderDraft() {
    return {
      setName: "",
      entries: [],
    };
  }

  function normalizeBuilderDraft(draft) {
    return {
      setName: typeof draft?.setName === "string" ? draft.setName : "",
      entries: Array.isArray(draft?.entries)
        ? draft.entries.filter(isValidBuilderEntry).map(normalizeBuilderEntry)
        : [],
    };
  }

  function isValidBuilderEntry(entry) {
    return (
      entry &&
      typeof entry.id === "string" &&
      typeof entry.term === "string" &&
      typeof entry.definition === "string" &&
      typeof entry.promptType === "string"
    );
  }

  function normalizeBuilderEntry(entry) {
    return {
      id: typeof entry.id === "string" ? entry.id : createBuilderEntryId(),
      concept: typeof entry.concept === "string" ? entry.concept.trim() : "",
      term: typeof entry.term === "string" ? entry.term.trim() : "",
      definition: typeof entry.definition === "string" ? entry.definition.trim() : "",
      promptType: entry.promptType === "term" ? "term" : "definition",
    };
  }

  function hasUsableBuilderEntry(entry) {
    return Boolean(entry.term && entry.definition);
  }

  function generateCardFromEntry(entry, index, entries) {
    const promptType = entry.promptType;
    const concept = entry.concept;
    const promptText = promptType === "term" ? entry.term : entry.definition;
    const correctAnswer = promptType === "term" ? entry.definition : entry.term;

    if (isBooleanAnswer(correctAnswer)) {
      return {
        concept,
        promptType,
        promptText,
        options: buildTrueFalseOptions(correctAnswer),
      };
    }

    const answerType = promptType === "term" ? "definition" : "term";
    const primaryDistractors = collectPrimaryDistractors(entries, index, answerType, correctAnswer);
    const fallbackDistractors = collectFallbackDistractors(
      entries,
      index,
      answerType,
      correctAnswer,
      promptText,
    );
    const distractors = takeUnique(primaryDistractors, [correctAnswer], 3);

    if (distractors.length < 3) {
      const extraDistractors = takeUnique(
        fallbackDistractors,
        [correctAnswer, promptText, ...distractors],
        3 - distractors.length,
      );
      distractors.push(...extraDistractors);
    }

    if (distractors.length < 3) {
      throw new Error(
        "This set needs more distinct cards before all options can be auto-generated cleanly.",
      );
    }

    return {
      concept,
      promptType,
      promptText,
      options: placeCorrectAnswer(correctAnswer, distractors, index),
    };
  }

  function buildTrueFalseOptions(correctAnswer) {
    const normalizedAnswer = correctAnswer.trim().toLowerCase();
    const options = ["True", "False"];

    return options.map((option) => ({
      text: option,
      isCorrect: option.toLowerCase() === normalizedAnswer,
    }));
  }

  function collectPrimaryDistractors(entries, currentIndex, answerType, correctAnswer) {
    return getRotatedOtherEntries(entries, currentIndex)
      .map((entry) => (answerType === "term" ? entry.term : entry.definition))
      .filter((value) => value && value !== correctAnswer);
  }

  function collectFallbackDistractors(entries, currentIndex, answerType, correctAnswer, promptText) {
    return getRotatedOtherEntries(entries, currentIndex)
      .flatMap((entry) => {
        const preferred = answerType === "term" ? entry.definition : entry.term;
        const secondary = answerType === "term" ? entry.term : entry.definition;
        return [preferred, secondary];
      })
      .filter((value) => value && value !== correctAnswer && value !== promptText);
  }

  function getRotatedOtherEntries(entries, currentIndex) {
    const otherEntries = [];

    for (let offset = 1; offset < entries.length; offset += 1) {
      otherEntries.push(entries[(currentIndex + offset) % entries.length]);
    }

    return otherEntries;
  }

  function takeUnique(candidates, excludedValues, limit) {
    const excluded = new Set(excludedValues.filter(Boolean));
    const selected = [];

    candidates.forEach((candidate) => {
      if (selected.length >= limit || excluded.has(candidate)) {
        return;
      }

      excluded.add(candidate);
      selected.push(candidate);
    });

    return selected;
  }

  function placeCorrectAnswer(correctAnswer, distractors, index) {
    const options = [];
    const correctSlot = index % 4;
    let distractorIndex = 0;

    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      if (optionIndex === correctSlot) {
        options.push({
          text: correctAnswer,
          isCorrect: true,
        });
      } else {
        options.push({
          text: distractors[distractorIndex],
          isCorrect: false,
        });
        distractorIndex += 1;
      }
    }

    return options;
  }

  function formatGeneratedCard(card) {
    const conceptLine = card.concept ? `concept: ${card.concept}` : "";
    const firstLine = `${card.promptType}: ${card.promptText}`;
    const optionLines = card.options.map((option) =>
      option.isCorrect ? `- * ${option.text}` : `- ${option.text}`,
    );

    return [conceptLine, firstLine, ...optionLines].filter(Boolean).join("\n");
  }

  function isBooleanAnswer(value) {
    return typeof value === "string" && /^(true|false)$/i.test(value.trim());
  }

  function stripFileExtension(filename) {
    return filename.replace(/\.[^.]+$/, "") || filename;
  }

  function formatSavedDate(isoDate) {
    const savedDate = new Date(isoDate);
    if (Number.isNaN(savedDate.getTime())) {
      return "recently";
    }

    return savedDate.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function isValidSavedSet(candidate) {
    return (
      candidate &&
      typeof candidate.id === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.content === "string" &&
      typeof candidate.updatedAt === "string"
    );
  }

  function normalizeSavedSet(set) {
    return {
      id: set.id,
      name: set.name,
      content: set.content,
      updatedAt: set.updatedAt,
      lastUsedAt: typeof set.lastUsedAt === "string" ? set.lastUsedAt : "",
    };
  }

  function isValidAttemptHistoryEntry(candidate) {
    return (
      candidate &&
      typeof candidate.setName === "string" &&
      Number.isFinite(Number(candidate.totalCards)) &&
      Number.isFinite(Number(candidate.totalAttempts)) &&
      Number.isFinite(Number(candidate.correctAnswers)) &&
      typeof candidate.completedAt === "string"
    );
  }

  function normalizeAttemptHistoryEntry(entry) {
    const totalCards = Math.max(1, Math.round(Number(entry?.totalCards) || 0));
    const totalAttempts = Math.max(1, Math.round(Number(entry?.totalAttempts) || 0));
    const correctAnswers = Math.min(
      totalAttempts,
      Math.max(0, Math.round(Number(entry?.correctAnswers) || 0)),
    );

    return {
      id:
        typeof entry?.id === "string" && entry.id.trim()
          ? entry.id.trim()
          : `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      setName: typeof entry?.setName === "string" && entry.setName.trim()
        ? entry.setName.trim()
        : "Untitled Set",
      totalCards,
      totalAttempts,
      correctAnswers,
      accuracy:
        typeof entry?.accuracy === "number" && Number.isFinite(entry.accuracy)
          ? Math.max(0, Math.min(1, entry.accuracy))
          : correctAnswers / totalAttempts,
      sessionMode: entry?.sessionMode === "quickLearn" ? "quickLearn" : "learn",
      elapsedSeconds: Math.max(0, Math.round(Number(entry?.elapsedSeconds) || 0)),
      timeRemainingSeconds: Math.max(0, Math.round(Number(entry?.timeRemainingSeconds) || 0)),
      completedAt:
        typeof entry?.completedAt === "string" && entry.completedAt.trim()
          ? entry.completedAt
          : new Date().toISOString(),
    };
  }

  function sortSavedSets(sets) {
    return [...sets]
      .map(normalizeSavedSet)
      .sort((left, right) => getSetSortTimestamp(right).localeCompare(getSetSortTimestamp(left)));
  }

  function getSetSortTimestamp(set) {
    return set.lastUsedAt || set.updatedAt;
  }

  function createSetId() {
    return `set-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function createBuilderEntryId(index = 0) {
    return `builder-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function slugify(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "exametrics-set";
  }

  return {
    appendAttemptHistory,
    countCards,
    createBuilderDraftFromDeck,
    deleteSet,
    downloadDeckText,
    downloadSet,
    extractBuilderEntriesFromDeck,
    formatSavedDate,
    generateDeckFromBuilderEntries,
    importSetFile,
    loadAttemptHistory,
    isValidSavedSet,
    loadAutoAdvanceEnabled,
    loadBuilderDraft,
    loadDraft,
    loadSavedSets,
    normalizeSetName,
    parseDeck,
    saveAutoAdvanceEnabled,
    saveBuilderDraft,
    saveDraft,
    saveAttemptHistory,
    saveSavedSets,
    setPendingAction,
    consumePendingAction,
    stripFileExtension,
    touchSetUsage,
    upsertSet,
  };
})();

```

## `js/builder.js`

```js
const elements = {
  setNameInput: document.getElementById("builder-set-name-input"),
  fileInput: document.getElementById("builder-file-input"),
  conceptInput: document.getElementById("builder-concept-input"),
  promptTypeSelect: document.getElementById("builder-prompt-type-select"),
  termInput: document.getElementById("builder-term-input"),
  definitionInput: document.getElementById("builder-definition-input"),
  form: document.getElementById("builder-form"),
  saveEntryButton: document.getElementById("builder-save-entry-button"),
  clearFormButton: document.getElementById("builder-clear-form-button"),
  message: document.getElementById("builder-message"),
  countNote: document.getElementById("builder-count-note"),
  entriesList: document.getElementById("builder-entries-list"),
  previewStatus: document.getElementById("builder-preview-status"),
  previewCode: document.getElementById("builder-preview-code"),
  saveSetButton: document.getElementById("builder-save-set-button"),
  studySetButton: document.getElementById("builder-study-set-button"),
  openSetButton: document.getElementById("builder-open-set-button"),
  downloadSetButton: document.getElementById("builder-download-set-button"),
};

const state = {
  draft: RecallLoopStore.loadBuilderDraft(),
  savedSets: RecallLoopStore.loadSavedSets(),
  editingEntryId: null,
  generatedDeckText: "",
  generationError: "",
};

initialize();

function initialize() {
  hydrateFromDraft();
  bindEvents();
  renderAll();
}

function hydrateFromDraft() {
  elements.setNameInput.value = state.draft.setName;
}

function bindEvents() {
  elements.form.addEventListener("submit", handleEntrySubmit);
  elements.clearFormButton.addEventListener("click", clearEntryForm);
  elements.fileInput.addEventListener("change", handleDeckUpload);
  elements.setNameInput.addEventListener("input", handleDraftInputChange);
  elements.conceptInput.addEventListener("input", handleDraftInputChange);
  elements.promptTypeSelect.addEventListener("change", handleDraftInputChange);
  elements.termInput.addEventListener("input", handleDraftInputChange);
  elements.definitionInput.addEventListener("input", handleDraftInputChange);
  elements.saveSetButton.addEventListener("click", handleSaveSet);
  elements.studySetButton.addEventListener("click", () => handleSaveAndRedirect("study"));
  elements.openSetButton.addEventListener("click", handleSaveAndViewLibrary);
  elements.downloadSetButton.addEventListener("click", handleDownloadText);
}

async function handleDeckUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    const content = await file.text();
    const builderDraft = RecallLoopStore.createBuilderDraftFromDeck(
      RecallLoopStore.stripFileExtension(file.name),
      content,
    );

    state.draft = builderDraft;
    state.editingEntryId = null;
    hydrateFromDraft();
    clearEntryForm();
    persistBuilderDraft();
    renderAll();
    showMessage(`Loaded "${file.name}". You can keep editing it below.`);
  } catch (error) {
    showMessage(
      error.message || "I couldn't read that file. Try a plain text `.txt` or `.md` deck.",
      true,
    );
  } finally {
    event.target.value = "";
  }
}

function handleEntrySubmit(event) {
  event.preventDefault();

  const entry = {
    id: state.editingEntryId || createLocalEntryId(),
    concept: elements.conceptInput.value.trim(),
    promptType: elements.promptTypeSelect.value,
    term: elements.termInput.value.trim(),
    definition: elements.definitionInput.value.trim(),
  };

  if (!entry.term || !entry.definition) {
    showMessage("Fill in both the term and the definition before saving a card.", true);
    return;
  }

  if (state.editingEntryId) {
    state.draft.entries = state.draft.entries.map((existingEntry) =>
      existingEntry.id === state.editingEntryId ? entry : existingEntry,
    );
    showMessage("Card updated.");
  } else {
    state.draft.entries = [...state.draft.entries, entry];
    showMessage("Card added.");
  }

  clearEntryForm();
  persistBuilderDraft();
  renderAll();
}

function handleDraftInputChange() {
  state.draft.setName = elements.setNameInput.value;
  persistBuilderDraft();
  updateActionButtons();
}

function clearEntryForm() {
  state.editingEntryId = null;
  elements.conceptInput.value = "";
  elements.promptTypeSelect.value = "definition";
  elements.termInput.value = "";
  elements.definitionInput.value = "";
  elements.saveEntryButton.textContent = "Add Card";
}

function renderAll() {
  renderCountNote();
  renderEntriesList();
  renderGeneratedDeck();
  updateActionButtons();
}

function renderCountNote() {
  const cardCount = state.draft.entries.length;
  const promptMix = summarizePromptMix(state.draft.entries);

  if (cardCount === 0) {
    elements.countNote.textContent =
      "Add at least 4 cards. The builder will create four-option cards when it has enough material.";
    return;
  }

  elements.countNote.textContent = `${cardCount} card${cardCount === 1 ? "" : "s"} added. ${promptMix}`;
}

function renderEntriesList() {
  elements.entriesList.innerHTML = "";

  if (state.draft.entries.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "library-empty";
    emptyState.innerHTML = `
      <p class="section-kicker">No cards yet</p>
      <h2>Start by adding a term and its definition.</h2>
      <p class="guide-copy">
        Choose whether each card should show the term or the definition during study,
        and add a concept label whenever you want more context.
      </p>
    `;
    elements.entriesList.appendChild(emptyState);
    return;
  }

  state.draft.entries.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = "saved-set-item";

    const copy = document.createElement("div");
    copy.className = "saved-set-copy";

    const topline = document.createElement("div");
    topline.className = "builder-entry-topline";

    const cardNumber = document.createElement("span");
    cardNumber.className = "pill";
    cardNumber.textContent = `Card ${index + 1}`;

    const promptPill = document.createElement("span");
    promptPill.className = "pill";
    promptPill.textContent =
      entry.promptType === "term" ? "Shows Term" : "Shows Definition";

    topline.append(cardNumber, promptPill);

    if (entry.concept) {
      const conceptPill = document.createElement("span");
      conceptPill.className = "pill";
      conceptPill.textContent = `Concept · ${entry.concept}`;
      topline.append(conceptPill);
    }

    const title = document.createElement("h3");
    title.className = "saved-set-title";
    title.textContent = entry.term;

    const meta = document.createElement("p");
    meta.className = "saved-set-meta";
    meta.textContent = entry.definition;

    copy.append(topline, title, meta);

    const actions = document.createElement("div");
    actions.className = "saved-set-actions";

    actions.append(
      createButton("Edit", "button button-secondary", () => loadEntryForEditing(entry.id)),
      createButton("Remove", "button button-ghost", () => removeEntry(entry.id)),
    );

    item.append(copy, actions);
    elements.entriesList.appendChild(item);
  });
}

function renderGeneratedDeck() {
  state.generatedDeckText = "";
  state.generationError = "";

  if (state.draft.entries.length < 4) {
    elements.previewStatus.textContent =
      "Add at least 4 complete cards to generate a full multiple-choice deck.";
    elements.previewCode.textContent = "";
    return;
  }

  try {
    state.generatedDeckText = RecallLoopStore.generateDeckFromBuilderEntries(state.draft.entries);
    elements.previewStatus.textContent =
      "This is the exact deck text that will be saved, studied, or downloaded.";
    elements.previewCode.textContent = state.generatedDeckText;
  } catch (error) {
    state.generationError = error.message;
    elements.previewStatus.textContent = error.message;
    elements.previewCode.textContent = "";
  }
}

function updateActionButtons() {
  const canUseGeneratedDeck = Boolean(state.generatedDeckText);
  const hasName = Boolean(elements.setNameInput.value.trim());

  elements.saveSetButton.disabled = !canUseGeneratedDeck || !hasName;
  elements.studySetButton.disabled = !canUseGeneratedDeck || !hasName;
  elements.openSetButton.disabled = !canUseGeneratedDeck || !hasName;
  elements.downloadSetButton.disabled = !canUseGeneratedDeck || !hasName;
}

function loadEntryForEditing(entryId) {
  const entry = state.draft.entries.find((item) => item.id === entryId);
  if (!entry) {
    return;
  }

  state.editingEntryId = entry.id;
  elements.conceptInput.value = entry.concept || "";
  elements.promptTypeSelect.value = entry.promptType;
  elements.termInput.value = entry.term;
  elements.definitionInput.value = entry.definition;
  elements.saveEntryButton.textContent = "Update Card";
  showMessage(`Editing "${entry.term}".`);
  elements.termInput.focus();
}

function removeEntry(entryId) {
  const removedEntry = state.draft.entries.find((entry) => entry.id === entryId);
  state.draft.entries = state.draft.entries.filter((entry) => entry.id !== entryId);

  if (state.editingEntryId === entryId) {
    clearEntryForm();
  }

  persistBuilderDraft();
  renderAll();
  showMessage(`Removed "${removedEntry ? removedEntry.term : "that card"}".`);
}

function handleSaveSet() {
  const savedSet = saveGeneratedSet();
  if (!savedSet) {
    return;
  }

  showMessage(`Saved "${savedSet.name}" to your local set library.`);
}

function handleSaveAndRedirect(actionType) {
  const savedSet = saveGeneratedSet();
  if (!savedSet) {
    return;
  }

  RecallLoopStore.setPendingAction({
    type: actionType,
    setId: savedSet.id,
  });
  window.location.href = "../index.html";
}

function handleSaveAndViewLibrary() {
  const savedSet = saveGeneratedSet();
  if (!savedSet) {
    return;
  }

  showMessage(`Saved "${savedSet.name}" to your local set library.`);
  window.location.href = "./library.html";
}

function handleDownloadText() {
  if (!ensureGeneratedDeckReady()) {
    return;
  }

  RecallLoopStore.downloadDeckText(elements.setNameInput.value.trim(), state.generatedDeckText);
  showMessage("Downloaded the generated `.txt` deck.");
}

function saveGeneratedSet() {
  if (!ensureGeneratedDeckReady()) {
    return null;
  }

  const setName = elements.setNameInput.value.trim();
  state.draft.setName = setName;

  const result = RecallLoopStore.upsertSet(state.savedSets, {
    name: setName,
    content: state.generatedDeckText,
  });
  state.savedSets = result.sets;

  if (!RecallLoopStore.saveSavedSets(state.savedSets)) {
    showMessage("This browser couldn't save the generated set locally.", true);
    return null;
  }

  persistBuilderDraft();
  return result.set;
}

function ensureGeneratedDeckReady() {
  const setName = elements.setNameInput.value.trim();

  if (!setName) {
    showMessage("Give the set a name before saving, studying, or downloading it.", true);
    elements.setNameInput.focus();
    return false;
  }

  if (!state.generatedDeckText) {
    showMessage(
      state.generationError || "Add enough complete cards before generating the study set.",
      true,
    );
    return false;
  }

  return true;
}

function persistBuilderDraft() {
  state.draft.setName = elements.setNameInput.value;
  RecallLoopStore.saveBuilderDraft(state.draft);
}

function summarizePromptMix(entries) {
  const termFirst = entries.filter((entry) => entry.promptType === "term").length;
  const definitionFirst = entries.length - termFirst;

  return `${definitionFirst} definition-first, ${termFirst} term-first.`;
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createLocalEntryId() {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function showMessage(message, isError = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", isError);
}

```

## `js/library.js`

```js
const elements = {
  message: document.getElementById("library-message"),
  list: document.getElementById("library-list"),
};

const state = {
  savedSets: [],
};

initialize();

function initialize() {
  state.savedSets = RecallLoopStore.loadSavedSets();
  renderLibrary();
}

function renderLibrary() {
  elements.list.innerHTML = "";

  if (state.savedSets.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "library-empty";
    emptyState.innerHTML = `
      <p class="section-kicker">No saved sets yet</p>
      <h2>Create a set from New or bring one in from Import/Export.</h2>
      <p class="guide-copy">
        Everything here stays local to this browser unless you export it yourself.
      </p>
    `;
    elements.list.appendChild(emptyState);
    return;
  }

  state.savedSets.forEach((set) => {
    const card = document.createElement("article");
    card.className = "saved-set-item";

    const copy = document.createElement("div");
    copy.className = "saved-set-copy";

    const title = document.createElement("h3");
    title.className = "saved-set-title";
    title.textContent = set.name;

    const meta = document.createElement("p");
    meta.className = "saved-set-meta";
    meta.textContent = formatSetMeta(set);

    copy.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "saved-set-actions";

    actions.append(
      createActionButton("Study", "button button-primary", () => queueSetAction("study", set.id)),
      createActionButton("Quick Learn", "button button-secondary", () =>
        queueSetAction("quickLearn", set.id),
      ),
      createIconActionButton("edit", "Edit in Builder", () =>
        openInBuilder(set),
      ),
      createIconActionButton("export", "Export Set", () => {
        RecallLoopStore.downloadSet(set);
        showMessage(`Exported "${set.name}".`);
      }),
      createIconActionButton("delete", "Delete Set", () => deleteSet(set.id), true),
    );

    card.append(copy, actions);
    elements.list.appendChild(card);
  });
}

function formatSetMeta(set) {
  const totalCards = RecallLoopStore.countCards(set.content);
  const cardCount = `${totalCards} card${totalCards === 1 ? "" : "s"}`;

  if (set.lastUsedAt) {
    return `Used ${RecallLoopStore.formatSavedDate(set.lastUsedAt)} • ${cardCount}`;
  }

  return `Saved ${RecallLoopStore.formatSavedDate(set.updatedAt)} • ${cardCount}`;
}

function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function createIconActionButton(iconName, label, onClick, isDanger = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `button button-ghost icon-button${isDanger ? " icon-button-danger" : ""}`;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = getIconMarkup(iconName);
  button.addEventListener("click", onClick);
  return button;
}

function getIconMarkup(iconName) {
  const iconMap = {
    edit: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 17.25V20h2.75L17.8 8.95l-2.75-2.75L4 17.25Z"></path>
        <path d="M14.04 4.79 16.79 2l2.75 2.75-2.75 2.75Z"></path>
      </svg>
    `,
    export: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3v10"></path>
        <path d="m8 9 4 4 4-4"></path>
        <path d="M5 16v3h14v-3"></path>
      </svg>
    `,
    delete: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h16"></path>
        <path d="M9 7V4h6v3"></path>
        <path d="M7 7l1 13h8l1-13"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
      </svg>
    `,
  };

  return iconMap[iconName] || "";
}

function queueSetAction(type, setId) {
  RecallLoopStore.setPendingAction({ type, setId });
  window.location.href = "../index.html";
}

function openInBuilder(set) {
  RecallLoopStore.saveBuilderDraft(
    RecallLoopStore.createBuilderDraftFromDeck(set.name, set.content),
  );
  window.location.href = "./builder.html";
}

function deleteSet(setId) {
  const { sets, deletedSet } = RecallLoopStore.deleteSet(state.savedSets, setId);
  state.savedSets = sets;

  if (!RecallLoopStore.saveSavedSets(state.savedSets)) {
    showMessage("This browser couldn't delete the saved set cleanly.", true);
    return;
  }

  renderLibrary();
  showMessage(`Deleted "${deletedSet ? deletedSet.name : "that set"}" from this device.`);
}

function showMessage(message, isError = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", isError);
}

```

## `js/ai-builder.js`

```js
const sampleDeck = `concept: Cell Biology
definition: The powerhouse of the cell.
- * Mitochondria
- Nucleus
- Ribosome
- Golgi apparatus

concept: Early American Government
definition: An agreement among states that created the first U.S. national government.
- * Articles of Confederation
- Bill of Rights
- Federalist Papers
- Emancipation Proclamation

concept: Plant Processes
term: Photosynthesis
- * The process plants use to convert light energy into chemical energy
- The division of a cell into two daughter cells
- The movement of water across a membrane
- The breakdown of glucose for ATP

concept: Scientific Statements
definition: Water freezes at 0°C.
- * True
- False`;

const elements = {
  setNameInput: document.getElementById("ai-set-name-input"),
  deckInput: document.getElementById("ai-deck-input"),
  fileInput: document.getElementById("ai-file-input"),
  sampleButton: document.getElementById("ai-sample-button"),
  saveSetButton: document.getElementById("ai-save-set-button"),
  studySetButton: document.getElementById("ai-study-set-button"),
  builderConvertButton: document.getElementById("ai-builder-convert-button"),
  openSetButton: document.getElementById("ai-open-set-button"),
  message: document.getElementById("ai-message"),
};

const state = {
  savedSets: [],
  currentSetId: "",
};

initialize();

function initialize() {
  state.savedSets = RecallLoopStore.loadSavedSets();
  elements.deckInput.value = RecallLoopStore.loadDraft();
  bindEvents();
}

function bindEvents() {
  elements.deckInput.addEventListener("input", handleDraftInput);
  elements.fileInput.addEventListener("change", handleDeckUpload);
  elements.sampleButton.addEventListener("click", loadSampleDeck);
  elements.saveSetButton.addEventListener("click", () => saveCurrentSet());
  elements.studySetButton.addEventListener("click", () => saveCurrentSet("study"));
  elements.builderConvertButton.addEventListener("click", openCurrentDeckInBuilder);
  elements.openSetButton.addEventListener("click", saveCurrentSetAndViewLibrary);
}

function handleDraftInput() {
  RecallLoopStore.saveDraft(elements.deckInput.value);
}

async function handleDeckUpload(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    elements.deckInput.value = await file.text();
    RecallLoopStore.saveDraft(elements.deckInput.value);

    if (!elements.setNameInput.value.trim()) {
      elements.setNameInput.value = RecallLoopStore.stripFileExtension(file.name);
    }

    state.currentSetId = "";
    showMessage(`Loaded "${file.name}". You can tweak it here before saving or studying.`);
  } catch (error) {
    showMessage("I couldn't read that file. Try a plain text `.txt` or `.md` deck.", true);
  } finally {
    event.target.value = "";
  }
}

function loadSampleDeck() {
  elements.deckInput.value = sampleDeck;
  elements.setNameInput.value = "Sample Deck";
  state.currentSetId = "";
  RecallLoopStore.saveDraft(elements.deckInput.value);
  showMessage("Sample AI deck loaded. You can edit it, save it, or study it.");
}

function saveCurrentSet(actionType = "") {
  const setName = elements.setNameInput.value.trim();
  const content = elements.deckInput.value.trim();

  if (!setName) {
    showMessage("Give the set a name before saving or studying it.", true);
    elements.setNameInput.focus();
    return;
  }

  if (!content) {
    showMessage("Paste or upload a deck before saving or studying it.", true);
    elements.deckInput.focus();
    return;
  }

  try {
    RecallLoopStore.parseDeck(content);
  } catch (error) {
    showMessage(error.message, true);
    return;
  }

  const result = RecallLoopStore.upsertSet(state.savedSets, {
    id: state.currentSetId,
    name: setName,
    content,
  });
  state.savedSets = result.sets;

  if (!RecallLoopStore.saveSavedSets(state.savedSets)) {
    showMessage("This browser couldn't save the set locally.", true);
    return;
  }

  state.currentSetId = result.set.id;
  RecallLoopStore.saveDraft(content);

  if (actionType) {
    RecallLoopStore.setPendingAction({
      type: actionType,
      setId: result.set.id,
    });
    window.location.href = "../index.html";
    return result.set;
  }

  showMessage(`Saved "${result.set.name}" to your local set library.`);
  return result.set;
}

function openCurrentDeckInBuilder() {
  const setName = elements.setNameInput.value.trim();
  const content = elements.deckInput.value.trim();

  if (!content) {
    showMessage("Paste or upload a deck before editing it in the builder.", true);
    elements.deckInput.focus();
    return;
  }

  try {
    const builderDraft = RecallLoopStore.createBuilderDraftFromDeck(setName, content);
    RecallLoopStore.saveBuilderDraft(builderDraft);
    window.location.href = "./builder.html";
  } catch (error) {
    showMessage(`I couldn't open that deck in the builder yet: ${error.message}`, true);
  }
}

function saveCurrentSetAndViewLibrary() {
  const savedSet = saveCurrentSet();
  if (!savedSet) {
    return;
  }

  showMessage(`Saved "${savedSet.name}" to your local set library.`);
  window.location.href = "./library.html";
}

function showMessage(message, isError = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", isError);
}

```

## `js/transfer.js`

```js
const elements = {
  importInput: document.getElementById("transfer-import-input"),
  message: document.getElementById("transfer-message"),
  list: document.getElementById("transfer-list"),
};

const state = {
  savedSets: [],
};

initialize();

function initialize() {
  state.savedSets = RecallLoopStore.loadSavedSets();
  elements.importInput.addEventListener("change", handleImport);
  renderSetList();
}

async function handleImport(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  try {
    const importedSet = await RecallLoopStore.importSetFile(file);
    RecallLoopStore.parseDeck(importedSet.content);

    const result = RecallLoopStore.upsertSet(state.savedSets, importedSet);
    state.savedSets = result.sets;

    if (!RecallLoopStore.saveSavedSets(state.savedSets)) {
      showMessage("This browser couldn't save the imported set locally.", true);
      return;
    }

    renderSetList();
    showMessage(`Imported and saved "${result.set.name}".`);
  } catch (error) {
    showMessage(error.message || "I couldn't import that set file.", true);
  } finally {
    event.target.value = "";
  }
}

function renderSetList() {
  elements.list.innerHTML = "";

  if (state.savedSets.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "library-empty";
    emptyState.innerHTML = `
      <p class="section-kicker">Nothing saved yet</p>
      <h2>Import a set first, then come back here any time to export it.</h2>
    `;
    elements.list.appendChild(emptyState);
    return;
  }

  state.savedSets.forEach((set) => {
    const card = document.createElement("article");
    card.className = "saved-set-item";

    const copy = document.createElement("div");
    copy.className = "saved-set-copy";

    const title = document.createElement("h3");
    title.className = "saved-set-title";
    title.textContent = set.name;

    const meta = document.createElement("p");
    meta.className = "saved-set-meta";
    meta.textContent = formatSetMeta(set);

    copy.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "saved-set-actions";
    actions.append(
      createActionButton("Export", "button button-secondary", () => {
        RecallLoopStore.downloadSet(set);
        showMessage(`Exported "${set.name}".`);
      }),
    );

    card.append(copy, actions);
    elements.list.appendChild(card);
  });
}

function formatSetMeta(set) {
  const totalCards = RecallLoopStore.countCards(set.content);
  const cardLabel = `${totalCards} card${totalCards === 1 ? "" : "s"}`;

  if (set.lastUsedAt) {
    return `Used ${RecallLoopStore.formatSavedDate(set.lastUsedAt)} • ${cardLabel}`;
  }

  return `Saved ${RecallLoopStore.formatSavedDate(set.updatedAt)} • ${cardLabel}`;
}

function createActionButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function showMessage(message, isError = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", isError);
}

```

## `pages/builder.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exametrics New Set</title>
    <meta name="theme-color" content="#0f7b6c" />
    <meta
      name="description"
      content="Upload a deck or build one card by card, then save it into Exametrics."
    />
    <link rel="icon" href="../assets/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="../manifest.webmanifest" />
    <link rel="stylesheet" href="../css/styles.css" />
    <script src="../js/shared.js" defer></script>
    <script src="../js/builder.js" defer></script>
  </head>
  <body>
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">Create something new</p>
        <h1>New Set</h1>
        <p class="hero-copy">
          Upload a text deck or build one card at a time, then let Exametrics generate the final study set for you automatically.
        </p>
      </header>

      <main class="main-panel">
        <section class="builder-page">
          <div class="library-toolbar">
            <div class="section-heading">
              <h2>Create a study set</h2>
            </div>

            <div class="library-toolbar-actions">
              <a href="../index.html" class="button button-primary button-link">Home</a>
              <a href="./library.html" class="button button-ghost button-link">Library</a>
              <a href="./ai-builder.html" class="button button-ghost button-link">AI Set Instructions</a>
              <a href="./transfer.html" class="button button-ghost button-link">Import/Export</a>
            </div>
          </div>

          <div class="builder-grid">
            <section class="editor-panel">
              <div class="section-heading">
                <h2>Upload or build manually</h2>
              </div>

              <label class="menu-label" for="builder-set-name-input">Set name</label>
              <input
                id="builder-set-name-input"
                class="set-name-input"
                type="text"
                maxlength="80"
                placeholder="Name this set"
              />

              <div class="upload-strip">
                <label class="button button-secondary upload-button upload-wide-button" for="builder-file-input">
                  Upload
                </label>
                <p class="upload-strip-note">Accepts `.txt` and `.md` files only.</p>
              </div>
              <input id="builder-file-input" type="file" accept=".txt,.md,text/plain" hidden />

              <div class="section-heading section-heading-subtle">
                <h3>Build manually</h3>
              </div>

              <form id="builder-form" class="builder-form">
                <label class="menu-label" for="builder-concept-input">Concept or section</label>
                <input
                  id="builder-concept-input"
                  class="set-name-input"
                  type="text"
                  maxlength="120"
                  placeholder="Optional: Cell Biology, Chapter 4, Unit 2"
                />

                <label class="menu-label" for="builder-prompt-type-select">Prompt shows</label>
                <select id="builder-prompt-type-select" class="menu-select">
                  <option value="definition">Definition first, answer with the term</option>
                  <option value="term">Term first, answer with the definition</option>
                </select>

                <label class="menu-label" for="builder-term-input">Term</label>
                <textarea
                  id="builder-term-input"
                  class="builder-textarea"
                  rows="3"
                  placeholder="Enter the term"
                ></textarea>

                <label class="menu-label" for="builder-definition-input">Definition</label>
                <textarea
                  id="builder-definition-input"
                  class="builder-textarea"
                  rows="4"
                  placeholder="Enter the definition"
                ></textarea>

                <div class="menu-actions">
                  <button id="builder-save-entry-button" class="button button-primary" type="submit">
                    Add Card
                  </button>
                  <button id="builder-clear-form-button" class="button button-ghost" type="button">
                    Clear Form
                  </button>
                </div>
              </form>

              <p id="builder-message" class="setup-message" aria-live="polite"></p>
              <p id="builder-count-note" class="guide-copy builder-count-note"></p>
              <div id="builder-entries-list" class="saved-sets-list"></div>
            </section>

            <aside class="guide-panel">
              <div class="guide-card">
                <div class="section-heading">
                  <p class="section-kicker">2. Generated deck</p>
                  <h2>Live `.txt` preview</h2>
                </div>

                <p id="builder-preview-status" class="guide-copy">
                  Add at least 4 complete cards to generate a full multiple-choice deck.
                </p>

                <pre class="builder-preview"><code id="builder-preview-code"></code></pre>

                <div class="menu-actions">
                  <button id="builder-save-set-button" class="button button-secondary" type="button">
                    Save Set
                  </button>
                  <button id="builder-study-set-button" class="button button-primary" type="button">
                    Save and Study
                  </button>
                  <button id="builder-open-set-button" class="button button-ghost" type="button">
                    Save and View Library
                  </button>
                  <button id="builder-download-set-button" class="button button-ghost" type="button">
                    Download `.txt`
                  </button>
                </div>
              </div>

              <div class="guide-card">
                <div class="section-heading">
                  <p class="section-kicker">How options work</p>
                  <h2>Auto-fill rules</h2>
                </div>

                <p class="guide-copy">
                  For `definition` cards, the correct answer is the term. For `term`
                  cards, the correct answer is the definition.
                </p>

                <p class="guide-copy">
                  Add an optional concept or section label if you want each card to show
                  extra context during study, like `Concept · Cellular Respiration`.
                </p>

                <p class="guide-copy">
                  The builder first pulls distractors from the same answer type, then
                  falls back to any other available texts only if it needs to.
                </p>

                <p class="guide-copy">
                  AI or imported decks can be edited here too. If a deck started as raw text,
                  Exametrics automatically rebuilds it into builder cards while keeping the
                  concept line, prompt direction, term, and definition.
                </p>

                <p class="guide-copy">
                  True/false answers stay as two-option cards. Everything else becomes
                  four-option multiple choice.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>

```

## `pages/library.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exametrics Library</title>
    <meta name="theme-color" content="#0f7b6c" />
    <meta
      name="description"
      content="Browse the saved study sets on this device and jump back into learning."
    />
    <link rel="icon" href="../assets/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="../manifest.webmanifest" />
    <link rel="stylesheet" href="../css/styles.css" />
    <script src="../js/shared.js" defer></script>
    <script src="../js/library.js" defer></script>
  </head>
  <body>
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">Local set manager</p>
        <h1>Exametrics Library</h1>
        <p class="hero-copy">
          Browse the saved sets in this browser and jump straight back into studying.
        </p>
      </header>

      <main class="main-panel">
        <section class="library-page">
          <div class="library-toolbar">
            <div class="section-heading">
              <p class="section-kicker">Saved on this device</p>
              <h2>Browse your set library</h2>
            </div>

            <div class="library-toolbar-actions">
              <a href="../index.html" class="button button-primary button-link">Home</a>
              <a href="./builder.html" class="button button-ghost button-link">New</a>
              <a href="./ai-builder.html" class="button button-ghost button-link">AI Set Instructions</a>
              <a href="./transfer.html" class="button button-ghost button-link">Import/Export</a>
            </div>
          </div>

          <p id="library-message" class="setup-message" aria-live="polite"></p>
          <div id="library-list" class="saved-sets-list library-list"></div>
        </section>
      </main>
    </div>
  </body>
</html>

```

## `pages/ai-builder.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exametrics AI Set Instructions</title>
    <meta name="theme-color" content="#0f7b6c" />
    <meta
      name="description"
      content="Use AI to generate study sets with custom distractors, concept headers, and a clean deck format for Exametrics."
    />
    <link rel="icon" href="../assets/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="../manifest.webmanifest" />
    <link rel="stylesheet" href="../css/styles.css" />
    <script src="../js/shared.js" defer></script>
    <script src="../js/ai-builder.js" defer></script>
  </head>
  <body>
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">AI-guided import</p>
        <h1>AI Set Instructions</h1>
        <p class="hero-copy">
          Use any AI tool you like, ask for a clean Exametrics deck format, then paste or
          upload the result here and save it straight into Exametrics.
        </p>
      </header>

      <main class="main-panel">
        <section class="builder-page">
          <div class="library-toolbar">
            <div class="section-heading">
              <p class="section-kicker">Bring in an AI deck</p>
              <h2>Paste it, upload it, save it, study it</h2>
            </div>

            <div class="library-toolbar-actions">
              <a href="../index.html" class="button button-primary button-link">Home</a>
              <a href="./builder.html" class="button button-ghost button-link">New</a>
              <a href="./library.html" class="button button-ghost button-link">Library</a>
              <a href="./transfer.html" class="button button-ghost button-link">Import/Export</a>
            </div>
          </div>

          <div class="builder-grid">
            <section class="editor-panel">
              <div class="section-heading">
                <p class="section-kicker">1. Add your deck</p>
                <h2>Paste AI output or upload a text file</h2>
              </div>

              <label class="menu-label" for="ai-set-name-input">Set name</label>
              <input
                id="ai-set-name-input"
                class="set-name-input"
                type="text"
                maxlength="80"
                placeholder="Name this set"
              />

              <div class="menu-actions">
                <label class="button button-secondary upload-button" for="ai-file-input">
                  Upload AI Deck
                </label>
                <button id="ai-sample-button" class="button button-ghost" type="button">
                  Use Sample Deck
                </button>
              </div>
              <input id="ai-file-input" type="file" accept=".txt,.md,text/plain" hidden />

              <label class="sr-only" for="ai-deck-input">AI deck text</label>
              <textarea
                id="ai-deck-input"
                spellcheck="false"
                placeholder="Paste the AI response here. You can also tweak the concept lines, prompt types, or distractors before saving."
              ></textarea>

              <div class="menu-actions">
                <button id="ai-save-set-button" class="button button-secondary" type="button">
                  Save Set
                </button>
                <button id="ai-study-set-button" class="button button-primary" type="button">
                  Save and Study
                </button>
                <button id="ai-builder-convert-button" class="button button-ghost" type="button">
                  Edit in Builder
                </button>
                <button id="ai-open-set-button" class="button button-ghost" type="button">
                  Save and View Library
                </button>
              </div>

              <p id="ai-message" class="setup-message" aria-live="polite"></p>
            </section>

            <aside class="guide-panel">
              <div class="guide-card">
                <div class="section-heading">
                  <p class="section-kicker">2. Quick guide</p>
                  <h2>What to tell your AI</h2>
                </div>

                <ol class="guide-steps">
                  <li>Using the AI of your choice, send it your terms and definitions you want to learn.</li>
                  <li>Paste the template below and ask for each term or definition to be formatted like that.</li>
                  <li>Start learning!</li>
                </ol>

                <p class="guide-copy">
                  Keep the instructions simple: ask for plausible distractors, one marked
                  correct answer, and blank lines between cards.
                </p>

                <p class="guide-copy">
                  If you want to tweak the core cards after import, just use `Edit in Builder`.
                  Exametrics will rebuild the deck into builder cards automatically while keeping
                  the set name, concept lines, prompt direction, term, and definition.
                </p>
              </div>

              <div class="guide-card">
                <div class="section-heading">
                  <p class="section-kicker">Simple example</p>
                  <h2>Short template</h2>
                </div>

                <pre><code>Format these as Exametrics cards.
Propogate each pairing with plausible and closely related answers and concepts.
Fill in a concept line for each question to help with context.
Use either "definition:" or "term:" for each prompt.
Put each answer choice on its own "- " line.
Mark the correct answer with "- * ".
Separate cards with one blank line.
Make the wrong answers plausible but still incorrect.

concept: Cellular Respiration
definition: The powerhouse of the cell.
- * Mitochondria
- Nucleus
- Ribosome
- Golgi apparatus

concept: Plant Processes
term: Photosynthesis
- * The process plants use to convert light energy into chemical energy
- The division of a cell into two daughter cells
- The movement of water across a membrane
- The breakdown of glucose for ATP

concept: Scientific Statements
definition: Water freezes at 0°C.
- * True
- False</code></pre>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>

```

## `pages/transfer.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exametrics Import and Export</title>
    <meta name="theme-color" content="#0f7b6c" />
    <meta
      name="description"
      content="Import study sets into Exametrics or export the saved sets from this device."
    />
    <link rel="icon" href="../assets/icon.svg" type="image/svg+xml" />
    <link rel="manifest" href="../manifest.webmanifest" />
    <link rel="stylesheet" href="../css/styles.css" />
    <script src="../js/shared.js" defer></script>
    <script src="../js/transfer.js" defer></script>
  </head>
  <body>
    <div class="app-shell">
      <header class="hero">
        <p class="eyebrow">Move sets around</p>
        <h1>Import/Export</h1>
        <p class="hero-copy">
          Bring a study set into this browser or download one out so you can move it to another
          browser or device.
        </p>
      </header>

      <main class="main-panel">
        <section class="builder-page">
          <div class="library-toolbar">
            <div class="section-heading">
              <h2>Transfer your sets</h2>
            </div>

            <div class="library-toolbar-actions">
              <a href="../index.html" class="button button-primary button-link">Home</a>
              <a href="./library.html" class="button button-ghost button-link">Library</a>
              <a href="./builder.html" class="button button-ghost button-link">New</a>
              <a href="./ai-builder.html" class="button button-ghost button-link">AI Set Instructions</a>
            </div>
          </div>

          <div class="builder-grid">
            <section class="editor-panel">
              <div class="section-heading">
                <p class="section-kicker">1. Import a study set</p>
                <h2>Upload a deck file</h2>
              </div>

              <div class="upload-strip">
                <label class="button button-secondary upload-button upload-wide-button" for="transfer-import-input">
                  Import Study Set
                </label>
                <p class="upload-strip-note">Accepts exported Exametrics files plus `.txt` and `.md` decks.</p>
              </div>
              <input
                id="transfer-import-input"
                type="file"
                accept=".json,.txt,.md,application/json,text/plain"
                hidden
              />

              <p class="guide-copy">
                Imported sets stay local to this browser once they are saved here.
              </p>

              <p id="transfer-message" class="setup-message" aria-live="polite"></p>
            </section>

            <aside class="guide-panel">
              <div class="guide-card">
                <div class="section-heading">
                  <p class="section-kicker">2. Export a saved set</p>
                  <h2>Download a copy</h2>
                </div>

                <p class="guide-copy">
                  Pick any saved set below and export it as a text file. Then import that file on
                  the other browser or device.
                </p>

                <div id="transfer-list" class="saved-sets-list"></div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>

```

## `service-worker.js`

```js
const CACHE_NAME = "recall-loop-v18";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./pages/library.html",
  "./pages/builder.html",
  "./pages/ai-builder.html",
  "./pages/transfer.html",
  "./css/styles.css",
  "./js/shared.js",
  "./js/app.js",
  "./js/library.js",
  "./js/builder.js",
  "./js/ai-builder.js",
  "./js/transfer.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./sample-decks/sample-deck.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseCopy);
        });

        return networkResponse;
      });
    }),
  );
});

```

