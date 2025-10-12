const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // --- ADD THIS --- Middleware to parse JSON request bodies

const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',           
    password: 'root', 
    database: 'wildlife_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the wildlife_db database.');
});

// --- GET Routes (to read data) ---

app.get('/api/species', (req, res) => {
    const sql = "SELECT * FROM Species";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/habitats', (req, res) => {
    const sql = "SELECT * FROM Habitats";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/sightings', (req, res) => {
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

// --- PUT Route (to update data) ---
// --- ADD THIS ENTIRE BLOCK ---
app.put('/api/species/:id', (req, res) => {
    // Get the ID from the URL and the updated data from the request body
    const { id } = req.params;
    const { common_name, scientific_name, conservation_status } = req.body;

    // The SQL query with placeholders (?) to prevent SQL injection
    const sql = `
        UPDATE Species 
        SET common_name = ?, scientific_name = ?, conservation_status = ? 
        WHERE species_id = ?
    `;

    // Execute the query with the updated data
    db.query(sql, [common_name, scientific_name, conservation_status, id], (err, result) => {
        if (err) {
            console.error("Error updating species:", err);
            return res.status(500).send("Error updating data in the database.");
        }
        res.status(200).send("Species updated successfully.");
    });
});

// ADD THIS: Endpoint to update a habitat record
app.put('/api/habitats/:id', (req, res) => {
    const { id } = req.params;
    const { habitat_name, location_description } = req.body;

    const sql = `
        UPDATE Habitats 
        SET habitat_name = ?, location_description = ? 
        WHERE habitat_id = ?
    `;

    db.query(sql, [habitat_name, location_description, id], (err, result) => {
        if (err) {
            console.error("Error updating habitat:", err);
            return res.status(500).send("Error updating data.");
        }
        res.status(200).send("Habitat updated successfully.");
    });
});

// --- ADD THIS ENTIRE BLOCK ---
// Endpoint to add (create) a new species
app.post('/api/species', (req, res) => {
    const { common_name, scientific_name, conservation_status } = req.body;

    const sql = `INSERT INTO Species (common_name, scientific_name, conservation_status) VALUES (?, ?, ?)`;

    db.query(sql, [common_name, scientific_name, conservation_status], (err, result) => {
        if (err) {
            console.error("Error adding species:", err);
            return res.status(500).send("Error adding data.");
        }
        // Send back the newly created species object for easy front-end update
        res.status(201).json({
            species_id: result.insertId,
            common_name,
            scientific_name,
            conservation_status
        });
    });
});

// --- ADD THIS ENTIRE BLOCK ---
// Endpoint to delete a species
app.delete('/api/species/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Species WHERE species_id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting species:", err);
            return res.status(500).send("Error deleting data.");
        }
        // Check if any row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).send("Species not found.");
        }
        res.status(200).send("Species deleted successfully.");
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});