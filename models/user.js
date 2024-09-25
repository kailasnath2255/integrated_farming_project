const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'farming'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Create users table if it doesn't exist
const createUserTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') NOT NULL
)`;

db.query(createUserTable, (err, result) => {
    if (err) throw err;
    console.log('Users table created');
});

module.exports = db;
