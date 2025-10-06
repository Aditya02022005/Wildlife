// 1. Import Dependencies
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. Create Express App
const app = express();
app.use(cors()); // Use CORS to allow cross-origin requests

// 3. Create Database Connection
const db = mysql.createConnection({
    host: 'localhost',      // Or your database host
    user: 'root',           // Your database username
    password: 'root', // Your database password
    database: 'wildlife_db' // The name of your database
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the wildlife_db database.');
});

// 4. Create Your First API Endpoint
// This endpoint will get all species from your database
// ... (keep all the existing code above this)

// 4. Create Your API Endpoints
// This endpoint gets all species (already exists)
app.get('/api/species', (req, res) => {
    const sql = "SELECT * FROM Species";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ADD THIS: Endpoint to get all habitats
app.get('/api/habitats', (req, res) => {
    const sql = "SELECT * FROM Habitats";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ADD THIS: Endpoint to get all sightings
app.get('/api/sightings', (req, res) => {
    // A JOIN query to get readable names instead of just IDs
    const sql = `
        SELECT s.sighting_id, sp.common_name, h.habitat_name, s.sighting_date, s.num_individuals
        FROM Sightings s
        JOIN Species sp ON s.species_id = sp.species_id
        JOIN Habitats h ON s.habitat_id = h.habitat_id
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// 5. Start the Server (already exists)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});