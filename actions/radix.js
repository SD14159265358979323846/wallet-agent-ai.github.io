// actions/radix.js
import { rdt } from "../rdt.js";
import { updateAccountState } from "../utils/accountSelector.js";
import { APP_STATE } from "../utils/state.js";
import { showAppToast } from "../utils/notify.js";

function formatSdkError(error) {
  if (!error) return "Unknown wallet error";
  if (typeof error === "string") return error;
  return (
    error.message ||
    error.errorMessage ||
    error.details?.message ||
    error.code ||
    JSON.stringify(error)
  );
}

export async function sendTransaction(manifest) {
  try {
    console.log("Sending TX...", manifest);
    showAppToast("Opening Radix Wallet — approve the transaction there.", "info");

    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      version: 1,
    });

    if (result.isErr()) {
      const message = formatSdkError(result.error);
      console.error("TX ERROR:", result.error);
      showAppToast(message, "error");
      return { ok: false, error: message };
    }

    console.log("TX SUCCESS:", result.value);
    showAppToast("Transaction submitted successfully.", "success");

    if (APP_STATE.activeAccount) {
      await updateAccountState(APP_STATE.activeAccount);
    }

    return { ok: true, value: result.value };
  } catch (err) {
    const message = err?.message || "Failed to send transaction to Radix Wallet";
    console.error("sendTransaction failed:", err);
    showAppToast(message, "error");
    return { ok: false, error: message };
  }
}
