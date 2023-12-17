<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>

    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >
        <span
          v-if="gameStore.loading"
          class="loading loading-bars loading-lg"
        ></span>

        <!-- Grids Section -->
        <div
          v-if="
            !gameStore.loading &&
            gameStore.gameSelected >= 0 &&
            gameStore.userGrid.length > 0 &&
            gameStore.gameStatus != 3
          "
        >
          <div class="flex justify-center items-center">
            <div class="w-full flex flex-row space-x-6 p-10 card rounded-box">
              <!-- Opponent Grid -->
              <div class="flex flex-col">
                <br /><br />
                <div
                  v-for="(row, rowIndex) in gameStore.opGridRotated"
                  :key="rowIndex"
                  class="flex"
                >
                  <div
                    v-for="(cellValue, colIndex) in row"
                    :key="colIndex"
                    :class="[
                      'w-20 h-20 flex justify-center items-center halo-effect pop-out-effect border-2 border-accent ',
                      cellPopOut(1, rowIndex, colIndex) ? 'pop-out-active' : '',
                      cellValue ? 'glass-effect' : '',
                    ]"
                    @click="handleCellClick(1, rowIndex, colIndex, $event)"
                  >
                    <div v-if="cellValue" class="text-4xl">?</div>
                  </div>
                </div>

                <button
                  :disabled="
                    gameStore.selectedPosition.gridIndex != 1 || notYourTurn()
                  "
                  @click="attack"
                  class="btn btn-accent w-full mt-4"
                >
                  Send Missile 🚀 at row
                  {{
                    gameStore.gridSize.width -
                    gameStore.selectedPosition.colIndex
                  }}
                </button>
              </div>
              <!-- Player Grid -->
              <div class="flex flex-col">
                <br /><br />
                <div
                  v-for="(row, rowIndex) in gameStore.userGridRotated"
                  :key="rowIndex"
                  class="flex"
                >
                  <div
                    v-for="(cellValue, colIndex) in row"
                    :key="colIndex"
                    :class="[
                      'w-20 h-20 flex justify-center items-center halo-effect pop-out-effect border-2 border-success',
                      cellPopOut(2, rowIndex, colIndex) ? 'pop-out-active' : '',
                    ]"
                    @click="handleCellClick(2, rowIndex, colIndex, $event)"
                  >
                    <span v-if="cellValue === 1" class="text-4xl"> 🏠 </span>
                    <span v-if="cellValue === 2" class="text-4xl"> 🏰 </span>
                  </div>
                </div>
                <!-- <button @click="play" class="btn btn-success w-full mt-4">
                  Play
                </button> -->
                <button
                  :disabled="
                    gameStore.selectedPosition.gridIndex != 2 ||
                    notYourTurn() ||
                    columnFull()
                  "
                  @click="build(BuildingStatus._house)"
                  class="btn btn-success w-full mt-4"
                >
                  Build House 🏠 at row
                  {{
                    gameStore.gridSize.width -
                    gameStore.selectedPosition.colIndex
                  }}
                </button>
                <button
                  :disabled="
                    gameStore.selectedPosition.gridIndex != 2 ||
                    notYourTurn() ||
                    columnFull()
                  "
                  @click="build(BuildingStatus._bunker)"
                  class="btn btn-success w-full mt-4"
                >
                  Build Bunker 🏰 at row
                  {{
                    gameStore.gridSize.width -
                    gameStore.selectedPosition.colIndex
                  }}
                </button>
                <!-- <button @click="encrypt" class="btn btn-success w-third mt-4">
                  Encrypt
                </button> -->
                <!-- <button
                  @click="createNewGame"
                  class="btn btn-success w-third mt-4"
                >
                  Start Game
                </button> -->
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            !gameStore.loading &&
            gameStore.getSelectedGame &&
            gameStore.userGrid.length == 0
          "
          class="emoji-container"
        >
          <h1 class="large-emoji">🔐</h1>
          <span font-style="italic">Game is Encrypted </span>
          <button @click="getBoardData" class="btn btn-success w-third mt-4">
            Decrypt game
          </button>
        </div>

        <div v-if="!gameStore.loading && gameStore.gameSelected == null">
          <FormNewGame></FormNewGame>
        </div>
        <div v-if="!gameStore.gameStatus == 3">
          <button @click="getGameResult" class="btn btn-success w-third mt-4">
            Get Game Result
          </button>

          <div v-if="gameStore.gameResult == 0">Player 1 won !</div>
          <div v-if="gameStore.gameResult == 1">Player 2 won !</div>
          <div v-if="gameStore.gameResult == 2">It was a tie !</div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >
        <!-- Input section -->
      </div>
    </div>

    <!-- <NuxtSnackbar /> -->
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "/store/game/game.index";
import { BrowserProvider } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";
import { useEthers, useEthersHooks } from "vue-dapp";
import { useFhevmStore } from "/store/fhevm/fhevm.index";
const { onActivated, onDeactivated, onChanged } = useEthersHooks();

