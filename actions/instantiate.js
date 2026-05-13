import { CONFIG } from "../config.js";
import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

function instantiateManifest({ maxPerTx, multisig, dailyCap, agentName, badgeDays }) {
  const account = APP_STATE.activeAccount.address;
const assets = CONFIG.ALLOWED_ASSETS.map(a => 
  `Tuple("${a.name}", Address("${a.address}"))`
).join(", ");

  return `
CALL_FUNCTION
    Address("${CONFIG.PACKAGE_ADDRESS}")
    "PolicyVault"
    "instantiate"
    Decimal("${maxPerTx}")
    Decimal("${multisig}")
    Decimal("${dailyCap}")
    Array<Tuple>(Tuple("owner", Address("${account}")))
    "${agentName}"
    ${badgeDays}u64
    Address("${CONFIG.DAPP_DEFINITION}")
    Address("${CONFIG.DEV_FEE_COLLECTOR}")
    Array<Tuple>(${assets})
;
CALL_METHOD
    Address("${account}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP")
;
`;
}

export async function instantiate() {
  if (!APP_STATE.activeAccount) {
    console.error("No active account");
    return;
  }

  openActionModal({
    title: "Instantiate Agent Wallet",
    content: `
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:8px;">
        <div>
          <label style="font-size:13px;color:#8b949e;">Agent Name</label>
          <p style="font-size:12px;color:#555;margin:2px 0 6px;">A name to identify your agent.</p>
          <input id="inst-name" type="text" placeholder="Put your own name for Example: my-trading-agent"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>
        <div>
          <label style="font-size:13px;color:#8b949e;">Max per Transaction</label>
          <p style="font-size:12px;color:#555;margin:2px 0 6px;">Maximum amount the agent can spend in a single transaction.</p>
          <input id="inst-max-tx" type="number" placeholder="Put your value  for Example: 400" min="0" step="1"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>
        <div>
          <label style="font-size:13px;color:#8b949e;">Multisig Threshold</label>
          <p style="font-size:12px;color:#555;margin:2px 0 6px;">Maximum the agent and owner can spend together in one TX.</p>
          <input id="inst-multisig" type="number" placeholder="E.g.:1000" min="0" step="1"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>
        <div>
          <label style="font-size:13px;color:#8b949e;">Daily Cap</label>
          <p style="font-size:12px;color:#555;margin:2px 0 6px;">Maximum total spending allowed per day.</p>
          <input id="inst-daily" type="number" placeholder="E.g. :10000" min="0" step="1"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>
        <div>
          <label style="font-size:13px;color:#8b949e;">Badge Duration (days)</label>
          <p style="font-size:12px;color:#555;margin:2px 0 6px;">How many days the agent badge stays valid.</p>
          <input id="inst-days" type="number" placeholder="E.g. :30" min="1" step="1"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>
      </div>
    `,
    confirmText: "Instantiate",
    onConfirm: async () => {
      const agentName = document.getElementById("inst-name").value.trim();
      const maxPerTx  = document.getElementById("inst-max-tx").value.trim();
      const multisig  = document.getElementById("inst-multisig").value.trim();
      const dailyCap  = document.getElementById("inst-daily").value.trim();
      const badgeDays = document.getElementById("inst-days").value.trim();

      if (!agentName || !maxPerTx || !multisig || !dailyCap || !badgeDays) {
        console.error("All fields required for instantiate");
        return;
      }

      if (parseFloat(maxPerTx) > parseFloat(multisig)) {
        console.error("Max per TX cannot exceed Multisig Threshold");
        return;
      }

      if (parseFloat(multisig) > parseFloat(dailyCap)) {
        console.error("Multisig Threshold cannot exceed Daily Cap");
        return;
      }

      const manifest = instantiateManifest({ 
        maxPerTx, multisig, dailyCap, agentName, 
        badgeDays: parseInt(badgeDays) 
      });
      console.log("INSTANTIATE MANIFEST:", manifest);
      await sendTransaction(manifest);
    }
  });
}
