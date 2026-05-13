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
  elements.openSetButton.addEventListener("click", () => saveCurrentSet("load"));
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
    return;
  }

  showMessage(`Saved "${result.set.name}" to your local set library.`);
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

function showMessage(message, isError = false) {
  elements.message.textContent = message;
  elements.message.classList.toggle("error", isError);
}
