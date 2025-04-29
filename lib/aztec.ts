import { AztecWalletSdk, obsidion } from "@nemi-fi/wallet-sdk";
import { useAccount as useAccountBase } from "@nemi-fi/wallet-sdk/react";

export const wallet = new AztecWalletSdk({
  aztecNode: "https://l2.testnet.nemi.fi",
  connectors: [obsidion({})],
});

export function useAccount() {
  return useAccountBase(wallet);
}
