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

    const answerStartIndex = lines.findIndex(isAnswerBlockStartLine);
    const definitionLines =
      answerStartIndex >= 0 ? lines.slice(0, answerStartIndex) : lines;
    const optionLines =
      answerStartIndex >= 0 ? lines.slice(answerStartIndex) : [];

    if (definitionLines.length === 0) {
      throw new Error(`Card ${blockIndex + 1} is missing its definition text.`);
    }

    if (optionLines.length < 2) {
      throw new Error(
        `Card ${blockIndex + 1} needs at least 2 answer choices, and the first answer should start with "- * ".`,
      );
    }

    const { concept, promptLines } = extractConcept(definitionLines, blockIndex);
    const { promptType, promptText, promptLines: normalizedPromptLines } = extractPromptType(
      promptLines,
      blockIndex,
    );

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
      promptLines: normalizedPromptLines,
      promptText,
      definition: promptText,
      options,
    };
  }

  function isAnswerBlockStartLine(line) {
    return /^-\s*(\*|\[correct\])\s+/i.test(line);
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
      const promptLines = definitionLines;
      return {
        promptType: "definition",
        promptLines,
        promptText: promptLines.join("\n"),
      };
    }

    const promptType = match[1].toLowerCase();
    const firstPromptLine = match[2].trim();
    const promptLines = [firstPromptLine, ...restLines].filter(Boolean);

    if (promptLines.length === 0) {
      throw new Error(`Card ${blockIndex + 1} is missing text after "${promptType}:".`);
    }

    return {
      promptType,
      promptLines,
      promptText: promptLines.join("\n"),
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
    const promptLines = splitPromptTextLines(card.promptText);
    const [firstPromptLine = "", ...restPromptLines] = promptLines;
    const firstLine = `${card.promptType}: ${firstPromptLine}`;
    const orderedOptions = orderOptionsForStorage(card.options);
    const optionLines = orderedOptions.map((option) =>
      option.isCorrect ? `- * ${option.text}` : `- ${option.text}`,
    );

    return [conceptLine, firstLine, ...restPromptLines, ...optionLines].filter(Boolean).join("\n");
  }

  function splitPromptTextLines(promptText) {
    return String(promptText || "")
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function orderOptionsForStorage(options) {
    const correctOption = options.find((option) => option.isCorrect);
    const incorrectOptions = options.filter((option) => !option.isCorrect);

    return correctOption ? [correctOption, ...incorrectOptions] : [...options];
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
      sessionMode:
        entry?.sessionMode === "quickLearn"
          ? "quickLearn"
          : entry?.sessionMode === "comprehensive"
            ? "comprehensive"
            : "regular",
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

  function promptForStudyMode(options = {}) {
    if (typeof document === "undefined" || !document.body) {
      return Promise.resolve(null);
    }

    const {
      title = "Choose a study mode",
      description = "Pick the pace that fits this study session best.",
    } = options;

    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";

      const card = document.createElement("div");
      card.className = "modal-card mode-picker-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "true");
      card.setAttribute("aria-labelledby", "study-mode-title");

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "modal-close-button";
      closeButton.setAttribute("aria-label", "Close study mode picker");
      closeButton.textContent = "×";
      closeButton.addEventListener("click", () => close(null));

      const kicker = document.createElement("p");
      kicker.className = "section-kicker";
      kicker.textContent = "Study mode";

      const heading = document.createElement("h2");
      heading.id = "study-mode-title";
      heading.textContent = title;

      const copy = document.createElement("p");
      copy.className = "guide-copy";
      copy.textContent = description;

      const optionGrid = document.createElement("div");
      optionGrid.className = "mode-picker-grid";

      const optionConfigs = [
        {
          mode: "regular",
          eyebrow: "Regular",
          title: "Steady circulation",
          copy:
            "Use the classic study flow: missed cards recycle through one shared queue until the set is cleared.",
          className: "mode-picker-option mode-picker-option-regular",
        },
        {
          mode: "comprehensive",
          eyebrow: "Comprehensive",
          title: "Group mastery",
          copy:
            "Study the deck in three groups, with the slightly larger groups first. Each card stays active until you answer it correctly twice in a row.",
          className: "mode-picker-option mode-picker-option-comprehensive",
        },
        {
          mode: "quickLearn",
          eyebrow: "Quick Learn",
          title: "Timed sprint",
          copy:
            "Study a fast randomized subset with the countdown timer and keep moving from question to question.",
          className: "mode-picker-option mode-picker-option-quick",
        },
      ];

      optionConfigs.forEach((config) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = config.className;
        button.addEventListener("click", () => close(config.mode));

        const optionEyebrow = document.createElement("span");
        optionEyebrow.className = "mode-picker-option-eyebrow";
        optionEyebrow.textContent = config.eyebrow;

        const optionTitle = document.createElement("span");
        optionTitle.className = "mode-picker-option-title";
        optionTitle.textContent = config.title;

        const optionCopy = document.createElement("span");
        optionCopy.className = "mode-picker-option-copy";
        optionCopy.textContent = config.copy;

        button.append(optionEyebrow, optionTitle, optionCopy);
        optionGrid.appendChild(button);
      });

      card.append(closeButton, kicker, heading, copy, optionGrid);
      overlay.appendChild(card);
      document.body.appendChild(overlay);

      function handleOverlayClick(event) {
        if (event.target === overlay) {
          close(null);
        }
      }

      function handleKeydown(event) {
        if (event.key === "Escape") {
          close(null);
        }
      }

      function close(result) {
        overlay.removeEventListener("click", handleOverlayClick);
        window.removeEventListener("keydown", handleKeydown);
        overlay.remove();
        resolve(result);
      }

      overlay.addEventListener("click", handleOverlayClick);
      window.addEventListener("keydown", handleKeydown);
    });
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
    promptForStudyMode,
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
