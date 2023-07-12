import { checkPassword, createPlayer, createResponse, playerExist } from "./players.helper";
import { RegistationRequestType } from "./players.types";

export const requestPlayersHandler = (message: RegistationRequestType) => {
    switch (message.type) {
        case 'reg':
            const data = JSON.parse(message.data);
            const player = playerExist(data)
            if(player) {
                if(checkPassword(data)) {
                    return createResponse(player, true, player.index);
                }
                return createResponse(data, true, player.index);
            }
            return createPlayer(data);
        default: 
        break
    }
}