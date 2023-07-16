import { database } from "../../db_server/db.server";
import { createResponseUpdateRoom, updateRoom } from "./rooms.helper";
import { RoomsRequestType } from "./rooms.types";

export const roomsRequestTypes = ['create_room', 'create_game', 'add_user_to_room', 'update_room'];

export const requestRoomsHandler = (message: RoomsRequestType, clientIndex: number) => {
    switch (message.type) {
        case 'create_room':
            const currentPlayer = database.getPlayerById(clientIndex);

            const rooms = database.roomList();

            if(rooms.find((r)=> r.player1 === clientIndex || r.player2 === clientIndex)){
                return;
            }
            
            const index = database.createRoom(clientIndex);
            return createResponseUpdateRoom(index, currentPlayer);

            case 'add_user_to_room':
            const data = JSON.parse(message.data);

            updateRoom(data.indexRoom, clientIndex);
            
            return {type: 'createGameEvent', roomId: data.indexRoom};
        default: 
        break
    }
}