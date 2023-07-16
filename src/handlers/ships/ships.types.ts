export type ShipsPositionsType = {
    position: {
     x: number,
     y: number },
            direction: boolean,
            length: number,
            type: "small"|"medium"|"large"|"huge",
}

export type ShipsType = {
    gameId: number,
    playerId: number,
    ships: ShipsPositionsType[],
}

export type AddShipsRequestType = {
    type: "add_ships",
    data: string,
    id: 0,
}

export type DataAddShipsRequestType = {
    gameId: number,
    ships: ShipsPositionsType[],
    indexPlayer: number,
}