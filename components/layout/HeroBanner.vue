<template>
  <div
    class="hero bg-base-200 py-10 bg-center bg-cover"
    style="background-image: url('~/assets/images/encrypted_blocks_2.png')"
  >
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Play Bunker War Z!</h1>
        <p class="py-6">
          You have select game id #{{ gameStore?.getSelectedGame?.newGameId
          }}<br />
          Game Status:
          <span class="badge badge-primary">{{
            gameStore?.getGameStatusLabel
          }}</span
          >&nbsp;<span class="badge" @click="updateGameStatus">
            <Icon
              size="32px"
              color="primary"
              name="majesticons:reload-circle-line"
          /></span>
        </p>
        <div>
          Player&nbsp;1:&nbsp;
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

          &nbsp;&nbsp;Player&nbsp;2:&nbsp;
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
import { shortenAddress, useEthers } from "vue-dapp";

const { address } = useEthers();
const gameStore = useGameStore();
const getBoardData = async function () {
  console.log("getBoardData");
  gameStore.getBoardData();
};

const showModal = ref(false);

const updateGameStatus = async function () {
  gameStore.getGameStatus();
};
</script>
