// helper functions
function isAndroid() {
  return (
    window.Capacitor &&
    typeof window.Capacitor.getPlatform === "function" &&
    window.Capacitor.getPlatform() === "android"
  );
}

// export fitur
window.exportNotes = async function () {
  try {
    const notes = getNotes();
    const dataStr = JSON.stringify(notes, null, 2);

    console.log("Platform:", window.Capacitor?.getPlatform?.());

    // web
    if (!isAndroid()) {
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Keepit Backup ${Date.now()}.json`;
      a.click();

      URL.revokeObjectURL(url);
      alert("Export success");
      return;
    }

    // android
    const Plugins = window.Capacitor.Plugins || {};
    const Filesystem = Plugins.Filesystem;
    const Share = Plugins.Share;

    if (!Filesystem || !Share) {
      throw new Error("Filesystem / Share plugin not imported");
    }

    console.log("Export Android mode");

    const fileName = `Keepit Backup ${Date.now()}.json`;

    const result = await Filesystem.writeFile({
      path: fileName,
      data: dataStr,
      directory: "DOCUMENTS", 
      encoding: "utf8"        
    });

    console.log("File saved:", result.uri);

    await Share.share({
      title: "Backup Keepit",
      text: "File backup Keepit",
      url: result.uri
    });

    alert("Notes Exported. Please check your share options to save the file.");

  } catch (err) {
    console.error("Export Error:", err);
    alert(
      "export failed\n\n" +
      (err?.message || JSON.stringify(err, null, 2))
    );
  }
};

// import fitur
window.importNotes = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error("Wrong format, import .json file backup format");

      saveNotes(data);
      alert("Notes has been restored");
    } catch (err) {
      alert("Backup file is not valid");
    }
  };
  reader.readAsText(file);
};


// clear data
window.clearAllData = function () {
  if (!confirm("All notes will be permanently deleted")) return;
  localStorage.removeItem("keepit_notes");
  alert("All data has been deleted");
};

// keyboard aware
// const { Keyboard } = window.Capacitor.Plugins;

// Keyboard.addListener('keyboardWillShow', (info) => {
//   const toolbar = document.querySelector('.toolbar-container');
//   if (toolbar) {
//     toolbar.style.bottom = info.keyboardHeight + 'px';
//   }
// });

// Keyboard.addListener('keyboardWillHide', () => {
//   const toolbar = document.querySelector('.toolbar-container');
//   if (toolbar) {
//     toolbar.style.bottom = '0px';
//   }
// });