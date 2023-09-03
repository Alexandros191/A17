const fs = require('fs');
const chokidar = require('chokidar');

const dataFilePath = 'data.json';
const usersFilePath = 'users.json';

// Read the initial data from data.json and update users.json
const initialData = fs.readFileSync(dataFilePath, 'utf8');
fs.writeFileSync(usersFilePath, initialData, 'utf8');

// Watch for changes in data.json and update users.json
chokidar.watch(dataFilePath).on('change', (event, path) => {
  const newData = fs.readFileSync(dataFilePath, 'utf8');
  fs.writeFileSync(usersFilePath, newData, 'utf8');
  console.log(`Change detected in ${dataFilePath}. Updating ${usersFilePath}.`);
});

console.log('Real-time synchronization started.');
