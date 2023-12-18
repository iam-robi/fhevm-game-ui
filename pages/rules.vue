<template>
  <Navbar></Navbar>
  <div class="mx-auto max-w-3xl p-4">
    <br />
    <h1 class="text-4xl mb-4">🚀 Bunker War Z</h1>
    <br />
    <section class="mb-8 text-justify">
      <h2 class="text-2xl font-bold mb-2">Presentation</h2>
      <!-- Presentation content here -->
      <p>Bunker War Z is a game running on FHE encrypted blockchains. Two players play against each other, competing to build the maximum number of houses on a grid and protect them with bunkers from missiles of the opponent.</p>
    </section>

    <section class="mb-8 text-justify">
      <h2 class="text-2xl font-bold mb-2">Rules 📝</h2>
      <p>Each player starts with an empty grid. The dimensions of the grid are adjustable when the game is created. The goal is to build a maximum number of houses before the game stops. Each house standing at the end of the game adds 1 point to the player&#39;s score.  </p>
      <p>The game stops after a number of turns equal to the number of cells on a board, for instance 16 turns for a 4x4 grid. Buildings of the opponent (houses or bunkers) are visible, but their type  is encrypted.</p>
      <br />
      <div>
      <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-logos.png" width=\700\>
      </div>
    </section>

    <section class="mb-8 text-justify">
      <h3 class="text-xl font-bold mb-2">Turns of the game</h3>
      <p>At each turn, a player can take one of three actions:</p>
      <br />
      <p>🏠 <strong>Build a hidden house</strong>: A house adds 1 point to the player&#39;s score. The house being hidden to the opponent, the player&#39;s score also is.</p>
      <br />
      <p>🏰 <strong>Build a hidden bunker</strong>: A bunker does not add score, but it protects the houses below it on the row from missiles (row can be called columns depending of the horizontal or display of the boards).</p>
      <br />
      <p>🚀 <strong>Send a missile to a row of the opponent&#39;s grid</strong>: the missile will destroy all unprotected houses on the row, decreasing the score of the opponent! The missile stops if there is a bunker on the row, and does not destroy it. All houses below the bunker are thus safe for the whole game. A player cannot send 2 missiles in a row.</p>
      <br />
      <p><strong>Hidden buildings and revealed information</strong>: When the opponent builds a house or a bunker, the player can see where the new building is on the opponent&#39;s grid, but the type of the building is hidden because it is encrypted. The score of the opponent stays encrypted as well. When a missile hits however, both player know where it stops, and thus they can deduce if there were unprotected houses that got destroyed and if there was a bunker.</p>
      <br />
      <p>Here&#39;s how a few turns of the game might unfold:</p>
      <br />
      <p>The player has one protected house and two unprotected house on row 2, and the opponent sends a missile to row number 2:</p>
      <br />
      <div>
      <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-1.png" width=\650\>
      </div>
      <br />
    
      <p>The unprotected houses get destroyed, and the missile stops on the bunker on row number 2. The opponent can thus deduces there is a bunker there, and also that he/she destroyed 2 houses. The player replicates with a missile toward the opponent&#39;s row number 3:</p>
      <br />
      <div>
      <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-2bis.png" width=\650\>
      </div>
      <br />
      <p>The player discovers that he/she successfully destroyed a house and now also deduces there is a bunker where the missile stopped at:</p>
      <br />
      <div>
      <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-3bis.png" width=\650\>
      </div>
    </section>

    <section class="mb-8 text-justify">
      <h3 class="text-xl font-bold mb-2">End of the game ⏰</h3>
      <p>When the maximum number of turns has passed, the game stops. The end of game status can then be querried, telling which player won or if there is a tie. The precise score of the opponent remains hidden, as the hidden constructions stay encrypted. This allows a player to keep his/her strategy secret for future games.</p>
      <br />
      <p>When the maximum number of turns has passed, the game stops. The end of game status can then be querried, telling which player won or if there is a tie. The precise score of the opponent remains hidden, as the hidden constructions stay encrypted. This allows a player to keep his/her strategy secret for future games.</p>
    </section>
  </div>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
</script>

