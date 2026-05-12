import { CONFIG } from "../config.js";
import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

const EPOCHS_PER_DAY = 288;

function renewBadgeManifest(days) {
  const account    = APP_STATE.activeAccount.address;
  const ownerBadge = APP_STATE.ownerBadgeAddress;
  const component  = APP_STATE.componentAddress;
  const localId    = APP_STATE.agentBadgeLocalId;
  const epochs     = Math.round(days * EPOCHS_PER_DAY);

  return `
CALL_METHOD
    Address("${account}")
    "create_proof_of_amount"
    Address("${ownerBadge}")
    Decimal("1")
;
CALL_METHOD
    Address("${component}")
    "renew_badge"
    NonFungibleLocalId("${localId}")
    ${epochs}u64
;
`;
}

export async function renewBadge() {
  if (!APP_STATE.activeAccount || !APP_STATE.ownerBadgeAddress || !APP_STATE.componentAddress || !APP_STATE.agentBadgeLocalId) {
    console.error("Missing APP_STATE data for renewBadge");
    return;
  }

  openActionModal({
    title: "Renew Agent Badge",
    content: `
      <label style="font-size:13px;color:#8b949e;">Renewal Duration (days)</label>
      <p style="font-size:12px;color:#555;margin:2px 0 8px;">
        How many days to extend the agent badge validity.
      </p>
      <input id="renew-days" type="number"
        placeholder="30" min="1" step="1"
        style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"
      />
      <p style="font-size:12px;color:#555;margin:8px 0 0;">
        Badge ID: <code style="color:#276ff5;">${APP_STATE.agentBadgeLocalId}</code>
      </p>
    `,
    confirmText: "Renew",
    onConfirm: async () => {
      const days = parseInt(document.getElementById("renew-days").value);
      if (!days || days < 1) {
        console.error("Invalid days for renewBadge");
        return;
      }
      const manifest = renewBadgeManifest(days);
      console.log("RENEW BADGE MANIFEST:", manifest);
      await sendTransaction(manifest);
    }
  });
}
