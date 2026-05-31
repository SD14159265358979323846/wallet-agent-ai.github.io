// Fixed page-level notifications (always visible, not inside scrollable modal)

let toastTimer = null;

export function showAppToast(message, type = "info") {
  if (!message) return;

  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    document.body.appendChild(toast);
  }

  toast.className = `app-toast app-toast-${type}`;
  toast.textContent = message;
  toast.hidden = false;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, type === "error" ? 12000 : 6000);
}

export function clearAppToast() {
  const toast = document.getElementById("app-toast");
  if (toast) toast.hidden = true;
}
