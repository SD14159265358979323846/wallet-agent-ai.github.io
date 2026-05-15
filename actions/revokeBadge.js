import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

function revokeBadgeManifest() {
  const account        = APP_STATE.activeAccount.address;
  const ownerBadge     = APP_STATE.ownerBadgeAddress;
  const component      = APP_STATE.componentAddress;
  const agentBadge     = APP_STATE.agentBadgeAddress;
  const vaultAddress   = APP_STATE.agentBadgeVaultAddress;

  return `
CALL_METHOD
    Address("${account}")
    "create_proof_of_amount"
    Address("${ownerBadge}")
    Decimal("1")
;
CALL_DIRECT_VAULT_METHOD
    Address("${vaultAddress}")
    "recall_non_fungibles"
    Array<NonFungibleLocalId>(NonFungibleLocalId("#1#"))
;
TAKE_ALL_FROM_WORKTOP
    Address("${agentBadge}")
    Bucket("badge_bucket")
;
CALL_METHOD
    Address("${component}")
    "revoke_badge"
    Bucket("badge_bucket")
;
`;
}

export async function revokeBadge() {
  if (!APP_STATE.activeAccount || !APP_STATE.ownerBadgeAddress || !APP_STATE.componentAddress || !APP_STATE.agentBadgeAddress || !APP_STATE.agentBadgeVaultAddress) {
    console.error("Missing APP_STATE data for revokeBadge");
    return;
  }

  openActionModal({
    title: "Revoke Agent Badge",
    content: `
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:8px;">
        <p style="color:#c0392b;font-size:14px;margin:0;">
          ⚠️ This will permanently burn the agent badge. The agent will immediately lose access.
          To use a new agent you will need to instantiate a new component.
        </p>
        <p style="font-size:13px;color:#8b949e;margin:0;">
          Badge: <code style="color:#555;">${APP_STATE.agentBadgeAddress}</code>
        </p>
        <p style="font-size:13px;color:#8b949e;margin:0;">
          Notarizer: <code style="color:#555;">${APP_STATE.notarizerAccount}</code>
        </p>
      </div>
    `,
    confirmText: "Revoke Badge",
    onConfirm: async () => {
      try {
        const manifest = revokeBadgeManifest();
        console.log("REVOKE BADGE MANIFEST:", manifest);
        await sendTransaction(manifest);
      } catch (err) {
        console.error("Error revoking badge:", err);
      }
    }
  });
}
