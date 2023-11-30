import { type FhevmInstance } from "fhevmjs";
export interface FhevmState {
  instance: FhevmInstance | null;
  publicKey: string;
  savedToken: SignPublicKeyReturnType;
}

export interface SignPublicKeyReturnType {
  generatedToken: {
    publicKey: Uint8Array;
    token: any;
  };
  signature: string;
}
