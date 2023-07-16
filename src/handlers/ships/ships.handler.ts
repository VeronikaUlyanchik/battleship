import { error } from "console";
import { isPlayersReady, updateGameWithShips } from "../../handlers/games/games.helper";
import { addShipsToPlayer, createShipsResponse } from "./ships.helper";
import { AddShipsRequestType, DataAddShipsRequestType } from "./ships.types";


export const requestShipsHandler = (message: AddShipsRequestType, clientIndex: number) => {
    switch (message.type) {
        case 'add_ships':
            const data = JSON.parse(message.data) as DataAddShipsRequestType;
            updateGameWithShips(data.gameId, clientIndex);
            addShipsToPlayer(data.ships, clientIndex, data.gameId);

            if (isPlayersReady(data.gameId)){
                return {type: 'startGameEvent', gameId: data.gameId};
            } 
            return;
        default: 
        break
    }
}
