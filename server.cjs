const express = require('express');
const app = express();
const { exec } = require('child_process');

app.use(express.static('public'));

app.get('/run-node-script', (req, res) => {
  // Run your Node.js script here
  exec('node newsim.cjs', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send('Error running Node.js script.');
      return;
    }
    console.log(`Script output: ${stdout}`);
    res.send('Node.js script executed successfully.');
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
