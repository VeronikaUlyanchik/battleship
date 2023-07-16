import { database } from "../../db_server/db.server";
import { ShipsPositionsType } from "./ships.types";

export const shipsRequestTypes = ['add_ships'];

export const createShipsResponse = (ships: ShipsPositionsType[], currentPlayerIndex: number) => {
    return JSON.stringify({
        type: "start_game",
        data: JSON.stringify(
            {
                ships,
                currentPlayerIndex,
            }),
        id: 0,
    })
}

export const addShipsToPlayer = (ships: ShipsPositionsType[], currentPlayerIndex: number, gameId: number) => {
    database.addShips(gameId, ships, currentPlayerIndex);
}

export const startGameEventHandler = (clientIndex: number, gameId: number) => {
    const ships = database.getShips(gameId, clientIndex);
    console.log(database.listShips());
    return createShipsResponse(ships?.ships, clientIndex);
}