const fs = require('fs');
const crypto = require('crypto');

// Load the key pair from the JSON file
const keyPair = loadKeyPairFromJson();

function loadKeyPairFromJson() {
    try {
        const data = fs.readFileSync('keyPair.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error loading key pair:', err);
        process.exit(1);
    }
}

// Simulated transaction data
const transactionData = {
  sender: 'sender-address',
  senderPublicKey: keyPair.publicKey, // Include the sender's public key
  recipient: 'recipient-address',
  amount: 10,
  timestamp: Date.now()
};

// Serialize and hash the transaction data
const transactionDataString = JSON.stringify(transactionData);
const transactionDataHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

// Sign the hash using the private key
const sign = crypto.createSign('sha256');
sign.update(transactionDataHash);
const signature = sign.sign(keyPair.privateKey, 'base64');

console.log('Transaction Data Hash:', transactionDataHash);
console.log('Signature:', signature);

// Simulated verification process

// Deserialize and hash the transaction data
const recalculatedHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

console.log('Recalculated Hash:', recalculatedHash);
console.log('Is Hash Match?', recalculatedHash === transactionDataHash);

// Verify the signature using the sender's public key
const verify = crypto.createVerify('sha256');
verify.update(recalculatedHash);
const isSignatureValid = verify.verify(keyPair.publicKey, signature, 'base64');

console.log('Is Signature Valid?', isSignatureValid);
