import { requestRoomsHandler, roomsRequestTypes } from "../handlers/rooms/rooms.handler";
import { database } from "../db_server/db.server";
import { requestPlayersHandler } from "../handlers/players/player.handler";
import { createGame } from '../handlers/rooms/rooms.helper'
import { WebSocket } from "ws";
import { shipsRequestTypes, startGameEventHandler } from "../handlers/ships/ships.helper";
import { playersRequestTypes } from "../handlers/players/players.helper";
import { requestShipsHandler } from "../handlers/ships/ships.handler";

type Client = {
  id: number,
  ws: WebSocket,
  state: string,
}

export const socketServer = new WebSocket.Server({port:3000});

const clients: Client[] = [];

socketServer.on('connection', function open(ws) {
  ws.onclose = function(){
    ws = null
    setTimeout(ws.ping, 5000)
  }

  ws.on('error', function(error) {
    console.log('Cannot start server');
});

    ws.on('message', (message)=> {
      const receivedMessage = JSON.parse(message.toString());

      if(!clients.find((cli)=> cli.ws === ws)) {
        clients.push({
          id: clients.length,
          ws: ws,
          state: receivedMessage.type,
        })
      }

      const clientIndex = clients.find((cli)=> cli.ws === ws).id;

      if(playersRequestTypes.includes(receivedMessage.type)) {
       const response = requestPlayersHandler(receivedMessage, clientIndex);
        ws.send(response)
      }

      if(roomsRequestTypes.includes(receivedMessage.type)) {
        const response = requestRoomsHandler(receivedMessage, clientIndex);

        if(typeof response === 'object' && response.type === 'createGameEvent') {
          for(let client of clients) {
            client.ws.send(createGame(response.roomId, client.id));
          }

          return;
        }
         for(let client of clients) {
          client.ws.send(response as string);
        }
      }

      if(shipsRequestTypes.includes(receivedMessage.type)){
        const response = requestShipsHandler(receivedMessage, clientIndex);

        if(typeof response === 'object' && response.type === 'startGameEvent') {
          for(let client of clients) {
            console.log('client', client.id);
            client.ws.send(startGameEventHandler(client.id, response.gameId));
          }

          return;
        }
      }

        // console.log(database.getAll())
        // console.log(message.toString())
        console.log(clients.map((cl)=> cl.id))
        console.log(database.listShips(), 'ships')
    })
  });