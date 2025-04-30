import { AztecNode, FunctionCall, NodeInfo } from "@aztec/aztec.js";
import { BlockHeader } from "@aztec/stdlib/tx";
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
  nft: "0x0df0b722ec3e476c556ff437981e10f75fae34f441dffd76e3c9c0a6d240f410",
};

export const chain = testnet;
export const getAztecNode = lazyValue(async () => {
  const { createAztecNodeClient } = await import("@aztec/aztec.js");
  return createAztecNodeClient(chain.node);
});

export async function simulatePublicCalls(
  node: AztecNode,
  calls: FunctionCall[],
) {
  const info = await node.getNodeInfo();
  const blockHeader = await node.getBlockHeader();
  if (!blockHeader) {
    throw new Error("No block header found");
  }
  const tx = await createTxFromPublicCalls({ info, blockHeader }, calls);
  const results = await node.simulatePublicCalls(tx);
  const returnValues = results.publicReturnValues.map((x) => x.values!);
  console.log("node simulation result", returnValues);
  return returnValues;
}

async function createTxFromPublicCalls(
  { info, blockHeader }: { info: NodeInfo; blockHeader: BlockHeader },
  calls: FunctionCall[],
) {
  const { Tx, AztecAddress, Fr, HashedValues } = await import(
    "@aztec/aztec.js"
  );
  const { getVKTreeRoot } = await import(
    "@aztec/noir-protocol-circuits-types/vk-tree"
  );
  const { protocolContractTreeRoot } = await import(
    "@aztec/protocol-contracts"
  );
  const { PublicCallRequest } = await import("@aztec/stdlib/kernel");
  const { ClientIvcProof } = await import("@aztec/stdlib/proofs");
  const { ContractClassLog } = await import("@aztec/stdlib/logs");
  const { RollupValidationRequests } = await import("@aztec/stdlib/kernel");
  const { Gas, GasFees, GasSettings } = await import("@aztec/stdlib/gas");
  const { TxConstantData, TxContext } = await import("@aztec/stdlib/tx");
  const { makeTuple } = await import("@aztec/foundation/array");
  const {
    PrivateKernelTailCircuitPublicInputs,
    PartialPrivateTailPublicInputsForPublic,
    PrivateToPublicAccumulatedData,
  } = await import("@aztec/stdlib/kernel");

  const emptyRad = PrivateToPublicAccumulatedData.empty();
  if (calls.length > emptyRad.publicCallRequests.length) {
    throw new Error(`tried to simulate too many public calls: ${calls.length}`);
  }
  const allHashedValues = await Promise.all(
    calls.map(async (call) =>
      HashedValues.fromCalldata([call.selector.toField(), ...call.args]),
    ),
  );
  const publicCallRequests = makeTuple(
    emptyRad.publicCallRequests.length,
    (i) => {
      const call = calls[i];
      if (!call) {
        return PublicCallRequest.empty();
      }
      return new PublicCallRequest(
        AztecAddress.zero(),
        call.to,
        call.isStatic,
        allHashedValues[i]!.hash,
      );
    },
  );
  const revertibleAccumulatedData = new PrivateToPublicAccumulatedData(
    emptyRad.noteHashes,
    emptyRad.nullifiers,
    emptyRad.l2ToL1Msgs,
    emptyRad.privateLogs,
    emptyRad.contractClassLogsHashes,
    publicCallRequests,
  );
  const forPublic = new PartialPrivateTailPublicInputsForPublic(
    PrivateToPublicAccumulatedData.empty(),
    revertibleAccumulatedData,
    PublicCallRequest.empty(),
  );

  const constants = new TxConstantData(
    blockHeader,
    new TxContext(
      info.l1ChainId,
      info.rollupVersion,
      GasSettings.default({
        maxFeesPerGas: GasFees.from({
          feePerDaGas: new Fr(Fr.MODULUS - 1n),
          feePerL2Gas: new Fr(Fr.MODULUS - 1n),
        }),
      }),
    ),
    getVKTreeRoot(),
    protocolContractTreeRoot,
  );

  return new Tx(
    new PrivateKernelTailCircuitPublicInputs(
      constants,
      RollupValidationRequests.empty(),
      Gas.empty(),
      AztecAddress.zero(),
      forPublic,
    ),
    ClientIvcProof.empty(),
    [ContractClassLog.empty()],
    allHashedValues,
  );
}

export function lazyValue<T>(fn: () => T): () => T {
  let value: T;
  let initialized = false;
  return () => {
    if (!initialized) {
      initialized = true;
      value = fn();
    }
    return value;
  };
}
