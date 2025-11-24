const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

app.put('/api/species/:id', (req, res) => {
    const { id } = req.params;
    const { common_name, scientific_name, conservation_status } = req.body;

    const sql = `
        UPDATE Species 
        SET common_name = ?, scientific_name = ?, conservation_status = ? 
        WHERE species_id = ?
    `;

    db.query(sql, [common_name, scientific_name, conservation_status, id], (err, result) => {
        if (err) {
            console.error("Error updating species:", err);
            return res.status(500).send("Error updating data in the database.");
        }
        res.status(200).send("Species updated successfully.");
    });
});

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

app.post('/api/habitats', (req, res) => {
    const { habitat_name, location_description } = req.body;

    const sql = `INSERT INTO Habitats (habitat_name, location_description) VALUES (?, ?)`;

    db.query(sql, [habitat_name, location_description], (err, result) => {
        if (err) {
            console.error("Error adding habitat:", err);
            return res.status(500).send("Error adding habitat.");
        }

        res.status(201).json({
            habitat_id: result.insertId,
            habitat_name,
            location_description
        });
    });
});

app.delete('/api/habitats/:id', (req, res) => {
    const { id } = req.params;

    db.beginTransaction(err => {
        if (err) return res.status(500).send("Error starting transaction.");

        // First delete related sightings
        const deleteSightingsSql = `DELETE FROM Sightings WHERE habitat_id = ?`;

        db.query(deleteSightingsSql, [id], (err) => {
            if (err) {
                db.rollback(() => {
                    console.error("Error deleting related sightings:", err);
                    return res.status(500).send("Error deleting related sightings.");
                });
                return;
            }

            // Now delete the habitat
            const deleteHabitatSql = `DELETE FROM Habitats WHERE habitat_id = ?`;

            db.query(deleteHabitatSql, [id], (err, result) => {
                if (err) {
                    db.rollback(() => {
                        console.error("Error deleting habitat:", err);
                        return res.status(500).send("Error deleting habitat.");
                    });
                    return;
                }

                db.commit(err => {
                    if (err) {
                        db.rollback(() => res.status(500).send("Commit failed."));
                        return;
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).send("Habitat not found.");
                    }

                    res.status(200).send("Habitat and related sightings deleted successfully.");
                });
            });
        });
    });
});

app.post('/api/species', (req, res) => {
    const { common_name, scientific_name, conservation_status } = req.body;

    const sql = `INSERT INTO Species (common_name, scientific_name, conservation_status) VALUES (?, ?, ?)`;

    db.query(sql, [common_name, scientific_name, conservation_status], (err, result) => {
        if (err) {
            console.error("Error adding species:", err);
            return res.status(500).send("Error adding data.");
        }
        res.status(201).json({
            species_id: result.insertId,
            common_name,
            scientific_name,
            conservation_status
        });
    });
});

app.delete('/api/species/:id', (req, res) => {
    const { id } = req.params;

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).send("Error starting transaction.");
        }

        const deleteSightingsSql = `DELETE FROM Sightings WHERE species_id = ?`;
        db.query(deleteSightingsSql, [id], (err, result) => {
            if (err) {
                db.rollback(() => {
                    console.error("Error deleting related sightings:", err);
                    return res.status(500).send("Error deleting related sightings.");
                });
                return;
            }

            const deleteSpeciesSql = `DELETE FROM Species WHERE species_id = ?`;
            db.query(deleteSpeciesSql, [id], (err, result) => {
                if (err) {
                    db.rollback(() => {
                        console.error("Error deleting species:", err);
                        return res.status(500).send("Error deleting species.");
                    });
                    return;
                }

                db.commit(err => {
                    if (err) {
                        db.rollback(() => {
                            return res.status(500).send("Transaction commit failed.");
                        });
                        return;
                    }
                    if (result.affectedRows === 0) {
                        return res.status(404).send("Species not found.");
                    }
                    res.status(200).send("Species and all related sightings deleted successfully.");
                });
            });
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
