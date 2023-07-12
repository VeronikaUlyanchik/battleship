import { PlayerType } from "../handlers/players/players.types";

type DatabaseType = (PlayerType & { index: number })[]

const local_database: DatabaseType = [];

class Database {
    getAll(){
        return local_database
    }
    create(data: PlayerType){
      return local_database.push({...data, index: local_database.length});
    }
    get(name: string) {
        return local_database.find((player)=> player.name === name);
    }
}

const database = new Database();

export { database };