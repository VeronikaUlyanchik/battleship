import { addGame } from "../../handlers/games/games.helper";
import { database } from "../../db_server/db.server";
import { PlayerType } from "../../handlers/players/players.types";

export const createResponseUpdateRoom = (roomIndex: number, currentPlayer: PlayerType & {index: number}) => {
    return JSON.stringify({
        type: "update_room",
        data:
            JSON.stringify([{
                    roomId: roomIndex,
                    roomUsers:
                        [{
                                name: currentPlayer.name,
                                index: currentPlayer.index,
                            }
                        ],
                },
            ]),
        id: 0,
    })
}

export const createResponseCreateGame = (roomIndex: number, idPlayer: number) => {
    return JSON.stringify({
        type: "create_game", //send for both players in the room
        data:JSON.stringify(
            {
                idGame: roomIndex,  
                idPlayer: idPlayer,
            }),
        id: 0,
    })
}

export const updateRoom = (roomIndex: number, clientIndex: number) =>  {
    const room = database.getRoomById(roomIndex);

    if (room?.player1 === clientIndex) {
        return 'already in game';
    }
    database.updateRoom(clientIndex, roomIndex);
}

export const createGame = (roomIndex: number, idPlayer: number) => {
    database.deleteRoom(roomIndex);
    return createResponseCreateGame(roomIndex, idPlayer)
}