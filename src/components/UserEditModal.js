import React from 'react';
import './UserEditModal.css'; // We'll create this CSS file next

const UserEditModal = ({ show, onClose, user, onSave }) => {
  if (!show) {
    return null;
  }

  // Placeholder form - we will populate this later
  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to save user data will go here
    console.log("Saving user:", user); // Placeholder
    // Call onSave prop if provided
    if (onSave) {
      // Assuming onSave expects the updated user object
      // You'll need to construct this object from form fields
      onSave(user); // Placeholder with potentially stale data
    }
    onClose(); // Close modal after submission
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields for user editing will go here */}
          <p>User editing form fields will be added here.</p>
          <p>Editing User: {user ? user.name : 'N/A'}</p> {/* Example usage */}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
