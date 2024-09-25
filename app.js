const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Your existing auth routes
const mysql = require('mysql');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'farming' // Your existing database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Existing authentication routes
app.use('/auth', authRoutes);

// Route to add farmer and product
app.post('/addFarmer', (req, res) => {
    const { farmerName, contactInfo, productName, price, quantity } = req.body;

    // Insert farmer details into the farmers table
    const farmerQuery = 'INSERT INTO farmers (name, contact_info) VALUES (?, ?)';
    db.query(farmerQuery, [farmerName, contactInfo], (err, result) => {
        if (err) {
            console.error('Error inserting farmer:', err);
            return res.status(500).send('Failed to add farmer');
        }

        const farmerId = result.insertId;

        // Insert product details into the products table
        const productQuery = 'INSERT INTO products (product_name, price, quantity, farmer_id) VALUES (?, ?, ?, ?)';
        db.query(productQuery, [productName, price, quantity, farmerId], (err, result) => {
            if (err) {
                console.error('Error inserting product:', err);
                return res.status(500).send('Failed to add product');
            }
            res.send('Farmer and product added successfully');
        });
    });
});

// Route to fetch all products
app.get('/getProducts', (req, res) => {
    const query = `
        SELECT p.product_name, p.price, p.quantity, f.name AS farmer_name, f.contact_info
        FROM products p
        JOIN farmers f ON p.farmer_id = f.farmer_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Failed to fetch products');
        }
        res.json(results);
    });
});

// Route to add a blog entry with detailed logging
app.post('/addBlog', (req, res) => {
    const { farmerName, content } = req.body;

    // Check if farmerName and content are present
    if (!farmerName || !content) {
        console.log('Missing farmerName or content');
        return res.status(400).send('Farmer name and content are required');
    }

    console.log('Received blog entry:', { farmerName, content });

    // Insert the blog entry into the database
    const blogQuery = 'INSERT INTO blogs (farmer_name, content) VALUES (?, ?)';
    db.query(blogQuery, [farmerName, content], (err, result) => {
        if (err) {
            console.error('Error inserting blog into the database:', err);
            return res.status(500).send('Failed to add blog');
        }
        console.log('Blog added successfully with ID:', result.insertId);
        res.send('Blog added successfully');
    });
});

// Route to fetch all blog entries
app.get('/getBlogs', (req, res) => {
    const query = 'SELECT * FROM blogs ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching blogs:', err);
            return res.status(500).send('Failed to fetch blogs');
        }
        res.json(results);
    });
});

// Server setup
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
