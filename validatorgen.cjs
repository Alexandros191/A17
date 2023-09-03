const fs = require('fs');
const elliptic = require('elliptic');

// Create a secp256k1 curve (used in cryptocurrencies like Bitcoin and Ethereum)
const curve = new elliptic.ec('secp256k1');

function generateValidatorAddress(index) {
    // Generate a key pair (public and private keys) using elliptic curve cryptography
    const keyPair = curve.genKeyPair();
    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');

    return { publicKey, privateKey };
}

function generateValidatorAddresses(numValidators) {
    const validators = [];

    for (let i = 1; i <= numValidators; i++) {
        const validator = generateValidatorAddress(i);
        validators.push({
            index: i,
            ...validator
        });
    }

    return validators;
}

function organizeValidatorsInGroups(validators) {
    const groupA = validators.slice(0, 51);
    const groupB = validators.slice(51, 80);
    const groupC = validators.slice(80, 91);
    const groupD = validators.slice(91);

    return {
        groupA,
        groupB,
        groupC,
        groupD
    };
}

function saveToJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync('validator_addresses.json', jsonContent);
}

const numValidators = 100;
const allValidators = generateValidatorAddresses(numValidators);
const groupedValidators = organizeValidatorsInGroups(allValidators);

saveToJSON(groupedValidators);
