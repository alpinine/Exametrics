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
