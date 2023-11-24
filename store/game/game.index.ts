// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { ethers, Contract } from "ethers";
import { defineStore } from "pinia";

// import { bunkerWarZAbi } from "~/abi/BunkerWarZ";
import { GameState } from "./game.types";
import { useEthers, useWallet } from "vue-dapp";
import { gameAbi } from "./abi";

import { createTransaction } from "~/utils/transactions";

export const useGameStore = defineStore("gameStore", {
  state: (): GameState => ({
    userGrid: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    newUserGrid: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    opponentGrid: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    gridSize: { width: 4, height: 4 },
    selectedPosition: {
      gridIndex: 0,
      rowIndex: 0,
      colIndex: 0,
    },
    selectedBuilding: 0,
    gameContractAddress: "0xD6fA8C9C69b3575Ef45beA10292366e788D6FAd3",
    player1: "",
    player2: "",
  }),

  actions: {
    startGame: async function () {
      const { address, signer } = useEthers();

      //@ts-ignore
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      let board_width = 4;
      let board_height = 4;

      const player1 = "0x64dbad4e0a22268d82d6c6bcfd2d169414c45fd6";
      const player2 = "0x04cB6fd7e278096A8eAB5CcE44a821ea1D43D476";

      const transaction = await contract[
        "newGame(uint8,uint8,address,address)"
      ](board_width, board_height, player1, player2);
      //await contract.newGame(board_width, board_height, player1, player2);
    },
    playRound: async function () {
      console.log("play round");
    },
  },
  getters: {
    gridVariation: (state) => {},
  },
});
