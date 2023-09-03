const fs = require('fs');
const crypto = require('crypto');

// Define the Block class
class Block {
    constructor(index, previousHash, transactions, timestamp, validator) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.validator = validator;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce +
                this.validator
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
        ) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block ${this.index}:`);
        console.log(`  Hash: ${this.hash}`);
        console.log(`  Previous Hash: ${this.previousHash}\n`);
    }
}

// Define the Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.validators = loadValidatorData();
    }

    createGenesisBlock() {
        return new Block(0, '0', [], Date.now(), 'Genesis');
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createTransaction(sender, recipient, amount) {
        this.pendingTransactions.push({
            sender,
            recipient,
            amount,
        });
    }

    minePendingTransactions(validator) {
        const newBlock = new Block(
            this.chain.length,
            this.getLastBlock().hash,
            this.pendingTransactions,
            Date.now(),
            validator
        );
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.pendingTransactions = [];
    }

    getValidatorsInOrder() {
        const allValidators = [
            ...this.validators.groupA,
            ...this.validators.groupB,
            ...this.validators.groupC,
            ...this.validators.groupD,
        ];

        const validatorsInOrder = allValidators
            .sort((a, b) => a.weight - b.weight)
            .map((validator) => validator.publicKey);

        return validatorsInOrder;
    }

    mineBlocksUsingValidators() {
        const validatorsInOrder = this.getValidatorsInOrder();

        for (let i = 0; i < validatorsInOrder.length; i++) {
            this.minePendingTransactions(validatorsInOrder[i]);
        }
    }

    isValidChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

function loadValidatorData() {
    const data = fs.readFileSync('validator_addresses.json', 'utf8');
    const validatorData = JSON.parse(data);
    return validatorData;
}

// Create a blockchain instance
const blockchain = new Blockchain();

// Mine blocks using validators in order
blockchain.mineBlocksUsingValidators();

// Validate the blockchain
console.log('Is blockchain valid?', blockchain.isValidChain());
