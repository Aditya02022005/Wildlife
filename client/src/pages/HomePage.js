import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  return (
    // This div will have the background image
    <div className="home-container with-bg">
      <div className="content-overlay">
        <h2>Wildlife Conservation Dashboard</h2>
        <p className="subtitle">Track, manage, and explore data on endangered species and their habitats.</p>
        <div className="card-grid">
          <Link to="/species" className="card">
            <h3>View Species</h3>
            <p>Browse all wildlife species stored in the database.</p>
          </Link>

          <Link to="/habitats" className="card">
            <h3>Explore Habitats</h3>
            <p>Discover different habitat locations and ecosystems.</p>
          </Link>

          <Link to="/sightings" className="card">
            <h3>Track Sightings</h3>
            <p>View detailed logs of all recorded wildlife sightings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;