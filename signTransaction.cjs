const crypto = require('crypto');
const fs = require('fs');

// Transaction details
const transaction = {
  sender: "baa3b07b8f0322ec93ccce8861dd963d03b178b0",
  recipient: "baa3b07b8f0322ec93ccce8861dd963d03b178b0",
  amount: 10,
  timestamp: 1692614917080
};

// Load the sender's private key
const privateKeyPEM = fs.readFileSync('private_key.pem', 'utf8');
const privateKey = crypto.createPrivateKey(privateKeyPEM);

// Sign the transaction
const sign = crypto.createSign('SHA256');
sign.update(JSON.stringify(transaction));
const signature = sign.sign(privateKey, 'base64');

console.log("Digital Signature:", signature);
