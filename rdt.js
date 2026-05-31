import {
  RadixDappToolkit,
  RadixNetwork,
  DataRequestBuilder,
} from "@radixdlt/radix-dapp-toolkit";

import { CONFIG } from "./config.js";

export const rdt = RadixDappToolkit({
  dAppDefinitionAddress: CONFIG.DAPP_DEFINITION,
  networkId: RadixNetwork.Mainnet,
  applicationName: CONFIG.APP_NAME,
  applicationVersion: CONFIG.APP_VERSION,
});

rdt.walletApi.setRequestData(
  DataRequestBuilder.accounts().atLeast(1)
);
