const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Generate a new user
function generateUser(name) {
    const user = {
        id: Date.now().toString(),
        name: name,
        publicKey: '',
        privateKey: '',
        walletAddress: ''
    };

    // Generate keys
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    user.publicKey = publicKey;
    user.privateKey = privateKey;

    // Generate a simple wallet address (this is just an example)
    const walletAddress = crypto.randomBytes(20).toString('hex');
    user.walletAddress = walletAddress;

    return user;
}

// Create a user and store their information in the JSON file
function createUserAndStore() {
    rl.question('Enter user name: ', (name) => {
        const newUser = generateUser(name);
        const users = loadUsersFromJson(); // Load existing users from the JSON file

        users.push(newUser);

        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

        console.log('User created and stored:', newUser);

        rl.close();
    });
}

// Load existing users from the JSON file (create file if it doesn't exist)
function loadUsersFromJson() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // If file doesn't exist, return an empty array
        return [];
    }
}

// Create a user and store their information
createUserAndStore();
