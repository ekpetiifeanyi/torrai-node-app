//webrtc signalling server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
const rooms = {};

wss.on('connection', ws => {
  console.log('Client connected');
  
  ws.on('message', message => {
    const data = JSON.parse(message);
    const room = data.room;

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(ws);

    // Send the message to other clients in the same room
    rooms[room].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    // Clean up closed sockets from all rooms
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(client => client !== ws);
    }
    console.log('Client disconnected');
  });
});
console.log('Signaling server running on ws://localhost:3000');