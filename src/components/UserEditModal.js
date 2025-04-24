import axios from 'axios'; // Import axios
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Import Swal
import './UserEditModal.css';

// Updated props to match Dashboard usage
const UserEditModal = ({ isOpen, onClose, userData, token, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    role: 'staff', // Default role - lowercase to match backend
    password: '', // Add password field
    // Status is often handled by backend or separate actions, removing for now unless needed
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Determine mode based on userData
  const isEditMode = Boolean(userData && userData._id);

  // Effect to update form data when the userData prop changes (for editing)
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        username: userData.username || '',
        role: userData.role || 'staff',
        password: '', // Clear password field on edit mode open
      });
      setErrors({}); // Clear errors when opening for edit
    } else {
      // Reset form for add mode
      setFormData({ username: '', role: 'staff', password: '' });
      setErrors({});
    }
  }, [userData, isOpen]); // Rerun effect if userData or isOpen changes

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    // Clear specific error on change
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.role) newErrors.role = 'Role is required';
    // Password is required only in add mode
    if (!isEditMode && !formData.password) newErrors.password = 'Password is required for new users';
    // Optional: Add password complexity validation here if needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    const payload = {
      username: formData.username,
      role: formData.role,
    };
    if (formData.password) { // Only include password if provided
      payload.password = formData.password;
    }

    try {
      const baseURL = 'http://localhost:5000';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      if (isEditMode) {
        await axios.put(`${baseURL}/api/admin/users/${userData._id}`, payload, config);
      } else {
        await axios.post(`${baseURL}/api/admin/users`, payload, config);
      }

      // Show success message
      Swal.fire({
        icon: 'success',
        title: `User ${isEditMode ? 'Updated' : 'Added'} Successfully!`,
        showConfirmButton: false,
        timer: 1500
      });

      onUserUpdated(); // Refresh the user list
      onClose(); // Close the modal

    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} user:`, error.response || error);
      
      // Handle field-specific errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      
      // Show error message
      const errorMsg = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} user.`;
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Using previous CSS classes, assuming they provide modal styling
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        {/* Dynamic Title */}
        <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={errors.username ? 'is-invalid' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {/* Password field - required for add, optional for edit */}
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className={errors.role ? 'is-invalid' : ''}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
              required={!isEditMode} // Required only when adding
              className={errors.password ? 'is-invalid' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>



          {/* Removed Status field, assuming backend handles it or separate action */}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Add User')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
