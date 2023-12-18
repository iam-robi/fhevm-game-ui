<template>
  <Navbar></Navbar>
  <div>
    <h1 id="-rocket-bunker-war-z-">:rocket: Bunker War Z !</h1>
    <h2 id="presentation">Presentation</h2>
    <p>Bunker War Z is an game running on FHE encrypted blockchains. Two players play against each other, competing one after the other to build the maximum number of houses on a grid and protect them with bunkers from missiles of the opponent.</p>
    <p><strong>Web app link</strong> : <a href="https://bunkerwarz.olafhe.com/">Bunker War Z</a>  </p>
    <p>Bunker War Z is a game running on FHE encrypted blockchains. Two players play against each other, competing to build the maximum number of houses on a grid and protect them with bunkers from the missiles of the opponent!</p>
    <h2 id="rules-memo-">Rules :memo:</h2>
    <p>Each player starts with an empty grid. The dimensions of the grid are adjustable when the game is created. The goal is to build a maximum number of houses before the game stops. Each house standing at the end of the game adds 1 point to the player&#39;s score.  </p>
    <p>The game stops after a number of turns equal to the number of cells on a board, for instance 16 turns for a 4x4 grid. Buildings of the opponent (houses or bunkers) are visible, but their type  is encrypted.</p>
    <div>
    <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-logos.png" width=\700\>
    </div>

    <h3 id="turns-of-the-game">Turns of the game</h3>
    <p>At each turn, a player can take one of three actions:</p>
    <ul>
    <li><p>:house: <strong>Build a hidden house</strong>: A house adds 1 point to the player&#39;s score. The house being hidden to the opponent, the player&#39;s score also is.</p>
    </li>
    <li><p>🏰 <strong>Build a hidden bunker</strong>: A bunker does not add score, but it protects the houses below it on the row from missiles (row can be called columns depending of the horizontal or display of the boards).</p>
    </li>
    <li><p>:rocket: <strong>Send a missile to a row of the opponent&#39;s grid</strong>: the missile will destroy all unprotected houses on the row, decreasing the score of the opponent! The missile stops if there is a bunker on the row, and does not destroy it. All houses below the bunker are thus safe for the whole game. A player cannot send 2 missiles in a row.</p>
    </li>
    </ul>
    <p><strong>Hidden buildings and revealed information</strong>: When the opponent builds a house or a bunker, the player can see where the new building is on the opponent&#39;s grid, but the type of the building is hidden because it is encrypted. The score of the opponent stays encrypted as well. When a missile hits however, both player know where it stops, and thus they can deduce if there were unprotected houses that got destroyed and if there was a bunker.</p>
    <p>Here&#39;s how a few turns of the game might unfold:</p>
    <ol>
    <li><p>The player has one protected house and two unprotected house on row 2, and the opponent sends a missile to row number 2:</p>
    <div>
    <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-1.png" width=\650\>
    </div>
    </li>
    <li><p>The unprotected houses get destroyed, and the missile stops on the bunker on row number 2. The opponent can thus deduces there is a bunker there, and also that he/she destroyed 2 houses. The player replicates with a missile toward the opponent&#39;s row number 3:</p>
    <div>
    <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-2bis.png" width=\650\>
    </div>
    </li>
    <li><p>The player discovers that he/she successfully destroyed a house and now also deduces there is a bunker where the missile stopped at:</p>
    <div>
    <img src="https://rcd-media.com/olafhe/bunker-war-z-schema-3bis.png" width=\650\>
    </div>

    </li>
    </ol>
    <h3 id="end-of-the-game-alarm_clock-">End of the game :alarm_clock:</h3>
    <p>When the maximum number of turns has passed, the game stops. The end of game status can then be querried, telling which player won or if there is a tie. The precise score of the opponent remains hidden, as the hidden constructions stay encrypted. This allows a player to keep his/her strategy secret for future games.</p>
    <p>When the maximum number of turns has passed, the game stops. The end of game status can then be querried, telling which player won or if there is a tie. The precise score of the opponent remains hidden, as the hidden constructions stay encrypted. This allows a player to keep his/her strategy secret for future games.</p>

  </div>
</template>

<script setup>
import Navbar from "@/components/layout/Navbar.vue";
</script>