const fhevmStore = useFhevmStore();
const createFhevmInstance = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();
  const publicKey = await provider.call({
    from: null,
    to: "0x0000000000000000000000000000000000000044",
  });
  fhevmStore.publicKey = publicKey;
  return createInstance({ chainId, publicKey });
};

const init = async () => {
  await initFhevm(); // Load TFHE
  return createFhevmInstance();
};

onActivated(({ provider, address, signer }) => {
  gameStore.getGamesCreated();
  console.group("wallet activated");
});
onDeactivated(() => {
  console.log("deactivated");
});
onChanged(() => {
  gameStore.getGamesCreated();
  console.log("account change");
});

const gameStore = useGameStore();
const handleCellClick = (gridIndex, rowIndex, colIndex, event) => {
  let updatedRowIndex = rowIndex;
  let updatedColIndex = colIndex;

  if (gridIndex === 1) {
    [updatedRowIndex, updatedColIndex] = rotateClickRight(rowIndex, colIndex);
  } else if (gridIndex === 2) {
    [updatedRowIndex, updatedColIndex] = rotateClickLeft(rowIndex, colIndex);
  } else {
    throw new Error("gridIndex should be 1 or 2");
  }

  if (
    (gridIndex == gameStore.selectedPosition.gridIndex &&
      updatedRowIndex == gameStore.selectedPosition.rowIndex &&
      updatedColIndex == gameStore.selectedPosition.colIndex) ||
    notYourTurn()
  ) {
  } else {
    gameStore.selectedPosition = {
      gridIndex: gridIndex,
      rowIndex: updatedRowIndex,
      colIndex: updatedColIndex,
    };
  }
  console.log(
    `Grid: ${gridIndex}, Row: ${updatedRowIndex}, Column: ${updatedColIndex}`
  );
};

// rotate left to cancel the right rotation of the grid
const rotateClickLeft = function (row, column) {
  return [column, gameStore.gridSize.height - 1 - row];
};

// rotate right to cancel the left rotation of the grid
const rotateClickRight = function (row, column) {
  return [
    gameStore.gridSize.width - 1 - column,
    gameStore.gridSize.height - 1 - row,
  ];
};

const updateOpGrid = async function () {
  console.log("updateOpGrid");
  gameStore.getOpGrid();
  gameStore.getGameStatus();
};

const updateUserGrid = async function () {
  console.log("updateUserData");
  gameStore.getUserGrid();
  gameStore.getGameStatus();
};

