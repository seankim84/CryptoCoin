const CryptoJS = require("crypto-js");


class Block {

    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data
    }
}

const genesisBlock = new Block(
    0,
    "6ABF814EDDA2B4C85D18FA4FF6D9DA2A8A15D2AA1DC7C377F2A5D825BF6334A2",
    null,
    1531971406.881,
    "This is the genesis"
)

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimeStamp = () => new Date().getTime() / 1000 ;

const createNewBlock = data => {
    const previousBlock = getLastBlock(); 
    const newBlockIndex = previousBlock.index + 1;
    const newTimeStamp = getTimeStamp();

}