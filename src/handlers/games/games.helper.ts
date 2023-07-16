import { database } from "../../db_server/db.server"

export const addGame = (roomIndex: number) => {
    database.createGame(roomIndex)
}

export const updateGameWithShips = (roomIndex: number, currentPlayerIndex: number) => {
    database.updateGame(roomIndex, currentPlayerIndex);
}

export const isPlayersReady = (roomIndex: number) => {
   const game = database.getGameByRoomId(roomIndex);
   return game.readyPlayers.length === 2;
}