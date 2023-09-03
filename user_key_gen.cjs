const crypto = require('crypto');

class Wallet {
    constructor() {
        this.privateKey = this.generatePrivateKey();
        this.publicKey = this.generatePublicKey(this.privateKey);
        this.walletAddress = this.generateWalletAddress(this.publicKey);
    }

    generatePrivateKey() {
        return [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    generatePublicKey(privateKey) {
        // Generate public key using your preferred elliptic curve algorithm
        // This is a simplified example and doesn't use a real elliptic curve library
        const privateKeyBytes = Buffer.from(privateKey, 'hex');
        const public_key_hash = crypto.createHash('sha256').update(privateKeyBytes).digest('hex');
        return public_key_hash;
    }

    generateWalletAddress(publicKey) {
        // Hash the custom mark 'A17INC' using SHA-256
        const customMark = 'A17INC';
        const customMarkHash = crypto.createHash('sha256').update(customMark).digest('hex');

        // Concatenate the hashed mark and public key
        const concatenatedData = customMarkHash + publicKey;

        // Hash the concatenated data using SHA-256 to generate the wallet address
        const walletAddress = crypto.createHash('sha256').update(concatenatedData).digest('hex');
        return walletAddress;
    }
}

// Create a new wallet
const wallet = new Wallet();

// Print wallet details
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
console.log('Wallet Address:', wallet.walletAddress);
