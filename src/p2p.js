const WebSockets = require("ws"); //socket means between server and server connection. no Client.
  BlockChain = require("./blockchain"); 

  const { getLastBlock } = BlockChain; 
  //First 가장 최근블록 요청

const sockets = [];

// 살펴보니, 엄청 뒤쳐진걸 알게되었다면 전체 blockchain을 요청.(for replacing)
// then, for the response, we have to response from request.
/* This is the work like a redux for response managing */

// Message Types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLCOKCHAIN_RESPONSE";

// Message Creators
const getLatest = () => {
  return {  
    type: GET_LATEST,
    data: null
  }
}

const getAll = () => {
  return {
    type: GET_ALL,
    data: null
  }
}

const blockchainResponse = (data) => {
  return {
    type: BLOCKCHAIN_RESPONSE,
    data
  }
}

const getSockets = () => sockets;

const startP2PServer = server => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", ws => { //누군가 ws에 접근시 ws에서 initSocketConnection을 실행
    initSocketConnection(ws);
  });
  console.log("Sean's coin P2P Server running");
};

const initSocketConnection = ws => {
  sockets.push(ws); // 연결된 곳에 ws를 추가
  handleSocketMessage(ws);
  handleSocketError(ws); // socket을 connection 하기전에 불러옴
  sendMessage(ws, getLatest()) //접속을하면 자동으로 나의 최근 블록을 가져가게 해준다.
};

const parseData = data => { // handleSocketMessage 에서 사용 할 parseData function 작성.
  try { // try and catch 문으로 작성하여 error를 잡음
    return JSON.parse(data) // JSON.parse 메소드는 JSON을 문자열로 파싱하여 파싱된 값을 추가로 변환한다.
  } catch(e) {
    console.log(e)
    return null;
  }
}

// Manging the Message
const handleSocketMessage = ws => { //Check the data and then, data chage to Json.
  ws.on("message", data => {
    const message = parseData(data);
    if(message === null){
      return;
    }
    console.log(message);
    switch(message.type){
      case GET_LATEST:
        sendMessage(ws, getLastBlock());
        break;
      }
  });
}

const sendMessage = (ws, message) => ws.send(JSON.stringify(message)); // JSON.parse를 할것이기 때문에 JSON.stringify를 해준다.

// Sockets Error Hanlder
const handleSocketError = ws => {
  const closeSocketConnection = ws => {
    ws.close()
    sockets.splice(sockets.indexOf(ws), 1); // splice(제거대상(배열의경우 순서로도 가능),제거할갯수)
  };
  ws.on("close", () => closeSocketConnection(ws)); //websocket이 "close" 된 경우
  ws.on("error", () => closeSocketConnection(ws)); //websocket이 "error" 된 경우
}

const connectToPeers = newPeer => { // This function to takes new Peer.(running the websocket Server)
  const ws = new WebSockets(newPeer);
  ws.on("open", () => { // when open the connection, call the function initSocketConnection
    initSocketConnection(ws);
  });
};

module.exports = {
  startP2PServer,
  connectToPeers
};