// const toast = useToast();
// Initialize noir when the component is mounted
const snackbar = useSnackbar();
const { instance, savedToken } = useFhevmStore();
onMounted(async () => {
  init().then((instance) => {
    console.log(instance);
    fhevmStore.instance = instance;
  });
  console.log("mounted");
  const ethNodeUrl = "wss://devnet.ws.zama.ai/";

  await gameStore.getLatestBlock();

  // const provider = new ethers.WebSocketProvider(ethNodeUrl);

  // const contractWebSocket = new Contract(
  //   gameStore.gameContractAddress,
  //   gameAbi,
  //   provider
  // );

  // contractWebSocket.on(
  //   "NewGameCreated",
  //   async (gameId, boardWidth, boardHeight, player1, player2) => {
  //     console.log("websocket NewGameCreated", gameId, player1, player2);
  //     if (player1 == address.value || player2 == address.value) {
  //       console.log(
  //         `New Game created! GameId: ${gameId.toString()}, BoardWidth: ${boardWidth.toString()}, BoardHeight: ${boardHeight.toString()}, Player1: ${player1.toString()}, Player2: ${player2.toString()}`
  //       );
  //       await gameStore.getGamesCreated().then(() => {
  //         gameStore.loading = false;
  //         gameStore.gameSelected = Number(gameId);
  //       });
  //     }
  //   }
  // );
  // contractWebSocket.on(
  //   "TurnPlayed",
  //   async (gameId, player, isBuilding, row, column, gameState) => {
  //     console.log(
  //       "websocket TurnPlayed",
  //       isBuilding,
  //       player,
  //       row,
  //       column,
  //       gameState,
  //       Number(gameId)
  //     );

  //     console.log(
  //       "gameStore.gameSelected == Number(gameId)",
  //       gameStore.gameSelected == Number(gameId)
  //     );

  //     console.log("player != address.value", player != address.value);

  //     if (gameStore.gameSelected == Number(gameId) && player != address.value) {
  //       console.log("doing stuff in websocket");
  //       if (isBuilding) {
  //         gameStore.opGrid[gameStore.opGrid.length - Number(row) - 1][
  //           Number(column)
  //         ] = true;
  //       } else {
  //         console.log("it's a missile!!!!!");
  //       }
  //       // await gameStore.getBoardData();
  //       // await gameStore.getOpGrid();
  //       // await gameStore.getGameStatus();
  //       gameStore.loading = false;
  //     }
  //   }
  // );
});

onBeforeUnmount(() => {
  console.log("befor unmount");
});

const getGamesCreated = async function () {
  gameStore.getGamesCreated();
  console.log("startGame");
};
const getBoardData = async function () {
  console.log("getBoardData");
  gameStore.getBoardData();
};

const encrypt = async function () {
  await fhevmStore.encrypt(5);
};

const columnFull = function () {
  return gameStore.userBuildingStates[gameStore.selectedPosition.colIndex];
};

const notYourTurn = function () {
  return (
    (gameStore.gameStatus == 1 && !gameStore.isPlayer1) ||
    (gameStore.gameStatus == 2 && gameStore.isPlayer1)
  );
};

const cellPopOut = function (gridIndex, rowIndex, colIndex) {
  if (notYourTurn()) {
    return false;
  }

  let updatedRowIndex = rowIndex;
  let updatedColIndex = colIndex;

  if (gridIndex === 1) {
    [updatedRowIndex, updatedColIndex] = rotateClickRight(rowIndex, colIndex);
  } else if (gridIndex === 2) {
    [updatedRowIndex, updatedColIndex] = rotateClickLeft(rowIndex, colIndex);
  } else {
    throw new Error("gridIndex should be 1 or 2");
  }

  if (gridIndex == 2 || gridIndex == 1) {
    return (
      gridIndex === gameStore.selectedPosition.gridIndex &&
      updatedColIndex === gameStore.selectedPosition.colIndex
    );
  } else {
    return false;
  }
};

const attack = async function () {
  console.log("attack");
  await gameStore.attack();
};

const build = async function (buildingType) {
  console.log("build");
  await gameStore.build(buildingType);
};
const play = async function () {
  console.log("play", fhevmStore.instance);

  try {
    await gameStore.play();
    snackbar.add({
      type: "success",
      text: "Your proof was successfully verified on-chain !",
    });
  } catch (err) {
    snackbar.add({
      type: "error",
      text: err,
    });
  }
};

