const crypto = require('crypto');
const fs = require('fs');

// Transaction details
const transaction = {
  sender: "baa3b07b8f0322ec93ccce8861dd963d03b178b0",
  recipient: "baa3b07b8f0322ec93ccce8861dd963d03b178b0",
  amount: 10,
  timestamp: 1692614917080
};

// Received digital signature
const receivedSignature = "received_signature_here"; // Replace with the actual received signature

// Load the sender's public key
const publicKeyPEM = fs.readFileSync('public_key.pem', 'utf8');
const publicKey = crypto.createPublicKey(publicKeyPEM);

// Verify the signature
const verify = crypto.createVerify('SHA256');
verify.update(JSON.stringify(transaction));

const isSignatureValid = verify.verify(publicKey, receivedSignature, 'base64');
console.log("Is Signature Valid?", isSignatureValid);
