const { exec } = require('child_process');
const express = require('express');

const app = express();
const port = 8018;

app.use(express.json());

app.post('/execute-after-registration', (req, res) => {
    // Trigger the execution of your newsim.cjs file
    exec('node path/to/newsim.cjs', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({ message: 'Error executing file' });
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.status(200).json({ message: 'File executed successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