// TODO : DEBUG to work with the rest
// onKeyStroke("ArrowDown", (e) => {
//   console.log("keystroke arrow down");
//   if (gameStore.selectedPosition.gridIndex == 0) {
//     gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
//   }
//   if (
//     gameStore.selectedPosition.gridIndex > 0 &&
//     gameStore.selectedPosition.rowIndex < 4
//   ) {
//     gameStore.selectedPosition.rowIndex =
//       gameStore.selectedPosition.rowIndex + 1;
//   }
//   e.preventDefault();
// });
// onKeyStroke("ArrowRight", (e) => {
//   if (gameStore.selectedPosition.gridIndex == 0) {
//     gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
//   }
//   if (gameStore.selectedPosition.gridIndex == 1) {
//     gameStore.selectedPosition.colIndex = 0;
//     gameStore.selectedPosition.gridIndex = 2;
//   }

//   if (
//     gameStore.selectedPosition.gridIndex > 0 &&
//     gameStore.selectedPosition.colIndex < 4
//   ) {
//     gameStore.selectedPosition.colIndex =
//       gameStore.selectedPosition.colIndex + 1;
//   }
//   e.preventDefault();
// });
// onKeyStroke(["b", "B"], (e) => {
//   console.log("keystroke b");
//   gameStore.selectedBuilding = 1;
//   e.preventDefault();
// });
// onKeyStroke(["h", "H"], (e) => {
//   console.log("keystroke h");
//   gameStore.selectedBuilding = 2;
//   e.preventDefault();
// });
// onKeyStroke(["e", "E"], (e) => {
//   console.log("keystroke e");
//   gameStore.selectedBuilding = 0;
//   e.preventDefault();
// });
// onKeyStroke(["Esc"], (e) => {
//   console.log("keystroke escape");
//   gameStore.selectedPosition = { gridIndex: 0, rowIndex: 0, colIndex: 0 };
//   gameStore.selectedBuilding = 0;
//   e.preventDefault();
// });
// onKeyStroke("ArrowLeft", (e) => {
//   if (gameStore.selectedPosition.gridIndex == 0) {
//     gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
//   }
//   if (
//     gameStore.selectedPosition.gridIndex == 2 &&
//     gameStore.selectedPosition.colIndex == 1
//   ) {
//     gameStore.selectedPosition.colIndex = 5;
//     gameStore.selectedPosition.gridIndex = 1;
//   }

//   if (
//     gameStore.selectedPosition.gridIndex > 0 &&
//     gameStore.selectedPosition.colIndex > 1
//   ) {
//     gameStore.selectedPosition.colIndex =
//       gameStore.selectedPosition.colIndex - 1;
//   }
//   e.preventDefault();
// });
// onKeyStroke("ArrowUp", (e) => {
//   console.log("keystroke araow down");
//   if (gameStore.selectedPosition.gridIndex == 0) {
//     gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
//   }
//   if (
//     gameStore.selectedPosition.gridIndex > 0 &&
//     gameStore.selectedPosition.rowIndex > 1
//   ) {
//     gameStore.selectedPosition.rowIndex =
//       gameStore.selectedPosition.rowIndex - 1;
//   }
//   e.preventDefault();
// });
</script>
<style scoped>
.halo-effect {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.glass-effect {
  background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent white */
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.pop-out-effect {
  transition: transform 0.3s ease;
}
.loading-bars {
  animation: loadingAnimation 2s infinite linear;
}

.pop-out-active {
  transform: scale(1.2) translateZ(15px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  background-color: rgba(
    255,
    255,
    255,
    0.2
  ); /* Semi-transparent white for glass effect */
  backdrop-filter: blur(10px); /* Blur for glass effect */
}
.emoji-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}
.large-emoji {
  font-size: 100px; /* Adjust the size as needed */
}
</style>
