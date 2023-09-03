const fs = require('fs');
const elliptic = require('elliptic');

const curve = new elliptic.ec('secp256k1');

function generateKeyPair() {
    const keyPair = curve.genKeyPair();
    const publicKey = keyPair.getPublic().encode('hex');
    const privateKey = keyPair.getPrivate().toString(16);
    return { publicKey, privateKey };
}

function generateValidatorData(numValidators) {
    const validators = [];
    for (let i = 0; i < numValidators; i++) {
        const { publicKey, privateKey } = generateKeyPair();
        validators.push({
            index: i + 1,
            publicKey,
            privateKey,
            calculatedValue: 0, // Initialize calculatedValue property
        });
    }
    return validators;
}

function createValidatorGroups(validators) {
    const groupA = validators.slice(0, 51);
    const groupB = validators.slice(51, 80);
    const groupC = validators.slice(80, 91);
    const groupD = validators.slice(91);
    return { groupA, groupB, groupC, groupD };
}

function loadValidatorData() {
    const data = fs.readFileSync('validator_addresses.json', 'utf8');
    return JSON.parse(data);
}

function updateJsonFile(validatorData) {
    fs.writeFileSync('validator_addresses.json', JSON.stringify(validatorData, null, 2), 'utf8');
}

function sortCalculatedValues(group) {
    return group.sort((a, b) => b.calculatedValue - a.calculatedValue);
}

function assignWeights(group) {
    return group.map((validator, index) => ({
        ...validator,
        weight: index + 1,
    }));
}

function applyRotationMechanismA(groupA, cycle) {
    const adjustedCycle = cycle % 200 < 100 ? cycle % 100 + 1 : 200 - (cycle % 100);
    groupA.forEach(validator => {
        const e = Math.exp(1);
        const sum = groupA.reduce((acc, v) => acc + Math.exp((v.index + adjustedCycle) / 100), 0);
        const calculatedValueA = Math.exp((validator.index + adjustedCycle) / 100) / sum;
        validator.calculatedValue = calculatedValueA;
    });
}

function applyRotationMechanismB(groupB, cycle) {
    const adjustedCycle = cycle % 200 < 100 ? cycle % 100 + 1 : 200 - (cycle % 100);
    groupB.forEach(validator => {
        const calculatedValueB = 1 / Math.log(validator.index + 1 + adjustedCycle);
        validator.calculatedValue = calculatedValueB;
    });
}

function applyRotationMechanismC(groupC, cycle) {
    const r = 3.75;
    const adjustedCycle = cycle % 200 < 100 ? cycle % 100 + 1 : 200 - (cycle % 100);
    
    groupC.forEach((validator, i) => {
        if (i === 0) {
            validator.position = Math.random() * 91;
        } else {
            const prevPosition = groupC[i - 1].position;
            const calculatedPositionC = (prevPosition * r * (1 - prevPosition / 91)) % 91;
            validator.position = calculatedPositionC;
        }
    });
}

function applyRotationMechanismD(groupD, cycle) {
    const adjustedCycle = cycle % 200 < 100 ? cycle % 100 + 1 : 200 - (cycle % 100);
    groupD.forEach(validator => {
        const calculatedValueD = (1 / Math.log(validator.index + 1 + adjustedCycle) + 1 / Math.log(validator.index + adjustedCycle)) / 2;
        validator.calculatedValue = calculatedValueD;
    });
}

const numValidators = 100;
const validators = generateValidatorData(numValidators);
const validatorGroups = createValidatorGroups(validators);

fs.writeFileSync('validator_addresses.json', JSON.stringify(validatorGroups, null, 2), 'utf8');

const loadedValidatorData = loadValidatorData();

for (let cycle = 0; cycle < 400; cycle++) {
    applyRotationMechanismA(loadedValidatorData.groupA, cycle);
    applyRotationMechanismB(loadedValidatorData.groupB, cycle);
    applyRotationMechanismC(loadedValidatorData.groupC, cycle);
    applyRotationMechanismD(loadedValidatorData.groupD, cycle);
}

loadedValidatorData.groupA = assignWeights(sortCalculatedValues(loadedValidatorData.groupA));
loadedValidatorData.groupB = assignWeights(sortCalculatedValues(loadedValidatorData.groupB));
loadedValidatorData.groupC = assignWeights(sortCalculatedValues(loadedValidatorData.groupC));
loadedValidatorData.groupD = assignWeights(sortCalculatedValues(loadedValidatorData.groupD));

updateJsonFile(loadedValidatorData);

module.exports = {
    generateKeyPair,
    generateValidatorData,
    createValidatorGroups,
    loadValidatorData,
    updateJsonFile,
    applyRotationMechanismA,
    applyRotationMechanismB,
    applyRotationMechanismC,
    applyRotationMechanismD,
    sortCalculatedValues,
     assignWeights,
 
};
