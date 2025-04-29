import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const sandbox = {
  node: "http://localhost:8080",
  nft: "0x2c007653ce6104009f6b7f4acbcb09e187d8ccedd69c2e286c01bc2a7dc29a7f",
};

const testnet = {
  node: "https://l2.testnet.nemi.fi",
  nft: "0x011206203068fff9507ab2efadfe364a42259ebf162047380596a32203e56294",
};

export const chain = testnet;
