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
  progressTrack: document.querySelector(".progress-track"),
  progressFill: document.getElementById("progress-fill"),
  progressSegments: document.getElementById("progress-segments"),
  sessionBadge: document.getElementById("session-badge"),
  timerPanel: document.getElementById("timer-panel"),
  timerValue: document.getElementById("timer-value"),
  homeButton: document.getElementById("home-button"),
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
  sessionMode: "regular",
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
  returnPath: "./index.html",
  comprehensiveGroups: [],
  currentGroupIndex: 0,
  questionStreaks: new Map(),
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
  elements.homeButton.addEventListener("click", returnFromStudy);
  elements.autoAdvanceToggle.addEventListener("change", handleAutoAdvanceToggle);
  elements.backButton.addEventListener("click", goBackOneQuestion);
  elements.nextButton.addEventListener("click", advanceToNextCard);
  elements.studyAgainButton.addEventListener("click", restartSession);
  elements.doneButton.addEventListener("click", returnFromStudy);
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
  markSetAsUsed(matchingSet.id);
  startSessionFromInput({
    mode: normalizeSessionMode(pendingAction.type),
    returnPath: normalizeReturnPath(pendingAction.returnPath),
  });
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
  const sessionMode = normalizeSessionMode(options.mode);

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
    state.returnPath = normalizeReturnPath(options.returnPath, state.returnPath);
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
  state.queue = [];
  state.currentItem = null;
  state.currentQuestion = null;
  state.renderedOptions = [];
  state.answered = false;
  state.answerHistory = [];
  state.masteredIds = new Set();
  state.comprehensiveGroups = [];
  state.currentGroupIndex = 0;
  state.questionStreaks = new Map();
  state.stats = {
    attempts: 0,
    misses: 0,
  };
  state.timeRemainingSeconds = 0;
  state.quickLearnTimedOut = false;
  state.sessionStartedAt = 0;
  state.sessionCompletedAt = 0;
  state.sessionHistoryRecorded = false;

  if (state.sessionMode === "comprehensive") {
    state.comprehensiveGroups = buildComprehensiveGroups(state.questions);
    state.queue = buildQuestionQueue(getCurrentComprehensiveGroupQuestionIds());
    return;
  }

  state.queue = buildQuestionQueue(state.questions.map((question) => question.id), {
    includeRetryCount: state.sessionMode === "regular",
  });
}

