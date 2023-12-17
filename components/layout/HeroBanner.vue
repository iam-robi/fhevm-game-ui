<template>
  <div class="hero bg-base-200 py-10 bg-center bg-cover">
    <div class="hero-content text-center">
      <div v-if="wallet.wallet.status != 'connected'" class="max-w-md">
        <h1 class="text-5xl font-bold mb-4">🚀 Bunker War Z</h1>
        <h5 class="text-xl font-bold">Connect your wallet to play</h5>
      </div>
      <div
        v-if="
          wallet.wallet.status == 'connected' && gameStore.gameSelected == null
        "
        class="max-w-md"
      >
        <h1 class="text-5xl font-bold mb-4">🚀 Bunker War Z</h1>
        <h5 class="text-xl font-bold">Select a game or create one</h5>
      </div>
      <div
        v-if="
          wallet.wallet.status == 'connected' && gameStore.gameSelected != null
        "
        class="max-w-md"
      >
        <h1 class="text-5xl font-bold">🚀 Bunker War Z</h1>
        <p class="py-6">
          You have selected game id #{{ gameStore?.getSelectedGame?.newGameId
          }}<br />
          Game Status:
          <span class="badge badge-primary">{{
            gameStore?.getGameTurnsLabel
          }}</span>
          <span class="badge badge-primary" style="margin-left: 10px;">{{
            gameStore?.getGameStatusLabel
          }}</span>          
          <button class="badge" @click="updateGameStatus">
            <Icon
              size="32px"
              color="primary"
              name="majesticons:reload-circle-line"
            />
          </button>
        </p>
        <div>
          <span class="badge">{{ gameStore?.getPlayerName1 }}</span>
          <div
            class="badge badge-outline"
            :class="[
              'badge badge-outline',
              address == gameStore?.getSelectedGame?.player1
                ? 'badge-success'
                : 'badge-accent',
            ]"
          >
            {{ shortenAddress(gameStore?.getSelectedGame?.player1) }}
          </div>

          <span class="badge" style="margin-left: 10px;">{{
            gameStore?.getPlayerName2
          }}</span>   
          <div
            class="badge badge-outline"
            :class="[
              'badge badge-outline',
              address == gameStore?.getSelectedGame?.player2
                ? 'badge-success'
                : 'badge-accent',
            ]"
          >
            {{ shortenAddress(gameStore?.getSelectedGame?.player2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useGameStore } from "@/store/game/game.index";
import { shortenAddress, useEthers, useWallet } from "vue-dapp";

const { address } = useEthers();
const gameStore = useGameStore();
const getBoardData = async function () {
  console.log("getBoardData");
  gameStore.getBoardData();
};

const showModal = ref(false);
const wallet = useWallet();

const updateGameStatus = async function () {
  gameStore.getBoardData();
};
</script>

<style scoped>
.max-w-md {
  margin: 0 auto;
  text-align: center;
}

.text-xl {
  margin-top: 3rem; /* Adjust margin-top as needed */
}
</style>
