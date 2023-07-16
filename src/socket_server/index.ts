import { requestRoomsHandler, roomsRequestTypes } from "../handlers/rooms/rooms.handler";
import { database } from "../db_server/db.server";
import { requestPlayersHandler } from "../handlers/players/player.handler";
import { createGame } from '../handlers/rooms/rooms.helper'
import { WebSocket } from "ws";

type Client = {
  id: number,
  ws: WebSocket,
  state: string,
}

export const socketServer = new WebSocket.Server({port:3000});

const clients: Client[] = [];

socketServer.on('connection', function open(ws) {
  ws.onopen = () => {
    var t = setInterval(function(){
        if (ws.readyState != 1) {
            clearInterval(t);
            return;
        }
        ws.send('{type:"ping"}');
    }, 5000);
  };


    ws.on('message', (message)=> {
      const receivedMessage = JSON.parse(message.toString());

      if(!clients.find((cli)=> cli.ws === ws)) {
        clients.push({
          id: clients.length,
          ws: ws,
          state: receivedMessage.type,
        })
      }

      const clientIndex = clients.find((cli)=> cli.ws === ws).id + 1;

      if(receivedMessage.type === 'reg') {
       const response = requestPlayersHandler(receivedMessage, clientIndex);
        ws.send(response)
      }
      if(roomsRequestTypes.includes(receivedMessage.type)) {
        const response = requestRoomsHandler(receivedMessage, clientIndex);

        if(typeof response === 'object' && response.type === 'createGameEvent') {

          for(let client of clients) {
            client.ws.send(createGame(response.roomId, clientIndex));
          }

          return;
        }

         for(let client of clients) {
          client.ws.send(response as string);
        }

      }
        console.log(database.getAll())
        console.log(message.toString())
    })
  });