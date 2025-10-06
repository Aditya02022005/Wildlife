import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SpeciesPage from './pages/SpeciesPage';
import HabitatsPage from './pages/HabitatsPage';
import './App.css'; // We will add some basic styling
import SightingsPage from './pages/SightingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1><Link to="/">Wildlife Conservation Tracker</Link></h1>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/species" element={<SpeciesPage />} />
            <Route path="/habitats" element={<HabitatsPage />} />
            <Route path="/sightings" element={<SightingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;