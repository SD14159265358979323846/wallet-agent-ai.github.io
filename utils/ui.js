export function updateInstantiateButton(hasAgent) {

  const instantiateBox =
    document.getElementById("instantiate-card");

  if (!instantiateBox) return;

  if (hasAgent) {

    instantiateBox.classList.add("disabled");

    instantiateBox.title =
      "This account already owns an Agent";

  } else {

    instantiateBox.classList.remove("disabled");

    instantiateBox.title = "";
  }
}
export function updateUI(hasAgent, hasBalance, hasWhitelist) {
  const ownerLocked   = document.getElementById("owner-locked");
  const freezeRow     = document.getElementById("freeze-row");
  const controlsRow1  = document.getElementById("controls-row-1");
  const controlsRow2  = document.getElementById("controls-row-2");
  const depositCard   = document.getElementById("deposit-card");
  const whitelistCard = document.getElementById("whitelist-card");

  if (!hasAgent) {
    depositCard?.classList.add("disabled");
    whitelistCard?.classList.add("disabled");
    ownerLocked?.classList.remove("hidden");
    freezeRow?.classList.add("hidden");
    controlsRow1?.classList.add("hidden");
    controlsRow2?.classList.add("hidden");
  } else if (hasAgent && !hasBalance) {
    depositCard?.classList.remove("disabled");
    whitelistCard?.classList.add("disabled");
    ownerLocked?.classList.remove("hidden");
    freezeRow?.classList.add("hidden");
    controlsRow1?.classList.add("hidden");
    controlsRow2?.classList.add("hidden");
  } else if (hasAgent && hasBalance && !hasWhitelist) {
    depositCard?.classList.remove("disabled");
    whitelistCard?.classList.remove("disabled");
    ownerLocked?.classList.remove("hidden");
    freezeRow?.classList.add("hidden");
    controlsRow1?.classList.add("hidden");
    controlsRow2?.classList.add("hidden");
  } else {
    depositCard?.classList.remove("disabled");
    whitelistCard?.classList.remove("disabled");
    ownerLocked?.classList.add("hidden");
    freezeRow?.classList.remove("hidden");
    controlsRow1?.classList.remove("hidden");
    controlsRow2?.classList.remove("hidden");
  }
}
