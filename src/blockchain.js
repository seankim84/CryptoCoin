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
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimeStamp = () => new Date().getTime() / 1000 ;

const createHash = (index, previousHash, timestamp, data ) => {
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)
    ).toString();
}

const createNewBlock = data => {
    const previousBlock = getLastBlock(); 
    const newBlockIndex = previousBlock.index + 1;
    const newTimeStamp = getTimeStamp();

    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash, 
        newTimeStamp, 
        data
    );

    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimeStamp,
        data
    );

    return newBlock;
};


const getBlockHash = block => createHash(block.index, block.previousHash, block.timestamp, block.data)

const isNewBlockValid = (candidateBlock, latestBlock) => {
   if(!isNewStructureValid(candidateBlock)){
       console.log("The candidateBlock structure is not valid");
       return false;
   }
   else if(latestBlock.index + 1 !== candidateBlock.index){
        console.log("The candidateBlock doesn't have valid index")
        return false;
    }
    else if(latestBlock.hash !== candidateBlock.previousHash){
        console.log("The previousHash of candidateBlock is not the hash of the latest Block")
        return false;
    }
    else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
        console.log("The hash of this Block is invalid");
        return false;
    }
    return true;
};

const isNewStructureValid = block => {
    return(
        typeof block.index === "number" &&
        typeof block.hash === 'string' && 
        typeof block.previousHash === 'string' && 
        typeof block.timestamp === 'number' &&
        typeof block.data === 'string'
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock)
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log("The candidateChains's genesisBlock is not the same genesisBlock");
        return false;
    }
    for (let i=1; i < candidateChain.length; i++){
        if(!isNewBlockvalid(candidateChain[i], candidateChain[i-1])){
            return false;
        }
    }
    return true;
};

