const http = require('http');
const port = 7056;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const jsonData = JSON.parse(data);

                // Assuming the client is sending a JSON object with a "walletstore" property
                if (jsonData.walletstore) {
                    console.log('Received walletstore:', jsonData.walletstore);

                    // You can perform any processing or storage of the data here

                    // Sending a response back to the client
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Data received successfully' }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid data format' }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error processing data' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
