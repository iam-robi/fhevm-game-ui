<template>
  <div>
    <Navbar></Navbar>
    <LayoutHeroBanner></LayoutHeroBanner>
    <div class="flex justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
      >

 
        <!-- Grids Section -->
    <div class="flex justify-center items-center">
      <div class="w-full flex flex-row space-x-6 p-10 card rounded-box">
        <div v-for="gridIndex in 2" :key="gridIndex" class="flex flex-col">
          
          <div v-for="row in 4" :key="row" class="flex">
             
            <div v-for="col in 4" :key="col" :class="[
              'w-20 h-20 flex justify-center items-center halo-effect pop-out-effect',
              gridIndex === 1 ? 'border-2 border-accent' : 'border-2 border-success',
              gridIndex === 1 && ((row === 1 && col === 1) || (row === 1 && col === 2)) ? 'glass-effect' : '',
              gridIndex === gameStore.selectedPosition.gridIndex && row === gameStore.selectedPosition.rowIndex && col === gameStore.selectedPosition.colIndex ? 'pop-out-active' : '',
            ]" @click="handleCellClick(gridIndex, row, col, $event)" >
              <!-- Display larger emoji in a cell for demonstration -->
              <span v-if="gridIndex === 2 && row === 2 && col === 2" class="text-4xl"> 🛡️</span>
              <span v-if="gridIndex === 2 && row === 3 && col === 4" class="text-4xl"> 🏠</span>
          
              <!-- Snowball-like effect behind glass -->
              <div v-if="gridIndex === 1 && ((row === 1 && col === 1) || (row === 1 && col === 2))" class="text-4xl">?</div>
            </div>
            
          </div>
                    <button v-if="gridIndex === 2" @click="play" class="btn btn-success w-full mt-4">Play</button>
                    <button v-if="gridIndex === 2" @click="encrypt" class="btn btn-success w-full mt-4">Encrypt</button>

        </div>
      </div>
    </div>

      </div>
    </div>
        <div class="flex justify-center items-center">
        <div
          class="w-full max-w-2xl flex flex-row space-x-6 p-10 card rounded-box"
        >
            <!-- Input section -->
    
          </div></div>
    
    <NuxtSnackbar />
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "/store/game/game.index";
import { BrowserProvider } from "ethers";
import { initFhevm, createInstance } from "fhevmjs";
import { useEthers } from "vue-dapp";
import { useFhevmStore } from "/store/fhevm/fhevm.index";


const { address, balance, chainId, isActivated, network, provider } = useEthers()
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


const gameStore = useGameStore();

const handleCellClick = (gridIndex, rowIndex, colIndex, event) => {
  gameStore.selectedPosition = { gridIndex, rowIndex, colIndex };
  console.log(event)
  console.log(`Grid: ${gridIndex}, Row: ${rowIndex}, Column: ${colIndex}`);
    togglePopOut(event);

};
// const toast = useToast();
// Initialize noir when the component is mounted
const snackbar = useSnackbar();

onMounted(async () => {
  init().then((instance) => {
    console.log(instance);
    fhevmStore.instance = instance
  });
  console.log("mounted");
});

onBeforeUnmount(() => {
  console.log("befor unmount");
});

const startGame = async function () {
  console.log("startGame");
};


const encrypt = async function() {
  await fhevmStore.encrypt(5);
}

const play = async function () {
  console.log("play", fhevmStore.instance)
  
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

// const togglePopOut = (event) => {
//   event.currentTarget.classList.toggle('pop-out-active');

// };

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
  background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent white for glass effect */
  backdrop-filter: blur(10px); /* Blur for glass effect */
}

</style>
