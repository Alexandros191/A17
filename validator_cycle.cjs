// print_order.js

const {
    loadValidatorData,
    assignWeights,
    sortCalculatedValues,
    
} = require('./rotation.cjs'); // Adjust the path accordingly

function printKeysInOrder() {
    const loadedValidatorData = loadValidatorData();

    loadedValidatorData.groupA = assignWeights(sortCalculatedValues(loadedValidatorData.groupA));
    loadedValidatorData.groupB = assignWeights(sortCalculatedValues(loadedValidatorData.groupB));
    loadedValidatorData.groupC = assignWeights(sortCalculatedValues(loadedValidatorData.groupC));
    loadedValidatorData.groupD = assignWeights(sortCalculatedValues(loadedValidatorData.groupD));

    const allValidators = [
        ...loadedValidatorData.groupA,
        ...loadedValidatorData.groupB,
        ...loadedValidatorData.groupC,
        ...loadedValidatorData.groupD,
    ];

    // Print keys in order 1 to 100
    for (let i = 0; i < allValidators.length; i++) {
        console.log(`Weight ${allValidators[i].weight}, Index ${allValidators[i].index}`);
    }

    // Print keys in order 100 to 1
    for (let i = allValidators.length - 1; i >= 0; i--) {
        console.log(`Weight ${allValidators[i].weight}, Index ${allValidators[i].index}`);
    }
}

printKeysInOrder();
