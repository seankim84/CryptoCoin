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