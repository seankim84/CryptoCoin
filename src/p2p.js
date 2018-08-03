const WebSockets = require("ws");

const sockets = [];

const getSockets = () => sockets;

const startP2PServer = server => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", ws => {
    initSocketConnection(ws);
  });
  console.log("Seanscoin P2P Server running");
};

const initSocketConnection = socket => {
  sockets.push(socket);
  socket.on("message", (data) =>   { // message를 받으면 data를 console.log
    console.log(data);
  });
  setTimeout(() => {
    socket.send("welcome");
  }, 5000);
};

const connectToPeers = newPeer => {
  const ws = new WebSockets(newPeer);
  ws.on("open", () => {
    initSocketConnection(ws);
  });
};

module.exports = {
  startP2PServer,
  connectToPeers
};