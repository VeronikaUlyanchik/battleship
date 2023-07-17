import { RoomType } from "../handlers/rooms/rooms.types";
import { PlayerType } from "../handlers/players/players.types";
import { GameType } from "../handlers/games/games.types";
import { ShipsPositionToCheckType, ShipsPositionsType, ShipsType } from "../handlers/ships/ships.types";
import { findShipWithCoordinates } from "../handlers/games/games.helper";

type DatabaseType = {
    players: (PlayerType & { index: number })[],
    rooms: (RoomType & { index: number })[],
    ships: ShipsType[],
    games: GameType[],
}

const local_database: DatabaseType = {players: [], rooms: [], games:[], ships: []};

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
        return local_database.rooms.find((r)=> r.index === index);
    }
    createGame(roomIndex: number){
        local_database.games.push({
            roomIndex,
            readyPlayers: [],
            turn: null,
        })
        return roomIndex;
    }
    deleteGame(roomIndex: number){
        local_database.games = local_database.games.filter((g)=> g.roomIndex !== roomIndex);
    }
    updateGame(roomIndex: number, currentPlayerIndex: number){
        local_database.games = local_database.games.map((g)=> g.roomIndex === roomIndex 
        ? {...g, turn: g.turn === null ? currentPlayerIndex : g.turn, readyPlayers: [...g.readyPlayers, currentPlayerIndex]} : g);
    }
    updateGameTurn(roomIndex: number, currentPlayerIndex: number){
        local_database.games = local_database.games.map((g)=> g.roomIndex === roomIndex 
        ? {...g, turn: currentPlayerIndex } : g);
    }
    getGameByRoomId(roomIndex: number){
        return local_database.games.find((game)=> game.roomIndex === roomIndex);
    }
    addShips(gameId: number, ships: ShipsPositionsType[], currentPlayerIndex: number){
        local_database.ships.push({
            gameId,
            ships,
            playerId: currentPlayerIndex,
        })
    }
    updateShipsPosition(gameId: number, currentPlayerIndex: number, positionX:number, positionY: number, status: string ){
        const ships = local_database.ships.find((s)=> s.gameId === gameId && s.playerId === currentPlayerIndex).ships;
        const ship = findShipWithCoordinates(ships, positionX, positionY);

        const pos = ship.ship.checkedPosition || [];
        
        const updatedShip = {...ship.ship, checkedPosition: [...pos, {x:positionX, y:positionY }], status} as ShipsPositionToCheckType;

        local_database.ships = local_database.ships.map((s)=> s.gameId === gameId && s.playerId === currentPlayerIndex ?
        {...s, ships: [...ships.filter((sh, i)=> i !== ship.index), updatedShip ]} :s);

        return ships;
    }
    getShips(gameId: number, currentPlayerIndex: number) {
        return local_database.ships.find((s)=> s.gameId === gameId && s.playerId === currentPlayerIndex);
    }
    getRivalShips(gameId: number, currentPlayerIndex: number) {
        return local_database.ships.find((s)=> s.gameId === gameId && s.playerId !== currentPlayerIndex);
    }
    listShips() {
        return local_database.ships;
    }
}

const database = new Database();

export { database };