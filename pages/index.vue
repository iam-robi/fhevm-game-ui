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
            gameStore.gameSelected != null &&
            gameStore.userGrid.length > 0
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
                    <div v-if="cellValue == 1" class="text-4xl">?</div>
                    <div v-if="cellValue == 2" class="text-4xl">💥</div>
                  </div>
                </div>

                <button
                  :disabled="
                    gameStore.selectedPosition.gridIndex != 1 || notYourTurn() || gameStore.gameState==3 || !canSendMissile()
                  "
                  @click="attack"
                  class="btn btn-accent w-full mt-4"
                >
                  {{getMissileLabel()}}
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
                    <span v-if="cellValue === 3" class="text-4xl"> 💥 </span>
                  </div>
                </div>

                <button
                  :disabled="
                    gameStore.selectedPosition.gridIndex != 2 ||
                    notYourTurn() ||
                    columnFull() ||
                    gameStore.gameState==3
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
                    columnFull() ||
                    gameStore.gameState==3
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
import Navbar from "@/components/layout/Navbar.vue";
import LayoutHeroBanner from "@/components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "@/store/game/game.index";
import { BrowserProvider } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";
import { useEthers, useEthersHooks, useWallet } from "vue-dapp";
import { useFhevmStore } from "@/store/fhevm/fhevm.index";
const { onActivated, onDeactivated, onChanged } = useEthersHooks();

const wallet = useWallet();

// update regularly if required
useIntervalFn(() => {
  if (wallet.wallet.status == "connected") {    
    gameStore.checkUpdate();
  }
}, 10000);

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
  gameStore.getLatestBlock();
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
  return [column, gameStore.gridSize.width - 1 - row];
};

// rotate right to cancel the left rotation of the grid
const rotateClickRight = function (row, column) {
  return [
    gameStore.gridSize.height - 1 - column,
    gameStore.gridSize.width - 1 - row,
  ];
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
  return gameStore.userGrid[0][gameStore.selectedPosition.colIndex];
};

const notYourTurn = function () {
  return (
    (gameStore.gameState == 1 && !gameStore.isPlayer1) ||
    (gameStore.gameState == 2 && gameStore.isPlayer1)
  );
};

const canSendMissile = function() {
  return (gameStore.player1_can_send_missile && gameStore.isPlayer1) ||
  (gameStore.player2_can_send_missile && !gameStore.isPlayer1);
}

const cellPopOut = function (gridIndex, rowIndex, colIndex) {
  if (notYourTurn() || gameStore.gameState==3) {
    return false;
  }

  if (gridIndex==1 && !canSendMissile()){
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

const getMissileLabel = function() {
  if (canSendMissile()){
    return `Send Missile 🚀 at row ${gameStore.gridSize.width - gameStore.selectedPosition.colIndex}`;
  }else{
    return "Cannot send Missile 🚀 this turn";
  }
}

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
