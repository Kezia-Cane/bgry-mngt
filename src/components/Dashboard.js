import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, logoutUserBackend } from '../store/authSlice';
import "./Dashboard.css";
import LoadingAnimation from './LoadingAnimation';

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
  FaUsers
} from "react-icons/fa";
import api from '../services/api';
import BlotterViewModal from "./BlotterViewModal.js";
import CertificateViewModal from "./CertificateViewModal.js";
import OfficialViewModal from "./OfficialViewModal.js";
import ResidentViewModal from "./ResidentViewModal.js";
import UserEditModal from "./UserEditModal.js";

import {
  Area,

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

import Swal from 'sweetalert2';


const initialOfficialFormState = {
  fullName: '',
  gender: '',
  age: '',
  position: '',
  term: '',
  status: 'Active',
};
const initialResidentFormState = {
  fullName: '',
  gender: '',
  age: '',
  birthdate: '',
  address: '',
  contactNumber: '',

  civilStatus: '',
  occupation: '',
};
const initialBlotterFormState = {
  incidentType: '',
  incidentDate: '',
  incidentLocation: '',
  complainantName: '',
  respondentName: '',
  narrative: '',
  status: 'Open',

};
const initialCertificateFormState = {
    certificateType: '',
    residentId: '',
    purpose: '',
};


const GENDER_COLORS = ['#0088FE', '#FF8042', '#FFBB28'];
const BLOTTER_COLORS = ['#DD4444', '#FFBB28', '#00C49F', '#8884d8', '#82ca9d'];


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);


  const [activeModule, setActiveModule] = useState("Dashboard");
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
  const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
  const [isBlotterModalOpen, setIsBlotterModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // We now use inline function in the button onClick
  // But keeping these functions for reference and potential future use
  /*
  const handleOpenUserModal = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };
  */

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setUserToEdit(null);
  };


  const handleOpenUserEditModal = (user) => {
    setUserToEdit(user);
    setIsUserEditModalOpen(true);
  };

  const handleCloseUserEditModal = () => {
    setIsUserEditModalOpen(false);
    setUserToEdit(null);
  };


  const handleUserUpdated = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError('Failed to refresh users list');
    } finally {
      setUsersLoading(false);
    }
  };


  // These render functions are no longer used as we're rendering content directly in the JSX
  // Keeping them commented out for reference
  /*
  const renderDashboardOverview = () => {
    return (
      <div className="dashboard-overview">
        <h2>Dashboard Overview</h2>
      </div>
    );
  };

  const renderBrgyOfficial = () => {
    return (
      <div className="brgy-official-section">
        <h2>Barangay Officials</h2>
      </div>
    );
  };

  const renderResident = () => {
    return (
      <div className="resident-section">
        <h2>Residents</h2>
      </div>
    );
  };

  const renderBlotter = () => {
    return (
      <div className="blotter-section">
        <h2>Blotter Records</h2>
      </div>
    );
  };

  const renderCertificate = () => {
    return (
      <div className="certificate-section">
        <h2>Certificates</h2>
      </div>
    );
  };

  const renderAbout = () => {
    return (
      <div className="about-section">
        <h2>About</h2>
      </div>
    );
  };
  */



  const [selectedResidentForView, setSelectedResidentForView] = useState(null);
  const [isResidentViewModalOpen, setIsResidentViewModalOpen] = useState(false);


  const [selectedOfficialForView, setSelectedOfficialForView] = useState(null);
  const [isOfficialViewModalOpen, setIsOfficialViewModalOpen] = useState(false);


  const [selectedBlotterForView, setSelectedBlotterForView] = useState(null);
  const [isBlotterViewModalOpen, setIsBlotterViewModalOpen] = useState(false);


  const [officialToEdit, setOfficialToEdit] = useState(null);


      const [residentToEdit, setResidentToEdit] = useState(null);


      const [blotterToEdit, setBlotterToEdit] = useState(null);


      const [selectedCertificateForView, setSelectedCertificateForView] = useState(null);
      const [isCertificateViewModalOpen, setIsCertificateViewModalOpen] = useState(false);


  const [officialFormData, setOfficialFormData] = useState(initialOfficialFormState);
  const [officialFormErrors, setOfficialFormErrors] = useState({});
  const [officialFormLoading, setOfficialFormLoading] = useState(false);
  const [officialFormMessage, setOfficialFormMessage] = useState('');


  const [officials, setOfficials] = useState([]);
  const [officialsLoading, setOfficialsLoading] = useState(false);
  const [officialsError, setOfficialsError] = useState(null);


  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState(null);


  const [residentFormData, setResidentFormData] = useState(initialResidentFormState);
  const [residentFormErrors, setResidentFormErrors] = useState({});
  const [residentFormLoading, setResidentFormLoading] = useState(false);
  const [residentFormMessage, setResidentFormMessage] = useState('');


  const [blotters, setBlotters] = useState([]);
  const [blottersLoading, setBlottersLoading] = useState(false);
  const [blottersError, setBlottersError] = useState(null);


  const [blotterFormData, setBlotterFormData] = useState(initialBlotterFormState);
  const [blotterFormErrors, setBlotterFormErrors] = useState({});
  const [blotterFormLoading, setBlotterFormLoading] = useState(false);
  const [blotterFormMessage, setBlotterFormMessage] = useState('');


  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState(null);


  const [certificateFormData, setCertificateFormData] = useState(initialCertificateFormState);
  const [certificateFormErrors, setCertificateFormErrors] = useState({});
  const [certificateFormLoading, setCertificateFormLoading] = useState(false);
  const [certificateFormMessage, setCertificateFormMessage] = useState('');


  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);


  const fetchUsers = async () => {
    // If already loading, don't start another request
    if (usersLoading) return;

    setUsersLoading(true);
    setUsersError(null);
    try {
      // Add a retry mechanism with exponential backoff
      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
            useCache: true,
            timeout: 15000 + (retries * 5000)
          };

          const response = await api.get('/admin/users', config);
          setUsers(response.data);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsersError(error.response?.data?.message || 'Failed to fetch users. Please try refreshing the page.');

      // Show user-friendly error message for network issues
      if (!error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Issue',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            fetchUsers();
          }
        });
      }
    } finally {
      setUsersLoading(false);
    }

    return true; // For promise chaining
  };

  const fetchOfficials = async () => {
    // If already loading, don't start another request
    if (officialsLoading) return;

    setOfficialsLoading(true);
    setOfficialsError(null);
    try {
      // Add a retry mechanism with exponential backoff
      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
            // Use cache by default
            useCache: true,
            // Increase timeout for slow connections
            timeout: 15000 + (retries * 5000) // 15s, 20s, 25s
          };

          const response = await api.get('/barangay-officials', config);
          setOfficials(response.data || []);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= maxRetries) throw err;
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
    } catch (error) {
      console.error("Error fetching officials:", error.response || error);
      setOfficialsError('Failed to load officials. Please try refreshing the page.');
      setOfficials([]);

      // Show user-friendly error message for network issues
      if (!error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Issue',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            fetchOfficials();
          }
        });
      }
    } finally {
      setOfficialsLoading(false);
    }

    return true; // For promise chaining
  };

  const fetchResidents = async () => {
    // If already loading, don't start another request
    if (residentsLoading) return;

    setResidentsLoading(true);
    setResidentsError(null);
    try {
      // Add a retry mechanism with exponential backoff
      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
            useCache: true,
            timeout: 15000 + (retries * 5000)
          };

          const response = await api.get('/residents', config);
          setResidents(response.data.residents || response.data || []);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
    } catch (error) {
      console.error("Error fetching residents:", error.response || error);
      setResidentsError('Failed to load residents. Please try refreshing the page.');
      setResidents([]);

      // Show user-friendly error message for network issues
      if (!error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Issue',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            fetchResidents();
          }
        });
      }
    } finally {
      setResidentsLoading(false);
    }

    return true; // For promise chaining
  };

  const fetchBlotters = async () => {
    // If already loading, don't start another request
    if (blottersLoading) return;

    setBlottersLoading(true);
    setBlottersError(null);
    try {
      // Add a retry mechanism with exponential backoff
      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
            useCache: true,
            timeout: 15000 + (retries * 5000)
          };

          const response = await api.get('/blotters', config);
          setBlotters(response.data.blotters || response.data || []);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
    } catch (error) {
      console.error("Error fetching blotters:", error.response || error);
      setBlottersError('Failed to load blotter records. Please try refreshing the page.');
      setBlotters([]);

      // Show user-friendly error message for network issues
      if (!error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Issue',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            fetchBlotters();
          }
        });
      }
    } finally {
      setBlottersLoading(false);
    }

    return true; // For promise chaining
  };

  const fetchCertificates = async () => {
    // If already loading, don't start another request
    if (certificatesLoading) return;

    setCertificatesLoading(true);
    setCertificatesError(null);
    try {
      // Add a retry mechanism with exponential backoff
      let retries = 0;
      const maxRetries = 3;
      let success = false;

      while (!success && retries < maxRetries) {
        try {
          const config = {
            headers: { 'Authorization': `Bearer ${token}` },
            useCache: true,
            timeout: 15000 + (retries * 5000)
          };

          const response = await api.get('/certificates', config);
          setCertificates(response.data.certificates || response.data || []);
          success = true;
        } catch (err) {
          retries++;
          if (retries >= maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
    } catch (error) {
      console.error("Error fetching certificates:", error.response || error);
      setCertificatesError('Failed to load certificates. Please try refreshing the page.');
      setCertificates([]);

      // Show user-friendly error message for network issues
      if (!error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Connection Issue',
          text: 'Unable to connect to the server. Please check your internet connection and try again.',
          confirmButtonText: 'Retry',
        }).then((result) => {
          if (result.isConfirmed) {
            fetchCertificates();
          }
        });
      }
    } finally {
      setCertificatesLoading(false);
    }

    return true; // For promise chaining
  };




  // Track which modules have loaded data
  const [loadedModules, setLoadedModules] = useState({
    Dashboard: false,
    "Brgy Official": false,
    Resident: false,
    Blotter: false,
    Certificate: false,
    Admin: false
  });

  // Initial data loading when component mounts
  useEffect(() => {
    if (token) {
      // Load only the data for the active module to improve initial load time
      loadDataForActiveModule(true);
    }
  }, [token]);

  // Load data when active module changes
  useEffect(() => {
    if (token) {
      loadDataForActiveModule(false);
    }
  }, [activeModule, token, user?.role]);

  // Function to load data based on active module
  const loadDataForActiveModule = (isInitialLoad) => {
    // If this module has already been loaded and it's not an initial load, don't reload
    if (!isInitialLoad && loadedModules[activeModule]) {
      console.log(`Module ${activeModule} already loaded, skipping reload`);
      return;
    }

    switch (activeModule) {
      case "Brgy Official":
        fetchOfficials().then(() => {
          setLoadedModules(prev => ({ ...prev, "Brgy Official": true }));
        });
        break;
      case "Resident":
        fetchResidents().then(() => {
          setLoadedModules(prev => ({ ...prev, Resident: true }));
        });
        break;
      case "Blotter":
        fetchBlotters().then(() => {
          setLoadedModules(prev => ({ ...prev, Blotter: true }));
        });
        break;
      case "Certificate":
        fetchCertificates().then(() => {
          setLoadedModules(prev => ({ ...prev, Certificate: true }));
        });
        // Only fetch residents if needed for the certificate form
        if (residents.length === 0 && !residentsLoading) {
          fetchResidents();
        }
        break;
      case "Dashboard":
        // Only load dashboard data if not already loaded or if it's an explicit refresh
        if (!loadedModules.Dashboard || isInitialLoad) {
          setDashboardStatsLoading(true);

          // Check if we already have data for each section
          const needsOfficials = officials.length === 0;
          const needsResidents = residents.length === 0;
          const needsBlotters = blotters.length === 0;
          const needsCertificates = certificates.length === 0;

          // Only fetch data we don't already have
          let promise = Promise.resolve();

          if (needsOfficials) {
            promise = promise.then(() => fetchOfficials())
              .then(() => new Promise(resolve => setTimeout(resolve, 300)));
          }

          if (needsResidents) {
            promise = promise.then(() => fetchResidents())
              .then(() => new Promise(resolve => setTimeout(resolve, 300)));
          }

          if (needsBlotters) {
            promise = promise.then(() => fetchBlotters())
              .then(() => new Promise(resolve => setTimeout(resolve, 300)));
          }

          if (needsCertificates) {
            promise = promise.then(() => fetchCertificates());
          }

          promise.finally(() => {
            setDashboardStatsLoading(false);
            setLoadedModules(prev => ({ ...prev, Dashboard: true }));
          });
        }
        break;
      case "Admin":
        fetchUsers().then(() => {
          setLoadedModules(prev => ({ ...prev, Admin: true }));
        });
        break;
      default:
        break;
    }
  };


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
      setOfficialFormErrors({});
      setOfficialFormMessage('');
    } else {
      setOfficialFormData(initialOfficialFormState);
      setOfficialFormErrors({});
      setOfficialFormMessage('');
    }
  }, [officialToEdit, isOfficialModalOpen]);


  useEffect(() => {
    if (residentToEdit) {
      const birthdateValue = residentToEdit.birthdate ? new Date(residentToEdit.birthdate).toISOString().split('T')[0] : '';
      setResidentFormData({
        fullName: residentToEdit.fullName || '',
        gender: residentToEdit.gender || '',
        birthdate: birthdateValue,
        address: residentToEdit.address?.street || residentToEdit.address || '',
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


  const handleOfficialFormChange = (e) => {
    const { name, value } = e.target;
    setOfficialFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (officialFormErrors[name]) {
      setOfficialFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
     setOfficialFormMessage('');
  };

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


  const validateOfficialForm = () => {
    const errors = {};
    if (!officialFormData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!officialFormData.gender) errors.gender = 'Gender is required';
    if (!officialFormData.age) errors.age = 'Age is required';
    else if (isNaN(officialFormData.age) || Number(officialFormData.age) <= 0) errors.age = 'Age must be a positive number';
    else if (Number(officialFormData.age) < 18) errors.age = 'Official must be at least 18 years old';
    if (!officialFormData.position.trim()) errors.position = 'Position is required';
    if (!officialFormData.term.trim()) errors.term = 'Term is required';
    if (!officialFormData.status) errors.status = 'Status is required';

    setOfficialFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const validateResidentForm = () => {
    const errors = {};
    if (!residentFormData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!residentFormData.gender) errors.gender = 'Gender is required';
    if (!residentFormData.birthdate) errors.birthdate = 'Birthdate is required';

    if (!residentFormData.address.trim()) errors.address = 'Address is required';
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


  const handleLogout = () => {

    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You will be returned to the login page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(logoutUserBackend());

        dispatch(logout());
        navigate('/login');

      }

    });
  };



  const handleViewOfficial = (official) => {
    setSelectedOfficialForView(official);
    setIsOfficialViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsOfficialViewModalOpen(false);
    setSelectedOfficialForView(null);
  };



  const handleViewResident = (resident) => {
    setSelectedResidentForView(resident);
    setIsResidentViewModalOpen(true);
  };

  const handleCloseResidentViewModal = () => {
    setIsResidentViewModalOpen(false);
    setSelectedResidentForView(null);
  };



  const handleViewBlotter = (blotter) => {
    setSelectedBlotterForView(blotter);
    setIsBlotterViewModalOpen(true);
  };

  const handleCloseBlotterViewModal = () => {
    setIsBlotterViewModalOpen(false);
    setSelectedBlotterForView(null);
  };



  const handleOpenOfficialModal = (official = null) => {
    setOfficialToEdit(official);
    setIsOfficialModalOpen(true);
  };

  const handleCloseOfficialModal = () => {
    setIsOfficialModalOpen(false);
    setOfficialToEdit(null);
    setOfficialFormData(initialOfficialFormState);
    setOfficialFormErrors({});
    setOfficialFormMessage('');
  };


  const handleSaveOfficial = async (e) => {
    e.preventDefault();
    setOfficialFormMessage('');
    setOfficialFormErrors({});

    if (!validateOfficialForm()) {
      setOfficialFormMessage('Please fix the errors in the form.');
      return;
    }

    setOfficialFormLoading(true);
    const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
    const dataToSubmit = { ...officialFormData, age: Number(officialFormData.age) };

    try {
      if (officialToEdit) {

        await api.put(`/barangay-officials/${officialToEdit._id}`, dataToSubmit, config);


        Swal.fire({
          icon: "success",
          title: "Official Updated",
          text: "The official's information has been successfully updated.",
          showConfirmButton: false,
          timer: 1500
        });


        handleCloseOfficialModal();


        await fetchOfficials();

      } else {

        await api.post('/barangay-officials', dataToSubmit, config);


        Swal.fire({
          icon: "success",
          title: "New Official has been saved",
          showConfirmButton: false,
          timer: 1500
        });


        handleCloseOfficialModal();


        await fetchOfficials();
      }

    } catch (error) {

      console.error("Error saving official:", error.response || error);
      let errorMessage = `Failed to ${officialToEdit ? 'update' : 'add'} official. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setOfficialFormMessage(errorMessage);

    } finally {
      setOfficialFormLoading(false);
    }
  };


  const handleDeleteOfficial = async (officialId) => {
    if (user?.role !== 'admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'Only administrators can delete official records.',
      });
      return;
    }



    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };

          await api.delete(`/barangay-officials/${officialId}`, config);


          Swal.fire(
            'Deleted!',
            'The official record has been deleted.',
            'success'
          );


          await fetchOfficials();

        } catch (error) {
          console.error("Error deleting official:", error.response || error);

          Swal.fire(
            'Error!',
            'Failed to delete the official record. Please try again.',
            'error'
          );
        }
      }
    });
  };


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
    const dataToSubmit = {
      fullName: residentFormData.fullName,
      gender: residentFormData.gender,
      birthdate: residentFormData.birthdate,

      address: {
          street: residentFormData.address,
          barangay: "New Visayas",
          city: "Panabo City",
          province: "Davao del Norte"
      },
      contactNumber: residentFormData.contactNumber || undefined,
      civilStatus: residentFormData.civilStatus || undefined,
      occupation: residentFormData.occupation || undefined,
    };

    try {
      if (residentToEdit) {

        await api.put(`/residents/${residentToEdit._id}`, dataToSubmit, config);


        Swal.fire({
            icon: "success",
            title: "Resident Updated",
            text: "The resident's information has been successfully updated.",
            showConfirmButton: false,
            timer: 1500
        });


        handleCloseResidentModal();


        await fetchResidents();

      } else {

        await api.post('/residents', dataToSubmit, config);


        Swal.fire({
            icon: "success",
            title: "New Resident has been saved",
            showConfirmButton: false,
            timer: 1500
        });


        handleCloseResidentModal();


        await fetchResidents();
      }

    } catch (error) {
      console.error("Error saving resident:", error.response || error);
      let errorMessage = `Failed to ${residentToEdit ? 'update' : 'add'} resident. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setResidentFormMessage(errorMessage);
    } finally {
      setResidentFormLoading(false);
    }
  };

  const handleOpenResidentModal = (resident = null) => {
    setResidentToEdit(resident);
    setIsResidentModalOpen(true);
  };

  const handleCloseResidentModal = () => {
    setIsResidentModalOpen(false);
    setResidentToEdit(null);
  };

  const handleDeleteResident = async (residentId) => {
    if (user?.role !== 'admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'Only administrators can delete resident records.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this resident record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };
          await api.delete(`/residents/${residentId}`, config);

          Swal.fire(
            'Deleted!',
            'The resident record has been deleted.',
            'success'
          );

          await fetchResidents();

        } catch (error) {
          console.error("Error deleting resident:", error.response || error);
          Swal.fire(
            'Error!',
            'Failed to delete the resident record. Please try again.',
            'error'
          );
        }
      }
    });
  };

  const handleOpenBlotterModal = (blotter = null) => {
    setBlotterToEdit(blotter);
    setIsBlotterModalOpen(true);
  };

  const handleCloseBlotterModal = () => {
    setIsBlotterModalOpen(false);
    setBlotterToEdit(null);
  };

  const handleViewCertificate = (certificate) => {
    setSelectedCertificateForView(certificate);
    setIsCertificateViewModalOpen(true);
  };

  const handleCloseCertificateViewModal = () => {
    setIsCertificateViewModalOpen(false);
    setSelectedCertificateForView(null);
  };

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
    const dataToSubmit = {
      incidentType: blotterFormData.incidentType,
      incidentDate: blotterFormData.incidentDate,
      incidentLocation: blotterFormData.incidentLocation,
      complainant: { name: blotterFormData.complainantName },
      respondent: { name: blotterFormData.respondentName },
      narrative: blotterFormData.narrative,
      status: blotterFormData.status,
    };

    try {
      if (blotterToEdit) {
        await api.put(`/blotters/${blotterToEdit._id}`, dataToSubmit, config);
        Swal.fire({
            icon: "success",
            title: "Blotter Record Updated",
            text: "The blotter record has been successfully updated.",
            showConfirmButton: false,
            timer: 1500
        });
        handleCloseBlotterModal();
        await fetchBlotters();

      } else {

        await api.post('/blotters', dataToSubmit, config);
        Swal.fire({
            icon: "success",
            title: "New Blotter Record has been saved",
            showConfirmButton: false,
            timer: 1500
        });
        handleCloseBlotterModal();
        await fetchBlotters();
      }
    } catch (error) {
      console.error("Error saving blotter record:", error.response || error);
      let errorMessage = `Failed to ${blotterToEdit ? 'update' : 'add'} blotter record. Please try again.`;
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setBlotterFormMessage(errorMessage);
    } finally {
      setBlotterFormLoading(false);
    }
  };

  const handleCloseCertificateModal = () => {
      setIsCertificateModalOpen(false);
      setCertificateFormData(initialCertificateFormState);
      setCertificateFormErrors({});
      setCertificateFormMessage('');
  }


  const genderData = useMemo(() => {
    if (!residents || residents.length === 0) return [];
    const counts = residents.reduce((acc, resident) => {
      const gender = resident?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [residents]);

  const blotterStatusData = useMemo(() => {
    if (!blotters || blotters.length === 0) return [];
    const counts = blotters.reduce((acc, blotter) => {
      const status = blotter?.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusOrder = ['Open', 'Under Investigation', 'Amicably Settled', 'Referred', 'Closed', 'Unknown'];
    return statusOrder
      .filter(status => counts[status] > 0)
      .map(status => ({ name: status, value: counts[status] }));

  }, [blotters]);

  const recentBlotterData = useMemo(() => {
    if (!blotters || blotters.length === 0) return [];

    const dayMap = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        dayMap[dateString] = { name: dayName, count: 0, date: dateString };
    }


    blotters.forEach(blotter => {
        if (!blotter.createdAt) return;
        const blotterDate = new Date(blotter.createdAt);
        blotterDate.setHours(0, 0, 0, 0);
        const dateString = blotterDate.toISOString().split('T')[0];


        if (dayMap[dateString]) {
            dayMap[dateString].count += 1;
        }
    });


    return Object.values(dayMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [blotters]);

  const recentlyAddedItems = useMemo(() => {
    const combined = [
      ...(officials || []).map(item => ({ ...item, type: 'Official', name: item.fullName, date: item.createdAt })),
      ...(residents || []).map(item => ({ ...item, type: 'Resident', name: item.fullName, date: item.createdAt })),

      ...(blotters || []).map(item => ({ ...item, type: 'Blotter', name: item.incidentType, date: item.createdAt || item.incidentDate })),
      ...(certificates || []).map(item => ({ ...item, type: 'Certificate', name: `${item.certificateType} for ${item.resident?.fullName || 'N/A'}`, date: item.createdAt || item.issueDate }))
    ];


    const validItems = combined.filter(item => item.date && !isNaN(new Date(item.date).getTime()));


    validItems.sort((a, b) => new Date(b.date) - new Date(a.date));


    return validItems.slice(0, 4);

  }, [officials, residents, blotters, certificates]);


  // Helper function to get the appropriate icon for each item type
  const renderItemIcon = (type) => {
      switch(type) {
          case 'Official': return <FaUserTie />;
          case 'Resident': return <FaUsers />;
          case 'Blotter': return <FaAddressBook />;
          case 'Certificate': return <FaFileAlt />;
          default: return null;
      }
  };


  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {

        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString;
    }
  };


  const handleDeleteBlotter = async (blotterId) => {

    if (user?.role !== 'admin') {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Denied',
        text: 'Only administrators can delete blotter records.',
      });
      return;
    }



    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this blotter record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const config = { headers: { 'Authorization': `Bearer ${token}` } };

          await api.delete(`/blotters/${blotterId}`, config);


          Swal.fire(
            'Deleted!',
            'The blotter record has been deleted.',
            'success'
          );


          await fetchBlotters();

        } catch (error) {
          console.error("Error deleting blotter:", error.response || error);

          Swal.fire(
            'Error!',
            'Failed to delete the blotter record. Please try again.',
            'error'
          );
        }
      }
    });
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

      await api.post('/certificates', dataToSubmit, config);

      Swal.fire({
          icon: "success",
          title: "Certificate Issued!",
          text: "The certificate has been successfully issued.",
          showConfirmButton: false,
          timer: 1500
      });

      handleCloseCertificateModal();
      await fetchCertificates();

    } catch (error) {
      console.error("Error issuing certificate:", error.response || error);
      let errorMessage = 'Failed to issue certificate. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        if (error.response.status === 404 && error.response.data.message.includes('Resident not found')){
            setCertificateFormErrors(prev => ({...prev, residentId: 'Selected resident not found.' }))
        }
      }
      setCertificateFormMessage(errorMessage);
    } finally {
      setCertificateFormLoading(false);
    }
  };





  const handleDeleteUser = async (userIdToDelete) => {

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };


        await api.delete(`/admin/users/${userIdToDelete}`, config);


        Swal.fire(
          'Deleted!',
          'The user has been deleted.',
          'success'
        );


        fetchUsers();

      } catch (error) {
        console.error("Error deleting user:", error.response || error);
        const errorMsg = error.response?.data?.message || 'Failed to delete user.';
        setUsersError(errorMsg);

        Swal.fire(
          'Error!',
          errorMsg,
          'error'
        );
      } finally {


        setUsersLoading(false);
      }
    }
  };



  useEffect(() => {
    if (activeModule === "Admin") {
      fetchUsers();
    }
  }, [activeModule]);


  // This render function is no longer used as we're rendering content directly in the JSX
  // Keeping it commented out for reference
  /*
  const renderUserManagementTable = () => {
    return (
      <div className="module-container user-management-module">
        <h3 className="module-title">User Management</h3>
        <button className="btn btn-primary mb-3" onClick={handleOpenUserModal}>
          <FaUserCog /> Add New User
        </button>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>{userItem.username}</td>
                  <td>{userItem.role}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleOpenUserEditModal(userItem)}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(userItem._id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isUserEditModalOpen && userToEdit && (
          <UserEditModal
            isOpen={isUserEditModalOpen}
            onClose={handleCloseUserEditModal}
            userData={userToEdit}
            onUserUpdated={fetchUsers}
            token={token}
          />
        )}
        {isUserModalOpen && (
          <UserEditModal
            isOpen={isUserModalOpen}
            onClose={handleCloseUserModal}
            userData={null}
            onUserUpdated={fetchUsers}
            token={token}
          />
        )}
      </div>
    );
  };
  */


  // This function is no longer used as we're rendering content directly in the JSX
  // Keeping it commented out for reference
  /*
  const renderContent = () => {
    switch (activeModule) {
      case "Brgy Official":
        return renderBrgyOfficial();
      case "Resident":
        return renderResident();
      case "Blotter":
        return renderBlotter();
      case "Certificate":
        return renderCertificate();
      case "About":
        return renderAbout();
      case "Admin":
        return renderUserManagementTable();
      default:
        return renderDashboardOverview();
    }
  };
  */

  // Add a useEffect to handle page refresh and 404 errors
  useEffect(() => {
    // Listen for the beforeunload event to handle page refreshes
    const handleBeforeUnload = () => {
      // Clear any sensitive data from localStorage if needed
      // This is just a placeholder - you might not need to do anything here
    };

    // Listen for the popstate event to handle browser navigation
    const handlePopState = () => {
      // If the user navigates using browser buttons, make sure we're on a valid route
      if (window.location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Handle 404 errors by redirecting to dashboard
    const handle404 = () => {
      if (window.location.pathname !== '/dashboard' && token) {
        navigate('/dashboard');
      }
    };

    // Call once on mount
    handle404();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, token]);

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            src="/logo.png"
            alt="Barangay Logo"
            className="sidebar-logo"
          />
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-title">Tools</span>
          <ul>
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
            {user?.role === 'admin' && (
              <li
                className={activeModule === "Admin" ? "active" : ""}
                onClick={() => setActiveModule("Admin")}
              >
                <FaUserCog /> <span>Admin</span>
              </li>
            )}
            <li onClick={handleLogout}>
              <FaSignOutAlt /> <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="main-header">
        </header>
        <main className="content-area">
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
                    {officialsLoading && (<tr><td colSpan="7" style={{ textAlign: 'center' }}><LoadingAnimation size={50} /></td></tr>)}
                    {officialsError && (<tr><td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>{officialsError}</td></tr>)}
                    {!officialsLoading && !officialsError && officials.length === 0 && (<tr><td colSpan="7" style={{ textAlign: 'center' }}>No officials found.</td></tr>)}
                    {!officialsLoading && !officialsError && [...officials].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((official) => (
                      <tr key={official._id}>
                        <td>{official.fullName}</td>
                        <td>{official.gender}</td>
                        <td>{official.age}</td>
                        <td>{official.position}</td>
                        <td>{official.term}</td>
                        <td>{official.status}</td>
                        <td className="action-buttons">
                          <button title="View" onClick={() => handleViewOfficial(official)}><FaEye /></button>
                          <button title="Edit" onClick={() => handleOpenOfficialModal(official)}><FaEdit /></button>
                          <button title="Delete" onClick={() => handleDeleteOfficial(official._id)}><FaTrash /></button>
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
                    <select
                      id="position"
                      name="position"
                      value={officialFormData.position}
                      onChange={handleOfficialFormChange}
                      aria-invalid={!!officialFormErrors.position}
                      >
                        <option value="" disabled>Select Position</option>
                        <option value="Punong Barangay">Punong Barangay</option>
                        <option value="Sangguniang Barangay Member">Sangguniang Barangay Member</option>
                        <option value="SK Chairperson">SK Chairperson</option>
                        <option value="Barangay Secretary">Barangay Secretary</option>
                     </select>
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

          {activeModule !== "Brgy Official" &&
            activeModule !== "Dashboard" &&
            activeModule !== "Resident" &&
            activeModule !== "Blotter" &&
            activeModule !== "Certificate" &&
            activeModule !== "About" &&
            activeModule !== "Admin" && (
              <div>
                <h2>{activeModule}</h2>{" "}
                <p>Content for {activeModule} module goes here.</p>{" "}
              </div>
            )}
          {activeModule === "Dashboard" && (
            <div className="dashboard-overview">
              <div className="overview-cards">
                <div className="overview-card residents-card">
                  <h3>Total Residents</h3>
                  <p className="card-value">
                    {residentsLoading || dashboardStatsLoading ? <LoadingAnimation size={50} /> : residents.length}
                  </p>
                  <p className="card-secondary">Updated recently</p>
                  {residentsError && <span className="error-message small">Failed to load</span>}
                </div>
                <div className="overview-card officials-card">
                  <h3>Active Officials</h3>
                  <p className="card-value">
                    {officialsLoading || dashboardStatsLoading ? <LoadingAnimation size={50} /> : officials.filter(o => o?.status === 'Active').length}
                  </p>
                  <p className="card-secondary">Currently serving</p>
                  {officialsError && <span className="error-message small">Failed to load</span>}
                </div>
                <div className="overview-card blotters-card">
                  <h3>Open Blotter Cases</h3>
                  <p className="card-value">
                    {blottersLoading || dashboardStatsLoading ? <LoadingAnimation size={50} /> : blotters.filter(b => b?.status === 'Open').length}
                  </p>
                  <p className="card-secondary">Require action</p>
                  {blottersError && <span className="error-message small">Failed to load</span>}
                </div>
                <div className="overview-card certificates-card">
                  <h3>Certificates Issued</h3>
                  <p className="card-value">
                    {certificatesLoading || dashboardStatsLoading ? <LoadingAnimation size={50} /> : certificates.length}
                  </p>
                  <p className="card-secondary">Total documents</p>
                  {certificatesError && <span className="error-message small">Failed to load</span>}
                </div>
              </div>

              <div className="dashboard-bottom-row">
                  <div className="bottom-chart-container large chart-wrapper">
                      <h4 style={{ marginBottom: '20px' }}>Blotters Recorded (Last 7 Days)</h4>
                      {(blottersLoading || dashboardStatsLoading) && <LoadingAnimation size={100} />}
                      {blottersError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading blotter data for chart.</p>}
                      {!blottersLoading && !blottersError && !dashboardStatsLoading && (
                          recentBlotterData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={250}>
                                  <AreaChart
                                      data={recentBlotterData}
                                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                  >
                                      <defs>
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
                                          fill="url(#colorBlotters)"
                                          strokeWidth={2}
                                          activeDot={{ r: 6 }}
                                          name="Blotters"
                                      />
                                  </AreaChart>
                              </ResponsiveContainer>
                          ) : <p>No recent blotter data available.</p>
                      )}
                  </div>

                  <div className="bottom-chart-container small-charts">
                      <div className="chart-wrapper">
                          <h4>Resident Gender</h4>
                          {(residentsLoading || dashboardStatsLoading) && <p>Loading...</p>}
                          {residentsError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading data</p>}
                          {!residentsLoading && !residentsError && !dashboardStatsLoading && (
                              genderData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height={200}>
                                      <PieChart>
                                          <Pie
                                              data={genderData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={60}
                                              outerRadius={80}
                                              fill="#8884d8"
                                              paddingAngle={2}
                                              dataKey="value"
                                              nameKey="name"
                                          >
                                              {genderData.map((_, index) => (
                                                  <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                              ))}
                                          </Pie>
                                          <Tooltip />
                                      </PieChart>
                                  </ResponsiveContainer>
                              ) : <p>No resident data</p>
                          )}
                      </div>

                       <div className="chart-wrapper">
                          <h4>Blotter Status</h4>
                           {(blottersLoading || dashboardStatsLoading) && <p>Loading...</p>}
                           {blottersError && !dashboardStatsLoading && <p style={{ color: 'red' }}>Error loading data</p>}
                           {!blottersLoading && !blottersError && !dashboardStatsLoading && (
                              blotterStatusData.length > 0 ? (
                                  <ResponsiveContainer width="100%" height={200}>
                                      <PieChart>
                                          <Pie
                                              data={blotterStatusData}
                                              cx="50%"
                                              cy="50%"
                                              innerRadius={60}
                                              outerRadius={80}
                                              fill="#8884d8"
                                              paddingAngle={2}
                                              dataKey="value"
                                              nameKey="name"
                                          >
                                              {blotterStatusData.map((_, index) => (
                                                  <Cell key={`cell-status-${index}`} fill={BLOTTER_COLORS[index % BLOTTER_COLORS.length]} />
                                              ))}
                                          </Pie>
                                          <Tooltip formatter={(value) => `${value} cases`} />
                                      </PieChart>
                                  </ResponsiveContainer>
                              ) : <p>No blotter data</p>
                           )}
                      </div>
                  </div>
              </div>

              <div className="dashboard-section recent-items-section">
                  <h3>Recently Added</h3>
                  {(dashboardStatsLoading) && <p>Loading recent activity...</p>}
                  {(!dashboardStatsLoading && recentlyAddedItems.length === 0) && <p>No recent activity found.</p>}
                  {!dashboardStatsLoading && recentlyAddedItems.length > 0 && (
                      <ul className="recent-items-list">
                          {recentlyAddedItems.map((item) => (
                              <li key={`${item.type}-${item._id}`} className="recent-item">
                                  <div className="item-icon">
                                      {renderItemIcon(item.type)}
                                  </div>
                                  <div className="item-details">
                                      <span className="item-type">{item.type}:</span>
                                      <span className="item-name" title={item.name}> {item.name}</span>
                                  </div>
                                  <span className="item-date">{formatDate(item.date)}</span>
                              </li>
                          ))}
                      </ul>
                  )}
                  {(!dashboardStatsLoading && (officialsError || residentsError || blottersError || certificatesError)) &&
                    <p style={{color: 'orange', fontSize: '0.9em'}}>Note: Some data might be missing due to loading errors.</p>}
              </div>

            </div>
          )}
          {activeModule === "Resident" && (
            <div>
              <div className="content-title-bar">
                <h2>Resident</h2>
                <div className="search-section">
                  <label htmlFor="search-type">Search Type:</label>
                  <select id="search-type" defaultValue="last name">
                    <option value="last name">Last name</option>
                    <option value="first name">First name</option>
                    <option value="address">Address</option>{" "}
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
                      <th>Address</th>
                      <th>Contact Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residentsLoading && (
                       <tr><td colSpan="5" style={{ textAlign: 'center' }}><LoadingAnimation size={50} /></td></tr>
                    )}
                    {residentsError && (
                       <tr><td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>{residentsError}</td></tr>
                    )}
                    {!residentsLoading && !residentsError && residents.length === 0 && (
                       <tr><td colSpan="5" style={{ textAlign: 'center' }}>No residents found.</td></tr>
                    )}
                    {!residentsLoading && !residentsError && [...residents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((resident) => (
                      <tr key={resident._id}>
                        <td>{resident.fullName}</td>
                        <td>{resident.gender}</td>
                        <td>{resident.address?.street || resident.address}</td>
                        <td>{resident.contactNumber || 'N/A'}</td>
                        <td className="action-buttons">
                          <button title="View" onClick={() => handleViewResident(resident)}>
                            <FaEye />
                          </button>
                          <button title="Edit" onClick={() => handleOpenResidentModal(resident)}>
                            <FaEdit />
                          </button>
                          <button title="Delete" onClick={() => handleDeleteResident(resident._id)}>
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
                  onClick={() => handleOpenResidentModal()}
                >
                  Add Resident
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}

          {isResidentModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseResidentModal(); }}>
              <div className="modal-content">
                <h2>{residentToEdit ? "Edit Resident" : "Add New Resident"}</h2>
                <form onSubmit={handleSaveResident} className="modal-form">
                   {residentFormMessage && <p className={`form-message ${residentFormErrors && Object.keys(residentFormErrors).length > 0 ? 'error' : 'success'}`}>{residentFormMessage}</p>}

                  <div className="form-group">
                    <label htmlFor="resFullName">Full Name:</label>
                    <input
                      type="text"
                      id="resFullName"
                      name="fullName"
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
                      name="gender"
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
                       name="birthdate"
                       value={residentFormData.birthdate}
                       onChange={handleResidentFormChange}
                       aria-invalid={!!residentFormErrors.birthdate}
                      />
                    {residentFormErrors.birthdate && <span className="error-message">{residentFormErrors.birthdate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="resAddress">Purok:</label>
                    <select
                      id="resAddress"
                      name="address"
                      value={residentFormData.address}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.address}
                      >
                        <option value="" disabled>Select Purok</option>
                        <option value="Purok 1 – Durian">Purok 1 – Durian</option>
                        <option value="Purok 2 – Oakwood Residence">Purok 2 – Oakwood Residence</option>
                        <option value="Purok 3 – Lemonsito">Purok 3 – Lemonsito</option>
                        <option value="Purok 4 – Cabaluna Street">Purok 4 – Cabaluna Street</option>
                        <option value="Purok 5">Purok 5</option>
                        <option value="Purok 6">Purok 6</option>
                        <option value="Purok 7">Purok 7</option>
                        <option value="Purok 8">Purok 8</option>
                        <option value="Purok 9">Purok 9</option>
                        <option value="Purok 10 – Andrea Homes Subdivision">Purok 10 – Andrea Homes Subdivision</option>
                        <option value="Purok 11">Purok 11</option>
                        <option value="Purok 12 - Northern Plain Subdivision">Purok 12 - Northern Plain Subdivision</option>
                        <option value="Purok 13">Purok 13</option>
                        <option value="Purok 14">Purok 14</option>
                        <option value="Purok 15">Purok 15</option>
                        <option value="Purok 16">Purok 16</option>
                        <option value="Purok 17 – Katipunan ng Kabataan">Purok 17 – Katipunan ng Kabataan</option>
                        <option value="Purok 18">Purok 18</option>
                     </select>
                     {residentFormErrors.address && <span className="error-message">{residentFormErrors.address}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="resContact">Contact Number (Optional):</label>
                    <input
                      type="text"
                      id="resContact"
                      name="contactNumber"
                      value={residentFormData.contactNumber}
                      onChange={handleResidentFormChange}
                      aria-invalid={!!residentFormErrors.contactNumber}
                     />
                    {residentFormErrors.contactNumber && <span className="error-message">{residentFormErrors.contactNumber}</span>}
                  </div>
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

          {isUserModalOpen && (
            <UserEditModal
              isOpen={isUserModalOpen}
              onClose={handleCloseUserModal}
              userData={null}
              onUserUpdated={fetchUsers}
              token={token}
            />
          )}

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
                      <th>Incident Date</th>
                      <th>Incident Type</th>
                      <th>Complainant</th>
                      <th>Respondent</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blottersLoading && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}><LoadingAnimation size={50} /></td></tr>
                    )}
                    {blottersError && (
                       <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{blottersError}</td></tr>
                    )}
                    {!blottersLoading && !blottersError && blotters.length === 0 && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>No blotter records found.</td></tr>
                    )}
                    {!blottersLoading && !blottersError && [...blotters].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((blotter) => (
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
                          <button title="Delete" onClick={() => handleDeleteBlotter(blotter._id)}>
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
                  onClick={() => handleOpenBlotterModal()}
                >
                  Add New Record
                </button>
                <button className="print-button">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          )}

          {isBlotterModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseBlotterModal(); }}>
              <div className="modal-content">
                <h2>{blotterToEdit ? "Edit Blotter Record" : "Add New Blotter Record"}</h2>
                <form onSubmit={handleSaveBlotter} className="modal-form">
                   {blotterFormMessage && <p className={`form-message ${blotterFormErrors && Object.keys(blotterFormErrors).length > 0 ? 'error' : 'success'}`}>{blotterFormMessage}</p>}

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
                     {certificatesLoading && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}><LoadingAnimation size={50} /></td></tr>
                    )}
                    {certificatesError && (
                       <tr><td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>{certificatesError}</td></tr>
                    )}
                    {!certificatesLoading && !certificatesError && certificates.length === 0 && (
                       <tr><td colSpan="6" style={{ textAlign: 'center' }}>No certificates found.</td></tr>
                    )}
                    {!certificatesLoading && !certificatesError && [...certificates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((certificate) => (
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
                  onClick={() => setIsCertificateModalOpen(true)}
                >
                  Issue New Certificate
                </button>
              </div>
            </div>
          )}

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
                       disabled={residentsLoading}
                      >
                      <option value="" disabled>Select Resident</option>
                      {residentsLoading && <option value="" disabled>Loading residents...</option>}
                      {!residentsLoading && residentsError && <option value="" disabled>Error loading residents</option>}
                      {!residentsLoading && !residentsError && residents.map(resident => (

                          resident?._id && <option key={resident._id} value={resident._id}>{resident.fullName}</option>
                      ))}
                      {!residentsLoading && !residentsError && residents.length === 0 && <option value="" disabled>No residents found</option>}
                    </select>
                    <>
                      {certificateFormErrors.residentId && <span className="error-message">{certificateFormErrors.residentId}</span>}
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

          {activeModule === "About" && (
            <div className="about-section">
              <h2>About the Barangay Management System</h2>
              <p>
              The Barangay Management System is a personal project developed to simulate and modernize the administrative processes within a barangay. It provides a centralized platform for managing resident information, barangay officials, blotter records, certificate issuance, and user accounts.
              </p>
              <p>
              This system is designed to improve efficiency, transparency, and communication in a community setting through digital transformation.
              </p>
              <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#6c757d' }}>
                 <strong>Disclaimer:</strong> This project is not affiliated with or officially connected to any actual barangay. All data used within the system is fictional and intended for demonstration purposes only.
              </p>
              <p>Version: 1.0.0 (Placeholder)</p>
            </div>
          )}
          {activeModule === "Admin" && (
            <div className="admin-section">
              <h2>Admin Panel</h2>

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
                      {usersLoading && (
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}><LoadingAnimation size={50} /></td></tr>
                      )}
                      {usersError && (
                        <tr><td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>{usersError}</td></tr>
                      )}
                      {!usersLoading && !usersError && users.length === 0 && (
                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td></tr>
                      )}
                      {!usersLoading && !usersError && [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((userItem) => (
                        <tr key={userItem._id}>
                          <td>{userItem.username}</td>
                          <td>{userItem.role}</td>
                          <td>{userItem.status || 'N/A'}</td>
                          <td className="action-buttons">
                            <button title="Edit" onClick={() => handleOpenUserEditModal(userItem)}>
                              <FaEdit />
                            </button>
                            <button title="Delete" onClick={() => handleDeleteUser(userItem._id)}>
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
                    className="add-user-button"
                    onClick={() => setIsUserModalOpen(true)}
                  >
                    Add New User
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {isOfficialViewModalOpen && (
          <OfficialViewModal
            official={selectedOfficialForView}
            onClose={handleCloseViewModal}
          />
        )}
        {isResidentViewModalOpen && (
          <ResidentViewModal
            resident={selectedResidentForView}
            onClose={handleCloseResidentViewModal}
          />
        )}
         {isBlotterViewModalOpen && (
          <BlotterViewModal
            blotter={selectedBlotterForView}
            onClose={handleCloseBlotterViewModal}
          />
        )}
        {isCertificateViewModalOpen && (
          <CertificateViewModal
            certificate={selectedCertificateForView}
            onClose={handleCloseCertificateViewModal}
          />
        )}
        {isUserEditModalOpen && (
          <UserEditModal
            isOpen={isUserEditModalOpen}
            onClose={handleCloseUserEditModal}
            userData={userToEdit}
            token={token}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
