<template>
  <div
    class="hero bg-base-200 py-10 bg-center bg-cover"
    style="background-image: url('~/assets/images/encrypted_blocks_2.png')"
  >
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Play Bunker War Z!</h1>
        <p class="py-6">
         You have select game id #{{ gameStore?.getSelectedGame?.newGameId }}<br>
        </p>
          <button  @click="getBoardData" class="btn btn-success w-third mt-4">Load & decrypt game data</button>
  
      </div>
    </div>
  </div>
</template>
<script setup>  
import { useGameStore } from "@/store/game/game.index";

const gameStore = useGameStore();
const getBoardData = async function () {
  console.log("getBoardData");
  gameStore.getBoardData();

};


const showModal = ref(false);

const  toggleModal = function () {
  showModal.value = !showModal.value;
}
</script>
