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
              gridIndex === 1 ? 'border-2 border-[#BA899D]' : 'border-2 border-[#B3DEC1]',
              gridIndex === 1 && ((row === 1 && col === 1) || (row === 1 && col === 2)) ? 'glass-effect' : ''
            ]" @click="handleCellClick(gridIndex, row, col, $event)" >
              <!-- Display larger emoji in a cell for demonstration -->
              <span v-if="gridIndex === 2 && row === 2 && col === 2" class="text-4xl"> 🛡️</span>
              <span v-if="gridIndex === 2 && row === 3 && col === 4" class="text-4xl"> 🏠</span>
              <!-- Snowball-like effect behind glass -->
              <div v-if="gridIndex === 1 && ((row === 1 && col === 1) || (row === 1 && col === 2))" class="text-4xl">?</div>
            </div>
          </div>
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
          <div class="flex flex-col space-y-4 w-1/2">
            <label for="input1" class="text-lg font-bold">Input X: </label>
            <input
              id="input1"
              type="text"
              class="input input-primary"
              placeholder="Enter input X"
              v-model.value="gameStore.playPositionX"
            />

            <label for="input2" class="text-lg font-bold">Input Y:</label>
            <input
              id="input2"
              type="text"
              class="input input-primary"
              placeholder="Enter input Y"
              v-model.value="gameStore.playPositionY"
            />
            <button @click="startGame" class="btn">Start Game</button>
          </div>
          </div></div>
    
    <NuxtSnackbar />
  </div>
</template>

<script setup>
import Navbar from "./components/layout/Navbar.vue";
import LayoutHeroBanner from "./components/layout/HeroBanner.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useGameStore } from "/store/game/game.index";
const gameStore = useGameStore();

const handleCellClick = (gridIndex, rowIndex, colIndex, event) => {
  console.log(event)
  console.log(`Grid: ${gridIndex}, Row: ${rowIndex}, Column: ${colIndex}`);
    togglePopOut(event);

};
// const toast = useToast();
// Initialize noir when the component is mounted
const snackbar = useSnackbar();

onMounted(async () => {
  console.log("mounted");
});

onBeforeUnmount(() => {
  console.log("befor unmount");
});

const startGame = async function () {
  console.log("startGame");
};

const play = async function () {
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

const togglePopOut = (event) => {
  event.currentTarget.classList.toggle('pop-out-active');

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

.pop-out-active {
  transform: scale(1.2) translateZ(15px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  background-color: rgba(255, 255, 255, 0.2); /* Semi-transparent white for glass effect */
  backdrop-filter: blur(10px); /* Blur for glass effect */
}

</style>
