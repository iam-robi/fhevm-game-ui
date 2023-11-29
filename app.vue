<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>

    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >
        <!-- Grids Section -->
        <div
          v-if="gameStore.gameSelected >= 0 && gameStore.gameData.length > 0"
        >
          <div class="flex justify-center items-center">
            <div class="w-full flex flex-row space-x-6 p-10 card rounded-box">
              <!-- Opponent Grid -->
              <div class="flex flex-col">
                <div
                  v-for="(row, index) in gameStore.opGameData"
                  :key="row"
                  class="flex"
                >
                  <div
                    v-for="(cellValue, index) in row"
                    :key="index"
                    :class="[
                      'w-20 h-20 flex justify-center items-center halo-effect pop-out-effect border-2 border-accent glass-effect',
                      cellPopOut(1, row, col) ? 'pop-out-active' : '',
                    ]"
                    @click="handleCellClick(1, row, col, $event)"
                  >
                    <div v-if="cellValue" class="text-4xl">?</div>
                  </div>
                </div>
              </div>
              <!-- Player Grid -->
              <div class="flex flex-col">
                <div
                  v-for="(row, index) in gameStore.gameData"
                  :key="index"
                  class="flex"
                >
                  <div
                    v-for="(cellValue, index) in row"
                    :key="index"
                    :class="[
                      'w-20 h-20 flex justify-center items-center halo-effect pop-out-effect border-2 border-success',
                      cellPopOut(2, row, cellValue) ? 'pop-out-active' : '',
                    ]"
                    @click="handleCellClick(2, row, cellValue, $event)"
                  >
                    <span v-if="cellValue === 1" class="text-4xl"> 🛡️</span>
                    <span v-if="cellValue === 2" class="text-4xl"> 🏠</span>
                  </div>
                </div>
                <button @click="play" class="btn btn-success w-full mt-4">
                  Play
                </button>
                <button @click="encrypt" class="btn btn-success w-third mt-4">
                  Encrypt
                </button>
                <button
                  @click="createNewGame"
                  class="btn btn-success w-third mt-4"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="gameStore.getSelectedGame && gameStore.gameData.length == 0"
          class="emoji-container"
        >
          <h1 class="large-emoji">🔐</h1>
          <span font-style="italic">Data is Encrypted </span>
          <button @click="getBoardData" class="btn btn-success w-third mt-4">
            Decrypt game data
          </button>
        </div>

        <div v-if="gameStore.gameSelected == null">
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
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "/store/game/game.index";
import { BrowserProvider } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";
import { useEthers, useEthersHooks } from "vue-dapp";
import { useFhevmStore } from "/store/fhevm/fhevm.index";
const { onActivated, onDeactivated, onChanged } = useEthersHooks();

// import { onKeyStroke } from '@vueuse/core'

const { address, balance, chainId, isActivated, network, provide, signer } =
  useEthers();
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
  if (
    gridIndex == gameStore.selectedPosition.gridIndex &&
    rowIndex == gameStore.selectedPosition.rowIndex &&
    colIndex == gameStore.selectedPosition.colIndex
  ) {
    console.log("same");
  } else {
    gameStore.selectedPosition = { gridIndex, rowIndex, colIndex };
  }

  console.log(event);
  console.log(`Grid: ${gridIndex}, Row: ${rowIndex}, Column: ${colIndex}`);
};
// const toast = useToast();
// Initialize noir when the component is mounted
const snackbar = useSnackbar();

onMounted(async () => {
  init().then((instance) => {
    console.log(instance);
    fhevmStore.instance = instance;
  });
  console.log("mounted");
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

const cellPopOut = function (gridIndex, rowIndex, colIndex) {
  if (gridIndex == 2) {
    return (
      gridIndex === gameStore.selectedPosition.gridIndex &&
      rowIndex === gameStore.selectedPosition.rowIndex &&
      colIndex === gameStore.selectedPosition.colIndex
    );
  } else if (gridIndex == 1) {
    return (
      gridIndex === gameStore.selectedPosition.gridIndex &&
      rowIndex === gameStore.selectedPosition.rowIndex
    );
  } else {
    return false;
  }
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

onKeyStroke("ArrowDown", (e) => {
  console.log("keystroke araow down");
  if (gameStore.selectedPosition.gridIndex == 0) {
    gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
  }
  if (
    gameStore.selectedPosition.gridIndex > 0 &&
    gameStore.selectedPosition.rowIndex < 4
  ) {
    gameStore.selectedPosition.rowIndex =
      gameStore.selectedPosition.rowIndex + 1;
  }
  e.preventDefault();
});
onKeyStroke("ArrowRight", (e) => {
  if (gameStore.selectedPosition.gridIndex == 0) {
    gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
  }
  if (gameStore.selectedPosition.gridIndex == 1) {
    gameStore.selectedPosition.colIndex = 0;
    gameStore.selectedPosition.gridIndex = 2;
  }

  if (
    gameStore.selectedPosition.gridIndex > 0 &&
    gameStore.selectedPosition.colIndex < 4
  ) {
    gameStore.selectedPosition.colIndex =
      gameStore.selectedPosition.colIndex + 1;
  }
  e.preventDefault();
});
onKeyStroke(["b", "B"], (e) => {
  console.log("keystroke b");
  gameStore.selectedBuilding = 1;
  e.preventDefault();
});
onKeyStroke(["h", "H"], (e) => {
  console.log("keystroke h");
  gameStore.selectedBuilding = 2;
  e.preventDefault();
});
onKeyStroke(["e", "E"], (e) => {
  console.log("keystroke e");
  gameStore.selectedBuilding = 0;
  e.preventDefault();
});
onKeyStroke(["Esc"], (e) => {
  console.log("keystroke escape");
  gameStore.selectedPosition = { gridIndex: 0, rowIndex: 0, colIndex: 0 };
  gameStore.selectedBuilding = 0;
  e.preventDefault();
});
onKeyStroke("ArrowLeft", (e) => {
  if (gameStore.selectedPosition.gridIndex == 0) {
    gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
  }
  if (
    gameStore.selectedPosition.gridIndex == 2 &&
    gameStore.selectedPosition.colIndex == 1
  ) {
    gameStore.selectedPosition.colIndex = 5;
    gameStore.selectedPosition.gridIndex = 1;
  }

  if (
    gameStore.selectedPosition.gridIndex > 0 &&
    gameStore.selectedPosition.colIndex > 1
  ) {
    gameStore.selectedPosition.colIndex =
      gameStore.selectedPosition.colIndex - 1;
  }
  e.preventDefault();
});
onKeyStroke("ArrowUp", (e) => {
  console.log("keystroke araow down");
  if (gameStore.selectedPosition.gridIndex == 0) {
    gameStore.selectedPosition = { gridIndex: 1, rowIndex: 1, colIndex: 1 };
  }
  if (
    gameStore.selectedPosition.gridIndex > 0 &&
    gameStore.selectedPosition.rowIndex > 1
  ) {
    gameStore.selectedPosition.rowIndex =
      gameStore.selectedPosition.rowIndex - 1;
  }
  e.preventDefault();
});
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
}
.large-emoji {
  font-size: 100px; /* Adjust the size as needed */
}
</style>
