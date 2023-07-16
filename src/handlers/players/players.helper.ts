import { database } from "../../db_server/db.server";
import { PlayerType } from "./players.types";

export const list = () => database.getAll();

export const playerExist = (data: PlayerType) => {
    return database.get(data.name);
}

export const createPlayer = (data: PlayerType, index: number) => {
    database.create(data, index)
    return createResponse(data, false, index);
}

export const checkPassword = (data: PlayerType) => {
    const player = database.get(data.name);
    return player.password === data.password;
}

export const createResponse = (data: PlayerType, error: boolean, index: number) => {
    return JSON.stringify({
        type: 'reg',
        data: JSON.stringify({
            name: data.name,
            index: index,
            error: error,
            errorText: error ? 'Wrong password' : '',
        }),
        id: 0,
    })
}
