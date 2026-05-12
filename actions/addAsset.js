import { CONFIG } from "../config";
import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";
import { sendTransaction } from "./radix.js";

function addAssetManifest(name, resourceAddress) {
  const account    = APP_STATE.activeAccount.address;
  const ownerBadge = APP_STATE.ownerBadgeAddress;
  const component  = APP_STATE.componentAddress;

  return `
CALL_METHOD
    Address("${account}")
    "create_proof_of_amount"
    Address("${ownerBadge}")
    Decimal("1")
;
CALL_METHOD
    Address("${component}")
    "add_asset"
    "${name}"
    Address("${resourceAddress}")
;
`;
}


export async function addAsset() {
  if (!APP_STATE.activeAccount || !APP_STATE.ownerBadgeAddress || !APP_STATE.componentAddress) {
    console.error("Missing APP_STATE data for addAsset");
    return;
  }

  const assets = await getAssets();

  const currentList = assets.map(a => `
    <div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:#0a0f1a;border:1px solid #1f2937;">
      <span style="font-size:12px;color:#8b949e;">${a.name}</span>
      <span style="font-size:11px;color:#555;">${a.address.slice(0, 20)}...</span>
    </div>
  `).join("");

  openActionModal({
    title: "Add Asset",
    content: `
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:8px;">

        <div>
          <label style="font-size:13px;color:#8b949e;">Current Assets</label>
          <div style="display:flex;flex-direction:column;gap:4px;margin-top:6px;">
            ${currentList || '<p style="font-size:12px;color:#555;">No assets listed yet.</p>'}
          </div>
        </div>

        <div style="border-top:1px solid #1f2937;padding-top:16px;">
          <label style="font-size:13px;color:#8b949e;">Asset Name</label>
          <input id="asset-name" type="text"
            placeholder="HUSDC"
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;margin-bottom:8px;"/>
          <label style="font-size:13px;color:#8b949e;">Resource Address</label>
          <input id="asset-address" type="text"
            placeholder="resource_tdx_2_1..."
            style="width:100%;padding:8px;border-radius:8px;background:#111;color:white;border:1px solid #333;box-sizing:border-box;"/>
        </div>

      </div>
    `,
    confirmText: "Add Asset",
    onConfirm: async () => {
      const name    = document.getElementById("asset-name").value.trim();
      const address = document.getElementById("asset-address").value.trim();

      if (!name || !address) {
        console.error("Name and address required");
        return;
      }

      const manifest = addAssetManifest(name, address);
      console.log("ADD ASSET MANIFEST:", manifest);
      await sendTransaction(manifest);
    }
  });
}


async function getAssets() {
  const account    = APP_STATE.activeAccount.address;
  const component  = APP_STATE.componentAddress;

  const manifest = `
CALL_METHOD Address("${account}") "create_proof_of_amount" Address("${APP_STATE.ownerBadgeAddress}") Decimal("1") ;
CALL_METHOD Address("${component}") "get_allowed_assets" ;
`;

  const response = await fetch(
    `${CONFIG.GATEWAY_URL}/transaction/preview`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        manifest,
        start_epoch_inclusive: 1,
        end_epoch_exclusive: 100,
        nonce: Math.floor(Math.random() * 1000000000),
        signer_public_keys: [],
        notary_public_key: {
          key_type: "EddsaEd25519",
          key_hex: "0000000000000000000000000000000000000000000000000000000000000001"
        },
        notary_is_signatory: true,
        tip_percentage: 0,
        flags: {
          use_free_credit: true,
          assume_all_signature_proofs: true,
          skip_epoch_check: true
        }
      })
    }
  );

  const data = await response.json();
  console.log("ASSETS PREVIEW:", data);

  const items = data?.receipt?.output?.[1]?.programmatic_json?.elements || [];
  return items.map(tuple => ({
    name:    tuple.fields[0].value,
    address: tuple.fields[1].value
  }));
}
