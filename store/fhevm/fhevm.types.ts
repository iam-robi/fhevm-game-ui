import { FhevmInstance } from "fhevmjs";
export interface FhevmState {
  instance: FhevmInstance | null;
  publicKey: string;
}
