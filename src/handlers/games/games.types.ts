export type GameType = {
    roomIndex: number,
    readyPlayers: number[],
    turn: number | null,
}

export type AttackDataRequestType = {
    gameId: number,
    x: number,
    y: number,
    indexPlayer: number,
}

export type AttackRequestType = {
    type: "attack",
    data: string,
    id: 0,
}

export type StatusType = "miss"|"killed"|"shot"