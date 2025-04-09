import React, { useState } from "react";
import "./OfficialForm.css"; // We'll create this CSS file later if needed

function OfficialForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    position: "",
    term: "",
    status: "Active", // Default status
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to submit the form data
    console.log("Form Data Submitted:", formData);
    // Potentially navigate back or show a success message
  };

  // TODO: Add navigation back to the dashboard (e.g., using useNavigate)

  return (
    <div className="official-form-container">
      <h2>Add New Barangay Official</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="term">Term (e.g., 2023-2025):</label>
          <input
            type="text"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleChange}
            required
          />
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save Official
          </button>
          {/* TODO: Add a Cancel button to navigate back */}
        </div>
      </form>
    </div>
  );
}

export default OfficialForm;
