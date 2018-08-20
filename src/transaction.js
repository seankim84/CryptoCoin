const CryptoJS = require("crypto-js"),
      elliptic = require("elliptic");

const ec = new EC("secp256k1");

class TxOut { // 얼마의 코인이 있는지, 어디에 속해 있는지
    constructor(address, amount){
        this.address = address;
        this.amount = amount;
    }
}

class TxIn { //input은 constructor가 없다. 우리가 바꿀것이기에
    // uTxOutId
    // uTxOutIndex
    // Signature
}

class Transaction {
    // ID
    // txIns[]
    // txOuts[]
}

class UTxOut {
    constructor(uTxOutId, uTxOutputIndex, address, amount){
        this.uTxOutId = uTxOutId;
        this.uTxOutputIndex = uTxOutputIndex;
        this.address = address;
        this.amount = amount;
    }
}

let uTxOuts =  [];

const getTxId = tx => { // tx 은 많은 수의 input과 output을 가진다. 그것들을 가져다가 hash 한다.
    const txInContent = tx.txIns.map(txIn => txIn.uTxOutId + txIn.uTxOutputIndex)
    .reduce((a,b) => a + b, "");

    const txOutContent = tx.txOuts.map(txOut => txOut.address + txOut.amount)
    .reduce((a,b) => a+b, "");
    
return CryptoJS.SHA256(txInContent + txOutContent).toString();
}

const signTxIn = (tx, txInIndex, privateKey, uTxOut) => {
    const txIn = tx.txIns[txInIndex];
    const dataToSign = tx.id;
    // To Do: Find Tx
    const referenceTxOut = null;
    if(referenceTxOut === null) {
        return;
    }
}