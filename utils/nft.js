import { CONFIG } from "../config.js";
import { APP_STATE } from "./state.js";

function getMeta(metadata, key) {
  const entry = metadata.find(m => m.key === key);
  return entry?.value?.typed?.value || null;
}

function getMetaArray(metadata, key) {
  const entry = metadata.find(m => m.key === key);
  return entry?.value?.typed?.values || [];
}

async function getComponentState(componentAddress) {
  const response = await fetch(`${CONFIG.GATEWAY_URL}/state/entity/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      addresses: [componentAddress],
      aggregation_level: "Global"
    }),
  });
  const data = await response.json();
  const fields = data?.items?.[0]?.details?.state?.fields || [];
  const notarizerField = fields.find(f => f.field_name === "notarizer_account");
  return notarizerField?.value || null;
}

async function getAgentBadgeFromNotarizer(notarizerAccount) {
  const response = await fetch(`${CONFIG.GATEWAY_URL}/state/entity/details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      addresses: [notarizerAccount],
      aggregation_level: "Vault",
      opt_ins: {
        explicit_metadata: ["name", "symbol", "dapp_definitions"]
      }
    }),
  });
  const data = await response.json();
  const nfResources = data?.items?.[0]?.non_fungible_resources?.items || [];

  for (const resource of nfResources) {
    const metadata = resource.explicit_metadata?.items || [];
    const name   = getMeta(metadata, "name");
    const symbol = getMeta(metadata, "symbol");
    const dapps  = getMetaArray(metadata, "dapp_definitions");

    if (
      name   === CONFIG.AGENT_BADGE_NAME &&
      symbol === CONFIG.AGENT_BADGE_SYMBOL &&
      dapps.includes(CONFIG.DAPP_DEFINITION)
    ) {
      const vaultItem = resource.vaults?.items?.[0];
      return {
        resourceAddress: resource.resource_address,
        vaultAddress: vaultItem?.vault_address || null,
        localId: "#1#"
      };
    }
  }
  return null;
}

export async function accountHasAgent(accountAddress) {
  try {
    const response = await fetch(`${CONFIG.GATEWAY_URL}/state/entity/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: [accountAddress],
        aggregation_level: "Vault",
        opt_ins: {
          non_fungible_include_nfids: true,
          explicit_metadata: ["name", "symbol", "dapp_definitions", "component"]
        }
      }),
    });

    const data = await response.json();
    const fungibles = data?.items?.[0]?.fungible_resources?.items || [];

    let foundPVOB = false;

    // ── PVOB ──
    for (const resource of fungibles) {
      const metadata  = resource.explicit_metadata?.items || [];
      const name      = getMeta(metadata, "name");
      const symbol    = getMeta(metadata, "symbol");
      const dapps     = getMetaArray(metadata, "dapp_definitions");
      const amount    = resource.vaults?.items?.[0]?.amount || "0";
      const component = getMeta(metadata, "component");

      const valid =
        name   === CONFIG.OWNER_BADGE_NAME   &&
        symbol === CONFIG.OWNER_BADGE_SYMBOL &&
        dapps.includes(CONFIG.DAPP_DEFINITION) &&
        parseFloat(amount) === 1;

      if (valid) {
        APP_STATE.ownerBadgeAddress = resource.resource_address;
        APP_STATE.componentAddress  = component;
        foundPVOB = true;
        console.log("PVOB found:", resource.resource_address);
        console.log("componentAddress:", component);

        // ── Leer notarizer_account del estado del componente ──
        const notarizerAccount = await getComponentState(component);
        if (notarizerAccount) {
          APP_STATE.notarizerAccount = notarizerAccount;
          console.log("notarizerAccount:", notarizerAccount);

          // ── Buscar AWB en la cuenta notarizadora ──
          const badge = await getAgentBadgeFromNotarizer(notarizerAccount);
          if (badge) {
            APP_STATE.agentBadgeAddress  = badge.resourceAddress;
            APP_STATE.agentBadgeVaultAddress = badge.vaultAddress;
            APP_STATE.agentBadgeLocalId  = badge.localId;
            console.log("AWB found:", badge.resourceAddress, "vault:", badge.vaultAddress);
          }
        }
      }
    }

    console.log("Detection result — PVOB:", foundPVOB);
    console.log("APP_STATE:", { ...APP_STATE });
    return foundPVOB;

  } catch (err) {
    console.error("NFT DETECTION ERROR:", err);
    return false;
  }
}
