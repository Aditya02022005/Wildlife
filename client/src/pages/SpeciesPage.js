import React, { useState, useEffect } from 'react';

function SpeciesPage() {
  const [species, setSpecies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for the EDIT modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);

  // States for the ADD modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpecies, setNewSpecies] = useState({
    common_name: '', scientific_name: '', conservation_status: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/species')
      .then(response => response.json())
      .then(data => {
        setSpecies(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching species:", error);
        setIsLoading(false);
      });
  }, []);

  // --- Edit Modal Functions ---
  const handleEditClick = (s) => {
    setEditingSpecies(s);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSpecies(null);
  };
  const handleEditInputChange = (e) => {
    setEditingSpecies({ ...editingSpecies, [e.target.name]: e.target.value });
  };
  const handleSaveChanges = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/species/${editingSpecies.species_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingSpecies),
    }).then(response => {
      if (response.ok) {
        setSpecies(species.map(s => (s.species_id === editingSpecies.species_id ? editingSpecies : s)));
        handleCloseEditModal();
      }
    });
  };

  // --- Add Modal Functions ---
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewSpecies({ common_name: '', scientific_name: '', conservation_status: '' });
  };
  const handleNewInputChange = (e) => {
    setNewSpecies({ ...newSpecies, [e.target.name]: e.target.value });
  };
  const handleAddSpecies = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/species', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpecies),
    })
    .then(response => response.json())
    .then(addedSpecies => {
      setSpecies([...species, addedSpecies]);
      handleCloseAddModal();
    });
  };

  // --- Delete Function ---
  const handleDeleteClick = (speciesId) => {
    if (window.confirm("Are you sure you want to delete this species? This action cannot be undone.")) {
      fetch(`http://localhost:5000/api/species/${speciesId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setSpecies(species.filter(s => s.species_id !== speciesId));
        } else {
          console.error("Failed to delete species.");
        }
      })
      .catch(error => console.error("Error:", error));
    }
  };

  return (
    <div>
      <h1>Species List</h1>
      <div className="page-actions">
        <button className="add-button" onClick={handleOpenAddModal}>+ Add New Species</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Common Name</th>
            <th>Scientific Name</th>
            <th>Conservation Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan="4">Loading species...</td></tr>
          ) : species.length > 0 ? (
            species.map(s => (
              <tr key={s.species_id}>
                <td>{s.common_name}</td>
                <td>{s.scientific_name}</td>
                <td>{s.conservation_status}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(s)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(s.species_id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No species found.</td></tr>
          )}
        </tbody>
      </table>

      {/* --- Edit Modal --- */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Species</h2>
            <form onSubmit={handleSaveChanges}>
              <label>Common Name:</label>
              <input type="text" name="common_name" value={editingSpecies.common_name} onChange={handleEditInputChange} />
              <label>Scientific Name:</label>
              <input type="text" name="scientific_name" value={editingSpecies.scientific_name} onChange={handleEditInputChange} />
              <label>Conservation Status:</label>
              <input type="text" name="conservation_status" value={editingSpecies.conservation_status} onChange={handleEditInputChange} />
              <div className="button-group">
                <button type="button" onClick={handleCloseEditModal}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add Modal --- */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Species</h2>
            <form onSubmit={handleAddSpecies}>
              <label>Common Name:</label>
              <input type="text" name="common_name" value={newSpecies.common_name} onChange={handleNewInputChange} placeholder="e.g., Bengal Tiger" />
              <label>Scientific Name:</label>
              <input type="text" name="scientific_name" value={newSpecies.scientific_name} onChange={handleNewInputChange} placeholder="e.g., Panthera tigris tigris" />
              <label>Conservation Status:</label>
              <input type="text" name="conservation_status" value={newSpecies.conservation_status} onChange={handleNewInputChange} placeholder="e.g., Endangered" />
              <div className="button-group">
                <button type="button" onClick={handleCloseAddModal}>Cancel</button>
                <button type="submit">Add Species</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeciesPage;