<template>

    <div v-if="wallet.wallet.status == 'connected'">
        <h3 class="text-4xl font-bold">Create a new Game</h3><br>
        Player 1: <input type="text" placeholder="0x..." v-model="gameStore.newGame.player1" class="input input-bordered w-full max-w-xs" /> <button @click="setMePlayer1
        " style="font-style: italic;" class="secondary"><span class="badge badge-primary">me</span>
        </button><br><br>
        Player 2: <input type="text" placeholder="0x..." v-model="gameStore.newGame.player2" class="input input-bordered w-full max-w-xs" />
        <br><br>
        <label for="quantity" style="margin-right: 7px;">Width: </label>
        <input
          type="number" v-model="gameStore.newGame.gridWidth" min="1" max="6"
          class="input input-bordered w-full max-w-xs small-input"
        />
        <label for="quantity" style="margin-left: 20px; margin-right: 7px;">Height: </label>
        <input
          type="number" v-model="gameStore.newGame.gridHeight" min="2" max="6"
          class="input input-bordered w-full max-w-xs small-input"
        />
        <br><br>
        <button @click="createNewGame" class="btn btn-success w-third mt-4">Create</button>

    </div>
</template>
<script setup>
import { useGameStore } from "@/store/game/game.index";
import { useEthers, useWallet } from "vue-dapp";
const  { account, address } = useEthers();
const gameStore = useGameStore();

const createNewGame = async function () {
  await gameStore.startGame().then(() => {
    gameStore.getGamesCreated();
    console.log("startGame");
  })
};

const wallet = useWallet();

const setMePlayer1 = function () {
  console.log("player 1 ", account)
  gameStore.newGame.player1 = address;
}
</script>

<style scoped>
.small-input{
max-width: 75px;
}
</style>