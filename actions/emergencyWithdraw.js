import { APP_STATE } from "../utils/state.js";
import { CONFIG } from "../config.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

export async function emergencyWithdraw() {
  if (!APP_STATE.activeAccount || !APP_STATE.ownerBadgeAddress || !APP_STATE.componentAddress) {
    console.error("Missing APP_STATE data for emergencyWithdraw");
    return;
  }

  openActionModal({
    title: "⚠️ Emergency Withdraw",
    content: `
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:8px;">
        <p style="color:#c0392b;font-size:14px;margin:0;">
          ⚠️ This will withdraw ALL funds from the contract directly to your wallet. Use only in emergency.
        </p>
        <div>
          <label style="font-size:13px;color:#8b949e;">Asset to withdraw</label>
          <select id="emergency-asset"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;margin-top:6px;">
            ${CONFIG.ALLOWED_ASSETS.map(a => `<option value="${a.address}">${a.name}</option>`).join("")}
          </select>
        </div>
      </div>
    `,
    confirmText: "Withdraw All",
    onConfirm: async () => {
      const assetAddress = document.getElementById("emergency-asset").value;
      if (!assetAddress) return;

      const account    = APP_STATE.activeAccount.address;
      const ownerBadge = APP_STATE.ownerBadgeAddress;
      const component  = APP_STATE.componentAddress;

      const manifest = `
CALL_METHOD
    Address("${account}")
    "create_proof_of_amount"
    Address("${ownerBadge}")
    Decimal("1")
;
CALL_METHOD
    Address("${component}")
    "emergency_withdraw"
    Address("${assetAddress}")
;
CALL_METHOD
    Address("${account}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`;
      console.log("EMERGENCY WITHDRAW MANIFEST:", manifest);
      await sendTransaction(manifest);
    }
  });
}
