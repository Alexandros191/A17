const crypto = require('crypto');
const fs = require('fs');

// Create or load a secure storage file (you might use a real database in a production environment)
const secureStorageFile = './secure_storage.json';
let secureStorage = {};

// Load data from the secure storage file
try {
    const storedData = fs.readFileSync(secureStorageFile, 'utf8');
    secureStorage = JSON.parse(storedData);
} catch (error) {
    // Handle file read error or invalid JSON
    console.error('Error loading secure storage file:', error);
}

// Function to generate a new key pair
const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    return { publicKey, privateKey };
};

// Function to store user data securely
const storeUserData = (userId, publicKey, privateKey) => {
    // Encrypt and store private key securely
    const encryptedPrivateKey = crypto.privateEncrypt(publicKey, Buffer.from(privateKey, 'utf8')).toString('base64');

    // Store user data
    secureStorage[userId] = { publicKey, encryptedPrivateKey };
    saveSecureStorage();
};

// Function to retrieve user data
const getUserData = (userId, password) => {
    const userData = secureStorage[userId];
    if (!userData) {
        return null; // User not found
    }

    // Decrypt private key using the provided password
    const decryptedPrivateKey = crypto.privateDecrypt(password, Buffer.from(userData.encryptedPrivateKey, 'base64')).toString('utf8');

    return {
        publicKey: userData.publicKey,
        privateKey: decryptedPrivateKey
    };
};

// Function to save secure storage to file
const saveSecureStorage = () => {
    try {
        const serializedData = JSON.stringify(secureStorage, null, 2);
        fs.writeFileSync(secureStorageFile, serializedData, 'utf8');
    } catch (error) {
        // Handle file write error
        console.error('Error saving secure storage file:', error);
    }
};

module.exports = { generateKeyPair, storeUserData, getUserData };
