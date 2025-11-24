import React, { useState, useEffect } from 'react';

function HabitatsPage() {
  const [habitats, setHabitats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingHabitat, setEditingHabitat] = useState(null);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitat, setNewHabitat] = useState({
    habitat_name: '',
    location_description: ''
  });

  // For disabling buttons during network operations
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadHabitats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHabitats = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/habitats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch habitats');
        return res.json();
      })
      .then(data => {
        setHabitats(data);
      })
      .catch(err => {
        console.error('Error fetching habitats:', err);
        alert('Error fetching habitats. Check backend.');
      })
      .finally(() => setIsLoading(false));
  };

  // ------------------ EDIT ------------------
  const handleEditClick = (habitat) => {
    setEditingHabitat(habitat);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingHabitat(null);
  };

  const handleEditInputChange = (e) => {
    if (!editingHabitat) return;
    setEditingHabitat({ ...editingHabitat, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!editingHabitat) return;

    // Basic validation
    if (!editingHabitat.habitat_name.trim()) {
      alert('Habitat name is required.');
      return;
    }

    setIsProcessing(true);
    fetch(`http://localhost:5000/api/habitats/${editingHabitat.habitat_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        habitat_name: editingHabitat.habitat_name,
        location_description: editingHabitat.location_description
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update habitat');
        // update local state
        setHabitats(prev => prev.map(h =>
          h.habitat_id === editingHabitat.habitat_id ? editingHabitat : h
        ));
        handleCloseEditModal();
      })
      .catch(err => {
        console.error('Error updating habitat:', err);
        alert('Failed to update habitat. See console for details.');
      })
      .finally(() => setIsProcessing(false));
  };

  // ------------------ ADD ------------------
  const handleOpenAddModal = () => setIsAddModalOpen(true);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewHabitat({ habitat_name: '', location_description: '' });
  };

  const handleNewInputChange = (e) => {
    setNewHabitat({ ...newHabitat, [e.target.name]: e.target.value });
  };

  const handleAddHabitat = (e) => {
    e.preventDefault();

    if (!newHabitat.habitat_name.trim()) {
      alert('Habitat name is required.');
      return;
    }

    setIsProcessing(true);
    fetch('http://localhost:5000/api/habitats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabitat),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add habitat');
        return res.json();
      })
      .then(addedHabitat => {
        // append new habitat
        setHabitats(prev => [...prev, addedHabitat]);
        handleCloseAddModal();
      })
      .catch(err => {
        console.error('Error adding habitat:', err);
        alert('Failed to add habitat. See console for details.');
      })
      .finally(() => setIsProcessing(false));
  };

  // ------------------ DELETE ------------------
  const handleDeleteClick = (habitatId) => {
    if (!window.confirm('Are you sure you want to delete this habitat? All linked sightings will also be deleted.')) {
      return;
    }

    setIsProcessing(true);
    fetch(`http://localhost:5000/api/habitats/${habitatId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete habitat');
        // remove from local state
        setHabitats(prev => prev.filter(h => h.habitat_id !== habitatId));
      })
      .catch(err => {
        console.error('Error deleting habitat:', err);
        alert('Failed to delete habitat. See console for details.');
      })
      .finally(() => setIsProcessing(false));
  };

  return (
    <div className="page-bg">
      <h1>Habitats List</h1>

      {/* Add Button */}
      <div className="page-actions">
        <button
          className="add-button"
          onClick={handleOpenAddModal}
          disabled={isProcessing}
        >
          + Add New Habitat
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Habitat Name</th>
            <th>Location Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr><td colSpan="3">Loading habitats...</td></tr>
          ) : habitats.length > 0 ? (
            habitats.map(h => (
              <tr key={h.habitat_id}>
                <td>{h.habitat_name}</td>
                <td>{h.location_description}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEditClick(h)} disabled={isProcessing}>Edit</button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(h.habitat_id)}
                      disabled={isProcessing}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3">No habitats found.</td></tr>
          )}
        </tbody>
      </table>

      {/* ------------------ EDIT MODAL ------------------ */}
      {isEditModalOpen && editingHabitat && (
        <div className="modal-overlay" onMouseDown={handleCloseEditModal}>
          <div className="modal-content" onMouseDown={e => e.stopPropagation()}>
            <h2>Edit Habitat</h2>

            <form onSubmit={handleSaveChanges}>
              <label>Habitat Name:</label>
              <input
                type="text"
                name="habitat_name"
                value={editingHabitat.habitat_name}
                onChange={handleEditInputChange}
                disabled={isProcessing}
              />

              <label>Location Description:</label>
              <input
                type="text"
                name="location_description"
                value={editingHabitat.location_description || ''}
                onChange={handleEditInputChange}
                disabled={isProcessing}
              />

              <div className="button-group">
                <button type="button" onClick={handleCloseEditModal} disabled={isProcessing}>Cancel</button>
                <button type="submit" disabled={isProcessing}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------ ADD MODAL ------------------ */}
      {isAddModalOpen && (
        <div className="modal-overlay" onMouseDown={handleCloseAddModal}>
          <div className="modal-content" onMouseDown={e => e.stopPropagation()}>
            <h2>Add New Habitat</h2>

            <form onSubmit={handleAddHabitat}>
              <label>Habitat Name:</label>
              <input
                type="text"
                name="habitat_name"
                value={newHabitat.habitat_name}
                onChange={handleNewInputChange}
                placeholder="e.g., Tropical Rainforest"
                disabled={isProcessing}
              />

              <label>Location Description:</label>
              <input
                type="text"
                name="location_description"
                value={newHabitat.location_description}
                onChange={handleNewInputChange}
                placeholder="e.g., Dense forest with high rainfall"
                disabled={isProcessing}
              />

              <div className="button-group">
                <button type="button" onClick={handleCloseAddModal} disabled={isProcessing}>Cancel</button>
                <button type="submit" disabled={isProcessing}>Add Habitat</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default HabitatsPage;
