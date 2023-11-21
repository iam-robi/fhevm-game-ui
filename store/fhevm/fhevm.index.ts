// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { ethers } from "ethers";
import { defineStore } from "pinia";

// import { bunkerWarZAbi } from "~/abi/BunkerWarZ";
import { FhevmState } from "./fhevm.types";
import { BrowserProvider } from "ethers";
import { FhevmInstance } from "fhevmjs";

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
    playRound: async function () {
      console.log("play round");
    },
  },
  getters: {},
});
