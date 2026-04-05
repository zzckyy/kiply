// params
const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");


// dom
const DOM = {
  title: document.getElementById("titleInput"),
  text: document.getElementById("textInput")
};


// variable state
let notes = getNotes();
let note = null;
let saveTimer = null;

// load note
function loadNote() {
  if (!noteId || !DOM.title || !DOM.text) return;

  note = notes.find(n => n.id === noteId);
  if (!note) return;

  DOM.title.value = note.title || "";
  DOM.text.innerHTML = note.text || "";
}

const editor = document.getElementById("textInput");

  editor.addEventListener("click", () => {
  editor.focus();
});

loadNote();


// autosave function
function autoSave() {
  if (!DOM.title || !DOM.text) return;

  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    const title = DOM.title.value.trim();
    const text = DOM.text.innerHTML.trim();

    // kalau kosong semua, ga usah simpan
    if (!title && !text) return;
    //jangan simpan tanpa title
    if (!title) return; // title kosong = gausah simpen

    // note baru
    if (!note) {
      noteId = crypto.randomUUID();
      note = {
        id: noteId,
        title: "",
        text: "",
        pinned: false,
        trashed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      notes.unshift(note);
    }

    note.title = title;
    note.text = text;
    note.updatedAt = Date.now();

    saveNotes(notes);
  }, 300);
}


// toolbar formatting
function format(command, value = null) {
  if (!DOM.text) return;

  DOM.text.focus();

  if (value !== null) {
    document.execCommand(command, false, value);
  } else {
    document.execCommand(command);
  }

  autoSave();
}


// autosave on title and text change
DOM.title?.addEventListener("input", () => {
  autoSave();
});

DOM.text?.addEventListener("input", () => {
  autoSave();
});
