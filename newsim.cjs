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

// Load existing data from the JSON file or initialize an empty array
let data = [];
try {
    const jsonData = fs.readFileSync('data.json', 'utf8');
    data = JSON.parse(jsonData);
} catch (err) {
    // If file doesn't exist or is invalid, continue with an empty array
}

// Generate a key pair
const { privateKey, publicKey } = generateKeyPair();

// Generate sender wallet address
const senderWalletAddress = generateWalletAddress(publicKey);

// Generate a unique filename for the recipient's transaction file
const recipientTransactionFilename = `PrivateContract10.pdf `;

// Simulated transaction data
const transactionData = {
    sender: "2a62c5e1802addf4371789af878beb13d6202d5700f9f0633163e2e0084a90cb",
    recipientAddress: "85e22d1ef1542973848a0d5bfcf022dbcdc2749c9767dd999c53647b02f9f8e5", // Changed the property name
    textOwnershipFiles: recipientTransactionFilename, // Store the filename as the value
    timestamp: Date.now()
};

// Serialize and hash the transaction data
const transactionDataString = JSON.stringify(transactionData);
const transactionDataHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

console.log('Transaction Data Hash:', transactionDataHash);

// Save transaction and key pair details to data array
data.push({
    transaction: {
        sender: transactionData.sender,
        recipientAddress: transactionData.recipientAddress, // Changed the property name
        textOwnershipFiles: transactionData.textOwnershipFiles,
        timestamp: transactionData.timestamp
    },
    keyPair: {
        privateKey: privateKey,
        publicKey: publicKey
    }
});

// Save data to the JSON file
fs.writeFileSync('data.json', JSON.stringify(data, null, 4));

// Display the link to the recipient's transaction file
console.log('Transaction and key pair details saved in data.json.');
console.log('Recipient Transaction File:', recipientTransactionFilename);
