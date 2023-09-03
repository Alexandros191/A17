const { exec } = require('child_process');

function executeCommand() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU2Nzg1MzAxOTRCQ0ExMjhjZjM1RDEzOUZEMGIwQ0E5ODRlNWQ1RDAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTMwNTc1ODI3NzQsIm5hbWUiOiJBMTcifQ.BYuB8QiwiALZRKMriGqNEtT-M9omNBdrnmzeye_oU00'; // Replace with your actual token
  const command = `node put-files.js --token=${token} users.json`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    const lines = stdout.trim().split('\n'); // Split stdout into lines
    const cids = [];

    for (const line of lines) {
      const match = line.match(/Content added with CID: (.+)/);
      if (match) {
        cids.push(match[1]);
      }
      console.log(line);
    }

    console.log('Extracted CIDs:', cids);

    const baseUrl = 'https://dweb.link/ipfs/';
    const cidUrls = cids.map(cid => baseUrl + cid);
    console.log('CID URLs:', cidUrls);
  });
}

// Initial execution
executeCommand();

// Reexecute every 20 seconds
const interval = 20000; // 20 seconds in milliseconds
setInterval(executeCommand, interval);
