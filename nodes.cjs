const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

const startPort = 3000;
const endPort = 3016;

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

function verifyTransaction(transactionObj) {
  const transactionData = transactionObj.transaction;
  const privateKey = transactionObj.keyPair.privateKey;
  const publicKey = transactionObj.keyPair.publicKey;

  function createDigitalSignature(data, privateKey) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(JSON.stringify(data));
    return sign.sign(privateKey, 'hex');
  }

  function verifyDigitalSignature(data, signature, publicKey) {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(JSON.stringify(data));
    return verify.verify(publicKey, signature, 'hex');
  }

  const signature = createDigitalSignature(transactionData, privateKey);
  const isValid = verifyDigitalSignature(transactionData, signature, publicKey);

  return {
    signature: signature,
    isValid: isValid
  };
}

function verifyNewTransactions() {
  const newData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  for (let i = 0; i < newData.length; i++) {
    const existingTransaction = data.find(entry => entry.transaction.sender === newData[i].transaction.sender);

    if (!existingTransaction) {
      const verificationResult = verifyTransaction(newData[i]);
      newData[i].signature = verificationResult.signature;
      newData[i].isValid = verificationResult.isValid;
    }
  }

  data = newData;
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

setInterval(verifyNewTransactions, 10000);

function generatePage(data) {
  const transactionsHtml = data.map((entry, index) => {
    const { transaction } = entry;

    return `
      <div>
        <pre>${JSON.stringify(transaction, null, 2)}</pre>
        <p>Transaction ${index + 1} Signature: ${entry.signature}</p>
        <p>Transaction ${index + 1} Validation: ${entry.isValid ? 'Valid' : 'Invalid'}</p>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="10">
</head>
<body>
  <a href="/data.json" target="_blank">Open data.json in new tab</a>
  <div>${transactionsHtml}</div>
</body>
</html>`;
}

for (let port = startPort; port <= endPort; port++) {
  const server = http.createServer((req, res) => {
    if (req.url === '/data.json') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(data, null, 2));
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(generatePage(data));
      res.end();
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

const validServer = http.createServer((req, res) => {
  if (req.url === '/data.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data, null, 2));
    res.end();
  } else if (req.url === '/open-data-json') {
    const openScript = `
      <script>
        window.open('/data.json', '_blank');
      </script>
    `;

    const pageContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Open data.json</title>
      </head>
      <body>
        <h1>Click the button to open data.json in a new tab</h1>
        <button onclick="openDataJson()">Open data.json</button>
        ${openScript}
      </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(pageContent);
    res.end();
  } else {
    const validTransactions = data.filter(entry => entry.isValid);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(generatePage(validTransactions));
    res.end();
  }
});

const port4000 = 4000;
validServer.listen(port4000, () => {
  console.log(`Server for valid transactions running at http://localhost:${port4000}`);
});
