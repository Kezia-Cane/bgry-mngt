import React, { useEffect, useMemo, useState } from "react"; // Add useMemo
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
// --- Import Recharts components ---
import {
  // --- Add Area import ---
  Area,
  // --- Add AreaChart import ---
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// --- Define Initial State OUTSIDE Component ---
const initialOfficialFormState = {
  fullName: '',
  gender: '',
  age: '',
  position: '',
  term: '',
  status: 'Active', // Default status
};
const initialResidentFormState = {
  fullName: '',
  gender: '',
  age: '', // Note: Model uses birthdate, UI shows age. Will handle conversion or adjust form.
  birthdate: '', // Actual field for the model
  address: '', // Simplify for now, model has nested address
  contactNumber: '',
  // Add other optional fields from Resident model if needed in the form
  civilStatus: '',
  occupation: '',
};
const initialBlotterFormState = {
  incidentType: '',
  incidentDate: '',
  incidentLocation: '',
  complainantName: '', // Simplified for form
  respondentName: '', // Simplified for form
  narrative: '',
  status: 'Open', // Default status
  // complainantAddress, complainantContact, respondentAddress can be added if needed
};
const initialCertificateFormState = {
    certificateType: '',
    residentId: '',
    purpose: '',
};

// --- Define Colors for Charts --- (Can be customized)
const GENDER_COLORS = ['#0088FE', '#FF8042', '#FFBB28']; // Blue, Pink, Yellow
const BLOTTER_COLORS = ['#DD4444', '#FFBB28', '#00C49F', '#8884d8', '#82ca9d']; // Red(Open), Yellow(Invest), Green(Settled), Purple(Referred), Gray(Closed)

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
  const [officialFormData, setOfficialFormData] = useState(initialOfficialFormState);
  const [officialFormErrors, setOfficialFormErrors] = useState({});
  const [officialFormLoading, setOfficialFormLoading] = useState(false); // Loading state for submit
  const [officialFormMessage, setOfficialFormMessage] = useState(''); // For success/error messages

  // --- Data Fetching State (Officials) ---
  const [officials, setOfficials] = useState([]);
  const [officialsLoading, setOfficialsLoading] = useState(false);
  const [officialsError, setOfficialsError] = useState(null);

  // --- Data Fetching State (Residents) ---
  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState(null);

  // --- State for Add/Edit Resident Form ---
  const [residentFormData, setResidentFormData] = useState(initialResidentFormState);
  const [residentFormErrors, setResidentFormErrors] = useState({});
  const [residentFormLoading, setResidentFormLoading] = useState(false);
  const [residentFormMessage, setResidentFormMessage] = useState('');

  // --- Data Fetching State (Blotters) ---
  const [blotters, setBlotters] = useState([]);
  const [blottersLoading, setBlottersLoading] = useState(false);
  const [blottersError, setBlottersError] = useState(null);

  // --- State for Add/Edit Blotter Form ---
  const [blotterFormData, setBlotterFormData] = useState(initialBlotterFormState);
  const [blotterFormErrors, setBlotterFormErrors] = useState({});
  const [blotterFormLoading, setBlotterFormLoading] = useState(false);
  const [blotterFormMessage, setBlotterFormMessage] = useState('');

  // --- Data Fetching State (Certificates) ---
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState(null);

  // --- State for Issue Certificate Form ---
  const [certificateFormData, setCertificateFormData] = useState(initialCertificateFormState);
  const [certificateFormErrors, setCertificateFormErrors] = useState({});
  const [certificateFormLoading, setCertificateFormLoading] = useState(false);
  const [certificateFormMessage, setCertificateFormMessage] = useState('');

  // Add loading state specifically for dashboard stats aggregation
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);

  // --- Fetch Functions ---
  const fetchOfficials = async () => {
    setOfficialsLoading(true);
    setOfficialsError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.get('/api/barangay-officials', config);
      setOfficials(response.data || []);
    } catch (error) {
      console.error("Error fetching officials:", error.response || error);
      setOfficialsError('Failed to load officials.');
      setOfficials([]);
    } finally {
      setOfficialsLoading(false);
    }
  };

  const fetchResidents = async () => {
    setResidentsLoading(true);
    setResidentsError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.get('/api/residents', config);
      setResidents(response.data.residents || response.data || []);
      // If API provides totalResidents, store it (optional)
      // setTotalResidents(response.data.totalResidents || 0);
    } catch (error) {
      console.error("Error fetching residents:", error.response || error);
      setResidentsError('Failed to load residents.');
      setResidents([]);
    } finally {
      setResidentsLoading(false);
    }
  };

  const fetchBlotters = async () => {
    setBlottersLoading(true);
    setBlottersError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.get('/api/blotters', config);
      setBlotters(response.data.blotters || response.data || []);
    } catch (error) {
      console.error("Error fetching blotters:", error.response || error);
      setBlottersError('Failed to load blotter records.');
      setBlotters([]);
    } finally {
      setBlottersLoading(false);
    }
  };

  const fetchCertificates = async () => {
    setCertificatesLoading(true);
    setCertificatesError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const response = await axios.get('/api/certificates', config);
      setCertificates(response.data.certificates || response.data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error.response || error);
      setCertificatesError('Failed to load certificates.');
      setCertificates([]);
    } finally {
      setCertificatesLoading(false);
    }
  };

  // --- Effect to Fetch Data when module is active ---
  useEffect(() => {
    if (token) {
      // Fetch specific data based on active module
      if (activeModule === "Brgy Official") fetchOfficials();
      if (activeModule === "Resident") fetchResidents();
      if (activeModule === "Blotter") fetchBlotters();
      if (activeModule === "Certificate") {
          fetchCertificates();
          if (residents.length === 0 && !residentsLoading) fetchResidents();
      }
      if (activeModule === "Dashboard") {
          // Fetch all data needed for dashboard stats
          setDashboardStatsLoading(true);
          Promise.all([
              fetchOfficials(),
              fetchResidents(),
              fetchBlotters(),
              fetchCertificates()
          ]).finally(() => {
              setDashboardStatsLoading(false);
          });
      }
      // Add other modules here
    }
  }, [activeModule, token]); // Rerun when module or token changes

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
  }, [officialToEdit, isOfficialModalOpen]);

  // --- Effect to pre-fill Resident form when editing ---
  useEffect(() => {
    if (residentToEdit) {
      // Convert birthdate back to YYYY-MM-DD for the input field if needed
      const birthdateValue = residentToEdit.birthdate ? new Date(residentToEdit.birthdate).toISOString().split('T')[0] : '';
      setResidentFormData({
        fullName: residentToEdit.fullName || '',
        gender: residentToEdit.gender || '',
        // age field is likely derived, use birthdate
        birthdate: birthdateValue,
        // Simplify address for now, requires handling nested object if complex
        address: residentToEdit.address?.street || residentToEdit.address || '', // Example access
        contactNumber: residentToEdit.contactNumber || '',
        civilStatus: residentToEdit.civilStatus || '',
        occupation: residentToEdit.occupation || '',
      });
      setResidentFormErrors({});
      setResidentFormMessage('');
    } else {
      setResidentFormData(initialResidentFormState);
      setResidentFormErrors({});
      setResidentFormMessage('');
    }
  }, [residentToEdit, isResidentModalOpen]);

  useEffect(() => {
    if (blotterToEdit) {
      // Format date and simplify object fields for the form
      const incidentDateValue = blotterToEdit.incidentDate ? new Date(blotterToEdit.incidentDate).toISOString().split('T')[0] : '';
      setBlotterFormData({
        incidentType: blotterToEdit.incidentType || '',
        incidentDate: incidentDateValue,
        incidentLocation: blotterToEdit.incidentLocation || '',
        complainantName: blotterToEdit.complainant?.name || '',
        respondentName: blotterToEdit.respondent?.name || '',
        narrative: blotterToEdit.narrative || '',
        status: blotterToEdit.status || 'Open',
      });
      setBlotterFormErrors({});
      setBlotterFormMessage('');
    } else {
      setBlotterFormData(initialBlotterFormState);
      setBlotterFormErrors({});
      setBlotterFormMessage('');
    }
  }, [blotterToEdit, isBlotterModalOpen]);

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

  // --- Input Handlers ---
  const handleResidentFormChange = (e) => {
    const { name, value } = e.target;
    setResidentFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (residentFormErrors[name]) {
      setResidentFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    setResidentFormMessage('');
  };

  const handleBlotterFormChange = (e) => {
    const { name, value } = e.target;
    setBlotterFormData(prevState => ({ ...prevState, [name]: value }));
    if (blotterFormErrors[name]) {
      setBlotterFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    setBlotterFormMessage('');
  };

  const handleCertificateFormChange = (e) => {
    const { name, value } = e.target;
    setCertificateFormData(prevState => ({ ...prevState, [name]: value }));
    if (certificateFormErrors[name]) {
      setCertificateFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    setCertificateFormMessage('');
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

  // --- Validation Functions ---
  const validateResidentForm = () => {
    const errors = {};
    if (!residentFormData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!residentFormData.gender) errors.gender = 'Gender is required';
    if (!residentFormData.birthdate) errors.birthdate = 'Birthdate is required';
    // Basic address check, model might require more detail
    if (!residentFormData.address.trim()) errors.address = 'Address is required';
    // Optional: Add validation for contact number format, birthdate format/validity etc.
    if (residentFormData.contactNumber && !/^[0-9\-+()\s]*$/.test(residentFormData.contactNumber)) {
        errors.contactNumber = 'Invalid contact number format';
    }

    setResidentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBlotterForm = () => {
    const errors = {};
    if (!blotterFormData.incidentType.trim()) errors.incidentType = 'Incident Type is required';
    if (!blotterFormData.incidentDate) errors.incidentDate = 'Incident Date is required';
    if (!blotterFormData.incidentLocation.trim()) errors.incidentLocation = 'Incident Location is required';
    if (!blotterFormData.complainantName.trim()) errors.complainantName = 'Complainant Name is required';
    if (!blotterFormData.respondentName.trim()) errors.respondentName = 'Respondent Name is required';
    if (!blotterFormData.narrative.trim()) errors.narrative = 'Narrative is required';
    if (!blotterFormData.status) errors.status = 'Status is required';

    setBlotterFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCertificateForm = () => {
    const errors = {};
    if (!certificateFormData.certificateType) errors.certificateType = 'Certificate Type is required';
    if (!certificateFormData.residentId) errors.residentId = 'Resident is required';
    if (!certificateFormData.purpose.trim()) errors.purpose = 'Purpose is required';
    setCertificateFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      if (officialToEdit) {
        // --- UPDATE LOGIC (Example - assumes PUT /api/barangay-officials/:id) ---
        // response = await axios.put(`/api/barangay-officials/${officialToEdit._id}`, dataToSubmit, config);
        // setOfficialFormMessage('Official updated successfully!');
         console.log("Update logic to be implemented"); // Placeholder for update
         setOfficialFormMessage('Update functionality not yet implemented.'); // Temporary message

      } else {
        // --- ADD LOGIC ---
        await axios.post('/api/barangay-officials', dataToSubmit, config);
         setOfficialFormMessage('Official added successfully!');
          // Optionally reset form after successful add
          setOfficialFormData(initialOfficialFormState);
          // TODO: Add logic to refresh the officials list displayed in the dashboard if needed
      }

      // --- Refresh the list after save/update --- Wait for it!
      await fetchOfficials();

      // Close modal after a short delay (optional)
      setTimeout(() => {
          handleCloseOfficialModal();
          // No need to switch module explicitly if already there
      }, 1500);

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

  // --- SAVE/UPDATE Resident Handler ---
  const handleSaveResident = async (e) => {
    e.preventDefault();
    setResidentFormMessage('');
    setResidentFormErrors({});

    if (!validateResidentForm()) {
      setResidentFormMessage('Please fix the errors in the form.');
      return;
    }

    setResidentFormLoading(true);
    const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };

    // Prepare data for API - structure might need adjustment based on backend model
    // Especially the address field
    const dataToSubmit = {
      fullName: residentFormData.fullName,
      gender: residentFormData.gender,
      birthdate: residentFormData.birthdate,
      address: { // Assuming nested address in model
          street: residentFormData.address, // This might need more fields (barangay, city etc.)
          // Add other address parts if needed, potentially from other form fields
          // barangay: 'Your Barangay Name', // Example default or fetched value
          // city: 'Your City Name',
          // province: 'Your Province Name'
      },
      contactNumber: residentFormData.contactNumber || undefined, // Send undefined if empty
      civilStatus: residentFormData.civilStatus || undefined,
      occupation: residentFormData.occupation || undefined,
    };

    try {
      if (residentToEdit) {
        // --- UPDATE RESIDENT LOGIC ---
        // await axios.put(`/api/residents/${residentToEdit._id}`, dataToSubmit, config);
        // setResidentFormMessage('Resident updated successfully!');
        console.log("Update resident logic to be implemented");
        setResidentFormMessage('Update functionality not yet implemented.');
      } else {
        // --- ADD RESIDENT LOGIC ---
        await axios.post('/api/residents', dataToSubmit, config);
        setResidentFormMessage('Resident added successfully!');
        setResidentFormData(initialResidentFormState);
      }

      // Refresh the list
      await fetchResidents();

      // Close modal
      setTimeout(() => {
        handleCloseResidentModal();
      }, 1500);

    } catch (error) {
      console.error("Error saving resident:", error.response || error);
      let errorMessage = 'Failed to save resident. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.data.errors) {
           // Handle detailed backend validation errors if needed
           // const backendErrors = error.response.data.errors;
           // Map backendErrors to residentFormErrors state
           console.error("Backend validation errors:", error.response.data.errors);
        }
      }
      setResidentFormMessage(errorMessage);
    } finally {
      setResidentFormLoading(false);
    }
  };
  // --- End SAVE/UPDATE Resident Handler ---

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

  // --- SAVE/UPDATE Handlers ---
  const handleSaveBlotter = async (e) => {
    e.preventDefault();
    setBlotterFormMessage('');
    setBlotterFormErrors({});

    if (!validateBlotterForm()) {
      setBlotterFormMessage('Please fix the errors in the form.');
      return;
    }

    setBlotterFormLoading(true);
    const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };

    // Prepare data for API - structure matches backend model
    // Note: `recordedBy` is handled automatically by the backend
    const dataToSubmit = {
      incidentType: blotterFormData.incidentType,
      incidentDate: blotterFormData.incidentDate,
      incidentLocation: blotterFormData.incidentLocation,
      complainant: { name: blotterFormData.complainantName }, // Create nested object
      respondent: { name: blotterFormData.respondentName }, // Create nested object
      narrative: blotterFormData.narrative,
      status: blotterFormData.status,
      // ActionsTaken are handled via a separate endpoint/process usually
    };

    try {
      if (blotterToEdit) {
        // --- UPDATE BLOTTER LOGIC ---
        // await axios.put(`/api/blotters/${blotterToEdit._id}`, dataToSubmit, config);
        // setBlotterFormMessage('Blotter record updated successfully!');
        console.log("Update blotter logic to be implemented");
        setBlotterFormMessage('Update functionality not yet implemented.');
      } else {
        // --- ADD BLOTTER LOGIC ---
        await axios.post('/api/blotters', dataToSubmit, config);
        setBlotterFormMessage('Blotter record added successfully!');
        setBlotterFormData(initialBlotterFormState);
      }

      // Refresh the list
      await fetchBlotters();

      // Close modal
      setTimeout(() => {
        handleCloseBlotterModal();
      }, 1500);

    } catch (error) {
      console.error("Error saving blotter record:", error.response || error);
      let errorMessage = 'Failed to save blotter record. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.data.errors) {
           console.error("Backend validation errors:", error.response.data.errors);
           // Map errors to form state if needed
        }
      }
      setBlotterFormMessage(errorMessage);
    } finally {
      setBlotterFormLoading(false);
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setCertificateFormMessage('');
    setCertificateFormErrors({});

    if (!validateCertificateForm()) {
      setCertificateFormMessage('Please fix the errors in the form.');
      return;
    }

    setCertificateFormLoading(true);
    const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
    const dataToSubmit = {
      certificateType: certificateFormData.certificateType,
      residentId: certificateFormData.residentId,
      purpose: certificateFormData.purpose,
    };

    try {
      await axios.post('/api/certificates', dataToSubmit, config);
      setCertificateFormMessage('Certificate issued successfully!');
      setCertificateFormData(initialCertificateFormState);
      await fetchCertificates(); // Refresh list
      setTimeout(() => {
        handleCloseCertificateModal();
      }, 1500);
    } catch (error) {
      console.error("Error issuing certificate:", error.response || error);
      let errorMessage = 'Failed to issue certificate. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.status === 404 && error.response.data.message.includes('Resident not found')){
            setCertificateFormErrors(prev => ({...prev, residentId: 'Selected resident not found in database.' }))
        }
        if (error.response.data.errors) {
           console.error("Backend validation errors:", error.response.data.errors);
        }
      }
      setCertificateFormMessage(errorMessage);
    } finally {
      setCertificateFormLoading(false);
    }
  };

  const handleCloseCertificateModal = () => {
      setIsCertificateModalOpen(false);
      setCertificateFormData(initialCertificateFormState);
      setCertificateFormErrors({});
      setCertificateFormMessage('');
  }

  // --- Data Processing for Charts (using useMemo for efficiency) ---
  const genderData = useMemo(() => {
    if (!residents || residents.length === 0) return [];
    const counts = residents.reduce((acc, resident) => {
      const gender = resident?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [residents]); // Recompute only when residents array changes

  const blotterStatusData = useMemo(() => {
    if (!blotters || blotters.length === 0) return [];
    const counts = blotters.reduce((acc, blotter) => {
      const status = blotter?.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    // Ensure consistent order for colors if needed
    const statusOrder = ['Open', 'Under Investigation', 'Amicably Settled', 'Referred', 'Closed', 'Unknown'];
    return statusOrder
      .filter(status => counts[status] > 0) // Only include statuses present
      .map(status => ({ name: status, value: counts[status] }));

  }, [blotters]); // Recompute only when blotters array changes

  const recentBlotterData = useMemo(() => {
    if (!blotters || blotters.length === 0) return [];

    const dayMap = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Initialize counts for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayName = dayNames[date.getDay()];
        dayMap[dateString] = { name: dayName, count: 0, date: dateString };
    }

    // Count blotters within the last 7 days
    blotters.forEach(blotter => {
        if (!blotter.createdAt) return; // Skip if no creation date
        const blotterDate = new Date(blotter.createdAt);
        blotterDate.setHours(0, 0, 0, 0);
        const dateString = blotterDate.toISOString().split('T')[0];

        // Check if the date is within our 7-day map
        if (dayMap[dateString]) {
            dayMap[dateString].count += 1;
        }
    });

    // Convert map back to array sorted by date
    return Object.values(dayMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [blotters]); // Recompute only when blotters array changes

  const recentlyAddedItems = useMemo(() => {
    const combined = [
      ...(officials || []).map(item => ({ ...item, type: 'Official', name: item.fullName, date: item.createdAt })),
      ...(residents || []).map(item => ({ ...item, type: 'Resident', name: item.fullName, date: item.createdAt })),
      // Use incidentDate for blotters if createdAt isn't reliable or relevant for 'added'
      ...(blotters || []).map(item => ({ ...item, type: 'Blotter', name: item.incidentType, date: item.createdAt || item.incidentDate })),
      ...(certificates || []).map(item => ({ ...item, type: 'Certificate', name: `${item.certificateType} for ${item.resident?.fullName || 'N/A'}`, date: item.createdAt || item.issueDate }))
    ];

    // Filter out items without a valid date
    const validItems = combined.filter(item => item.date && !isNaN(new Date(item.date).getTime()));

    // Sort by date descending
    validItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return top 4 (changed from 5)
    return validItems.slice(0, 4);

  }, [officials, residents, blotters, certificates]);

  // Function to get icon based on item type
  const getItemIcon = (type) => {
      switch(type) {
          case 'Official': return <FaUserTie />;
          case 'Resident': return <FaUsers />;
          case 'Blotter': return <FaAddressBook />;
          case 'Certificate': return <FaFileAlt />;
          default: return null;
      }
  };

  // --- Helper function moved INSIDE component ---
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        // Use locale-specific date formatting
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString; // Fallback
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Replace with actual logo */}
          <img
            src="/logo.png"
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
                    {/* --- Conditional Rendering for Loading/Error/Data --- */}
                    {officialsLoading && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>Loading officials...</td>
                      </tr>
                    )}
                    {officialsError && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>{officialsError}</td>
                      </tr>
                    )}
                    {!officialsLoading && !officialsError && officials.length === 0 && (
                       <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>No officials found.</td>
                      </tr>
                    )}
                    {!officialsLoading && !officialsError && officials.map((official) => (
                      <tr key={official._id}> {/* Use a unique key, like _id from MongoDB */}
                        <td>{official.fullName}</td>
                        <td>{official.gender}</td>
                        <td>{official.age}</td>
                        <td>{official.position}</td>
                        <td>{official.term}</td>
                        <td>{official.status}</td>
                        <td className="action-buttons">
                          {/* Pass the fetched official object to handlers */}
                          <button title="View" onClick={() => handleViewOfficial(official)}>
                            <FaEye />
                          </button>
                          <button title="Edit" onClick={() => handleOpenOfficialModal(official)}>
                            <FaEdit />
                          </button>
                          <button title="Delete"> {/* TODO: Implement Delete */}
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
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
              {/* Cards Section - Apply new structure and classes */}
              <div className="overview-cards">
                {/* Total Residents Card */}
                <div className="overview-card residents-card">
                  <h3>Total Residents</h3>
                  <p className="card-value">
                    {residentsLoading || dashboardStatsLoading ? '...' : residents.length}
                  </p>
                  <p className="card-secondary">Updated recently</p> {/* Placeholder secondary text */}
                  {residentsError && <span className="error-message small">Failed to load</span>}
                </div>
                {/* Active Officials Card */}
                <div className="overview-card officials-card">
                  <h3>Active Officials</h3>
                  <p className="card-value">
                    {officialsLoading || dashboardStatsLoading ? '...' : officials.filter(o => o?.status === 'Active').length}
                  </p>
                  <p className="card-secondary">Currently serving</p> {/* Placeholder */}
                  {officialsError && <span className="error-message small">Failed to load</span>}
                </div>
                {/* Open Blotter Cases Card */}
                <div className="overview-card blotters-card">
                  <h3>Open Blotter Cases</h3>
                  <p className="card-value">
                    {blottersLoading || dashboardStatsLoading ? '...' : blotters.filter(b => b?.status === 'Open').length}
                  </p>
                  <p className="card-secondary">Require action</p> {/* Placeholder */}
                  {blottersError && <span className="error-message small">Failed to load</span>}
                </div>
                {/* Certificates Issued Card */}
                <div className="overview-card certificates-card">
                  <h3>Certificates Issued</h3>
                  <p className="card-value">
                    {certificatesLoading || dashboardStatsLoading ? '...' : certificates.length}
                  </p>
                  <p className="card-secondary">Total documents</p> {/* Placeholder */}
                  {certificatesError && <span className="error-message small">Failed to load</span>}
                </div>
              </div>

              {/* --- Bottom Row with Charts --- */}
              <div className="dashboard-bottom-row">
                  {/* Large Chart Area - Modernized Line/Area Chart */}
                  <div className="bottom-chart-container large chart-wrapper">
                      {/* Title - Rely on chart-wrapper for centering */}
                      <h4 style={{ marginBottom: '20px' }}>Blotters Recorded (Last 7 Days)</h4>
                      {(blottersLoading || dashboardStatsLoading) && <p>Loading chart data...</p>}
                      {blottersError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading blotter data for chart.</p>}
                      {!blottersLoading && !blottersError && !dashboardStatsLoading && (
                          recentBlotterData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={250}> {/* Adjusted height */}
                                  {/* Using AreaChart for a filled look */}
                                  <AreaChart
                                      data={recentBlotterData}
                                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                  >
                                      <defs>
                                          {/* Gradient Definition */}
                                          <linearGradient id="colorBlotters" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#4e73df" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0"/>
                                      <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} fontSize={12} />
                                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} fontSize={12} />
                                      <Tooltip
                                          contentStyle={{ borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: 'none'}}
                                          itemStyle={{ color: '#4e73df' }}
                                      />
                                      <Area
                                          type="monotone"
                                          dataKey="count"
                                          stroke="#4e73df"
                                          fillOpacity={1}
                                          fill="url(#colorBlotters)" /* Apply gradient */
                                          strokeWidth={2}
                                          activeDot={{ r: 6 }}
                                          name="Blotters"
                                      />
                                      {/* Optional: Keep the line if preferred */}
                                      {/* <Line type="monotone" dataKey="count" stroke="#4e73df" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Blotters"/> */}
                                  </AreaChart>
                              </ResponsiveContainer>
                          ) : <p>No recent blotter data available.</p>
                      )}
                  </div>

                  {/* Container for the two smaller doughnut charts */}
                  <div className="bottom-chart-container small-charts">
                      {/* Resident Gender Doughnut Chart */}
                      <div className="chart-wrapper">
                          <h4>Resident Gender</h4>
                          {(residentsLoading || dashboardStatsLoading) && <p>Loading...</p>}
                          {residentsError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading data</p>}
                          {!residentsLoading && !residentsError && !dashboardStatsLoading && (
                              genderData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height={200}> {/* Adjust height */}
                                      <PieChart>
                                          <Pie
                                              data={genderData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={60} // Make it a doughnut
                                              outerRadius={80}
                                              fill="#8884d8"
                                              paddingAngle={2}
                                              dataKey="value"
                                              nameKey="name"
                                          >
                                              {genderData.map((entry, index) => (
                                                  <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                              ))}
                                          </Pie>
                                          <Tooltip />
                                          {/* <Legend /> Optional: Legend might clutter small charts */}
                                      </PieChart>
                                  </ResponsiveContainer>
                              ) : <p>No resident data</p>
                          )}
                      </div>

                       {/* Blotter Status Doughnut Chart */}
                       <div className="chart-wrapper">
                          <h4>Blotter Status</h4>
                           {(blottersLoading || dashboardStatsLoading) && <p>Loading...</p>}
                           {blottersError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading data</p>}
                           {!blottersLoading && !blottersError && !dashboardStatsLoading && (
                              blotterStatusData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height={200}> {/* Adjust height */}
                                      <PieChart>
                                          <Pie
                                              data={blotterStatusData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={60} // Make it a doughnut
                                              outerRadius={80}
                                              fill="#8884d8"
                                              paddingAngle={2}
                                              dataKey="value"
                                              nameKey="name"
                                          >
                                              {blotterStatusData.map((entry, index) => (
                                                  <Cell key={`cell-status-${index}`} fill={BLOTTER_COLORS[index % BLOTTER_COLORS.length]} />
                                              ))}
                                          </Pie>
                                          <Tooltip formatter={(value) => `${value} cases`} />
                                           {/* <Legend /> Optional */}
                                      </PieChart>
                                  </ResponsiveContainer>
                              ) : <p>No blotter data</p>
                           )}
                      </div>
                  </div>
              </div>
              {/* --- End Bottom Row --- */}

              {/* --- Recently Added Section --- */}
              <div className="dashboard-section recent-items-section">
                  <h3>Recently Added</h3>
                  {(dashboardStatsLoading) && <p>Loading recent activity...</p>}
                  {(!dashboardStatsLoading && recentlyAddedItems.length === 0) && <p>No recent activity found.</p>}
                  {!dashboardStatsLoading && recentlyAddedItems.length > 0 && (
                      <ul className="recent-items-list">
                          {recentlyAddedItems.map((item) => (
                              <li key={`${item.type}-${item._id}`} className="recent-item">
                                  {/* Icon removed */}
                                  {/* <span className="item-icon">{getItemIcon(item.type)}</span> */}
                                  <div className="item-details">
                                      <span className="item-type">{item.type}:</span>
                                      <span className="item-name" title={item.name}> {item.name}</span>
                                  </div>
                                  <span className="item-date">{formatDate(item.date)}</span>
                              </li>
                          ))}
                      </ul>
                  )}
                  {/* Optional: Add error state display */}
                  {(!dashboardStatsLoading && (officialsError || residentsError || blottersError || certificatesError)) &&
                    <p style={{color: 'orange', fontSize: '0.9em'}}>Note: Some data might be missing due to loading errors.</p>}
              </div>
              {/* --- End Recently Added Section --- */}

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
                      <th>Age</th> {/* Displaying Age from virtual field */}
                      <th>Address</th>
                      <th>Contact Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Conditional Rendering for Residents */}
                    {residentsLoading && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading residents...</td></tr>
                    )}
                    {residentsError && (
                       <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{residentsError}</td></tr>
                    )}
                    {!residentsLoading && !residentsError && residents.length === 0 && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>No residents found.</td></tr>
                    )}
                    {!residentsLoading && !residentsError && residents.map((resident) => (
                      <tr key={resident._id}>
                        <td>{resident.fullName}</td>
                        <td>{resident.gender}</td>
                        <td>{resident.age}</td> {/* Assuming 'age' virtual field exists from model */}
                        {/* Display simplified or full address based on model */}
                        <td>{resident.address?.street || resident.address}</td>
                        <td>{resident.contactNumber || 'N/A'}</td>
                        <td className="action-buttons">
                          <button title="View" onClick={() => handleViewResident(resident)}>
                            <FaEye />
                          </button>
                          <button title="Edit" onClick={() => handleOpenResidentModal(resident)}>
                            <FaEdit />
                          </button>
                          <button title="Delete"> {/* TODO: Implement Delete */}
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
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
                {/* Updated form with validation and controlled inputs */}
                <form onSubmit={handleSaveResident} className="modal-form">
                   {residentFormMessage && <p className={`form-message ${residentFormErrors && Object.keys(residentFormErrors).length > 0 ? 'error' : 'success'}`}>{residentFormMessage}</p>}

                  {/* Resident Form Fields */}
                  <div className="form-group">
                    <label htmlFor="resFullName">Full Name:</label>
                    <input
                      type="text"
                      id="resFullName"
                      name="fullName" /* Name matches state key */
                      value={residentFormData.fullName}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.fullName}
                      />
                    {residentFormErrors.fullName && <span className="error-message">{residentFormErrors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="resGender">Gender:</label>
                    <select
                      id="resGender"
                      name="gender" /* Name matches state key */
                      value={residentFormData.gender}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.gender}
                      >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {residentFormErrors.gender && <span className="error-message">{residentFormErrors.gender}</span>}
                  </div>
                   <div className="form-group">
                    <label htmlFor="resBirthdate">Birthdate:</label>
                    <input
                       type="date"
                       id="resBirthdate"
                       name="birthdate" /* Name matches state key */
                       value={residentFormData.birthdate}
                       onChange={handleResidentFormChange}
                       aria-invalid={!!residentFormErrors.birthdate}
                      />
                    {residentFormErrors.birthdate && <span className="error-message">{residentFormErrors.birthdate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="resAddress">Address (Street/Purok):</label> {/* Clarify label */}
                    <input
                      type="text"
                      id="resAddress"
                      name="address" /* Name matches state key */
                      value={residentFormData.address}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.address}
                      />
                       {/* Add more address fields if needed (barangay, city based on model) */}
                     {residentFormErrors.address && <span className="error-message">{residentFormErrors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="resContact">Contact Number (Optional):</label>
                    <input
                      type="text"
                      id="resContact"
                      name="contactNumber" /* Name matches state key */
                      value={residentFormData.contactNumber}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.contactNumber}
                     />
                    {residentFormErrors.contactNumber && <span className="error-message">{residentFormErrors.contactNumber}</span>}
                  </div>
                   {/* Optional Fields */}
                   <div className="form-group">
                      <label htmlFor="resCivilStatus">Civil Status (Optional):</label>
                      <select id="resCivilStatus" name="civilStatus" value={residentFormData.civilStatus} onChange={handleResidentFormChange}>
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="resOccupation">Occupation (Optional):</label>
                      <input type="text" id="resOccupation" name="occupation" value={residentFormData.occupation} onChange={handleResidentFormChange} />
                    </div>

                  <div className="modal-actions">
                    <button type="submit" className="save-button" disabled={residentFormLoading}>
                      {residentFormLoading ? 'Saving...' : (residentToEdit ? "Update" : "Save")}
                    </button>
                    <button type="button" onClick={handleCloseResidentModal} className="cancel-button" disabled={residentFormLoading}>
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
                       {/* Adjust columns based on Blotter model and importance */}
                      <th>Incident Date</th>
                      <th>Incident Type</th>
                      <th>Complainant</th>
                      <th>Respondent</th>
                      <th>Status</th>
                      {/* <th>Narrative</th>  Too long for table? */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Conditional Rendering for Blotters */}
                    {blottersLoading && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading records...</td></tr>
                    )}
                    {blottersError && (
                       <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{blottersError}</td></tr>
                    )}
                    {!blottersLoading && !blottersError && blotters.length === 0 && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>No blotter records found.</td></tr>
                    )}
                    {!blottersLoading && !blottersError && blotters.map((blotter) => (
                      <tr key={blotter._id}>
                        <td>{new Date(blotter.incidentDate).toLocaleDateString()}</td>
                        <td>{blotter.incidentType}</td>
                        <td>{blotter.complainant?.name}</td>
                        <td>{blotter.respondent?.name}</td>
                        <td>{blotter.status}</td>
                        <td className="action-buttons">
                          <button title="View" onClick={() => handleViewBlotter(blotter)}>
                            <FaEye />
                          </button>
                          <button title="Edit" onClick={() => handleOpenBlotterModal(blotter)}>
                            <FaEdit />
                          </button>
                          <button title="Delete"> {/* TODO: Implement Delete */}
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="content-footer">
                <button
                  className="add-record-button"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleOpenBlotterModal()} // Use the handler for Add/Edit
                >
                  Add New Record
                </button>
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
                <h2>{blotterToEdit ? "Edit Blotter Record" : "Add New Blotter Record"}</h2>
                <form onSubmit={handleSaveBlotter} className="modal-form">
                   {blotterFormMessage && <p className={`form-message ${blotterFormErrors && Object.keys(blotterFormErrors).length > 0 ? 'error' : 'success'}`}>{blotterFormMessage}</p>}

                  {/* Blotter Form Fields */}
                  <div className="form-group">
                    <label htmlFor="incidentType">Incident Type:</label>
                    <input
                      type="text"
                      id="incidentType"
                      name="incidentType"
                      value={blotterFormData.incidentType}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.incidentType}
                    />
                    {blotterFormErrors.incidentType && <span className="error-message">{blotterFormErrors.incidentType}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="incidentDate">Incident Date:</label>
                    <input
                      type="date"
                      id="incidentDate"
                      name="incidentDate"
                      value={blotterFormData.incidentDate}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.incidentDate}
                    />
                    {blotterFormErrors.incidentDate && <span className="error-message">{blotterFormErrors.incidentDate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="incidentLocation">Incident Location:</label>
                    <input
                      type="text"
                      id="incidentLocation"
                      name="incidentLocation"
                      value={blotterFormData.incidentLocation}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.incidentLocation}
                    />
                    {blotterFormErrors.incidentLocation && <span className="error-message">{blotterFormErrors.incidentLocation}</span>}
                  </div>
                   <div className="form-group">
                    <label htmlFor="complainantName">Complainant Name:</label>
                    <input
                      type="text"
                      id="complainantName"
                      name="complainantName"
                      value={blotterFormData.complainantName}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.complainantName}
                    />
                     {blotterFormErrors.complainantName && <span className="error-message">{blotterFormErrors.complainantName}</span>}
                  </div>
                   <div className="form-group">
                    <label htmlFor="respondentName">Respondent Name:</label>
                    <input
                      type="text"
                      id="respondentName"
                      name="respondentName"
                      value={blotterFormData.respondentName}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.respondentName}
                    />
                     {blotterFormErrors.respondentName && <span className="error-message">{blotterFormErrors.respondentName}</span>}
                  </div>
                   <div className="form-group">
                    <label htmlFor="narrative">Narrative:</label>
                    <textarea
                      id="narrative"
                      name="narrative"
                      rows="4"
                      value={blotterFormData.narrative}
                      onChange={handleBlotterFormChange}
                      aria-invalid={!!blotterFormErrors.narrative}
                    ></textarea>
                     {blotterFormErrors.narrative && <span className="error-message">{blotterFormErrors.narrative}</span>}
                  </div>
                   <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                       id="status"
                       name="status"
                       value={blotterFormData.status}
                       onChange={handleBlotterFormChange}
                       aria-invalid={!!blotterFormErrors.status}
                       >
                       {/* Values from Blotter model enum */}
                      <option value="Open">Open</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Amicably Settled">Amicably Settled</option>
                      <option value="Referred">Referred</option>
                      <option value="Closed">Closed</option>
                    </select>
                     {blotterFormErrors.status && <span className="error-message">{blotterFormErrors.status}</span>}
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="save-button" disabled={blotterFormLoading}>
                      {blotterFormLoading ? 'Saving...' : (blotterToEdit ? "Update" : "Save Record")}
                    </button>
                    <button type="button" onClick={handleCloseBlotterModal} className="cancel-button" disabled={blotterFormLoading}>
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
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Conditional Rendering for Certificates */}
                     {certificatesLoading && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading certificates...</td></tr>
                    )}
                    {certificatesError && (
                       <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{certificatesError}</td></tr>
                    )}
                    {!certificatesLoading && !certificatesError && certificates.length === 0 && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>No certificates found.</td></tr>
                    )}
                    {/* Use optional chaining for safety */}
                    {!certificatesLoading && !certificatesError && certificates.map((certificate) => (
                      <tr key={certificate?._id}>
                        <td>{certificate?.certificateType}</td>
                        <td>{certificate?.resident?.fullName || 'N/A'}</td>
                        <td>{certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{certificate?.issuedBy?.username || 'N/A'}</td>
                        <td>{certificate?.status}</td>
                        <td className="action-buttons">
                          <button title="View/Download" onClick={() => handleViewCertificate(certificate)}>
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
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
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseCertificateModal(); }}>
              <div className="modal-content">
                <button onClick={handleCloseCertificateModal} className="modal-close-button">&times;</button>
                <h2>Issue New Certificate</h2>
                <form onSubmit={handleIssueCertificate} className="modal-form">
                   {certificateFormMessage && <p className={`form-message ${certificateFormErrors && Object.keys(certificateFormErrors).length > 0 ? 'error' : 'success'}`}>{certificateFormMessage}</p>}

                  <div className="form-group">
                    <label htmlFor="certificateType">Certificate Type:</label>
                    <select
                      id="certificateType"
                      name="certificateType"
                      value={certificateFormData.certificateType}
                      onChange={handleCertificateFormChange}
                      aria-invalid={!!certificateFormErrors.certificateType}
                      >
                      <option value="" disabled>Select Type</option>
                      <option value="Barangay Clearance">Barangay Clearance</option>
                      <option value="Certificate of Residency">Certificate of Residency</option>
                      <option value="Certificate of Indigency">Certificate of Indigency</option>
                      <option value="Business Permit">Business Permit</option>
                      <option value="Other">Other</option>
                    </select>
                    {certificateFormErrors.certificateType && <span className="error-message">{certificateFormErrors.certificateType}</span>}
                  </div>

                   <div className="form-group">
                    <label htmlFor="residentId">Resident:</label>
                    <select
                       id="residentId"
                       name="residentId"
                       value={certificateFormData.residentId}
                       onChange={handleCertificateFormChange}
                       aria-invalid={!!certificateFormErrors.residentId}
                       disabled={residentsLoading} // Disable while residents are loading
                      >
                      <option value="" disabled>Select Resident</option>
                      {/* Handle loading and error states for residents */}
                      {residentsLoading && <option value="" disabled>Loading residents...</option>}
                      {!residentsLoading && residentsError && <option value="" disabled>Error loading residents</option>}
                      {!residentsLoading && !residentsError && residents.map(resident => (
                          // Ensure resident object and _id exist before rendering option
                          resident?._id && <option key={resident._id} value={resident._id}>{resident.fullName}</option>
                      ))}
                      {!residentsLoading && !residentsError && residents.length === 0 && <option value="" disabled>No residents found</option>}
                    </select>
                    {/* Wrap conditional error messages in a Fragment */}
                    <>
                      {certificateFormErrors.residentId && <span className="error-message">{certificateFormErrors.residentId}</span>}
                      {/* Display resident fetch error only if relevant */}
                      {residentsError && !residentsLoading && <span className="error-message">{residentsError}</span>}
                    </>
                  </div>

                  <div className="form-group">
                    <label htmlFor="purpose">Purpose:</label>
                    <input
                      type="text"
                      id="purpose"
                      name="purpose"
                      value={certificateFormData.purpose}
                      onChange={handleCertificateFormChange}
                      aria-invalid={!!certificateFormErrors.purpose}
                     />
                     {certificateFormErrors.purpose && <span className="error-message">{certificateFormErrors.purpose}</span>}
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="save-button" disabled={certificateFormLoading || residentsLoading}>
                      {certificateFormLoading ? 'Issuing...' : 'Issue Certificate'}
                    </button>
                    <button type="button" onClick={handleCloseCertificateModal} className="cancel-button" disabled={certificateFormLoading}>
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
