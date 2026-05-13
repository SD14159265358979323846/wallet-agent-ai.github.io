import {
  RadixDappToolkit,
  DataRequestBuilder,
} from "@radixdlt/radix-dapp-toolkit";


import { CONFIG } from "./config.js";
import { renderAccountSelector } from "./utils/accountSelector.js";
import { APP_STATE } from "./utils/state.js";
import { accountHasAgent } from "./utils/nft.js"; 

// modal de acciones 
import { freeze } from "./actions/freeze.js";

import { unfreeze } from "./actions/unfreeze.js";

import { deposit } from "./actions/deposit.js";
window.deposit = deposit;

import { instantiate } from "./actions/instantiate.js";
window.instantiate = instantiate;

import { renewBadge } from "./actions/renewBadge.js";
window.renewBadge = renewBadge;

import { issueBadge } from "./actions/issueBadge.js";
window.issueBadge = issueBadge;

import { revokeBadge } from "./actions/revokeBadge.js";
window.revokeBadge = revokeBadge;

import { increaseLimits } from "./actions/increaseLimits.js";
window.increaseLimits = increaseLimits;

import { addAsset } from "./actions/addAsset.js";
window.addAsset = addAsset;

import { resetDailyCap } from "./actions/resetDailyCap.js";
window.resetDailyCap = resetDailyCap;

import { viewBalances } from "./actions/viewBalances.js";
window.viewBalances = viewBalances;

import { getPendingTransfer, updatePendingCard, checkAndOpenPending } from "./actions/pending.js";

window.checkAndOpenPending = checkAndOpenPending;




import { addWhitelist, removeWhitelist } from "./actions/whitelist.js";
window.addWhitelist    = addWhitelist;
window.removeWhitelist = removeWhitelist;

window.toggleFreeze = function() {
  openActionModal({
    title: "Freeze / Unfreeze",
    hideConfirm: true,
    content: `
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
        <button id="btn-freeze" style="padding:12px;border-radius:8px;background:#c0392b;color:white;border:none;cursor:pointer;font-size:15px;font-weight:600;">
          ❄️ Freeze — Lock all activity
        </button>
        <button id="btn-unfreeze" style="padding:12px;border-radius:8px;background:#27ae60;color:white;border:none;cursor:pointer;font-size:15px;font-weight:600;">
          ✅ Unfreeze — Restore operations
        </button>
      </div>
    `,
  });

  setTimeout(() => {
    document.getElementById("btn-freeze")?.addEventListener("click", () => {
      closeHow();
      freeze();
    });
    document.getElementById("btn-unfreeze")?.addEventListener("click", () => {
      closeHow();
      unfreeze();
    });
  }, 50);
};

window.toggleWhitelist = function() {
  openActionModal({
    title: "Whitelist",
    hideConfirm: true,
    content: `
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px;">
        <button id="btn-add-wl" style="padding:12px;border-radius:8px;background:#276ff5;color:white;border:none;cursor:pointer;font-size:15px;font-weight:600;">
          ➕ Add wallet to whitelist
        </button>
        <button id="btn-remove-wl" style="padding:12px;border-radius:8px;background:#7c4dff;color:white;border:none;cursor:pointer;font-size:15px;font-weight:600;">
          ➖ Remove wallet from whitelist
        </button>
      </div>
    `,
  });

  setTimeout(() => {
    document.getElementById("btn-add-wl")?.addEventListener("click", () => {
      closeHow();
      addWhitelist();
    });
    document.getElementById("btn-remove-wl")?.addEventListener("click", () => {
      closeHow();
      removeWhitelist();
    });
  }, 50);
};







//modal general 
import { 
  openHow, 
  openAbout, 
  openTerms, 
  openDisclaimer, 
  openPrivacy, 
  closeHow, 
  closeDisclaimer,
  openActionModal  
} from "./utils/modal.js";

// Exponer al window para los onclick del HTML
window.openHow = openHow;
window.openAbout = openAbout;
window.openTerms = openTerms;
window.openDisclaimer = openDisclaimer;
window.openPrivacy = openPrivacy;
window.closeHow = closeHow;
window.closeDisclaimer = closeDisclaimer;
window.closeModal = closeHow; 

// =========================
// INIT TOOLKIT
// =========================

export const rdt = RadixDappToolkit({
  dAppDefinitionAddress: CONFIG.DAPP_DEFINITION,

  networkId: CONFIG.NETWORK_ID,

  applicationName: CONFIG.APP_NAME,

  applicationVersion: CONFIG.APP_VERSION,
});

// Pedir cuentas al usuario
rdt.walletApi.setRequestData(
  DataRequestBuilder.accounts().atLeast(1)
);


// Pedir datos al usuario
rdt.walletApi.walletData$.subscribe((walletData) => {
  APP_STATE.walletData = walletData; 
  if (
    walletData &&
    walletData.accounts &&
    walletData.accounts.length > 0
  ) {
    renderAccountSelector(walletData.accounts);
  }
});





function startPendingPolling() {
  setInterval(async () => {
    if (!APP_STATE.hasAgent || !APP_STATE.componentAddress) return;
    const pending = await getPendingTransfer();
    updatePendingCard(pending);
  }, 15000);
}

startPendingPolling();



