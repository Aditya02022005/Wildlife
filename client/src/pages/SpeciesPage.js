import React, { useState, useEffect } from 'react';

function SpeciesPage() {
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/species')
      .then(response => response.json())
      .then(data => setSpecies(data))
      .catch(error => console.error("Error fetching species:", error));
  }, []);

  return (
    <div>
      <h1>Species List</h1>
      <p>This data is loaded from your database.</p>
      <table>
        <thead>
          <tr>
            <th>Common Name</th>
            <th>Scientific Name</th>
            <th>Conservation Status</th>
          </tr>
        </thead>
        <tbody>
          {species.map(s => (
            <tr key={s.species_id}>
              <td>{s.common_name}</td>
              <td>{s.scientific_name}</td>
              <td>{s.conservation_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpeciesPage;