// following this example https://github.com/productdevbook/oku-nuxt3-template/tree/master/src
import { ethers, Contract, type Signer } from "ethers";
import { defineStore } from "pinia";

// import { bunkerWarZAbi } from "~/abi/BunkerWarZ";
import {
  type GameStoreState,
  GameStatus,
  type NewGameEvent,
} from "./game.types";
import { useEthers, useWallet } from "vue-dapp";
import { gameAbi } from "./abi";
import { useFhevmStore } from "../fhevm/fhevm.index";

import { createTransaction } from "~/utils/transactions";

export const useGameStore = defineStore("gameStore", {
  state: (): GameStoreState => ({
    loading: false,
    gridSize: { width: 4, height: 4 },
    selectedPosition: {
      gridIndex: 0,
      rowIndex: 0,
      colIndex: 0,
    },
    selectedBuilding: 0,
    gameContractAddress: "0xaDCE6E593dE93309e068a9b1B9e2E36C3D8c8655",
    blockStart: 100680,
    latestBlock: null,
    newGameEvents: [],
    gameSelected: null,
    gameStatus: null,
    userGrid: [],
    userBuildingStates: [],
    opGrid: [],
    gameResult: null,

    newGame: {
      boardWidth: 4,
      boardHeight: 4,
      player1: "",
      player2: "0x64dbad4e0a22268d82d6c6bcfd2d169414c45fd6",
    },
  }),

  actions: {
    startGame: async function () {
      const { address, signer } = useEthers();
      // const ethNodeUrl = "wss://devnet.ws.zama.ai/";
      // const provider = new ethers.WebSocketProvider(ethNodeUrl);

      // const contractWebSocket = new Contract(
      //   this.gameContractAddress,
      //   gameAbi,
      //   provider
      // );

      // contractWebSocket.on(
      //   "NewGameCreated",
      //   (gameId, boardWidth, boardHeight, player1, player2) => {
      //     console.log(
      //       "websocket event",
      //       gameId,
      //       boardWidth,
      //       boardHeight,
      //       player1,
      //       player2
      //     );
      //     console.log("websocket address", address);
      //     if (player1 == address.value || player2 == address.value) {
      //       console.log(
      //         `New Game created! GameId: ${gameId.toString()}, BoardWidth: ${boardWidth.toString()}, BoardHeight: ${boardHeight.toString()}, Player1: ${player1.toString()}, Player2: ${player2.toString()}`
      //       );
      //       this.getGamesCreated().then(() => {
      //         this.loading = false;
      //         this.gameSelected = Number(gameId);
      //       });
      //     }
      //   }
      // );
      // contractWebSocket.on(
      //   "TurnPlayed",
      //   (isBuilding, player, row, column, gameId) => {
      //     console.log(
      //       "websocket TurnPlayed",
      //       isBuilding,
      //       player,
      //       row,
      //       column,
      //       gameId
      //     );
      //     console.log("websocket address", address);

      //     if (this.gameSelected == gameId) {
      //       this.loading = true;
      //       this.getBoardData().then(() => {
      //         this.loading = false;
      //       });
      //     }
      //   }
      // );
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      let board_width = 4;
      let board_height = 4;

      console.log("players", this.newGame.player1, this.newGame.player2);

      this.loading = true;
      const transaction = await contract[
        "newGame(uint8,uint8,address,address)"
      ](board_width, board_height, this.newGame.player1, this.newGame.player2);

      let tx = await transaction.wait().then((receipt: any) => {
        console.log("receipt", receipt);
      });

      await this.getGamesCreated().then(() => {
        this.loading = false;
        this.gameSelected =
          this.newGameEvents[this.newGameEvents.length - 1].newGameId;
      });
      //this.loading = false;
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
      // this.loading = false;
      // console.log()
      // this.gameSelected = gameId;
      //this.newGameEvents = eventData;
    },
    getBoardData: async function () {
      this.loading = true;
      await this.getUserGrid();
      await this.getOpGrid();
      await this.getGameStatus();
      this.loading = false;
    },
    getPastEvents: async function (contract: any, filter: any) {
      try {
        // Replace with specific block numbers or use 'latest' for the most recent block
        const fromBlock = this.blockStart;
        await this.getLatestBlock();
        
        let toBlock = fromBlock;
        let events=[]
        while (toBlock < this.latestBlock){
          toBlock = Math.min(toBlock+10000, this.latestBlock);
          const new_events = await contract.queryFilter(filter, fromBlock, toBlock);  
          events.push(...new_events);
        }
        
        return events;
      } catch (error) {
        console.error(`Error fetching events: ${error}`);
        return [];
      }
    },
    selectGame: function (gameId: number) {
      this.gameSelected = gameId;
    },
    build: async function (building: number) {
      this.loading = true;
      const { address, signer } = useEthers();
      const { instance } = useFhevmStore();

      let emptyCells: any = [];

      this.userGrid.map((row, index) => {
        if (row[this.selectedPosition.colIndex] === 0) {
          emptyCells.push(index);
        }
      });

      const playableRow =
        this.getSelectedGame.boardHeight -
        emptyCells[emptyCells.length - 1] -
        1;

      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      if (instance) {
        const encryptedValue = instance.encrypt8(building);
        const transaction = await contract["build(uint, uint8,uint8,bytes)"](
          this.getSelectedGame.newGameId,
          playableRow,
          this.selectedPosition.colIndex,
          encryptedValue
        );
        let tx = await transaction.wait().then((receipt: any) => {
          const displayRowToUpdate = this.userGrid.length - playableRow - 1;
          this.userGrid[displayRowToUpdate][this.selectedPosition.colIndex] =
            building;

          console.log("receipt ", receipt);
        });
        await this.getGameStatus().then(() => {
          this.loading = false;
        });
      }
    },
    attack: async function () {
      const { signer } = useEthers();

      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      try {
        const gasLimit = BigInt("1000000");

        const transactionResponse = await contract.sendMissile(
          this.getSelectedGame.newGameId,
          this.selectedPosition.rowIndex,
          {
            gasLimit: gasLimit,
          }
        );

        console.log("Transaction hash:", transactionResponse.hash);

        // Awaiting the transaction to be confirmed
        const receipt = await transactionResponse.wait();

        console.log("Transaction confirmed, receipt:", receipt);
      } catch (error) {
        console.error("Transaction error:", error);
      }

      await this.getOpGrid().then(() => {});

      await this.getGameStatus().then(() => {
        this.loading = false;
      });
    },
    getUserGrid: async function () {
      const { address, signer } = useEthers();
      const { instance, signPublicKey, savedToken } = useFhevmStore();

      //we fetch user building states to avoid decrypting unecessary cells
      await this.getUserBuildingStates();
      console.log("user building  states are", this.userBuildingStates);

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      let gToken;
      let gSignature;

      if (!savedToken) {
        const { generatedToken, signature } = await signPublicKey(
          this.gameContractAddress,
          signerInstance
        );
        gToken = generatedToken;
        gSignature = signature;
      } else {
        gToken = savedToken.generatedToken;
        gSignature = savedToken.signature;
      }

      let gameId = this.gameSelected;
      try {
        const game = await contract.games(gameId);
        this.gameStatus = Number(game.game_state);
        console.log("gameState", Number(game.game_state));
      } catch (error) {
        console.error("Error:", error);
      }

      let agg = [];
      // Fetch the board data
      for (let row = 0; row < this.gridSize.height; row++) {
        let boardRow = [];
        for (let col = 0; col < this.gridSize.width; col++) {          
          // make a decryption call only if the cell is not empty
          if (this.userBuildingStates[row*this.gridSize.width+col]==true){
            let cellValue = await contract.getBoardValue(
              gameId,
              row,
              col,
              gToken.publicKey,
              gSignature
            );
            boardRow.push(instance?.decrypt(this.gameContractAddress, cellValue));
          }else{
            boardRow.push(0);
          }          
        }
        agg.unshift(boardRow);
      }
      this.userGrid = agg;
    },
    getOpGrid: async function () {
      const { address, signer } = useEthers();
      const { instance } = useFhevmStore();

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      let gameId = this.gameSelected;
      try {
        const game = await contract.games(gameId);
        this.gameStatus = Number(game.game_state);
        console.log("gameState", Number(game.game_state));
      } catch (error) {
        console.error("Error:", error);
      }
      this.opGrid = [];

      let aggOpGrid = [];
      let buildings_states = contract.getBuildingStates(gameId, address.value != this.getSelectedGame.player1);
      let index=0;
      for (let row = 0; row < this.gridSize.height; row++) {
        let opBoardRow = [];
        for (let col = 0; col < this.gridSize.width; col++) {
          opBoardRow.push(buildings_states[index]);
          index+=1;
        }
        aggOpGrid.unshift(opBoardRow);
      }      
      this.opGrid = aggOpGrid;
    },
    getGameStatus: async function () {
      const { address, signer } = useEthers();
      const { instance } = useFhevmStore();

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      let gameId = this.gameSelected;
      try {
        const game = await contract.games(gameId);
        this.gameStatus = Number(game.game_state);
        console.log("gameState", Number(game.game_state));
      } catch (error) {
        console.error("Error:", error);
      }
    },
    getUserBuildingStates: async function () {
      const { address, signer } = useEthers();
      const { instance } = useFhevmStore();

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      let gameId = this.gameSelected;
      this.userBuildingStates = await contract.getBuildingStates(
        gameId,
        address.value == this.getSelectedGame.player1
      );
    },
    getGameResult: async function () {
      const { address, signer } = useEthers();
      const { instance, signPublicKey, savedToken } = useFhevmStore();

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      );

      let gToken;
      let gSignature;

      if (!savedToken) {
        const { generatedToken, signature } = await signPublicKey(
          this.gameContractAddress,
          signerInstance
        );
        gToken = generatedToken;
        gSignature = signature;
      } else {
        gToken = savedToken.generatedToken;
        gSignature = savedToken.signature;
      }

      let gameId = this.gameSelected;

      let gameResult = await contract.getGameResult(
        gameId,
        gToken.publicKey,
        gSignature
      );

      this.gameResult = instance?.decrypt(this.gameContractAddress, gameResult);
    },
    getLatestBlock: async function () {
      const { provider } = useEthers();
      const blockNumber = await provider.value.getBlock("latest");
      this.latestBlock = blockNumber.number;
    },    
  },
  getters: {
    gridVariation: (state) => {},
    getSelectedGame: (state) => {
      return state.newGameEvents.filter(
        (game: NewGameEvent) => game.newGameId === state.gameSelected
      )[0];
    },
    getGameStatusLabel(state) {
      switch (state.gameStatus) {
        case GameStatus._uninitialized:
          return "Uninitialized";
        case GameStatus._player1Turn:
          return "Player 1's Turn";
        case GameStatus._player2Turn:
          return "Player 2's Turn";
        case GameStatus._gameEnded:
          return "Game Ended";
        default:
          return "Unknown State";
      }
    },
    getUserPlayer(state) {
      const { address } = useEthers();

      if (state.gameSelected) {
        const selectedGame = state.newGameEvents.filter(
          (game: NewGameEvent) => game.newGameId === state.gameSelected
        )[0];

        if (selectedGame.player1 === address.value) {
          return 1;
        } else if (selectedGame.player2 === address.value) {
          return 2;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }, 
  },
});
