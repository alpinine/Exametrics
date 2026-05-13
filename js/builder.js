const elements = {
  setNameInput: document.getElementById("builder-set-name-input"),
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
  elements.setNameInput.addEventListener("input", handleDraftInputChange);
  elements.conceptInput.addEventListener("input", handleDraftInputChange);
  elements.promptTypeSelect.addEventListener("change", handleDraftInputChange);
  elements.termInput.addEventListener("input", handleDraftInputChange);
  elements.definitionInput.addEventListener("input", handleDraftInputChange);
  elements.saveSetButton.addEventListener("click", handleSaveSet);
  elements.studySetButton.addEventListener("click", () => handleSaveAndRedirect("study"));
  elements.openSetButton.addEventListener("click", () => handleSaveAndRedirect("load"));
  elements.downloadSetButton.addEventListener("click", handleDownloadText);
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
  window.location.href = "./index.html";
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
