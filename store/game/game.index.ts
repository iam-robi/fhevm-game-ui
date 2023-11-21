// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { ethers } from "ethers";
import { defineStore } from "pinia";

// import { bunkerWarZAbi } from "~/abi/BunkerWarZ";
import { GameState } from "./game.types";

export const useGameStore = defineStore("gameStore", {
  state: (): GameState => ({
    gridSize: { width: 4, height: 4 },
    selectedPosition: {
      gridIndex: 0,
      rowIndex: 0,
      colIndex: 0,
    },
    selectedAction: 0,
    gameContractAddress: "smartcontractaddress",
  }),

  actions: {
    startGame: async function () {
      console.log("startGame");
    },
    playRound: async function () {
      console.log("play round");
    },
  },
  getters: {},
});
