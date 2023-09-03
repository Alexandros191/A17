const fs = require('fs');
const crypto = require('crypto');

// Load transaction data from data.json
const jsonData = fs.readFileSync('data.json', 'utf8');
const transactions = JSON.parse(jsonData);

transactions.forEach(transactionObj => {
  const { recipient, amount, timestamp, signature, senderPublicKey } = transactionObj.transaction;
  const senderKeyPair = transactionObj.keyPair;

  // Deserialize and hash the transaction data
  const transactionDataString = JSON.stringify({ recipient, amount, timestamp });
  const transactionDataHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

  // Recalculate the hash
  const recalculatedHash = crypto.createHash('sha256').update(transactionDataString).digest('hex');

  // Verify the signature using the sender's public key
  const verify = crypto.createVerify('sha256');
  verify.update(recalculatedHash);
  const isSignatureValid = verify.verify(senderKeyPair.publicKey, signature, 'base64');

  console.log('Recipient:', recipient);
  console.log('Amount:', amount);
  console.log('Timestamp:', timestamp);
  console.log('Is Hash Match?', recalculatedHash === transactionDataHash);
  console.log('Is Signature Valid?', isSignatureValid);
  console.log('---');
});
