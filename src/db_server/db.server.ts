import { RoomType } from "../handlers/rooms/rooms.types";
import { PlayerType } from "../handlers/players/players.types";

type DatabaseType = {
    players: (PlayerType & { index: number })[],
    rooms: (RoomType & { index: number })[],
}

const local_database: DatabaseType = {players: [], rooms: []};

class Database {
    getAll(){
        return local_database.players;
    }
    create(data: PlayerType, index: number ){
        return local_database.players.push({...data, index: index});
    }
    get(name: string) {
        return local_database.players.find((player)=> player.name === name);
    }
    getPlayerById(id: number) {
        return local_database.players.find((player)=> player.index === id);
    }
    createRoom(currentPlayerIndex: number){
        const index = local_database.rooms.push({player1: currentPlayerIndex, player2: null, index: local_database.rooms.length})
        return index;
    }
    updateRoom(secondPlayerIndex: number, roomIndex: number){
        local_database.rooms = local_database.rooms.map((r)=> r.index === roomIndex ? {...r, player2: secondPlayerIndex } : r);
        const room = local_database.rooms.find((r)=> r.index !== roomIndex);
        return room;
    }
    deleteRoom(roomIndex: number){
        local_database.rooms = local_database.rooms.filter((r)=> r.index !== roomIndex);
    }
    roomList(){
        return local_database.rooms;
    }
    getRoomById(index: number){
        return local_database.rooms.find((r)=> r.index !== index);
    }
}

const database = new Database();

export { database };