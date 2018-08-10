const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"), // At the console shown the information u need.
  Blockchain = require("./blockchain"),
  P2P = require("./p2p");

const { getBlockchain, createNewBlock } = Blockchain;
const { startP2PServer, connectToPeers } = P2P;

// Psssst. Don't forget about typing 'export HTTP_PORT=4000' in your console
const PORT = process.env.HTTP_PORT || 3000; // HTTP_PORT라는 이름의 environment variable을 찾는다.
//therefore, can use the "export HTTP_PORT='PORT_VALUE'"
const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/blocks", (req, res) => {
  res.send(getBlockchain());
});

app.post("/blocks", (req, res) => {
  const { body: { data } } = req;
  const newBlock = createNewBlock(data);
  res.send(newBlock);
});

app.post("/peers", (req, res) => {
  const { body: { peer } } = req;
  connectToPeers(peer);
  res.send(); //
});

const server = app.listen(PORT, () => console.log(`Sean's HTTP Server running on port ${PORT} ✅`));
startP2PServer(server); //P2P server에게 express를 준다.
//app.listen을  server라는 변수에 넣은 이유.
//HTTP_SERVER 위에 WebSocket Server를 올렸다.
//websocket server와 HTTP_Server는 같은 포트에서 실행이 가능하다. 프로토콜이 다르기 때문에.