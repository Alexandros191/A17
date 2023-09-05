const crypto = require('crypto');

class Block {
    constructor(index, previousHash, timestamp, data, nonce, hash, privateKey) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.hash = hash;
        this.privateKey = privateKey; // Added private key
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '0', Date.now(), 'Genesis Block', 0, this.calculateHash(0, '0', Date.now(), 'Genesis Block', 0), '');
    }

    calculateHash(index, previousHash, timestamp, data, nonce) {
        return crypto.createHash('sha256').update(index + previousHash + timestamp + data + nonce).digest('hex');
    }

    mineBlock(index, previousHash, timestamp, data, difficulty, privateKey) {
        let nonce = 0;
        let hash = '';

        while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            nonce++;
            hash = this.calculateHash(index, previousHash, timestamp, data, nonce);
        }

        return new Block(index, previousHash, timestamp, data, nonce, hash, privateKey);
    }

    addBlock(newBlock) {
        const lastBlock = this.chain[this.chain.length - 1];
        newBlock.previousHash = lastBlock.hash;
        newBlock.timestamp = Date.now();
        newBlock.hash = this.calculateHash(newBlock.index, newBlock.previousHash, newBlock.timestamp, newBlock.data, newBlock.nonce);
        this.chain.push(newBlock);
    }
}

const blockchain = new Blockchain();

// Load validator data
const validatorData = require('./validator_addresses.json');
const validators = [...validatorData.groupA, ...validatorData.groupB, ...validatorData.groupC, ...validatorData.groupD];

// Simulate block mining
const difficulty = 4; 
for (let i = 1; i <= 100; i++) {
    const validator = validators[(i - 1) % validators.length];
    const newBlock = blockchain.mineBlock(i, blockchain.chain[i - 1].hash, Date.now(), `Block ${i} by Validator ${validator.index}`, difficulty, validator.privateKey);
    blockchain.addBlock(newBlock);
}

// Print the blockchain with private keys
console.log(JSON.stringify(blockchain.chain, null, 2));
