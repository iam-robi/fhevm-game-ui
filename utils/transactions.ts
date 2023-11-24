import type { ContractMethodArgs, Typed } from "ethers";
import type { TypedContractMethod } from "./commontypes";

export const createTransaction = async <
  A extends [...{ [I in keyof A]-?: A[I] | Typed }]
>(
  method: TypedContractMethod<A>,
  ...params: A
) => {
  const gasLimit = await method.estimateGas(...params);
  const updatedParams: ContractMethodArgs<A> = [
    ...params,
    { gasLimit: Math.round(+gasLimit.toString() * 1.2) },
  ];
  return method(...updatedParams);
};
