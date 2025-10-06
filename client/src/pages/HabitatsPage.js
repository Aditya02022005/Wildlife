import React, { useState, useEffect } from 'react';

function HabitatsPage() {
  const [habitats, setHabitats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/habitats')
      .then(response => response.json())
      .then(data => setHabitats(data))
      .catch(error => console.error("Error fetching habitats:", error));
  }, []);

  return (
    <div>
      <h1>Habitats List</h1>
      <table>
        <thead>
          <tr>
            <th>Habitat Name</th>
            <th>Location Description</th>
          </tr>
        </thead>
        <tbody>
          {habitats.map(h => (
            <tr key={h.habitat_id}>
              <td>{h.habitat_name}</td>
              <td>{h.location_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitatsPage;