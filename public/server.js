const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change if you have a different username
    password: '',  // Your MySQL password
    database: 'farming'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.post('/submit', (req, res) => {
    const { name, cropType, farmSize, location } = req.body;
    const query = "INSERT INTO farmers (name, cropType, farmSize, location) VALUES (?, ?, ?, ?)";
    db.query(query, [name, cropType, farmSize, location], (err, result) => {
        if (err) {
            return res.status(500).send('Error saving data');
        }
        res.send('Farmer data saved successfully');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
