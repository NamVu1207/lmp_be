const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("Manager connected");

  ws.on("close", () => {
    console.log("Manager disconnected");
  });
});

function notificationToManagers(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

module.exports = { notificationToManagers };
