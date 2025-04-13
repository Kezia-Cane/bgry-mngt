import React, { useEffect, useState } from 'react';
import './UserEditModal.css';

const UserEditModal = ({ show, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    status: '',
  });

  // Effect to update form data when the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        role: user.role || '',
        status: user.status || '',
      });
    } else {
      // Reset form if no user is provided (though typically this modal won't show without a user)
      setFormData({ username: '', role: '', status: '' });
    }
  }, [user]); // Rerun effect if user object changes

  if (!show) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to save user data using formData
    console.log("Saving updated user data:", formData); // Log the updated data
    // Call onSave prop if provided, passing the updated formData
    if (onSave) {
      // Pass the updated data from the form state
      onSave({ ...user, ...formData }); // Merge original user data with changes
    }
    onClose(); // Close modal after submission
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}> {/* Close on backdrop click */}
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            {/* Username might be read-only depending on requirements */}
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              readOnly // Often usernames are not editable
              className="form-control-plaintext" // Style as non-editable if readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

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
