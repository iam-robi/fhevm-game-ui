export enum BuildingStatus {
  _house = 0,
  _bunker = 1,
}

export enum GameAction {
  _none = 0,
  _attack = 1,
  _build = 2,
}

export enum GameStatus {
  _uninitialized = 0,
  _player1Turn = 1,
  _player2Turn = 2,
  _gameEnded = 3,
}

export type NewGameEvent = {
  newGameId: number;
  gridWidth: number;
  gridHeight: number;
  player1: string;
  player2: string;
};

export type NewGame = {
  gridWidth: number;
  gridHeight: number;
  player1: string;
  player2: string;
};

export interface GameStoreState {
  loading: boolean;
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
  latestBlock: number | null;

  blockStart: number;
  newGameEvents: NewGameEvent[];
  gameSelected: number | null;
  gameState: GameStatus | null;
  previousGameState: GameStatus | null;
  userGrid: any[];
  previousUserGrid: any[];
  userGridRotated: any[];
  opGrid: any[];
  previousOpGrid: any[];
  opGridRotated: any[];
  userBuildingStates: any[];
  newGame: NewGame;
  gameResult: any;
  isPlayer1: bool;
  turns: Number;
  maxTurns: Number | null;
  player1_can_send_missile: bool;
  player2_can_send_missile: bool;
}
