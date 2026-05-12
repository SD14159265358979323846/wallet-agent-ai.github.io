import { CONFIG } from "../config.js";
import { APP_STATE } from "../utils/state.js";
import { openActionModal } from "../utils/modal.js";

async function fetchComponentBalances() {
  const response = await fetch(
    `${CONFIG.GATEWAY_URL}/state/entity/details`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: [APP_STATE.componentAddress],
        aggregation_level: "Vault",
        opt_ins: {
          explicit_metadata: ["name", "symbol"]
        }
      })
    }
  );
  const data = await response.json();
  const fungibles = data?.items?.[0]?.fungible_resources?.items || [];

  return fungibles.map(resource => {
    const metadata = resource.explicit_metadata?.items || [];
    const name     = metadata.find(m => m.key === "name")?.value?.typed?.value   || "Unknown";
    const symbol   = metadata.find(m => m.key === "symbol")?.value?.typed?.value || "???";
    const amount   = parseFloat(resource.vaults?.items?.[0]?.amount || 0).toFixed(4);
    return { name, symbol, amount };
  });
}

export async function viewBalances() {
  if (!APP_STATE.componentAddress) {
    console.error("Missing componentAddress for viewBalances");
    return;
  }

  const balances = await fetchComponentBalances();

  const rows = balances.length > 0
    ? balances.map(b => `
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px;border-radius:8px;background:#0a0f1a;border:1px solid #1f2937;">
          <span style="font-size:13px;color:#8b949e;">${b.symbol} — ${b.name}</span>
          <span style="font-size:14px;font-weight:600;color:#276ff5;">${b.amount}</span>
        </div>
      `).join("")
    : `<p style="color:#555;font-size:13px;text-align:center;">No assets found in agent wallet.</p>`;

  openActionModal({
    title: "Agent Wallet Balances",
    hideConfirm: true,
    content: `
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
        ${rows}
      </div>
    `,
  });
}
