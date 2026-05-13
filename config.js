// config.js

export const CONFIG = {

  // ===== NETWORK =====
  NETWORK_ID: 1, // 2 stokenet
  //GATEWAY_URL: "https://stokenet.radixdlt.com",
  GATEWAY_URL: "https://mainnet.radixdlt.com",

  // ===== TOKEN CONST =====
  //XRD: "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc",

  XRD: "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
  // ===== APP =====
  APP_NAME: "Wallet Agent AI",
  APP_VERSION: "1.0.0",

  // ===== DAPP =====
  DAPP_DEFINITION:
    "account_rdx12x0tunkp3gw94cfer06a067sf87xzrntdnzsxtkfk4hkz6xwj0jh98",

  // ===== PACKAGE =====
  PACKAGE_ADDRESS: "package_rdx1p4zthdh3ryfj03k54l7hyc0afm7yeklw7j8ewyntp6zd76uat30w0h",
  DEV_FEE_COLLECTOR: "component_rdx1cp9ndw4jvmtkumzwrkj4vjl9fek0g2smdxzm3klfwxutl2jwgjllfe",

  // ===== NFT DETECTION =====
  AGENT_BADGE_NAME: "AgentWallet Badge",
  AGENT_BADGE_SYMBOL: "AWB",

  OWNER_BADGE_NAME:   "PolicyVault Badge AgentWallet Owner Controler",  
  OWNER_BADGE_SYMBOL: "PVOB",

ALLOWED_ASSETS: [
//  { name: "XRD",   address: "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc" },
  //mainnet 
  { name: "XRD",   address: "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd" },
     { name: "HWBTC", address: "resource_rdx1t58kkcqdz0mavfz98m98qh9m4jexyl9tacsvlhns6yxs4r6hrm5re5",},
  { name: "HUSDC", address: "resource_rdx1thxj9m87sn5cc9ehgp9qxp6vzeqxtce90xm5cp33373tclyp4et4gv" },
  { name: "HETH",  address: "resource_rdx1th09yvv7tgsrv708ffsgqjjf2mhy84mscmj5jwu4g670fh3e5zgef0" },
  { name: "HUSDT", address: "resource_rdx1th4v03gezwgzkuma6p38lnum8ww8t4ds9nvcrkr2p9ft6kxx3kxvhe" },
],

};
