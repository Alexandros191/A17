const fs = require('fs');
const crypto = require('crypto');

// Load existing transactions from the JSON file
let transactions = loadTransactionsFromJson();

// Function to load transactions from the JSON file
function loadTransactionsFromJson() {
    try {
        const data = fs.readFileSync('transactions.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist or is invalid, return an empty array
        return [];
    }
}

// Load existing users from the JSON file (create file if it doesn't exist)
function loadUsersFromJson() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, return an empty array
        return [];
    }
}

// Load the users from the JSON file
const users = loadUsersFromJson();

// Select the first user for this example
const senderUser = users[0];
const senderPrivateKey = senderUser.privateKey;
const senderPublicKey = senderUser.publicKey; // Add public key
const senderWalletAddress = senderUser.walletAddress;

// Recipient's wallet address (replace with actual recipient's address)
const recipientWalletAddress = "Recipient's Wallet Address";

// Amount to be sent
const amount = 10;

// Create a transaction object
const transaction = {
    sender: senderWalletAddress,
    senderPublicKey: senderPublicKey, // Add sender's public key
    recipient: recipientWalletAddress,
    amount: amount,
    timestamp: Date.now(), // Use the current time
    signature: null, // Placeholder for the digital signature
    senderPrivateKey: senderPrivateKey // Add sender's private key
};

// Convert the transaction object (excluding the signature) to a string for signing
const transactionWithoutSignature = {
    sender: transaction.sender,
    senderPublicKey: transaction.senderPublicKey, // Include sender's public key
    recipient: transaction.recipient,
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    senderPrivateKey: transaction.senderPrivateKey // Include sender's private key
};

// Create a hash of the transaction data
const hash = crypto.createHash('sha256').update(JSON.stringify(transactionWithoutSignature)).digest('hex');

// Sign the hash using the sender's private key
const signer = crypto.createSign('RSA-SHA256');
signer.update(hash);
const signature = signer.sign(senderPrivateKey, 'base64');

// Assign the digital signature to the transaction object
transaction.signature = signature;

console.log('Transaction:', transaction);
console.log('Digital Signature:', signature);

// Push the new transaction to the transactions array
transactions.push(transaction);

// Update transactions.json with the new transactions
fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 4));

console.log('Transaction added to transactions.json');
