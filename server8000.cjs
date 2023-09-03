const http = require('http');
const axios = require('axios');
const crypto = require('crypto');

const serverPort = 8000;
const targetServerUrl = 'http://localhost:4000'; // URL of the server on port 4000

function fetchAndDisplayTransactions(res) {
  // Fetch the JSON data from the target server on port 4000
  axios.get(`${targetServerUrl}/data.json`)
    .then(response => {
      const transactions = response.data;
      const validTransactions = [];
      let previousHash = null; // Initial value for the Genesis block's previous hash
      let genesisHash = null; // Variable to store the Genesis block's hash

      // Add the Genesis block
      const genesisBlock = {
        name: "Genesis Block",
        timestamp: 1693235538550 // An earlier timestamp for the Genesis block
      };

      const genesisBlockData = JSON.stringify(genesisBlock) + previousHash;
      genesisHash = crypto.createHash('sha256').update(genesisBlockData).digest('hex');

      validTransactions.push({
        transaction: genesisBlock,
        hash: genesisHash,
        previousHash: null,
      });

      // Process each transaction
      transactions.forEach((entry, index) => {
        const { transaction, signature, isValid } = entry;

        if (isValid) {
          const transactionData = JSON.stringify(transaction) + signature + previousHash;
          const hash = crypto.createHash('sha256').update(transactionData).digest('hex');

          validTransactions.push({
            transaction,
            signature,
            isValid: true,
            hash,
            previousHash,
          });

          previousHash = hash; // Update the previousHash for the next transaction
        }
      });

      const transactionsHtml = validTransactions.map((entry, index) => {
        const transactionHtml = `
          <div style="font-family: 'Montserrat', sans-serif; margin: 10px auto; max-width: 600px; text-align: left; border-top: 1px solid #ccc; padding-top: 10px;">
            <pre>${JSON.stringify(entry.transaction, null, 2)}</pre>
            <p style="font-size: 12px;">Transaction ${index} Hash: ${entry.hash}</p>
            <p style="font-size: 12px;">Transaction ${index} Previous Hash: ${entry.previousHash || genesisHash}</p>
          </div>
        `;
        return transactionHtml;
      }).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Transactions</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Montserrat', sans-serif;
              text-align: center;
            }
          </style>
          <meta http-equiv="refresh" content="10">
        </head>
        <body>
          <div><a href="${targetServerUrl}/data.json" target="_blank">)*(^(*&^)*&^(&^</a></div>
          ${transactionsHtml}
        </body>
        </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    })
    .catch(error => {
      console.error('Error fetching data from port 4000:', error.message);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fetchAndDisplayTransactions(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});
