import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

function revokeBadgeManifest() {
  const account       = APP_STATE.activeAccount.address;
  const ownerBadge    = APP_STATE.ownerBadgeAddress;
  const component     = APP_STATE.componentAddress;
  const agentBadge    = APP_STATE.agentBadgeAddress;
  const agentLocalId  = APP_STATE.agentBadgeLocalId;

  return `
CALL_METHOD
    Address("${account}")
    "create_proof_of_amount"
    Address("${ownerBadge}")
    Decimal("1")
;
CALL_METHOD
    Address("${account}")
    "withdraw_non_fungibles"
    Address("${agentBadge}")
    Array<NonFungibleLocalId>(NonFungibleLocalId("${agentLocalId}"))
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
  if (!APP_STATE.activeAccount || !APP_STATE.ownerBadgeAddress || !APP_STATE.componentAddress || !APP_STATE.agentBadgeLocalId) {
    console.error("Missing APP_STATE data for revokeBadge");
    return;
  }

  openActionModal({
    title: "Revoke Agent Badge",
    content: `
      <p style="color:#c0392b;font-size:14px;margin-bottom:12px;">
        ⚠️ This will permanently burn the agent badge. The agent will immediately lose access.
      </p>
      <p style="font-size:13px;color:#8b949e;">
        Badge: <code style="color:#276ff5;">${APP_STATE.agentBadgeLocalId}</code><br>
        Resource: <code style="color:#555;font-size:11px;">${APP_STATE.agentBadgeAddress}</code>
      </p>
    `,
    confirmText: "Revoke Badge",
    onConfirm: async () => {
      const manifest = revokeBadgeManifest();
      console.log("REVOKE BADGE MANIFEST:", manifest);
      await sendTransaction(manifest);
    }
  });
}
