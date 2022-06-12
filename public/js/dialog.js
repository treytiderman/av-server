// Dialogs close by clicking the backdrop
const dialogs = document.querySelectorAll("dialog");
dialogs.forEach((dialog) => {
  dialog.addEventListener("mousedown", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  })
});

// Open a dialog by ID
function dialogOpen(id) {
  const dialog = document.getElementById(id);
  dialog.showModal();
}

// Close a dialog by ID
function dialogClose(id) {
  const dialog = document.getElementById(id);
  dialog.close();
}
