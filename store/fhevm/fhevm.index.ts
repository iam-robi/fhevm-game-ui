// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { defineStore } from "pinia";
import { type FhevmState, type SignPublicKeyReturnType } from "./fhevm.types";
import { type Signer } from "ethers";

export const useFhevmStore = defineStore("fhevmStore", {
  state: (): FhevmState => ({
    instance: null,
    publicKey: "",
  }),

  actions: {
    encrypt: async function (number: number) {
      const encryptedNumber = this.instance?.encrypt16(number);
      console.log("encryptedNumber", encryptedNumber);
    },

    signPublicKey: async function (
      contractAddress: string,
      signer: Signer
    ): Promise<SignPublicKeyReturnType> {
      let generatedToken;
      let signature;

      if (this.instance) {
        generatedToken = this.instance.generateToken({
          verifyingContract: contractAddress,
        });

        console.log("generatedToken", generatedToken);

        signature = await signer.signTypedData(
          generatedToken.token.domain,
          { Reencrypt: generatedToken.token.types.Reencrypt }, // Need to remove EIP712Domain from types
          generatedToken.token.message
        );
        this.instance.setTokenSignature(contractAddress, signature);

        return { generatedToken, signature };
      } else {
        throw new Error("Instance is not available");
      }
    },
    playRound: async function () {
      console.log("play round");
    },
  },
  getters: {},
});
