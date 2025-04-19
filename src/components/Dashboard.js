import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'; // <-- Import Redux hooks
import { useNavigate } from 'react-router-dom'; // <-- Import navigate hook
import { logout, logoutUserBackend } from '../store/authSlice'; // <-- Import logout actions
import "./Dashboard.css";
// Import necessary icons from react-icons
import axios from 'axios'; // <-- Import axios
import {
  FaAddressBook,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaInfoCircle,
  FaPrint,
  FaSearch,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTrash,
  FaUserCog,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import BlotterViewModal from "./BlotterViewModal.js"; // Import Blotter modal
import CertificateViewModal from "./CertificateViewModal.js"; // Import Certificate View modal
import OfficialViewModal from "./OfficialViewModal.js";
import ResidentViewModal from "./ResidentViewModal.js";
import UserEditModal from "./UserEditModal.js"; // Re-import UserEditModal

// Remove onLogout prop
function Dashboard() {
  const dispatch = useDispatch(); // <-- Get dispatch function
  const navigate = useNavigate(); // <-- Get navigate function
  const { user, token } = useSelector((state) => state.auth); // <-- Get token

  // Placeholder for active module state
  const [activeModule, setActiveModule] = useState("Dashboard"); // Default to Dashboard
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false); // Renamed state for official modal
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false); // State for resident modal visibility
  const [isBlotterModalOpen, setIsBlotterModalOpen] = useState(false); // State for blotter modal visibility
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for ADD User modal
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false); // State for EDIT User modal
  const [userToEdit, setUserToEdit] = useState(null); // State to hold the user being edited

  // Resident View Modal state - This seems to already exist from a previous attempt, ensuring it's correct.
  const [selectedResidentForView, setSelectedResidentForView] = useState(null);
  const [isResidentViewModalOpen, setIsResidentViewModalOpen] = useState(false);

  // State for Official VIEW modal
  const [selectedOfficialForView, setSelectedOfficialForView] = useState(null);
  const [isOfficialViewModalOpen, setIsOfficialViewModalOpen] = useState(false);

  // State for Blotter VIEW modal
  const [selectedBlotterForView, setSelectedBlotterForView] = useState(null);
  const [isBlotterViewModalOpen, setIsBlotterViewModalOpen] = useState(false);

  // State for Official EDIT modal
  const [officialToEdit, setOfficialToEdit] = useState(null); // Data of the official being edited

      // State for Resident EDIT modal
      const [residentToEdit, setResidentToEdit] = useState(null); // Data of the resident being edited

      // State for Blotter EDIT modal
      const [blotterToEdit, setBlotterToEdit] = useState(null); // Data of the blotter record being edited

      // State for Certificate VIEW modal
      const [selectedCertificateForView, setSelectedCertificateForView] = useState(null);
      const [isCertificateViewModalOpen, setIsCertificateViewModalOpen] = useState(false);

  // --- State for Add/Edit Official Form ---
  const initialOfficialFormState = {
    fullName: '',
    gender: '',
    age: '',
    position: '',
    term: '',
    status: 'Active', // Default status
  };
  const [officialFormData, setOfficialFormData] = useState(initialOfficialFormState);
  const [officialFormErrors, setOfficialFormErrors] = useState({});
  const [officialFormLoading, setOfficialFormLoading] = useState(false); // Loading state for submit
  const [officialFormMessage, setOfficialFormMessage] = useState(''); // For success/error messages

  // --- Effect to pre-fill form when editing ---
   useEffect(() => {
    if (officialToEdit) {
      setOfficialFormData({
        fullName: officialToEdit.fullName || '',
        gender: officialToEdit.gender || '',
        age: officialToEdit.age || '',
        position: officialToEdit.position || '',
        term: officialToEdit.term || '',
        status: officialToEdit.status || 'Active',
      });
      setOfficialFormErrors({}); // Clear errors when opening for edit
      setOfficialFormMessage(''); // Clear message
    } else {
      setOfficialFormData(initialOfficialFormState); // Reset form for add
      setOfficialFormErrors({});
      setOfficialFormMessage('');
    }
  }, [officialToEdit, isOfficialModalOpen]); // Depend on officialToEdit and modal state

  // --- Input change handler for official form ---
  const handleOfficialFormChange = (e) => {
    const { name, value } = e.target;
    setOfficialFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Optional: Clear specific error on change
    if (officialFormErrors[name]) {
      setOfficialFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
     setOfficialFormMessage(''); // Clear general message on input change
  };

  // --- Validation function for official form ---
  const validateOfficialForm = () => {
    const errors = {};
    if (!officialFormData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!officialFormData.gender) errors.gender = 'Gender is required';
    if (!officialFormData.age) errors.age = 'Age is required';
    else if (isNaN(officialFormData.age) || Number(officialFormData.age) <= 0) errors.age = 'Age must be a positive number';
    else if (Number(officialFormData.age) < 18) errors.age = 'Official must be at least 18 years old'; // Example validation
    if (!officialFormData.position.trim()) errors.position = 'Position is required';
    if (!officialFormData.term.trim()) errors.term = 'Term is required'; // Basic check, could add format validation
    if (!officialFormData.status) errors.status = 'Status is required';

    setOfficialFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // --- Define Logout Handler ---
  const handleLogout = () => {
    // Optional: Call backend logout first
    dispatch(logoutUserBackend());
    // Immediately clear client-side state and storage
    dispatch(logout());
    navigate('/login'); // Redirect to login page
  };
  // --- End Define Logout Handler ---

  // --- Handlers for VIEW Modal ---
  const handleViewOfficial = (official) => {
    setSelectedOfficialForView(official);
    setIsOfficialViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsOfficialViewModalOpen(false);
    setSelectedOfficialForView(null);
  };
  // --- End Handlers for Official VIEW Modal ---

  // --- Handlers for Resident VIEW Modal ---
  const handleViewResident = (resident) => {
    setSelectedResidentForView(resident);
    setIsResidentViewModalOpen(true);
  };

  const handleCloseResidentViewModal = () => {
    setIsResidentViewModalOpen(false);
    setSelectedResidentForView(null);
  };
  // --- End Handlers for Resident VIEW Modal ---

  // --- Handlers for Blotter VIEW Modal ---
  const handleViewBlotter = (blotter) => {
    setSelectedBlotterForView(blotter);
    setIsBlotterViewModalOpen(true);
  };

  const handleCloseBlotterViewModal = () => {
    setIsBlotterViewModalOpen(false);
    setSelectedBlotterForView(null);
  };
  // --- End Handlers for Blotter VIEW Modal ---

  // --- Handlers for Official ADD/EDIT Modal ---
  const handleOpenOfficialModal = (official = null) => {
    setOfficialToEdit(official); // Set to null for Add, or the official object for Edit
    setIsOfficialModalOpen(true);
  };

  const handleCloseOfficialModal = () => {
    setIsOfficialModalOpen(false);
    setOfficialToEdit(null); // Clear editing state on close
    setOfficialFormData(initialOfficialFormState); // Explicitly reset form state on close
    setOfficialFormErrors({}); // Clear errors
    setOfficialFormMessage(''); // Clear message
  };

  // --- SAVE/UPDATE Official Handler ---
  const handleSaveOfficial = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setOfficialFormMessage(''); // Clear previous messages
    setOfficialFormErrors({}); // Clear previous errors explicitly

    if (!validateOfficialForm()) {
      setOfficialFormMessage('Please fix the errors in the form.');
      return; // Stop if validation fails
    }

    setOfficialFormLoading(true);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the auth token
      }
    };

    // Prepare data, ensure age is a number
    const dataToSubmit = {
        ...officialFormData,
        age: Number(officialFormData.age)
    };

    try {
      let response;
      if (officialToEdit) {
        // --- UPDATE LOGIC (Example - assumes PUT /api/barangay-officials/:id) ---
        // response = await axios.put(`/api/barangay-officials/${officialToEdit._id}`, dataToSubmit, config);
        // setOfficialFormMessage('Official updated successfully!');
         console.log("Update logic to be implemented"); // Placeholder for update
         setOfficialFormMessage('Update functionality not yet implemented.'); // Temporary message

      } else {
        // --- ADD LOGIC ---
        response = await axios.post('/api/barangay-officials', dataToSubmit, config);
         setOfficialFormMessage('Official added successfully!');
          // Optionally reset form after successful add
          setOfficialFormData(initialOfficialFormState);
          // TODO: Add logic to refresh the officials list displayed in the dashboard if needed
      }

     // Close modal after a short delay to show message (optional)
      setTimeout(() => {
          handleCloseOfficialModal();
          // You might want to trigger a refresh of the officials list here
           setActiveModule("Brgy Official"); // Switch back to the list view maybe
      }, 1500); // Adjust delay as needed


    } catch (error) {
      console.error("Error saving official:", error.response || error);
      let errorMessage = 'Failed to save official. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
        // Handle specific validation errors from backend if needed
        if (error.response.data.errors) {
           // Example: Convert backend errors to frontend format if structure differs
           // const backendErrors = error.response.data.errors;
           // const frontendErrors = {}; // Map backendErrors to officialFormErrors structure
           // setOfficialFormErrors(frontendErrors);
           console.error("Backend validation errors:", error.response.data.errors);
        }
      }
      setOfficialFormMessage(errorMessage);
    } finally {
      setOfficialFormLoading(false);
    }
  };
  // --- End SAVE/UPDATE Official Handler ---

  // --- Handlers for Resident ADD/EDIT Modal ---
  const handleOpenResidentModal = (resident = null) => {
    setResidentToEdit(resident); // Set to null for Add, or the resident object for Edit
    setIsResidentModalOpen(true);
  };

  const handleCloseResidentModal = () => {
    setIsResidentModalOpen(false);
    setResidentToEdit(null); // Clear editing state on close
  };
  // --- End Handlers for Resident ADD/EDIT Modal ---

  // --- Handlers for Blotter ADD/EDIT Modal ---
  const handleOpenBlotterModal = (blotter = null) => {
    setBlotterToEdit(blotter); // Set to null for Add, or the blotter object for Edit
    setIsBlotterModalOpen(true); // Reuse the existing modal open state
  };

  const handleCloseBlotterModal = () => {
    setIsBlotterModalOpen(false);
    setBlotterToEdit(null); // Clear editing state on close
  };
  // --- End Handlers for Blotter ADD/EDIT Modal ---

  // --- Handlers for Certificate VIEW Modal ---
  const handleViewCertificate = (certificate) => {
    setSelectedCertificateForView(certificate);
    setIsCertificateViewModalOpen(true);
  };

  const handleCloseCertificateViewModal = () => {
    setIsCertificateViewModalOpen(false);
    setSelectedCertificateForView(null);
  };
  // --- End Handlers for Certificate VIEW Modal ---

  // --- Handlers for User EDIT Modal ---
  const handleOpenUserEditModal = (user) => {
    setUserToEdit(user); // Set the user data to be edited
    setIsUserEditModalOpen(true); // Open the modal
  };

  const handleCloseUserEditModal = () => {
    setIsUserEditModalOpen(false); // Close the modal
    setUserToEdit(null); // Clear the user data
  };
  // --- End Handlers for User EDIT Modal ---

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Replace with actual logo */}
          <img
            src="/logo192.png"
            alt="Barangay Logo"
            className="sidebar-logo"
          />
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-title">Tools</span>
          <ul>
            {/* Render icons */}
            <li
              className={activeModule === "Dashboard" ? "active" : ""}
              onClick={() => setActiveModule("Dashboard")}
            >
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li
              className={activeModule === "Brgy Official" ? "active" : ""}
              onClick={() => setActiveModule("Brgy Official")}
            >
              <FaUserTie /> <span>Brgy Official</span>
            </li>
            <li
              className={activeModule === "Resident" ? "active" : ""}
              onClick={() => setActiveModule("Resident")}
            >
              <FaUsers /> <span>Resident</span>
            </li>
            <li
              className={activeModule === "Blotter" ? "active" : ""}
              onClick={() => setActiveModule("Blotter")}
            >
              <FaAddressBook /> <span>Blotter</span>
            </li>
            <li
              className={activeModule === "Certificate" ? "active" : ""}
              onClick={() => setActiveModule("Certificate")}
            >
              <FaFileAlt /> <span>Certificate</span>
            </li>
            <li
              className={activeModule === "About" ? "active" : ""}
              onClick={() => setActiveModule("About")}
            >
              <FaInfoCircle /> <span>About</span>
            </li>
            {/* Conditionally render Admin module link based on user role */}
            {user?.role === 'admin' && (
              <li
                className={activeModule === "Admin" ? "active" : ""}
                onClick={() => setActiveModule("Admin")}
              >
                <FaUserCog /> <span>Admin</span>
              </li>
            )}
            {/* Attach handleLogout to the onClick event */}
            <li onClick={handleLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="main-header">
          {/* Top header content if any - image shows it empty */}
        </header>
        <main className="content-area">
          {/* Content changes based on activeModule */}
          {activeModule === "Brgy Official" && (
            <div>
              <div className="content-title-bar">
                <h2>Brgy Official</h2>
                {/* Button removed from here */}
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="last name">
                    <option value="last name">Last name</option>
                    <option value="first name">First name</option>
                    <option value="position">Position</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Full name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Position</th>
                      <th>Term</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder data */}
                    {/* Replace with actual data from API */}
                    <tr>
                      <td>Juan Dela Cruz</td>
                      <td>Male</td>
                      <td>45</td>
                      <td>Captain</td>
                      <td>2023-2025</td>
                      <td>Active</td>
                      <td className="action-buttons">
                        <button title="View" onClick={() => handleViewOfficial({ id: 1, fullName: 'Juan Dela Cruz', gender: 'Male', age: 45, position: 'Captain', term: '2023-2025', status: 'Active' })}>
                          <FaEye />
                        </button>
                        <button title="Edit" onClick={() => handleOpenOfficialModal({ id: 1, fullName: 'Juan Dela Cruz', gender: 'Male', age: 45, position: 'Captain', term: '2023-2025', status: 'Active' })}>
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Maria Clara</td>
                      <td>Female</td>
                      <td>38</td>
                      <td>Kagawad</td>
                      <td>2023-2025</td>
                      <td>Active</td>
                      <td className="action-buttons">
                        <button title="View" onClick={() => handleViewOfficial({ id: 2, fullName: 'Maria Clara', gender: 'Female', age: 38, position: 'Kagawad', term: '2023-2025', status: 'Active' })}>
                          <FaEye />
                        </button>
                        <button title="Edit" onClick={() => handleOpenOfficialModal({ id: 2, fullName: 'Maria Clara', gender: 'Female', age: 38, position: 'Kagawad', term: '2023-2025', status: 'Active' })}>
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleOpenOfficialModal()}
                >
                  Add Official
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}

          {/* Modal for Adding/Editing Official */}
          {isOfficialModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseOfficialModal(); }}>
              <div className="modal-content">
                <h2>{officialToEdit ? "Edit Barangay Official" : "Add New Barangay Official"}</h2>
                <form onSubmit={handleSaveOfficial} className="modal-form">
                  {officialFormMessage && <p className={`form-message ${officialFormErrors && Object.keys(officialFormErrors).length > 0 ? 'error' : 'success'}`}>{officialFormMessage}</p>}

                  <div className="form-group">
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={officialFormData.fullName}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.fullName}
                    />
                    {officialFormErrors.fullName && <span className="error-message">{officialFormErrors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select
                      id="gender"
                      name="gender"
                      value={officialFormData.gender}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.gender}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {officialFormErrors.gender && <span className="error-message">{officialFormErrors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={officialFormData.age}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.age}
                    />
                    {officialFormErrors.age && <span className="error-message">{officialFormErrors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="position">Position:</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={officialFormData.position}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.position}
                    />
                    {officialFormErrors.position && <span className="error-message">{officialFormErrors.position}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="term">Term:</label>
                    <input
                      type="text"
                      id="term"
                      name="term"
                      placeholder="e.g., 2023-2025"
                      value={officialFormData.term}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.term}
                    />
                    {officialFormErrors.term && <span className="error-message">{officialFormErrors.term}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                      id="status"
                      name="status"
                      value={officialFormData.status}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.status}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    {officialFormErrors.status && <span className="error-message">{officialFormErrors.status}</span>}
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="save-button" disabled={officialFormLoading}>
                      {officialFormLoading ? 'Saving...' : (officialToEdit ? "Update" : "Save")}
                    </button>
                    <button type="button" onClick={handleCloseOfficialModal} className="cancel-button" disabled={officialFormLoading}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add conditional rendering for other modules here */}
          {/* Exclude Dashboard, Resident, Blotter, Certificate, and About from this generic fallback */}
          {activeModule !== "Brgy Official" &&
            activeModule !== "Dashboard" &&
            activeModule !== "Resident" &&
            activeModule !== "Blotter" &&
            activeModule !== "Certificate" &&
            activeModule !== "About" &&
            activeModule !== "Admin" && ( // Exclude Admin as well
              <div>
                <h2>{activeModule}</h2>{" "}
                {/* Keep title for Admin or other future modules */}
                <p>Content for {activeModule} module goes here.</p>{" "}
                {/* Added placeholder text */}
              </div>
            )}
          {activeModule === "Dashboard" && (
            <div className="dashboard-overview">
              <h2>Dashboard Overview</h2> {/* Added title back */}
              <p className="welcome-message">Welcome back, [User Name]!</p>{" "}
              {/* Added Welcome Message */}
              {/* Keep existing Dashboard content */}
              <div className="overview-cards">
                <div className="overview-card">
                  <h3>Total Residents</h3>
                  <p>150</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>Active Officials</h3>
                  <p>12</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>New Blotter Cases </h3>
                  <p>5</p> {/* Placeholder */}
                </div>
                <div className="overview-card">
                  <h3>Certificates Issued</h3>
                  <p>25</p> {/* Placeholder */}
                </div>
              </div>
              {/* Placeholder for Charts */}
              <div className="dashboard-section">
                <h3>Analytics</h3>
                <div className="chart-placeholder">
                  Chart: Resident Demographics (Placeholder)
                </div>
                {/* Add more chart placeholders if needed */}
              </div>
            </div>
          )}
          {/* Add specific rendering for Resident module */}
          {activeModule === "Resident" && (
            <div>
              <div className="content-title-bar">
                <h2>Resident</h2> {/* Title for the Resident section */}
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="last name">
                    <option value="last name">Last name</option>
                    <option value="first name">First name</option>
                    <option value="address">Address</option>{" "}
                    {/* Resident specific search */}
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Full name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Address</th>
                      <th>Contact Number</th> {/* Resident specific column */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Resident Data */}
                    <tr>
                      <td>John Doe</td>
                      <td>Male</td>
                      <td>30</td>
                      <td>123 Main St, Barangay XYZ</td>
                      <td>0917-123-4567</td>
                      <td className="action-buttons">
                        {/* Placeholder resident object for onClick */}
                        <button title="View" onClick={() => handleViewResident({ fullName: 'John Doe', gender: 'Male', age: 30, address: '123 Main St, Barangay XYZ', contactNumber: '0917-123-4567' })}>
                          <FaEye />
                        </button>
                        <button title="Edit" onClick={() => handleOpenResidentModal({ fullName: 'John Doe', gender: 'Male', age: 30, address: '123 Main St, Barangay XYZ', contactNumber: '0917-123-4567' })}>
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>Female</td>
                      <td>25</td>
                      <td>456 Oak Ave, Barangay XYZ</td>
                      <td>0928-987-6543</td>
                      <td className="action-buttons">
                         {/* Placeholder resident object for onClick */}
                        <button title="View" onClick={() => handleViewResident({ fullName: 'Jane Smith', gender: 'Female', age: 25, address: '456 Oak Ave, Barangay XYZ', contactNumber: '0928-987-6543' })}>
                          <FaEye />
                        </button>
                        <button title="Edit" onClick={() => handleOpenResidentModal({ fullName: 'Jane Smith', gender: 'Female', age: 25, address: '456 Oak Ave, Barangay XYZ', contactNumber: '0928-987-6543' })}>
                          <FaEdit />
                        </button>
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder residents as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                {/* Add Resident Button */}
                {/* Add Resident Button */}
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleOpenResidentModal()} // Use the new handler for Add
                >
                  Add Resident
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}

          {/* Modal for Adding/Editing Resident */}
          {isResidentModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseResidentModal(); }}>
              <div className="modal-content">
                <h2>{residentToEdit ? "Edit Resident" : "Add New Resident"}</h2>
                <form>
                  {/* Add input fields based on resident table columns */}
                  <div className="form-group">
                    <label htmlFor="resFullName">Full Name:</label>
                    <input type="text" id="resFullName" name="resFullName" defaultValue={residentToEdit?.fullName || ''} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="resGender">Gender:</label>
                    <select id="resGender" name="resGender" defaultValue={residentToEdit?.gender || ''}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="resAge">Age:</label>
                    <input type="number" id="resAge" name="resAge" defaultValue={residentToEdit?.age || ''} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="resAddress">Address:</label>
                    <input type="text" id="resAddress" name="resAddress" defaultValue={residentToEdit?.address || ''} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="resContact">Contact Number:</label>
                    <input type="text" id="resContact" name="resContact" defaultValue={residentToEdit?.contactNumber || ''} />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-button">
                      {residentToEdit ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCloseResidentModal} // Use the new close handler
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add specific rendering for Blotter module */}
          {activeModule === "Blotter" && (
            <div>
              <div className="content-title-bar">
                <h2>Blotter Records</h2>
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="complainant">
                    <option value="complainant">Complainant</option>
                    <option value="respondent">Respondent</option>
                    <option value="status">Status</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date Recorded</th>
                      <th>Complainant</th>
                      <th>Respondent</th>
                      <th>Narrative</th>
                      <th>Status</th>
                      <th>Actions Taken</th>
                      <th>Recorded By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Blotter Data */}
                    <tr>
                      <td>2025-04-08</td>
                      <td>Pedro Penduko</td>
                      <td>Juan Tamad</td>
                      <td>
                        {
                          /* Limit to first two words */
                          "Verbal altercation regarding property line..."
                            .split(" ")
                            .slice(0, 2)
                            .join(" ")
                        }
                      </td>
                      <td>Amicably Settled</td>
                      <td>Mediation</td>
                      <td>Officer Reyes</td>
                      <td className="action-buttons">
                        {/* Placeholder blotter object for onClick */}
                        <button title="View" onClick={() => handleViewBlotter({ dateRecorded: '2025-04-08', complainant: 'Pedro Penduko', respondent: 'Juan Tamad', narrative: 'Verbal altercation regarding property line...', status: 'Amicably Settled', actionsTaken: 'Mediation', recordedBy: 'Officer Reyes' })}>
                          <FaEye />
                        </button>
                        {/* Attach handler to Edit button - using placeholder data */}
                        <button title="Edit" onClick={() => handleOpenBlotterModal({ dateRecorded: '2025-04-08', complainant: 'Pedro Penduko', respondent: 'Juan Tamad', narrative: 'Verbal altercation regarding property line...', status: 'Amicably Settled', actionsTaken: 'Mediation', recordedBy: 'Officer Reyes' })}>
                          <FaEdit />
                        </button>
                        {/* Add delete button same as resident module */}
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2025-04-07</td>
                      <td>Maria Makiling</td>
                      <td>Unknown</td>
                      <td>
                        {
                          /* Limit to first two words */
                          "Reported theft of livestock..."
                            .split(" ")
                            .slice(0, 2)
                            .join(" ")
                        }
                      </td>
                      <td>Under Investigation</td>
                      <td>Initial report taken</td>
                      <td>Officer Santos</td>
                      <td className="action-buttons">
                        {/* Placeholder blotter object for onClick */}
                         <button title="View" onClick={() => handleViewBlotter({ dateRecorded: '2025-04-07', complainant: 'Maria Makiling', respondent: 'Unknown', narrative: 'Reported theft of livestock...', status: 'Under Investigation', actionsTaken: 'Initial report taken', recordedBy: 'Officer Santos' })}>
                          <FaEye />
                        </button>
                        {/* Attach handler to Edit button - using placeholder data */}
                        <button title="Edit" onClick={() => handleOpenBlotterModal({ dateRecorded: '2025-04-07', complainant: 'Maria Makiling', respondent: 'Unknown', narrative: 'Reported theft of livestock...', status: 'Under Investigation', actionsTaken: 'Initial report taken', recordedBy: 'Officer Santos' })}>
                          <FaEdit />
                        </button>
                        {/* Add delete button same as resident module */}
                        <button title="Delete">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder blotter records as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                {/* Add Record Button */}
                {/* Add Record Button */}
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleOpenBlotterModal()} // Use the new handler for Add/Edit
                >
                  Add New Record
                </button>
                {/* Print Button Added */}
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}

          {/* Modal for Adding/Editing Blotter Record */}
          {isBlotterModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseBlotterModal(); }}>
              <div className="modal-content">
                {/* Dynamic Title */}
                <h2>{blotterToEdit ? "Edit Blotter Record" : "Add New Blotter Record"}</h2>
                {/* TODO: Add form submission handler */}
                <form>
                  {/* Add input fields, prefill with blotterToEdit data if available */}
                  <div className="form-group">
                    <label htmlFor="blotterDate">Date Recorded:</label>
                    <input type="date" id="blotterDate" name="blotterDate" defaultValue={blotterToEdit?.dateRecorded || ''} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterComplainant">Complainant:</label>
                    <input
                      type="text"
                      id="blotterComplainant"
                      name="blotterComplainant"
                      defaultValue={blotterToEdit?.complainant || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterRespondent">Respondent:</label>
                    <input
                      type="text"
                      id="blotterRespondent"
                      name="blotterRespondent"
                      defaultValue={blotterToEdit?.respondent || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterNarrative">Narrative:</label>
                    <textarea
                      id="blotterNarrative"
                      name="blotterNarrative"
                      rows="3"
                      defaultValue={blotterToEdit?.narrative || ''}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterStatus">Status:</label>
                    <select id="blotterStatus" name="blotterStatus" defaultValue={blotterToEdit?.status || ''}>
                      <option value="">Select Status</option>
                      <option value="Amicably Settled">Amicably Settled</option>
                      <option value="Under Investigation">
                        Under Investigation
                      </option>
                      <option value="Referred to Higher Authority">
                        Referred to Higher Authority
                      </option>
                      <option value="Closed/Dismissed">Closed/Dismissed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterActionsTaken">Actions Taken:</label>
                    <input
                      type="text"
                      id="blotterActionsTaken"
                      name="blotterActionsTaken"
                      defaultValue={blotterToEdit?.actionsTaken || ''}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="blotterRecordedBy">Recorded By:</label>
                    <input
                      type="text"
                      id="blotterRecordedBy"
                      name="blotterRecordedBy"
                      defaultValue={blotterToEdit?.recordedBy || ''}
                    />
                  </div>
                  <div className="modal-actions">
                    {/* Dynamic Button Text */}
                    <button type="submit" className="save-button">
                      {blotterToEdit ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCloseBlotterModal} // Use the new close handler
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add specific rendering for Certificate module */}
          {activeModule === "Certificate" && (
            <div>
              <div className="content-title-bar">
                <h2>Certificates</h2>
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="resident">
                    <option value="resident">Resident Name</option>
                    <option value="type">Certificate Type</option>
                    <option value="date">Date Issued</option>
                  </select>
                  <input type="text" placeholder="Search..." />
                  <button className="search-button">
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Certificate Type</th>
                      <th>Resident Name</th>
                      <th>Date Issued</th>
                      <th>Issued By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder Certificate Data */}
                    <tr>
                      <td>Barangay Indigency</td>
                      <td>John Doe</td>
                      <td>2025-04-01</td>
                      <td>Secretary Lee</td>
                      <td className="action-buttons">
                        {/* Attach handler to View button - using placeholder data */}
                        <button title="View/Download" onClick={() => handleViewCertificate({ certificateType: 'Barangay Indigency', residentName: 'John Doe', dateIssued: '2025-04-01', issuedBy: 'Secretary Lee' })}>
                          <FaEye />
                        </button>
                        {/* Maybe Revoke? */}
                      </td>
                    </tr>
                    <tr>
                      <td>Barangay Residency</td>
                      <td>Jane Smith</td>
                      <td>2025-03-25</td>
                      <td>Secretary Lee</td>
                      <td className="action-buttons">
                        {/* Attach handler to View button - using placeholder data */}
                        <button title="View/Download" onClick={() => handleViewCertificate({ certificateType: 'Barangay Residency', residentName: 'Jane Smith', dateIssued: '2025-03-25', issuedBy: 'Secretary Lee' })}>
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                    {/* Add more placeholder certificate records as needed */}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                <button
                  className="issue-certificate-button"
                  onClick={() => setIsCertificateModalOpen(true)} // Open certificate modal
                >
                  Issue New Certificate
                </button>
              </div>
            </div>
          )}

          {/* Modal for Issuing Certificate */}
          {isCertificateModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsCertificateModalOpen(false); }}>
              <div className="modal-content">
                <h2>Issue New Certificate</h2>
                <form>
                  {/* Add input fields based on certificate table columns */}
                  <div className="form-group">
                    <label htmlFor="certType">Certificate Type:</label>
                    <select id="certType" name="certType">
                      <option value="">Select Type</option>
                      <option value="Barangay Indigency">
                        Barangay Indigency
                      </option>
                      <option value="Barangay Residency">
                        Barangay Residency
                      </option>
                      <option value="Barangay Clearance">
                        Barangay Clearance
                      </option>
                      {/* Add other certificate types as needed */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="certResidentName">Resident Name:</label>
                    <input
                      type="text"
                      id="certResidentName"
                      name="certResidentName"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="certDateIssued">Date Issued:</label>
                    <input
                      type="date"
                      id="certDateIssued"
                      name="certDateIssued"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="certIssuedBy">Issued By:</label>
                    <input type="text" id="certIssuedBy" name="certIssuedBy" />
                  </div>
                  {/* Add other relevant fields like Purpose, OR Number, Amount Paid if needed */}
                  <div className="modal-actions">
                    <button type="submit" className="save-button">
                      Issue Certificate
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setIsCertificateModalOpen(false)} // Close certificate modal
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add specific rendering for About module */}
          {activeModule === "About" && (
            <div className="about-section">
              <h2>About the Barangay Management System</h2>
              <p>
                The Barangay Management System aims to modernize the
                record-keeping and administrative processes within a barangay.
                It provides a centralized platform for managing resident
                information, barangay officials, blotter incidents, certificate
                issuance, and user accounts.
              </p>
              <p>
                This system intends to improve efficiency, transparency, and
                communication within the community.
              </p>
              {/* Add more details if needed, e.g., version, contact */}
              <p>Version: 1.0.0 (Placeholder)</p>
            </div>
          )}
          {/* Add specific rendering for Admin module */}
          {activeModule === "Admin" && (
            <div className="admin-section">
              <h2>Admin Panel</h2>

              {/* User Management Section */}
              <div className="dashboard-section">
                <h3>User Management</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Placeholder User Data */}
                      <tr>
                        <td>admin_user</td>
                        <td>Admin</td>
                        <td>Active</td>
                        <td className="action-buttons">
                        {/* Corrected onClick handler for Edit User */}
                        <button title="Edit" onClick={() => handleOpenUserEditModal({ username: 'admin_user', role: 'Admin', status: 'Active' })}>
                          <FaEdit />
                        </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>staff_user1</td>
                        <td>Staff</td>
                        <td>Active</td>
                        <td className="action-buttons">
                        {/* Corrected onClick handler for Edit User */}
                        <button title="Edit" onClick={() => handleOpenUserEditModal({ username: 'staff_user1', role: 'Staff', status: 'Active' })}>
                          <FaEdit />
                        </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>staff_user2</td>
                        <td>Staff</td>
                        <td>Inactive</td>
                        <td className="action-buttons">
                          {/* Corrected onClick handler for Edit User */}
                           <button title="Edit" onClick={() => handleOpenUserEditModal({ username: 'staff_user2', role: 'Staff', status: 'Inactive' })}>
                            <FaEdit />
                          </button>
                          <button title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="content-footer">
                  <button
                    className="add-user-button"
                    onClick={() => setIsUserModalOpen(true)}
                  >
                    Add New User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Adding User */}
          {isUserModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsUserModalOpen(false); }}>
              <div className="modal-content">
                <h2>Add New User</h2>
                <form>
                  {/* Add input fields for adding a new user */}
                  <div className="form-group">
                    <label htmlFor="userUsername">Username:</label>
                    <input type="text" id="userUsername" name="userUsername" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="userRole">Role:</label>
                    <select id="userRole" name="userRole">
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="userStatus">Status:</label>
                    <select id="userStatus" name="userStatus">
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-button">
                      Add User
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setIsUserModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* --- Other ADD Modals defined by user --- */}
          {/* ... (existing modals for Add Official, Add Resident, etc.) ... */}
        </main>

        {/* --- Render the VIEW Modal --- */}
        {isOfficialViewModalOpen && (
          <OfficialViewModal
            official={selectedOfficialForView}
            onClose={handleCloseViewModal}
          />
        )}
        {/* --- Render Resident VIEW Modal --- */}
        {isResidentViewModalOpen && (
          <ResidentViewModal
            resident={selectedResidentForView}
            onClose={handleCloseResidentViewModal}
          />
        )}
         {/* --- Render Blotter VIEW Modal --- */}
         {isBlotterViewModalOpen && (
          <BlotterViewModal
            blotter={selectedBlotterForView}
            onClose={handleCloseBlotterViewModal}
          />
        )}
        {/* --- Render Certificate VIEW Modal --- */}
        {isCertificateViewModalOpen && (
          <CertificateViewModal
            certificate={selectedCertificateForView}
            onClose={handleCloseCertificateViewModal}
          />
        )}
        {/* --- Render User EDIT Modal --- */}
        {isUserEditModalOpen && userToEdit && (
          <UserEditModal
            user={userToEdit}
            onClose={handleCloseUserEditModal}
            // onSave={handleUpdateUser} // Pass a function to handle the update API call
          />
        )}
        {/* --- End Render VIEW Modals --- */}
      </div>
    </div>
  );
}

export default Dashboard;
