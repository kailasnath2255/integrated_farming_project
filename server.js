// Import the required modules
const express = require('express');
const path = require('path');

// Create an instance of Express
const app = express();

// Define the port to run the server
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL ("/") to serve firstindex.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'firstindex.html'));
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});
