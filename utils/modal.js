// utils/modal.js
import { showAppToast } from "./notify.js";

// ── Carga contenido desde /content/*.html y abre el howModal ──
async function loadModal(title, file) {
  const res = await fetch(`/content/${file}`);
  const html = await res.text();
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalContent").innerHTML = html;
  clearModalActions();
  document.getElementById("howModal").classList.add("active");
}

// ── Abre con contenido externo ──
export function openHow()        { loadModal("How it Works",       "how.html"); }
export function openTerms()      { loadModal("Terms & Conditions", "terms.html"); }
export function openPrivacy()    { loadModal("Privacy Policy",     "privacy.html"); }
export function openAbout()      { loadModal("About",              "about.html"); }

// ── Disclaimer: abre el modal dedicado #disclaimer ──
export function openDisclaimer() {
  loadModal("Disclaimer", "disclaimer.html");
}

export function openInitialDisclaimer() {
  document.getElementById("disclaimer").classList.add("active");
}

export function closeHow() {
  document.getElementById("howModal").classList.remove("active");
}

export function closeDisclaimer() {
  document.getElementById("disclaimer").classList.remove("active");
}

function clearModalActions() {
  const actions = document.getElementById("modalActions");
  if (actions) actions.innerHTML = "";
}

export function showModalError(message) {
  const el = document.getElementById("modalError");
  if (!el) {
    showAppToast(message, "error");
    return;
  }
  el.textContent = message;
  el.style.display = message ? "block" : "none";
  if (message) showAppToast(message, "error");
}

export function clearModalError() {
  showModalError("");
}

export function setModalLoading(message) {
  document.getElementById("modalTitle").innerText = "Please wait";
  document.getElementById("modalContent").innerHTML = `
    <div id="modalError" style="display:none"></div>
    <div class="modal-loading">
      <div class="modal-loading-spinner">⏳</div>
      <p>${message}</p>
    </div>
  `;
  clearModalActions();
}

export function openActionModal({ title, content, confirmText = "Confirm", onConfirm, hideConfirm = false }) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalContent").innerHTML = `
    <div id="modalError" style="display:none"></div>
    ${content}
  `;

  const actions = document.getElementById("modalActions");
  if (hideConfirm) {
    clearModalActions();
  } else {
    actions.innerHTML = `
      <button type="button" id="confirmActionBtn" class="modal-primary-btn">${confirmText}</button>
    `;

    document.getElementById("confirmActionBtn").onclick = async () => {
      const btn = document.getElementById("confirmActionBtn");
      btn.disabled = true;
      try {
        const keepOpen = await onConfirm();
        if (keepOpen !== false) closeHow();
      } catch (err) {
        console.error(err);
        const message = err?.message || "Something went wrong. Please try again.";
        showModalError(message);
      } finally {
        if (document.getElementById("confirmActionBtn")) {
          btn.disabled = false;
        }
      }
    };
  }

  document.getElementById("howModal").classList.add("active");
}

// ── Emergency Modal — nivel 1: elige acción ──
export function openEmergencyModal() {
  document.getElementById("modalTitle").innerText = "🔴 Emergency Controls";
  document.getElementById("modalContent").innerHTML = `
    <p style="color:#8b949e;font-size:14px;margin:0 0 20px;">
      Select an emergency action. Each action will require your signature in Radix Wallet.
    </p>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <button onclick="closeHow(); freeze();"
        style="padding:14px;border-radius:10px;background:#1a1a2e;border:1px solid #444;
               color:white;font-size:15px;cursor:pointer;text-align:left;">
        🧊 <strong>Freeze Agent</strong>
        <span style="display:block;font-size:12px;color:#8b949e;margin-top:4px;">
          Lock all outgoing activity of the agent wallet.
        </span>
      </button>
      <button onclick="closeHow(); unfreeze();"
        style="padding:14px;border-radius:10px;background:#1a1a2e;border:1px solid #444;
               color:white;font-size:15px;cursor:pointer;text-align:left;">
        🔓 <strong>Unfreeze Agent</strong>
        <span style="display:block;font-size:12px;color:#8b949e;margin-top:4px;">
          Restore all outgoing activity of the agent wallet.
        </span>
      </button>
      <button onclick="closeHow(); emergencyWithdraw();"
        style="padding:14px;border-radius:10px;background:#2d0000;border:1px solid #c0392b;
               color:#ff6b6b;font-size:15px;cursor:pointer;text-align:left;">
        💸 <strong>Emergency Withdraw</strong>
        <span style="display:block;font-size:12px;color:#8b949e;margin-top:4px;">
          Recover ALL funds from the contract directly to your wallet.
        </span>
      </button>
    </div>
  `;
  clearModalActions();
  document.getElementById("howModal").classList.add("active");
}
