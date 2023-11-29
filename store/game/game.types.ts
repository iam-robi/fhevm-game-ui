export enum BuildingStatus {
  _empty = 0,
  _bunker = 1,
  _house = 2,
}

export enum GameAction {
  _none = 0,
  _attack = 1,
  _build = 2,
}

export type NewGameEvent = {
  newGameId: number;
  boardWidth: number;
  boardHeight: number;
  player1: string;
  player2: string;
};

export type NewGame = {
  boardWidth: number;
  boardHeight: number;
  player1: string;
  player2: string;
};

export interface GameState {
  userGrid: Number[];
  newUserGrid: Number[];
  opponentGrid: Number[];
  gridSize: {
    width: number;
    height: number;
  };
  gameContractAddress: string;
  selectedPosition: {
    gridIndex: number;
    rowIndex: number;
    colIndex: number;
  };
  selectedBuilding: BuildingStatus;

  blockStart: number;
  newGameEvents: NewGameEvent[];
  gameSelected: number | null;
  gameData: any[];
  newGame: NewGame;
}
