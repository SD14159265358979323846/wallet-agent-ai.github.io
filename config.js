// config.js — Mainnet only (Radix Wallet validates on https://wallet-agent-ai.github.io)

export const CONFIG = {
  NETWORK_ID: 1,
  NETWORK_LABEL: "Mainnet",
  GATEWAY_URL: "https://mainnet.radixdlt.com",
  DASHBOARD_URL: "https://dashboard.radixscan.io",
  XRD: "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
  APP_NAME: "Wallet Agent AI",
  APP_VERSION: "1.0.0",
  DAPP_DEFINITION:
    "account_rdx12x0tunkp3gw94cfer06a067sf87xzrntdnzsxtkfk4hkz6xwj0jh98",
  VERIFIED_ORIGIN: "https://wallet-agent-ai.github.io",
  PACKAGE_ADDRESS:
    "package_rdx1pke3sjgq0haza7l6vqjn020qj5n0yzqghddly6xemvn70dfwvfdavs",
  DEV_FEE_COLLECTOR:
    "component_rdx1cqcwh5ed7d4evn3k7ckguntwgdng09xwrdzdn2wste354p9sx3sejw",
  AGENT_BADGE_NAME: "AgentWallet Badge",
  AGENT_BADGE_SYMBOL: "AWB",
  OWNER_BADGE_NAME: "PolicyVault Badge AgentWallet Owner Controler",
  OWNER_BADGE_SYMBOL: "PVOB",
  ALLOWED_ASSETS: [
    {
      name: "XRD",
      address:
        "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
    },
    {
      name: "HWBTC",
      address:
        "resource_rdx1t58kkcqdz0mavfz98m98qh9m4jexyl9tacsvlhns6yxs4r6hrm5re5",
    },
    {
      name: "HUSDC",
      address:
        "resource_rdx1thxj9m87sn5cc9ehgp9qxp6vzeqxtce90xm5cp33373tclyp4et4gv",
    },
    {
      name: "HETH",
      address:
        "resource_rdx1th09yvv7tgsrv708ffsgqjjf2mhy84mscmj5jwu4g670fh3e5zgef0",
    },
    {
      name: "HUSDT",
      address:
        "resource_rdx1th4v03gezwgzkuma6p38lnum8ww8t4ds9nvcrkr2p9ft6kxx3kxvhe",
    },
  ],
};

export function isVerifiedOrigin() {
  if (typeof window === "undefined") return true;
  return window.location.origin === CONFIG.VERIFIED_ORIGIN;
}
