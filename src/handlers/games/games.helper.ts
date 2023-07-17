import { ShipsPositionToCheckType, ShipsPositionsType } from "../../handlers/ships/ships.types";
import { database } from "../../db_server/db.server"
import { AttackDataRequestType, StatusType } from "./games.types";

export const gamesRequestTypes = ['attack', 'randomAttack', ];

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

const checkShot = (ships: ShipsPositionToCheckType[], x: number, y: number): StatusType => {
        let result = "miss";
      
        for (const ship of ships) {
          const { position, direction, length, checkedPosition, status } = ship;
      
          if (!direction) {
            for (let i = 0; i < length; i++) {
              const shipX = position.x + i;
              const shipY = position.y;
      
              if (x === shipX && y === shipY) {
                result = "shot";
      
                if (length === 1) {
                  result = "killed";
                }
      
                let fullyDestroyed = true;
                for (let j = 0; j < length; j++) {
                  const checkX = position.x + j;
                  const checkY = position.y;
      
                  if (checkX !== x || checkY !== y) {
                    fullyDestroyed = false;
                    break;
                  }
                }
      
                if (fullyDestroyed) {
                  result = "killed";
                }
      
                break;
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              const shipX = position.x;
              const shipY = position.y + i;
      
              if (x === shipX && y === shipY) {
                result = "shot";
      
                if (length === 1) {
                  result = "killed";
                }
      
                let fullyDestroyed = true;
                for (let j = 0; j < length; j++) {
                  const checkX = position.x;
                  const checkY = position.y + j;
      
                  if (checkX !== x || checkY !== y) {
                    fullyDestroyed = false;
                    break;
                  }
                }
      
                if (fullyDestroyed) {
                  result = "killed";
                }
      
                break;
              }
            }
          }
      
          if (result === "shot" || result === "killed") {
            break;
          }
        }
      
        return result as StatusType; 
}

const createAttackFeedback = (position: {x: number, y: number}, currentPlayer: number, status: StatusType) => {
    return JSON.stringify({
        type: "attack",
        data:
            JSON.stringify({
                position,
                currentPlayer,
                status,
            }),
        id: 0,
    })
}

export const changeTurn = (roomId: number) => {
const turn = database.getGameByRoomId(roomId)?.turn;

    return JSON.stringify({
        type: "turn",
        data: JSON.stringify(
            {
                currentPlayer: turn,
            }),
        id: 0,
    })

}

export const checkAttackResult = (attack: AttackDataRequestType) => {
    const turn = database.getGameByRoomId(attack.gameId)?.turn;

    if(turn !== attack.indexPlayer) {
        return null;
    }

  const rival = database.getRivalShips(attack.gameId, attack.indexPlayer);
  const result = checkShot(rival.ships, attack.x, attack.y);

  if(result !== 'miss') {
    database.updateShipsPosition(attack.gameId, rival.playerId, attack.x, attack.y, result )
  }

    if(result !== 'shot') {
        database.updateGameTurn(rival.gameId, rival.playerId);
        return [createAttackFeedback({x: attack.x, y: attack.y}, attack.indexPlayer, result), changeTurn(attack.gameId)];
    }
    
    return createAttackFeedback({x: attack.x, y: attack.y}, attack.indexPlayer, result);
}

const isCoordinateWithinShip = (ship: ShipsPositionToCheckType, x: number, y:number) => {
    const { position, direction, length } = ship;
  
    if (direction === false) { 
      if (y !== position.y) {
        return false;
      }
      const endX = position.x + length - 1;
      return x >= position.x && x <= endX;
    } else { 
      if (x !== position.x) {
        return false;
      }
      const endY = position.y + length - 1;
      return y >= position.y && y <= endY;
    }
  }
  
  export const findShipWithCoordinates = (ships: ShipsPositionToCheckType[], x: number, y:number) => {
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      if (isCoordinateWithinShip(ship, x, y)) {
        return {ship, index: i};
      }
    }
    return null; 
  }
  

  
  
  
  
  