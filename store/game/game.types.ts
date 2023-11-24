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
  player1: string;
  player2: string;
}
