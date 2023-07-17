import { checkAttackResult } from "./games.helper"
import { AttackRequestType } from "./games.types"


export const requestGamesHandler = (message: AttackRequestType, clientIndex: number) => {
    switch (message.type) {
        case 'attack':
         const attackResult = checkAttackResult(JSON.parse(message.data));
        return attackResult;
        default: 
        break
    }
}