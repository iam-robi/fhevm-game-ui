// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { ethers, Contract, type Signer } from "ethers";
import { defineStore } from "pinia";

// import { bunkerWarZAbi } from "~/abi/BunkerWarZ";
import { GameState, type NewGameEvent } from "./game.types";
import { useEthers, useWallet } from "vue-dapp";
import { gameAbi } from "./abi";
import { useFhevmStore } from "../fhevm/fhevm.index";

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
    gameContractAddress: "0x5ee024843B0B3EA02a7F5CF68a06F3D8bce92a04",
    player1: "0x64dbad4e0a22268d82d6c6bcfd2d169414c45fd6",
    player2: "0x04cB6fd7e278096A8eAB5CcE44a821ea1D43D476",
    blockStart: 755740,
    newGameEvents: [],
    gameSelected: 0,
    gameData: [],
  }),

  actions: {
    startGame: async function () {
      const { address, signer } = useEthers();

      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      let board_width = 4;
      let board_height = 4;

      const transaction = await contract[
        "newGame(uint8,uint8,address,address)"
      ](board_width, board_height, this.player1, this.player2);

      await transaction.wait().then((receipt: any) => {
        console.log("receipt", receipt);
      });
    },
    playRound: async function () {
      console.log("play round");
    },
    getGamesCreated: async function () {
      const { address, signer } = useEthers();
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );
      //TODO: only get games of current user
      const filterPlayer1 = contract.filters.NewGameCreated(
        null,
        null,
        null,
        address.value,
        null
      );
      const filterPlayer2 = contract.filters.NewGameCreated(
        null,
        null,
        null,
        null,
        address.value
      );

      // Fetch events for both filters
      const eventsPlayer1 = await this.getPastEvents(contract, filterPlayer1);
      const eventsPlayer2 = await this.getPastEvents(contract, filterPlayer2);

      // Combine and deduplicate events
      const allEvents = [...eventsPlayer1, ...eventsPlayer2].reduce(
        (acc, current) => {
          const x = acc.find(
            (item: any) => item.transactionHash === current.transactionHash
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        },
        []
      );
      //const events = await this.getPastEvents(contract, filter);
      // Parse each event and map it to the NewGameEvent structure

      const parsedEvents = allEvents.map((event: any) => {
        const args = event.args;
        return {
          newGameId: parseInt(args[0].toString()),
          boardWidth: parseInt(args[1].toString()),
          boardHeight: parseInt(args[2].toString()),
          player1: args[3],
          player2: args[4],
        };
      });

      // Now parsedEvents contains an array of NewGameEvent objects
      // You can assign it to your store's state or process it as needed
      this.newGameEvents = parsedEvents;
      //this.newGameEvents = eventData;
    },
    getBoardData: async function () {
      const { address, signer } = useEthers();

      const { instance, signPublicKey } = useFhevmStore();

      const signerInstance = signer.value as Signer;

      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      const { generatedToken, signature } = await signPublicKey(
        this.gameContractAddress,
        signerInstance
      );

      let gameId = 2;
      this.gameData = [];
      // Fetch the board data
      for (let row = 0; row < this.gridSize.height; row++) {
        let boardRow = [];
        for (let col = 0; col < this.gridSize.width; col++) {
          let cellValue = await contract.getBoardValue(
            gameId,
            row,
            col,
            generatedToken.publicKey,
            signature
          );
          boardRow.push(instance?.decrypt(this.gameContractAddress, cellValue));
        }
        this.gameData.push(boardRow);
      }
    },

    getPastEvents: async function (contract: any, filter: any) {
      try {
        // Replace with specific block numbers or use 'latest' for the most recent block
        const fromBlock = this.blockStart;
        const toBlock = "latest";

        const events = await contract.queryFilter(filter, fromBlock, toBlock);
        return events;
      } catch (error) {
        console.error(`Error fetching events: ${error}`);
        return [];
      }
    },
  },
  getters: {
    gridVariation: (state) => {},
  },
});
