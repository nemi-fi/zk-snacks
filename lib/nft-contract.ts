import { AztecAddress } from "@aztec/aztec.js";
import { Account } from "@nemi-fi/wallet-sdk";
import { Contract } from "@nemi-fi/wallet-sdk/eip1193";
import { NFTContract as NftContract_ } from "../noir/target/NFT";
import { chain } from "./utils";

export class NftContract extends Contract.fromAztec(NftContract_) {}

export async function getNftContract(account: Account) {
  return await NftContract.at(AztecAddress.fromString(chain.nft), account);
}
