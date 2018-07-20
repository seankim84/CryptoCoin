const WebSockets = require("ws");

const sockets = [];

const startP2PServer = server => {
    const wsServer = new WebSockets.Server({ server });
    wsServer.on("connection", ws => {
        console.log(`Hellow ${ws}`);
    });
    console.log("CryptoCoin P2P Server Running");
};

module.exports = {
    startP2PServer
};