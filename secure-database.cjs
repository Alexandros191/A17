const http = require('http');
const fs = require('fs');

const jsonRpcApiUrl = 'http://localhost:4000'; // Replace with your API's URL
const displayPort = 5600;

let users = []; // Array to hold user data

const displayServer = http.createServer((req, res) => {
    const requestData = JSON.stringify({
        jsonrpc: '2.0',
        method: 'getTransactions', // Replace with your API method
        params: [], // If your method requires parameters, provide them here
        id: 1
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    const apiRequest = http.request(jsonRpcApiUrl, requestOptions, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const jsonData = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonData, null, 2)); // Send JSON response

                jsonData.forEach(transaction => {
                    const user = users.find(user => user.walletAddress === transaction.senderAddress);
                    if (user) {
                        user.amount = transaction.amount; // Update the user's amount
                    }
                });

                console.log(`User 1's balance: ${users.find(user => user.id === "1691967106871").amount}`);
                console.log(`User 2's balance: ${users.find(user => user.id === "1691967121675").amount}`);
                console.log(`User 3's balance: ${users.find(user => user.id === "1693063702288").amount}`);
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        });
    });

    apiRequest.on('error', (error) => {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });

    apiRequest.write(requestData);
    apiRequest.end();
});

// Read initial user data from the file
fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading users.json:', err);
    } else {
        users = JSON.parse(data);
    }

    // Start the server
    displayServer.listen(displayPort, () => {
        console.log(`Display server is running on port ${displayPort}`);
    });
});
