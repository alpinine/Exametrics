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
