import React, { useState, useEffect } from 'react';

function SightingsPage() {
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sightings')
      .then(response => response.json())
      .then(data => setSightings(data))
      .catch(error => console.error("Error fetching sightings:", error));
  }, []);

  // Function to format the date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <h1>Sightings Log</h1>
      <table>
        <thead>
          <tr>
            <th>Species</th>
            <th>Habitat</th>
            <th>Date of Sighting</th>
            <th>Number Seen</th>
          </tr>
        </thead>
        <tbody>
          {sightings.map(s => (
            <tr key={s.sighting_id}>
              <td>{s.common_name}</td>
              <td>{s.habitat_name}</td>
              <td>{formatDate(s.sighting_date)}</td>
              <td>{s.num_individuals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SightingsPage;