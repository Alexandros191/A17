const IPFS = require('ipfs-core');

// Create an IPFS instance
async function createIPFSInstance() {
  return await IPFS.create();
}

// Example transactions data
const transactions = [
  {
    from: 'userA',
    to: 'userB',
    amount: 10
  },
  {
    from: 'userC',
    to: 'userD',
    amount: 5
  }
];

// Function to add transactions to IPFS and return their hashes
async function addTransactions(ipfs, transactions) {
  const transactionHashes = [];
  
  for (const transaction of transactions) {
    const transactionHash = await ipfs.add(JSON.stringify(transaction));
    transactionHashes.push(transactionHash.cid.toString());
  }
  
  return transactionHashes;
}

// Example usage
(async () => {
  try {
    const ipfs = await createIPFSInstance();
    const transactionHashes = await addTransactions(ipfs, transactions);
    
    console.log('Transactions added to IPFS:');
    console.log(transactionHashes);
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
