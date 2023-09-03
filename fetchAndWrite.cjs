const fs = require('fs');
const axios = require('axios');

const url = 'http://localhost:4000/data.json';
const outputFile = 'users.json';

async function fetchDataAndSaveToFile() {
    try {
        const response = await axios.get(url);
        const jsonData = response.data;

        fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
        console.log(`Data successfully written to ${outputFile}`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

// Fetch and save data immediately
fetchDataAndSaveToFile();

// Fetch and save data every 10 seconds
setInterval(fetchDataAndSaveToFile, 10000); // 10000 milliseconds = 10 seconds
