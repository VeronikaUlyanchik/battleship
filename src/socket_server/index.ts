import { database } from "../db_server/db.server";
import { requestPlayersHandler } from "../handlers/players/player.handler";
import { WebSocket } from "ws";

export const socketServer = new WebSocket.Server({port:3000});

socketServer.on('connection', function open(ws) {
  ws.onopen = () => {
    var t = setInterval(function(){
        if (ws.readyState != 1) {
            clearInterval(t);
            return;
        }
        ws.send('{type:"ping"}');
    }, 55000);
  };


    ws.on('message', (message)=> {
      const receivedMessage = JSON.parse(message.toString());

      if(receivedMessage.type === 'reg') {
       const response = requestPlayersHandler(receivedMessage);
        ws.send(response)
      }
      if(receivedMessage.type === 'create_room') {
        
      }
        console.log(database.getAll())
        console.log(message.toString())
    })
  });