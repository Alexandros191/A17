const http = require('http');

const serverPort = 7017;
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/collect') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const transactions = JSON.parse(body);
        const transactionsHtml = generateTransactionHtml(transactions);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(transactionsHtml);
      } catch (error) {
        console.error('Error parsing received data:', error.message);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});

function generateTransactionHtml(transactions) {
  const transactionsHtml = transactions.map((transaction, index) => {
    return `
      <div>
        <h3>Transaction ${index + 1}</h3>
        <pre>${JSON.stringify(transaction, null, 2)}</pre>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <title>Received Transactions</title>
</head>
<body>
  <h1>Received Transactions</h1>
  ${transactionsHtml}
</body>
</html>`;
}
