export const gameAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
    ],
    name: "GameEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "board_width",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "board_height",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player2",
        type: "address",
      },
    ],
    name: "NewGameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "is_building",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "column",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum BunkerWarZ.GameState",
        name: "new_game_state",
        type: "uint8",
      },
    ],
    name: "TurnPlayed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "column",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "encrypted_type_m1",
        type: "bytes",
      },
    ],
    name: "build",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "clear_game_result_",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "board_width",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "board_height",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "turns",
        type: "uint8",
      },
      {
        internalType: "enum BunkerWarZ.GameState",
        name: "game_state",
        type: "uint8",
      },
      {
        internalType: "bool",
        name: "player1_can_send_missile",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "player2_can_send_missile",
        type: "bool",
      },
      {
        internalType: "euint8",
        name: "player1_houses",
        type: "uint256",
      },
      {
        internalType: "euint8",
        name: "player2_houses",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "missile_sent",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "missile_stopped_at_row_plus_1",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "missile_sent_at_column",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "column",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "publicKey",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "getBoardValue",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "is_player1",
        type: "bool",
      },
    ],
    name: "getBuildingStates",
    outputs: [
      {
        internalType: "bool[]",
        name: "",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
    ],
    name: "getGameResult",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
    ],
    name: "getMissileStop",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "column",
        type: "uint8",
      },
    ],
    name: "getOpponentBuildingStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_board_width",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_board_height",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_player2",
        type: "address",
      },
    ],
    name: "newGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "new_game_id",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "game_id",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "column",
        type: "uint8",
      },
    ],
    name: "sendMissile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
