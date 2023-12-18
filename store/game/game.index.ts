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

function transpose(array2D) {
  const rows = array2D.length;
  const cols = array2D.reduce((maxCols, row) => Math.max(maxCols, row.length), 0);

  const result = [];
  for (let i = 0; i < cols; i++) {
    result.push([]);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (array2D[i][j] !== undefined) {
        result[j][i] = array2D[i][j];
      }
    }
  }
  return result;
}

// flip horizontally a 2D array
function flipHorizontal(array2D) {
  return array2D.map((row) => row.slice().reverse());
}

// flip vertically a 2D array
function flipVertical(array2D) {
  return array2D.slice().reverse();
}

// rotates a 2D array to the right
function rotate_right(array2D) {
  return flipVertical(transpose(array2D));
}

// rotates a 2D array to the left
function rotate_left(array2D) {
  return flipHorizontal(rotate_right(array2D));
}

// compares two 2D arrays
function cloneArray2D(array) {
  const new_array = [];

  for (let i = 0; i < array.length; i++) {
    const new_sub_array = [];

    for (let j = 0; j < array[i].length; j++) {
      new_sub_array.push(array[i][j]);
    }
    new_array.push(new_sub_array);
  }

  return new_array;
}

export const useGameStore = defineStore("gameStore", {
  state: (): GameStoreState => ({
    loading: false,
    // TODO: user can chose the board size at game creation
    gridSize: { width: 4, height: 4 },
    maxTurns: null,
    selectedPosition: {
      gridIndex: 0,
      rowIndex: 0,
      colIndex: 0,
    },
    selectedBuilding: 0,
    gameContractAddress: "0xaDCE6E593dE93309e068a9b1B9e2E36C3D8c8655",
    blockStart: 113051,
    latestBlock: null,
    newGameEvents: [],
    gameSelected: null,
    gameState: null,
    previousGameState: null,
    userGrid: [],
    previousUserGrid: [],
    userGridRotated: [],
    userBuildingStates: [],
    opGrid: [],
    previousOpGrid: [],
    opGridRotated: [],
    gameResult: null,
    isPlayer1: null,
    turns: 0,
    player1_can_send_missile: true,
    player2_can_send_missile: true,

    newGame: {
      gridWidth: 4,
      gridHeight: 4,
      player1: "",
      player2: "",
    },
  }),

  actions: {
    startGame: async function () {
      const { address, signer } = useEthers();

      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signer.value
      );

      let gridWidth = this.newGame.gridWidth;
      let gridHeight = this.newGame.gridHeight;

      this.maxTurns = this.gridSize.width*this.gridSize.height;

      console.log("players", this.newGame.player1, this.newGame.player2);

      this.loading = true;
      const transaction = await contract[
        "newGame(uint8,uint8,address,address)"
      ](gridWidth, gridHeight, this.newGame.player1, this.newGame.player2);

      let tx = await transaction.wait().then((receipt: any) => {
        console.log("receipt", receipt);
      });

      await this.getGamesCreated().then(() => {
        this.loading = false;
        this.gridSize.width = gridWidth;
        this.gridSize.height = gridHeight;
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
          gridWidth: parseInt(args[1].toString()),
          gridHeight: parseInt(args[2].toString()),
          player1: args[3],
          player2: args[4],
        };
      });

      // Now parsedEvents contains an array of NewGameEvent objects
      // You can assign it to your store's state or process it as needed
      this.newGameEvents = parsedEvents;
    },
    getBoardData: async function (getStatus=true) {

      this.previousGameState = this.gameState;
      this.loading = true;
      await this.getUserGrid();
      this.selectedPosition.gridIndex = 2;
      this.selectedPosition.colIndex = this.gridSize.width-1;
      await this.getOpGrid();
      if(getStatus){
        await this.getGameState();
      }
      this.loading = false;
    },
    checkUpdate: async function (){
      // update latest block and game state
      this.getLatestBlock();

      // don't update the game state if it has ended
      if(this.gameState==3){
        return;
      }
      
      await this.getGameState();
      // if game state changed and previous state was other player turn
      // it means it is now our turn to play, so you have to decrypt your board
      if (this.gameState != this.previousGameState){        
        if ((this.previousGameState==2 && this.isPlayer1) || 
          (this.previousGameState==1 && !this.isPlayer1)){
          // reseting grid will trigger the "decrypt button" and force user to reload
          this.userGrid = [];
          this.userGridRotated = [];
          this.opGrid = [];
          this.opGridRotated = [];
        }
        this.previousGameState = this.gameState;
      }
    },
    getPastEvents: async function (contract: any, filter: any) {
      try {
        // Replace with specific block numbers or use 'latest' for the most recent block
        const fromBlock = this.blockStart;
        await this.getLatestBlock();

        let toBlock = fromBlock;
        let events = [];
        while (toBlock < this.latestBlock) {
          toBlock = Math.min(toBlock + 10000, this.latestBlock);
          const new_events = await contract.queryFilter(
            filter,
            fromBlock,
            toBlock
          );
          events.push(...new_events);
        }

        return events;
      } catch (error) {
        console.error(`Error fetching events: ${error}`);
        return [];
      }
    },
    build: async function (building: number) {
      this.loading=true;
      const { address, signer } = useEthers();
      const { instance } = useFhevmStore();

      let emptyCells: any = [];

      this.userGrid.map((row, index) => {
        if (row[this.selectedPosition.colIndex] === 0) {
          emptyCells.push(index);
        }
      });

      const playableRow =
        this.getSelectedGame.gridHeight -
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
        try{
          await this.getGameState();
          await this.getUserGrid();
          this.loading=false;
        }catch (error){        
        }
      }
    },
    attack: async function () {
      this.loading=true;
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
          this.selectedPosition.colIndex,
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

      try{
        await this.getGameState();
        await this.getOpGrid();
        this.loading = false;
      }catch (error){        
      }
    },
    getUserGrid: async function () {

      const { address, signer } = useEthers();
      const { instance, signPublicKey, savedToken } = useFhevmStore();

      //we fetch user building states to avoid decrypting unecessary cells
      await this.getUserBuildingStates();

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
        this.gameState = Number(game.game_state);
      } catch (error) {
        console.error("Error:", error);
      }

      let agg = [];
      // Fetch the board data
      // TODO: only call decryption to buildings that have changed, and not all of them every time
      for (let row = 0; row < this.gridSize.height; row++) {
        let boardRow = [];
        for (let col = 0; col < this.gridSize.width; col++) {
          // make a decryption call only if the cell is not empty
          if (
            this.userBuildingStates[row * this.gridSize.width + col] == true
          ) {
            let cellValue = await contract.getBoardValue(
              gameId,
              row,
              col,
              gToken.publicKey,
              gSignature
            );
            boardRow.push(
              instance?.decrypt(this.gameContractAddress, cellValue)
            );
          } else {
            boardRow.push(0);
          }
        }
        agg.unshift(boardRow);
      }
      this.userGrid = agg;

      // check if some houses where destroyed
      if (this.previousUserGrid.length > 0 && this.userGrid.length > 0){
        for (let i = 0; i < this.userGrid.length; i++) {
          for (let j = 0; j < this.userGrid[0].length; j++) {
            if (this.previousUserGrid[i][j] == 1 && this.userGrid[i][j] == 0) {
              this.userGrid[i][j] = 3; // put explosion when a house was destroyed
            }
          }
        }        
      }

      this.previousUserGrid = cloneArray2D(this.userGrid);

      // also create a rotated version of the grid for horizontal display
      this.userGridRotated = rotate_right(this.userGrid);
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
        this.gameState = Number(game.game_state);
      } catch (error) {
        console.error("Error:", error);
      }
      this.opGrid = [];

      let aggOpGrid = [];
      let buildings_states = await contract.getBuildingStates(
        gameId,
        address.value != this.getSelectedGame.player1
      );
      let index = 0;
      for (let row = 0; row < this.gridSize.height; row++) {
        let opBoardRow = [];
        for (let col = 0; col < this.gridSize.width; col++) {
          opBoardRow.push(buildings_states[index]*1);
          index += 1;
        }
        aggOpGrid.unshift(opBoardRow);
      }
      this.opGrid = aggOpGrid;

      // check if some houses where destroyed
      if (this.previousOpGrid.length > 0 && this.opGrid.length > 0){
        for (let i = 0; i < this.opGrid.length; i++) {
          for (let j = 0; j < this.opGrid[0].length; j++) {
            if (this.previousOpGrid[i][j] == 1 && this.opGrid[i][j] == 0) {
              this.opGrid[i][j] = 2; // put explosion when a house was destroyed
            }
          }
        }        
      }

      this.previousOpGrid = cloneArray2D(this.opGrid);

      // also create a rotated version of the grid for horizontal display
      this.opGridRotated = rotate_left(this.opGrid);
    },
    getGameState: async function () {

      if(this.gameSelected == null){
        return;
      }

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
        this.gameState = Number(game.game_state);
        this.turns = Number(game.turns);
        this.player1_can_send_missile = Boolean(game.player1_can_send_missile);
        this.player2_can_send_missile = Boolean(game.player2_can_send_missile);
      } catch (error) {
        console.error("Error:", error);
      }

      this.isPlayer1 = address.value == this.getSelectedGame.player1;

      if(this.gameState==3){ // game has ended, querry result
        this.getGameResult();
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
      const { instance } = useFhevmStore();

      const signerInstance = signer.value as Signer;
      const contract = new Contract(
        this.gameContractAddress,
        gameAbi,
        signerInstance
      ); 

      let gameId = this.gameSelected;

      this.gameResult = await contract.getGameResult(gameId);
    },
    getLatestBlock: async function () {
      const { provider } = useEthers();
      if (provider.value) {
        const blockNumber = await provider.value.getBlock("latest");
        this.latestBlock = blockNumber.number;
      }
    },
  },
  getters: {
    gridVariation: (state) => {},
    getSelectedGame: (state) => {
      return state.newGameEvents.filter(
        (game: NewGameEvent) => game.newGameId === state.gameSelected
      )[0];
    },
    getGameTurnsLabel(state) {
      switch (state.gameState) {
        case GameStatus._uninitialized:
          return `Turn ${this.turns}/${this.maxTurns}`;
        case GameStatus._player1Turn:
          return `Turn ${this.turns}/${this.maxTurns}`;
        case GameStatus._player2Turn:
          return `Turn ${this.turns}/${this.maxTurns}`;
        case GameStatus._gameEnded:
          return `Turn ${this.turns}/${this.maxTurns}`;
        default:
          return "No game selected";
      }
    },
    getGameStateLabel(state) {
      switch (state.gameState) {
        case GameStatus._uninitialized:
          return "Uninitialized";
        case GameStatus._player1Turn:
          if (state.isPlayer1) {
            return `YOU PLAY`;
          }else{
            return `OPPONENT PLAYS`;
          }
        case GameStatus._player2Turn:
          if (state.isPlayer1) {
            return `OPPONENT PLAYS`;
          }else{
            return `YOU PLAY`;
          }
        case GameStatus._gameEnded:
          if(this.gameResult==0){            
            if (state.isPlayer1) {
              return "Game Ended: YOU WON!";
            }else{
              return "Game Ended: YOU LOST!";
            }
          }else if(this.gameResult==1){            
            if (state.isPlayer1) {
              return "Game Ended: YOU LOST!";
            }else{
              return "Game Ended: YOU WON!";
            }
          }else if(this.gameResult==2){            
            return "Game Ended: TIE!";
          }else{
            return "Game Ended: wait...";
          }
        default:
          return "No game selected";
      }
    },
    getPlayerName1(state) {
      if (state.isPlayer1 == null) {
        return "Player 1 :";
      }
      if (state.isPlayer1) {
        return "You :";
      } else {
        return "Opponent :";
      }
    },
    getPlayerName2(state) {
      if (state.isPlayer1 == null) {
        return "Player 2 :";
      }
      if (state.isPlayer1) {
        return "Opponent :";
      } else {
        return "You :";
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
