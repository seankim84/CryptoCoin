//input은 이전에는 output 이다.

const CryptoJS = require("crypto-js"),
      elliptic = require("elliptic"),
      utils  = require("./utils");

const ec = new elliptic.ec("secp256k1");


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
    constructor(txOutId, txOutputIndex, address, amount){
        this.txOutId = txOutId;
        this.txOutputIndex = txOutputIndex;
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

const findTxOut = (txOutId, txOutIndex, uTxOutList) => {
    return uTxOutList.find(
        uTxOut = uTxOut.txOutId === txOutId && uTxOut.txOutIndex === txOutIndex
    );
}  

const signTxIn = (tx, txInIndex, privateKey, uTxOut) => {
    const txIn = tx.txIns[txInIndex];
    const dataToSign = tx.id;
    // To Do: Find Tx
    const referenceUTxOut = findTxOut(txIn.txOutId, tx.txOutIndex, uTxOuts);
    if(referenceUTxOut === null) {
        return;
    }
    const key = ec.keyFromPrivate(privateKey, "hex");
    const signature = utils.toHexString(key.sign(dataToSign).toDER());
    return signature;
};

const updateUTxOuts = (newTxs, uTxOutList) => {
    const newUTxOuts = newTxs.map(tx => {
        tx.txOuts.map(
            (txOut, index) => {
                new UTxOut(tx, id, index, txOut.address, txOut.amount);
            });
    })
    .reduce((a,b) => a.concat(b), []); 
    
    const spentTxOuts = newTxs.map(tx => tx.txIns)
    .reduce((a,b) => a.concat(b), [])
    .map(txIn => new UTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

    const resultingUTxOuts = uTxOutList.filter(uTxO => !findUTxOut(uTxO.txOutID, uTxO.txOutIndex, spentTxOuts)
    ).concat(newUTxOuts);

    return resultingUTxOuts;
};

const isTxInStructureValid = (txIn) => {
    //to do
}

const isTxOutStructureValid = (txOut) => {

}

const isTxStructureValid = (tx) => {
    if (typeof tx.id !=="string"){
        console.log("Tx Id is not Valid");
        return false;
    } else if(!(tx.txIns instanceof Array)){
        console.log("The TxIns are not array")
        return false;
    } else if(){
        console.log("The structure of one of the txIn is not valid")
    } else if(!(tx.txOuts instanceof Array)){
        console.log("The txOuts are not an array")
        return false;
    } else if(){
        console.log("The structure of one of the txOut is not valid")
        return false;
    } else {
        return true;
    }
};