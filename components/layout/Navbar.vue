<template>
  <div class="navbar bg-base-300 rounded-box">
    <!-- Wallet Connect at the beginning -->

    <div class="flex">
      <NuxtLink to="/" class="btn btn-ghost">Play</NuxtLink>
      <NuxtLink to="/rules" class="btn btn-ghost">Rules</NuxtLink>
      <div class="flex-none">
        <ConnectWallet class="btn btn-ghost rounded-btn"></ConnectWallet>
      </div>
      <span style="margin-left: 100px;">Start block: </span>
      <input
        type="number"
        v-model="gameStore.blockStart"
        class="input input-bordered"
        style="margin-left: 10px; max-width: 110px"
      />      
    </div>

    <!-- Recent Games Dropdown at the end -->
    <div class="flex justify-end flex-1 px-2">
      <div class="dropdown dropdown-bottom dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">
          Your Games {{ gameStore.newGameEvents.length }}
        </div>
        <ul
          class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-64 mt-4"
        >
          <li v-for="(game, index) in gameStore.newGameEvents" :key="index">
            <button @click="selectGame(game)">
              <br />
              <h3 class="font-bold">id #{{ game.newGameId }}</h3>
              <br />
              <p><b>P1</b>: {{ `${game.player1.slice(0, 6)}...` }}</p>
              <p><b>P2</b>: {{ `${game.player2.slice(0, 6)}...` }}</p>
              <span class="badge" style="font-style: italic">{{
                `${game.gridWidth}x${game.gridHeight}`
              }}</span>

              <!-- <p>{{ `${game.gridWidth}x${game.gridHeight}` }}</p> -->
            </button>
          </li>
          <li @click="createNewGame" style="text-align: center">
            <button @click="createNewGame">+</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ConnectWallet from "@/components/wallet/ConnectWallet.vue";
import { useGameStore } from "@/store/game/game.index";
const colorMode = useColorMode();

const gameStore = useGameStore();

const createNewGame = async function () {
  gameStore.gameSelected = null;
};

const selectGame = async function (game) {
  console.log("selectGame");
  gameStore.gameSelected = game.newGameId;
  await gameStore.getGameState();
  gameStore.previousUserGrid = [];
  gameStore.userGrid = [];
  gameStore.opGrid = [];
  gameStore.previousOpGrid = [];
  gameStore.gridSize.width = game.gridWidth;
  gameStore.gridSize.height = game.gridHeight;
  gameStore.maxTurns = gameStore.gridSize.width * gameStore.gridSize.height;
  // gameStore.selectGame(gameId);
};
const themes = [
  "system",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
</script>
