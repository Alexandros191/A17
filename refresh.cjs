const http = require('http');

// Configure the server details
const serverHost = 'localhost';
const serverPort = 3000; // Change this to your server's port

// Make an HTTP GET request to trigger a refresh
const refreshRequest = http.request(
  {
    hostname: serverHost,
    port: serverPort,
    path: '/refresh', // This should be the path that triggers a page refresh on your server
    method: 'GET',
  },
  (response) => {
    console.log(`Refresh request sent. Status code: ${response.statusCode}`);
  }
);

refreshRequest.on('error', (error) => {
  console.error('Error sending refresh request:', error);
});

refreshRequest.end();
