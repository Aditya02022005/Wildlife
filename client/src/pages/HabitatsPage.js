import React, { useState, useEffect } from 'react';

function HabitatsPage() {
  const [habitats, setHabitats] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabitat, setEditingHabitat] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/habitats')
      .then(response => response.json())
      .then(data => {
        setHabitats(data);
        setIsLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error("Error fetching habitats:", error);
        setIsLoading(false); // Also stop loading on error
      });
  }, []);

  // ... (All your handleEditClick, handleCloseModal, etc. functions remain the same) ...

  const handleEditClick = (habitat) => {
    setEditingHabitat(habitat);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabitat(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingHabitat({ ...editingHabitat, [name]: value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    
    fetch(`http://localhost:5000/api/habitats/${editingHabitat.habitat_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingHabitat),
    })
    .then(response => {
      if (response.ok) {
        setHabitats(habitats.map(h => 
          h.habitat_id === editingHabitat.habitat_id ? editingHabitat : h
        ));
        handleCloseModal();
      } else {
        console.error("Failed to update habitat");
      }
    })
    .catch(error => console.error("Error:", error));
  };


  return (
    <div>
      <h1>Habitats List</h1>
      <table>
        <thead>
          <tr>
            <th>Habitat Name</th>
            <th>Location Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* ✅ CORRECT WAY TO HANDLE LOADING AND EMPTY STATES */}
          {isLoading ? (
            <tr>
              <td colSpan="3">Loading habitats...</td>
            </tr>
          ) : habitats.length > 0 ? (
            habitats.map(h => (
              <tr key={h.habitat_id}>
                <td>{h.habitat_name}</td>
                <td>{h.location_description}</td>
                <td>
                  <button onClick={() => handleEditClick(h)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No habitats found in the database.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Habitat</h2>
            <form onSubmit={handleSaveChanges}>
              <label>Habitat Name:</label>
              <input
                type="text"
                name="habitat_name"
                value={editingHabitat.habitat_name}
                onChange={handleInputChange}
              />
              <label>Location Description:</label>
              <input
                type="text"
                name="location_description"
                value={editingHabitat.location_description}
                onChange={handleInputChange}
              />
              <div className="button-group">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitatsPage;