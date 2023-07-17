import { checkPassword, createPlayer, createResponse, playerExist } from "./players.helper";
import { RegistationRequestType } from "./players.types";

export const requestPlayersHandler = (message: RegistationRequestType, clientIndex: number) => {
    switch (message.type) {
        case 'reg':
            const data = JSON.parse(message.data);
            const player = playerExist(data)
            if(player) {
                if(checkPassword(data)) {
                    return createResponse(player, true, clientIndex);
                }
                return createResponse(data, true, clientIndex);
            }
            return createPlayer(data, clientIndex);
        default: 
        break
    }
}