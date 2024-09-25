const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/user');
const router = express.Router();

// Signup Route
router.post('/signup', (req, res) => {
    const { username, password, role } = req.body;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert user into MySQL
    const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(sql, [username, hashedPassword, role], (err, result) => {
        if (err) throw err;

        // Redirect to the index page with a success query parameter
        res.redirect('/?signup=success');
    });
});

// routes/auth.js

// Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0];

        // Compare password
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
            // Respond with success status and token
            res.json({ message: 'Login successful', token });
        } else {
            res.status(400).send('Incorrect password');
        }
    });
});

module.exports = router;
