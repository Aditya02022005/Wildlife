import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function HomePage() {
  return (
    <div className="fullscreen-hero with-bg">

      <div className="content-overlay">
        <h2>Wildlife Conservation Dashboard</h2>
        <p className="subtitle">
          Track, monitor, and explore endangered species, their habitats, and wildlife sightings.
        </p>

        <div className="card-grid">
          <Link to="/species" className="card">
            <h3>View Species</h3>
            <p>Browse all wildlife species stored in the database.</p>
          </Link>

          <Link to="/habitats" className="card">
            <h3>Explore Habitats</h3>
            <p>Discover habitat locations and ecosystems.</p>
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