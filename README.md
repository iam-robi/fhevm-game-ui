# :rocket: Bunker War Z !


## Presentation

**Web app link** : [Bunker War Z](https://bunkerwarz.olafhe.com/)  

Bunker War Z is a game running on FHE encrypted blockchains. Two players play against each other, competing to build the maximum number of houses on a grid and protect them with bunkers from the missiles of the opponent!

## Rules :memo:  

Each player starts with an empty grid. The dimensions of the grid are adjustable when the game is created. The goal is to build a maximum number of houses before the game stops. Each house standing at the end of the game adds 1 point to the player's score.  
  
The game stops after a number of turns equal to the number of cells on a board, for instance 16 turns for a 4x4 grid. Buildings of the opponent (houses or bunkers) are visible, but their type  is encrypted.

<div>
<img src="https://rcd-media.com/olafhe/bunker-war-z-schema-logos.png" width=\700\>
</div>

### Turns of the game
At each turn, a player can take one of three actions:
- :house: **Build a hidden house**: A house adds 1 point to the player's score. The house being hidden to the opponent, the player's score also is.  

- 🏰 **Build a hidden bunker**: A bunker does not add score, but it protects the houses below it on the row from missiles (row can be called columns depending of the horizontal or display of the boards).  

- :rocket: **Send a missile to a row of the opponent's grid**: the missile will destroy all unprotected houses on the row, decreasing the score of the opponent! The missile stops if there is a bunker on the row, and does not destroy it. All houses below the bunker are thus safe for the whole game. A player cannot send 2 missiles in a row.

**Hidden buildings and revealed information**: When the opponent builds a house or a bunker, the player can see where the new building is on the opponent's grid, but the type of the building is hidden because it is encrypted. The score of the opponent stays encrypted as well. When a missile hits however, both player know where it stops, and thus they can deduce if there were unprotected houses that got destroyed and if there was a bunker.


Here's how a few turns of the game might unfold:

1. The player has one protected house and two unprotected house on row 2, and the opponent sends a missile to row number 2:
<div>
<img src="https://rcd-media.com/olafhe/bunker-war-z-schema-1.png" width=\650\>
</div>

2. The unprotected houses get destroyed, and the missile stops on the bunker on row number 2. The opponent can thus deduces there is a bunker there, and also that he/she destroyed 2 houses. The player replicates with a missile toward the opponent's row number 3:
<div>
<img src="https://rcd-media.com/olafhe/bunker-war-z-schema-2.png" width=\650\>
</div>

3. The player discovers that he/she successfully destroyed a house and now also deduces there is a bunker where the missile stopped at:
<div>
<img src="https://rcd-media.com/olafhe/bunker-war-z-schema-3.png" width=\650\>
</div>


### End of the game :alarm_clock: 
When the maximum number of turns has passed, the game stops. The end of game status can then be querried, telling which player won or if there is a tie. The precise score of the opponent remains hidden, as the hidden constructions stay encrypted. This allows a player to keep his/her strategy secret for future games.


## Run ui

### :warning: Important notice

The **ZAMA** blockchain being in developpment, there is no subgraphs available on it. Thus, the app fetches events directly on the explorer, but there is a caveat: before starting a new game, one should first edit `game.index.ts` at line `blockStart:` and change the value to a recent block. A value of a recent block can be found at [Zama explorer](https://main.explorer.zama.ai/ ) in the ***Transactions*** field. This prevents having to fetch to far in the past and avoid errors during the testing of the game.  

Later, when subgraphs will be available, the smart contract and the web app can be changed (see TODO in the smart contract) so as to easily querry all relevant events and values of the past of the smart contract.

### Run online

The game is playable online at: [Bunker War Z](https://bunkerwarz.olafhe.com/)

### Run locally

This starter uses [bun](https://bun.sh/) runtime environment for performance improvement on proof generation. It is also compatible with npm, pnpm and yarn.

Make sure to install the dependencies:

```bash
# bun
bun install

# npm
bun install
# pnpm
pnpm install

# yarn
yarn install
```

Start the development server on `http://localhost:3000`:

```bash
# npm
bun run dev

# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Smart contract

[Link to the smart contract dev repository on github](https://github.com/iam-robi/fhevm-game)

Last deployed smart contract address: [0xaDCE6E593dE93309e068a9b1B9e2E36C3D8c8655](https://main.explorer.zama.ai/address/0xaDCE6E593dE93309e068a9b1B9e2E36C3D8c8655)

## Dev

When subgraphs are available, create a subgraph and adapt both the smart contrat and the web app to querry game information on the subgraph.
