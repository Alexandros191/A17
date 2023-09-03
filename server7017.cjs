const http = require('http');

const serverPort = 7017;
let receivedData = []; // Store received data

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/display') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const transactions = JSON.parse(body);
        receivedData.push(transactions); // Store received data

        console.log('Received data:', transactions); // Log received data

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(receivedData, null, 2));
      } catch (error) {
        console.error('Error parsing received data:', error.message);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } else if (req.method === 'GET' && req.url === '/display') {
    const pageContent = generateHtmlPage(receivedData);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(pageContent);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});

function generateHtmlPage(data) {
  const jsonData = JSON.stringify(data, null, 2);

  return `<!DOCTYPE html>
<html>
<head>
  <title>Received Data from Port 8000</title>
  <meta http-equiv="refresh" content="10">
</head>
<body>
  <h1>Received Data from Port 8000</h1>
  <pre>${jsonData}</pre>
</body>
</html>`;
}