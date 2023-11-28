<template>
    <div>
        <h3 class="text-5xl font-bold">Create a new Game</h3><br>
        Player 1: <input type="text" placeholder="0x..." v-model="gameStore.newGame.player1" class="input input-bordered w-full max-w-xs" /> <button @click="setMePlayer1
        " style="font-style: italic;" class="secondary"><span class="badge badge-primary">me</span>
    </button><br><br>

        Player 2: <input type="text" placeholder="0x..." v-model="gameStore.newGame.player2" class="input input-bordered w-full max-w-xs" /><button @click="setMePlayer1
        " style="font-style: italic;" class="secondary">
        </button>
        <br><br>
        <button @click="createNewGame" class="btn btn-success w-third mt-4">Create</button>

       
    </div>
</template>
<script setup>
import { useGameStore } from "@/store/game/game.index";
import { useEthers } from "vue-dapp";
const  { account, address } = useEthers();
const gameStore = useGameStore();
const createNewGame = async function () {
  await gameStore.startGame().then(() => {
    gameStore.getGamesCreated();
    console.log("startGame");
  })
};

const setMePlayer1 = function () {
    console.log(account)
  gameStore.newGame.player1 = address;
}
</script>
