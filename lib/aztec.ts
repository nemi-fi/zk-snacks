import { AztecWalletSdk, obsidion } from "@nemi-fi/wallet-sdk";
import { useAccount as useAccountBase } from "@nemi-fi/wallet-sdk/react";
import { chain } from "./utils";

export const wallet = new AztecWalletSdk({
  aztecNode: chain.node,
  connectors: [obsidion({})],
});

export function useAccount() {
  return useAccountBase(wallet);
}
