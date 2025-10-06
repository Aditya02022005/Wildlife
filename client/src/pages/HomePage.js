import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  return (
    <div className="home-container">
     

      <div className="card-grid">
        <Link to="/species" className="card">
          <h3>View Species</h3>
          <p>Browse through all wildlife species stored in the database.</p>
        </Link>

        <Link to="/habitats" className="card">
          <h3>Explore Habitats</h3>
          <p>Discover different habitat locations and their ecosystems.</p>
        </Link>

        <Link to="/sightings" className="card">
          <h3>Track Sightings</h3>
          <p>View detailed logs of all recorded wildlife sightings.</p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
