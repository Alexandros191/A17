const fs = require('fs');
const crypto = require('crypto');

// Function to generate a key pair (private key and public key)
function generateKeyPair() {
    return crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
}

// Function to generate a wallet address from a public key
function generateWalletAddress(publicKey) {
    const publicKeyHash = crypto.createHash('sha256').update(publicKey).digest('hex');
    return publicKeyHash;
}

// Generate a key pair
const { privateKey, publicKey } = generateKeyPair();

// Generate sender wallet address
const senderWalletAddress = generateWalletAddress(publicKey);

// Generate a unique filename for the recipient's transaction file
const recipientTransactionFilename = `document_${Date.now()}.pdf`;

// Simulated transaction data
const transactionData = {
    sender: senderWalletAddress,
    recipientAddress: "walletaddress", // Changed the property name
    textOwnershipFiles: recipientTransactionFilename, // Store the filename as the value
    timestamp: Date.now()
};

// Serialize and hash the transaction data
const transactionDataString = JSON.stringify(transactionData);
const transactionDataHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

// Display the results
console.log('Transaction Data Hash:', transactionDataHash);
console.log('Sender Wallet Address:', senderWalletAddress);
console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
console.log('Recipient Transaction File:', recipientTransactionFilename);
