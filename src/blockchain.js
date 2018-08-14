// parse : convert text into a JavaScript Object

const CryptoJS = require("crypto-js"),
      hexToBinary = require("hex-to-binary");


const BLOCK_GENERATION_INTERVAL = 10; // 몇분마다 채굴되는지(초 단위)
const DIFFICULTY_ADJUSMENT_INTERVAL = 10; // 얼마나 자주 블록 난이도를 조절할지

class Block {
  constructor(index, hash, previousHash, timestamp, data, difficulty, nonce) { // by using this constructor, create new things
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

const genesisBlock = new Block( // Make by constructor, u can use only value on this object
  0,
  "2C4CEB90344F20CC4C77D626247AED3ED530C1AEE3E6E85AD494498B17414CAC",
  null,
  1520312194926,
  "This is the genesis!!",
  0,
  0
);

let blockchain = [ genesisBlock ]; // Put the genesis block inside the block chain

const getNewestBlock = () => blockchain[blockchain.length - 1];

const getTimestamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data, difficulty, nonce) =>
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data) + difficulty + nonce
  ).toString();

const createNewBlock = data => {
  const previousBlock = getNewestBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const difficulty = findDifficulty(); 
  const newBlock = findBlock(
    newBlockIndex,
    previousBlock.hash,
    newTimestamp,
    data,
    20,
    difficulty
  );

  addBlockToChain(newBlock);
  require("./p2p").broadcastNewBlock(); 
  return newBlock;
};

const findDifficulty = () => {
  const newestBlock = getNewestBlock();
  if (newestBlock.index % DIFFICULTY_ADJUSMENT_INTERVAL === 0 &&
      newestBlock.index !== 0) { // 나눠진 결과가 0이라면
    return calculateNewDifficulty(newestBlock, getBlockchain)
  } else {
    return newestBlock.difficulty;
  }
};

const calculateNewDifficulty = (newBlock, blockchain) => {
  const latestBlock = blockchain[blockchain.length - DIFFICULTY_ADJUSMENT_INTERVAL] // 가장 최근 블록의 10개 전을 보여준다.
  const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSMENT_INTERVAL; // 그 블록들 사이의 소요시간
  const timeTaken = newestBlock.timestamp - lastCalculatedBlock.timestamp; // 최근 블록과 난이도가 계산된 블록사이의 소요시간을 알려줌
  if (timeTaken < timeExpected / 2) {//블록을 채굴하는데 걸리는 시간이 내가 예상한 시간(2배)보다 짧으면 난이도를 높임.
    return lastCalculatedBlock.difficulty + 1;
  } else if (timeTaken > timeExpected * 2) { //채굴시간이 내가 예상한 시간(2배)보다 길면,난이도를 낮춘다.
    return lastCalculatedBlock.difficult - 1;
  } else {
    return lastCalculatedBlock.difficulty;
  }
};

const findBlock = (index, previousHash, timestamp, data, difficulty) => {
  let nonce = 0;
  while(true) { // true가 될때까지 반복
    console.log("Current nonce:", nonce)
    const hash = createHash(
      index,
      previousHash,
      timestamp,
      data,
      difficulty,
      nonce
    );
    if (hashMatchesDifficulty(hash,difficulty)) { //to do check amount of zeros(hash Matches difficulty)
      return new Block(
        index, 
        hash, 
        previousHash, 
        timestamp, 
        data, 
        difficulty, 
        nonce)
    } 
      nonce++
  }
};

const hashMatchesDifficulty = (hash, difficulty) => { // 여기서의 argument는 hash, difficulty 이다.
  const hashInBinary = hexToBinary(hash); //
  const requiredZeros = "0".repeat(difficulty); //"0" 을 difficulty만큼 반복
  console.log("Trying difficulty:", difficulty, "with hash:", hash )
  return hashInBinary.startsWith(requiredZeros);
} 

const getBlocksHash = block => 
  createHash(block.index, block.previousHash, block.timestamp, block.data, block.nonce);

//Validating the Block
const isBlockValid = (candidateBlock, latestBlock) => {
  if (!isBlockStructureValid(candidateBlock)) {
    console.log("The candidate block structure is not valid");
    return false;
  } else if (latestBlock.index + 1 !== candidateBlock.index) {
    console.log("The candidate block doesnt have a valid index");
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.log(
      "The previousHash of the candidate block is not the hash of the latest block"
    );
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.log("The hash of this block is invalid");
    return false;
  }
  return true;
};

const isBlockStructureValid = block => {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string"
  );
};

const isChainValid = candidateChain => {
  const isGenesisValid = block => {
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "The candidateChains's genesisBlock is not the same as our genesisBlock"
    );
    return false;
  }
  for (let i = 1; i < candidateChain.length; i++) {
    if (!isBlockValid(candidateChain[i], candidateChain[i - 1])) {
      return false;
    }
  }
  return true;
};

const replaceChain = candidateChain => {
  if (
    isChainValid(candidateChain) &&
    candidateChain.length > getBlockchain().length
  ) {
    blockchain = candidateChain;
    return true;
  } else {
    return false;
  }
};

const addBlockToChain = candidateBlock => {
  if (isBlockValid(candidateBlock, getNewestBlock())) {
    blockchain.push(candidateBlock);
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getBlockchain,
  createNewBlock,
  getNewestBlock,
  isBlockStructureValid,
  addBlockToChain,
  replaceChain
};