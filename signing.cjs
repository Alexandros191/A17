const crypto = require('crypto');

class Validator {
    constructor(publicKey, privateKey, weight) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.weight = weight;
    }

    sign(data) {
        const sign = crypto.createSign('sha256');
        sign.update(data);
        return sign.sign(this.privateKey, 'hex');
    }

    verify(data, signature) {
        const verify = crypto.createVerify('sha256');
        verify.update(data);
        return verify.verify(this.publicKey, signature, 'hex');
    }
}

class Block {
    constructor(index, data, previousBlock, validator, weight) {
        this.index = index;
        this.data = data;
        this.previousBlock = previousBlock;
        this.timestamp = new Date().toISOString();
        this.validator = validator;
        this.weight = weight;
        this.signature = null;
    }

    signBlock() {
        const dataToSign = `${this.index}${this.data}${this.previousBlock}${this.timestamp}${this.validator.publicKey}${this.weight}`;
        this.signature = this.validator.sign(dataToSign);
    }

    validateBlock() {
        const dataToVerify = `${this.index}${this.data}${this.previousBlock}${this.timestamp}${this.validator.publicKey}${this.weight}`;
        return this.validator.verify(dataToVerify, this.signature);
    }
}

// Sample validator data
const validator1_public_key = '...';
const validator1_private_key = '...';
const validator1_weight = 1;

const validator2_public_key = '...';
const validator2_private_key = '...';
const validator2_weight = 2;

const validator1 = new Validator(validator1_public_key, validator1_private_key, validator1_weight);
const validator2 = new Validator(validator2_public_key, validator2_private_key, validator2_weight);

// Create a sample block
const block1 = new Block(1, 'Transaction Data', null, validator1, validator1_weight);

// Sign and validate the block
block1.signBlock();
const isValid = block1.validateBlock();

console.log('Block Signature:', block1.signature);
console.log('Block Validation:', isValid);
