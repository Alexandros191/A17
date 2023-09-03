const concurrently = require('concurrently');

const scripts = [
    { command: 'node nodes.cjs', name: 'nodes', prefixColor: 'bgBlue.bold' },
    { command: 'node server8000.cjs', name: 'blockchain', prefixColor: 'bgGreen.bold' },
    { command: 'node FetchAndWrite.cjs', name: 'blockupload', prefixColor: 'bgBlackBright' },
{ command: 'node dataupload.cjs', name: 'IPFS', prefixColor: 'bgWhiteBright' }
];

concurrently(scripts);