function advanceToNextCard() {
  clearAutoAdvanceTimeout();

  if (state.queue.length === 0) {
    if (state.sessionMode === "comprehensive" && moveToNextComprehensiveGroup()) {
      renderProgress();
    } else {
      finishSession();
      return;
    }
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
    state.sessionMode === "regular" && Number(state.currentItem?.retryCount ?? 0) > 0;

  elements.questionCount.textContent = getQuestionCountLabel();
  elements.retryPill.hidden = !shouldShowRetry;
  elements.retryPill.style.display = shouldShowRetry ? "inline-flex" : "none";
  elements.conceptLabel.hidden = !state.currentQuestion.concept;
  elements.conceptLabel.textContent = state.currentQuestion.concept
    ? `Concept · ${state.currentQuestion.concept}`
    : "";
  elements.promptKindLabel.textContent = capitalizePromptType(state.currentQuestion.promptType);
  renderPromptContent(state.currentQuestion);
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

function renderPromptContent(question) {
  elements.definitionText.innerHTML = "";

  const promptLines = Array.isArray(question.promptLines) && question.promptLines.length > 0
    ? question.promptLines
    : String(question.promptText || question.definition || "")
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean);

  if (promptLines.length === 0) {
    return;
  }

  const [firstLine, ...remainingLines] = promptLines;
  const heading = document.createElement("p");
  heading.className = "definition-text-heading";
  heading.textContent = stripPromptBulletMarker(firstLine);
  elements.definitionText.appendChild(heading);

  let listElement = null;

  remainingLines.forEach((line) => {
    if (isPromptBulletLine(line)) {
      if (!listElement) {
        listElement = document.createElement("ul");
        listElement.className = "definition-text-list";
        elements.definitionText.appendChild(listElement);
      }

      const item = document.createElement("li");
      item.textContent = stripPromptBulletMarker(line);
      listElement.appendChild(item);
      return;
    }

    listElement = null;
    const paragraph = document.createElement("p");
    paragraph.className = "definition-text-line";
    paragraph.textContent = line;
    elements.definitionText.appendChild(paragraph);
  });
}

function isPromptBulletLine(line) {
  return /^(\*|-)\s+/.test(line);
}

function stripPromptBulletMarker(line) {
  return String(line || "").replace(/^(\*|-)\s+/, "");
}

function handleAnswer(selectedIndex) {
  if (state.answered) {
    return;
  }

  state.answerHistory.push(captureAnswerSnapshot());
  state.answered = true;
  state.stats.attempts += 1;

  const buttons = Array.from(elements.optionsGrid.querySelectorAll(".option-button"));
  const correctIndex = state.currentQuestion.options.findIndex((option) => option.isCorrect);
  const wasCorrect = selectedIndex === correctIndex;
  const currentQuestionId = state.currentQuestion.id;
  let questionJustMastered = false;
  let currentStreak = 0;

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
    if (state.sessionMode === "comprehensive") {
      currentStreak = (state.questionStreaks.get(currentQuestionId) || 0) + 1;
      state.questionStreaks.set(currentQuestionId, currentStreak);
      questionJustMastered = currentStreak >= 2;

      if (questionJustMastered) {
        state.masteredIds.add(currentQuestionId);
      } else {
        requeueCurrentItemRandomly();
      }
    } else {
      state.masteredIds.add(currentQuestionId);
    }

    elements.feedbackText.textContent = getCorrectFeedback({
      retryCount: state.currentItem.retryCount,
      questionJustMastered,
      currentStreak,
    });
    elements.feedbackText.classList.add("success");
  } else {
    state.stats.misses += 1;

    if (state.sessionMode === "regular") {
      state.queue.push({
        questionId: state.currentQuestion.id,
        retryCount: state.currentItem.retryCount + 1,
      });
    } else if (state.sessionMode === "comprehensive") {
      state.questionStreaks.set(currentQuestionId, 0);
      requeueCurrentItemRandomly();
    }

    const correctAnswer = state.currentQuestion.options[correctIndex].text;
    elements.feedbackText.textContent = getIncorrectFeedback(correctAnswer);
    elements.feedbackText.classList.add("error");
  }

  if (isSessionComplete()) {
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

function getCorrectFeedback({ retryCount = 0, questionJustMastered = false, currentStreak = 0 } = {}) {
  if (state.sessionMode === "quickLearn") {
    return state.autoAdvanceEnabled
      ? "Correct. Moving to the next question..."
      : "Correct.";
  }

  if (state.sessionMode === "comprehensive") {
    const currentGroupNumber = state.currentGroupIndex + 1;
    const nextGroupNumber = currentGroupNumber + 1;

    if (questionJustMastered && state.queue.length === 0 && hasNextComprehensiveGroup()) {
      return state.autoAdvanceEnabled
        ? `Correct again. Group ${currentGroupNumber} is mastered. Moving to Group ${nextGroupNumber}...`
        : `Correct again. Group ${currentGroupNumber} is mastered.`;
    }

    if (questionJustMastered) {
      return state.autoAdvanceEnabled
        ? "Correct again. That card is mastered. Moving to the next card..."
        : "Correct again. That card is mastered.";
    }

    if (currentStreak === 1) {
      return state.autoAdvanceEnabled
        ? "Correct. Get this card right one more time to master it, then we'll move on."
        : "Correct. Get this card right one more time to master it.";
    }

    return state.autoAdvanceEnabled ? "Correct. Moving on..." : "Correct.";
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

  if (state.sessionMode === "comprehensive") {
    return state.autoAdvanceEnabled
      ? `Not quite. The correct answer is "${correctAnswer}". This card's streak resets, then we'll move on.`
      : `Not quite. The correct answer is "${correctAnswer}". This card's streak resets.`;
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
    renderLinearProgress(percent);
  } else if (state.sessionMode === "comprehensive") {
    const currentGroup = getCurrentComprehensiveGroup();
    const currentGroupSize = currentGroup ? currentGroup.questionIds.length : 0;
    const groupMasteredCount = getCurrentComprehensiveMasteredCount();
    elements.progressLabel.textContent = `Group ${state.currentGroupIndex + 1} of ${state.comprehensiveGroups.length} • ${groupMasteredCount} / ${currentGroupSize} mastered`;
    elements.queueLabel.textContent = `${activeCards} active card${activeCards === 1 ? "" : "s"} left in this group • each card needs 2 in a row`;
    renderComprehensiveProgress();
  } else {
    const mastered = state.masteredIds.size;
    percent = totalQuestions === 0 ? 0 : (mastered / totalQuestions) * 100;
    elements.progressLabel.textContent = `${mastered} / ${totalQuestions} mastered`;
    elements.queueLabel.textContent = `${activeCards} card${activeCards === 1 ? "" : "s"} still in circulation`;
    renderLinearProgress(percent);
  }
}

function renderLinearProgress(percent) {
  elements.progressTrack.classList.remove("is-segmented");
  elements.progressFill.hidden = false;
  elements.progressSegments.hidden = true;
  elements.progressSegments.innerHTML = "";
  elements.progressFill.style.width = `${percent}%`;
}

function renderComprehensiveProgress() {
  elements.progressTrack.classList.add("is-segmented");
  elements.progressFill.hidden = true;
  elements.progressSegments.hidden = false;
  elements.progressSegments.innerHTML = "";

  state.comprehensiveGroups.forEach((group, index) => {
    const segment = document.createElement("div");
    segment.className = "progress-segment";
    segment.style.flexGrow = String(group.questionIds.length);

    const fill = document.createElement("div");
    fill.className = "progress-segment-fill";

    const masteredCount = group.questionIds.filter((questionId) => state.masteredIds.has(questionId)).length;
    const percent = group.questionIds.length === 0 ? 0 : (masteredCount / group.questionIds.length) * 100;

    if (index < state.currentGroupIndex) {
      fill.classList.add("is-mastered");
      fill.style.width = "100%";
    } else if (index === state.currentGroupIndex) {
      fill.classList.add(percent >= 100 ? "is-mastered" : "is-active");
      fill.style.width = `${percent}%`;
    } else {
      fill.style.width = "0%";
    }

    segment.appendChild(fill);
    elements.progressSegments.appendChild(segment);
  });
}

function buildQuestionQueue(questionIds, options = {}) {
  const { includeRetryCount = false } = options;

  return shuffleArray(
    questionIds.map((questionId) => ({
      questionId,
      retryCount: includeRetryCount ? 0 : 0,
    })),
  );
}

function buildComprehensiveGroups(questions) {
  if (questions.length === 0) {
    return [];
  }

  const groupCount = Math.max(1, Math.ceil(questions.length / 20));
  const baseSize = Math.floor(questions.length / groupCount);
  const remainder = questions.length % groupCount;
  const groups = [];
  let cursor = 0;

  for (let index = 0; index < groupCount; index += 1) {
    const size = baseSize + (index < remainder ? 1 : 0);
    const groupQuestions = questions.slice(cursor, cursor + size);
    groups.push({
      index,
      questionIds: groupQuestions.map((question) => question.id),
    });
    cursor += size;
  }

  return groups;
}

function getCurrentComprehensiveGroup() {
  return state.comprehensiveGroups[state.currentGroupIndex] || null;
}

function getCurrentComprehensiveGroupQuestionIds() {
  return getCurrentComprehensiveGroup()?.questionIds || [];
}

function getCurrentComprehensiveMasteredCount() {
  return getCurrentComprehensiveGroupQuestionIds().filter((questionId) =>
    state.masteredIds.has(questionId),
  ).length;
}

function hasNextComprehensiveGroup() {
  return state.currentGroupIndex < state.comprehensiveGroups.length - 1;
}

function moveToNextComprehensiveGroup() {
  if (state.sessionMode !== "comprehensive" || !hasNextComprehensiveGroup()) {
    return false;
  }

  state.currentGroupIndex += 1;
  state.queue = buildQuestionQueue(getCurrentComprehensiveGroupQuestionIds());
  return true;
}

function requeueCurrentItemRandomly() {
  if (!state.currentItem) {
    return;
  }

  const insertionIndex = Math.floor(Math.random() * (state.queue.length + 1));
  state.queue.splice(insertionIndex, 0, {
    questionId: state.currentItem.questionId,
    retryCount: state.currentItem.retryCount,
  });
}

function isSessionComplete() {
  if (state.queue.length > 0) {
    return false;
  }

  if (state.sessionMode === "comprehensive") {
    return !hasNextComprehensiveGroup();
  }

  return true;
}

function captureAnswerSnapshot() {
  return {
    queue: state.queue.map((item) => ({ ...item })),
    currentItem: state.currentItem ? { ...state.currentItem } : null,
    currentQuestionId: state.currentQuestion?.id || "",
    renderedOptions: state.renderedOptions.map((option) => ({ ...option })),
    masteredIds: Array.from(state.masteredIds),
    questionStreaks: Array.from(state.questionStreaks.entries()),
    currentGroupIndex: state.currentGroupIndex,
    stats: {
      ...state.stats,
    },
    sessionCompletedAt: state.sessionCompletedAt,
  };
}

function restoreAnswerSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }

  state.queue = snapshot.queue.map((item) => ({ ...item }));
  state.currentItem = snapshot.currentItem ? { ...snapshot.currentItem } : null;
  state.currentQuestion = state.questionBank.get(snapshot.currentQuestionId) || null;
  state.renderedOptions = snapshot.renderedOptions.map((option) => ({ ...option }));
  state.masteredIds = new Set(snapshot.masteredIds);
  state.questionStreaks = new Map(snapshot.questionStreaks);
  state.currentGroupIndex = snapshot.currentGroupIndex;
  state.stats = {
    ...snapshot.stats,
  };
  state.sessionCompletedAt = snapshot.sessionCompletedAt;
  state.answered = false;
  renderProgress();
  renderCurrentCard();
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
  } else if (state.sessionMode === "comprehensive") {
    elements.finishTitle.textContent = "Comprehensive study complete.";
    summary =
      misses === 0
        ? `You cleared all ${state.comprehensiveGroups.length} groups and mastered every card with perfect streaks.`
        : `You cleared all ${state.comprehensiveGroups.length} groups, mastered all ${totalQuestions} cards, and worked through ${misses} reset${misses === 1 ? "" : "s"} along the way.`;
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
  if (state.answered || state.answerHistory.length === 0) {
    return;
  }

  clearAutoAdvanceTimeout();
  const previousSnapshot = state.answerHistory.pop();
  restoreAnswerSnapshot(previousSnapshot);
}

function restartSession() {
  clearAutoAdvanceTimeout();

  if (state.sourceQuestions.length === 0 && state.questions.length === 0) {
    returnFromStudy();
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

function returnFromStudy() {
  clearAutoAdvanceTimeout();
  clearQuickLearnTimer();

  if (normalizeReturnPath(state.returnPath) !== "./index.html") {
    window.location.href = state.returnPath;
    return;
  }

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
  updateSessionActionButtons();
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
  const activeMode = state.sessionMode;
  const history = state.attemptHistory
    .filter((entry) => (entry.sessionMode || "regular") === activeMode)
    .slice(-10);
  elements.historyChart.innerHTML = "";
  elements.historyTitle.textContent = `Last 10 ${getSessionModeLabel(activeMode)} sessions`;

  if (history.length === 0) {
    elements.historySummary.textContent = "";
    elements.historyEmpty.textContent =
      activeMode === "quickLearn"
        ? "No Quick Learn data yet. Finish a quick session and your score trend will appear here."
        : activeMode === "comprehensive"
          ? "No Comprehensive data yet. Finish a comprehensive session and your score trend will appear here."
        : "No Regular data yet. Finish a regular study session and your score trend will appear here.";
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
      : activeMode === "comprehensive"
        ? "Score = correct answers divided by total answer attempts. The line runs oldest to newest, with total time spent shown under each Comprehensive session."
      : "Score = correct answers divided by total answer attempts. The line runs oldest to newest, with time spent shown under each Regular session.";
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
      createRecentActionButton("Study", "button button-quick button-compact", () =>
        launchSavedSet(set.id),
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

async function launchSavedSet(setId) {
  const matchingSet = state.savedSets.find((set) => set.id === setId);
  if (!matchingSet) {
    showSetupMessage("That saved set is no longer available on this device.", true);
    state.savedSets = RecallLoopStore.loadSavedSets();
    renderRecentSets();
    return;
  }

  const selectedMode = await RecallLoopStore.promptForStudyMode({
    title: `Study "${matchingSet.name}"`,
    description: "Choose how you want to work through this deck before the session begins.",
  });

  if (!selectedMode) {
    return;
  }

  loadSetIntoEditor(matchingSet, "saved");
  markSetAsUsed(setId);
  startSessionFromInput({
    mode: selectedMode,
    returnPath: "./index.html",
  });
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
  const width = Math.max(440, history.length * 92 + 92);
  const height = 248;
  const paddingLeft = 56;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 84;
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
      const pointValueY = point.y <= paddingTop + 14 ? point.y + 18 : point.y - 12;
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
          <text class="history-point-value" x="${point.x}" y="${pointValueY}" text-anchor="middle">${formatPercent(
            point.entry.accuracy,
          )}</text>
          <text class="history-axis-label history-axis-label-bottom" x="${point.x}" y="${height - 40}" text-anchor="middle">
            <tspan x="${point.x}" dy="0">${escapeSvgText(metric.value)}</tspan>
            <tspan class="history-axis-label-detail" x="${point.x}" dy="14">${escapeSvgText(metric.label)}</tspan>
            <tspan class="history-axis-label-session" x="${point.x}" dy="14">S${index + 1}</tspan>
          </text>
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

function syncNextButton() {
  if (state.sessionMode === "comprehensive" && state.queue.length === 0 && hasNextComprehensiveGroup()) {
    elements.nextButton.textContent = "Next Group";
  } else {
    elements.nextButton.textContent = state.queue.length === 0 ? "Finish" : "Next";
  }

  elements.nextButton.hidden = false;
}

function syncSessionChrome() {
  const isQuickLearn = state.sessionMode === "quickLearn";
  const isComprehensive = state.sessionMode === "comprehensive";
  elements.sessionBadge.hidden = !isQuickLearn && !isComprehensive;
  elements.timerPanel.hidden = !isQuickLearn;
  elements.timerPanel.classList.toggle("is-warning", false);
  elements.sessionBadge.classList.toggle("pill-quick", isQuickLearn);
  updateSessionActionButtons();

  if (isQuickLearn) {
    elements.sessionBadge.textContent = "Quick Learn";
    updateTimerDisplay();
  } else if (isComprehensive) {
    elements.sessionBadge.textContent = "Comprehensive";
  }
}

function updateSessionActionButtons() {
  const inStudyView = !elements.studyView.hidden;
  elements.homeButton.hidden = !inStudyView;
  elements.homeButton.textContent = "Return";
  elements.doneButton.textContent = "Return";
}

function updateTimerDisplay() {
  if (state.sessionMode !== "quickLearn") {
    return;
  }

  elements.timerValue.textContent = formatTimerValue(state.timeRemainingSeconds);
  elements.timerPanel.classList.toggle("is-warning", state.timeRemainingSeconds > 0 && state.timeRemainingSeconds <= 30);
}

function normalizeSessionMode(mode) {
  if (mode === "quickLearn") {
    return "quickLearn";
  }

  if (mode === "comprehensive") {
    return "comprehensive";
  }

  return "regular";
}

function normalizeReturnPath(path, fallback = "./index.html") {
  return typeof path === "string" && path.trim() ? path.trim() : fallback;
}

function getQuestionCountLabel() {
  const questionNumber = state.stats.attempts + 1;

  if (state.sessionMode === "quickLearn") {
    return `Question ${questionNumber} of ${state.questions.length}`;
  }

  if (state.sessionMode === "comprehensive") {
    const currentGroup = getCurrentComprehensiveGroup();
    const currentGroupSize = currentGroup ? currentGroup.questionIds.length : 0;
    return `Group ${state.currentGroupIndex + 1} • ${getCurrentComprehensiveMasteredCount()} / ${currentGroupSize}`;
  }

  return `Question ${questionNumber}`;
}

function formatTimerValue(totalSeconds) {
  return formatClock(totalSeconds);
}

function getSessionModeLabel(sessionMode) {
  if (sessionMode === "quickLearn") {
    return "Quick Learn";
  }

  if (sessionMode === "comprehensive") {
    return "Comprehensive";
  }

  return "Regular";
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
