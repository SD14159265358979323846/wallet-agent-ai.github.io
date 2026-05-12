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

export async function accountHasAgent(accountAddress) {
  try {
    const response = await fetch(
      `${CONFIG.GATEWAY_URL}/state/entity/details`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addresses: [accountAddress],
          aggregation_level: "Vault",
          opt_ins: {
            non_fungible_include_nfids: true,
            non_fungible_resources: true,
            explicit_metadata: ["name", "symbol", "dapp_definitions", "component"]
          }
        }),
      }
    );

    const data = await response.json();

    const fungibles    = data?.items?.[0]?.fungible_resources?.items     || [];
    const nonFungibles = data?.items?.[0]?.non_fungible_resources?.items || [];

    let foundPVOB = false;
    let foundAWB  = false;

    // ── PVOB — fungible, vinculado a nuestro dapp_definition ──
    for (const resource of fungibles) {
      const metadata = resource.explicit_metadata?.items || [];
      const name     = getMeta(metadata, "name");
      const symbol   = getMeta(metadata, "symbol");
      const dapps    = getMetaArray(metadata, "dapp_definitions");
      const amount   = resource.vaults?.items?.[0]?.amount || "0";
      const component = getMeta(metadata, "component"); // disponible tras redeploy

      const valid =
        name   === CONFIG.OWNER_BADGE_NAME   &&
        symbol === CONFIG.OWNER_BADGE_SYMBOL &&
        dapps.includes(CONFIG.DAPP_DEFINITION) &&
        parseFloat(amount) === 1;

      if (valid) {
        APP_STATE.ownerBadgeAddress = resource.resource_address;
        APP_STATE.componentAddress  = component; // null hasta redeploy Scrypto
        foundPVOB = true;
        console.log("PVOB found:", resource.resource_address);
        console.log("componentAddress:", component);
      }
    }

    // ── AWB — non-fungible, vinculado a nuestro dapp_definition ──
    for (const resource of nonFungibles) {
  const metadata = resource.explicit_metadata?.items || [];
  const name     = getMeta(metadata, "name");
  const symbol   = getMeta(metadata, "symbol");
  const dapps    = getMetaArray(metadata, "dapp_definitions");
  const count    = resource.vaults?.items?.[0]?.total_count || 0;

  const valid =
    name   === CONFIG.AGENT_BADGE_NAME   &&
    symbol === CONFIG.AGENT_BADGE_SYMBOL &&
    dapps.includes(CONFIG.DAPP_DEFINITION) &&
    count >= 1;

  if (valid) {
    APP_STATE.agentBadgeAddress = resource.resource_address;
    APP_STATE.agentBadgeLocalId = resource.vaults?.items?.[0]?.items?.[0] || null;
    foundAWB = true;
    console.log("AWB found:", resource.resource_address, "localId:", APP_STATE.agentBadgeLocalId);
  }
}



      // for (const resource of nonFungibles) {
    //   const metadata = resource.explicit_metadata?.items || [];
    //   const name     = getMeta(metadata, "name");
    //   const symbol   = getMeta(metadata, "symbol");
    //   const dapps    = getMetaArray(metadata, "dapp_definitions");
   //
    //   const count    = resource.vaults?.items?.[0]?.total_count || 0;
    //
    //
    //   const valid =
    //     name   === CONFIG.AGENT_BADGE_NAME   &&
    //     symbol === CONFIG.AGENT_BADGE_SYMBOL &&
    //     dapps.includes(CONFIG.DAPP_DEFINITION) &&
    //     count >= 1;
    //
    //   if (valid) {
    //     APP_STATE.agentBadgeAddress = resource.resource_address;
    //     foundAWB = true;
    //     console.log("AWB found:", resource.resource_address);
    //   }
    // }
    //
    console.log("Detection result — PVOB:", foundPVOB, "AWB:", foundAWB);
    console.log("APP_STATE:", { ...APP_STATE });

    console.log(">>> nft.js returning:", foundPVOB && foundAWB);

    return foundPVOB && foundAWB;

  } catch (err) {
    console.error("NFT DETECTION ERROR:", err);
    return false;
  }
}
