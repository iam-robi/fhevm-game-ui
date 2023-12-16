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
  _player1Won = 3,
  _player2Won = 4,
  _tie = 5,
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
  gameStatus: GameStatus | null;
  userGrid: any[];
  opGrid: any[];
  userBuildingStates: any[];
  newGame: NewGame;
  gameResult: any;
}
