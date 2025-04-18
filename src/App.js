import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'; // Added Navigate
import { logout, logoutUserBackend } from './store/authSlice'; // Import logout actions

// Import Page Components
// import LoginPage from './pages/LoginPage'; // Remove this import
import Login from './components/Login'; // Import your Login component
// Import other page components as needed (e.g., Dashboard, ResidentList, etc.)
// import DashboardPage from './pages/DashboardPage';

// Import Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Import CSS
import './App.css'; // Make sure you have styles defined

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Call backend logout first
    dispatch(logoutUserBackend());
    // Immediately clear client-side state and storage
    dispatch(logout());
    navigate('/login');
  };

  // Placeholder for Dashboard component
  const DashboardPage = () => (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username}! (Role: {user?.role})</p>
      {/* Add dashboard content here */}
    </div>
  );

  return (
    <div>
      {/* Basic Navigation - Render only if needed based on your structure */}
      {isAuthenticated && (
          <nav style={styles.navbar}>
            <h1>Barangay Management</h1>
            <ul style={styles.navList}>
                  <li style={styles.navItem}><Link to="/dashboard" style={styles.navLink}>Dashboard</Link></li>
                  {/* Add other links for authenticated users */}
                  {/* Example: <li style={styles.navItem}><Link to="/residents" style={styles.navLink}>Residents</Link></li> */}
                  {user?.role === 'admin' && (
                    <li style={styles.navItem}><Link to="/admin/users" style={styles.navLink}>Admin Users</Link></li>
                  )}
                  <li style={styles.navItem}>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                  </li>
            </ul>
          </nav>
      )}

      <main style={styles.mainContent}> { /* Ensure main content area exists */}
        <Routes>
          {/* Public Routes */}
          {/* Use your Login component for the /login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}> { /* Wrap protected routes */}
             {/* Add other protected routes here, inside the wrapper */}
             <Route path="/dashboard" element={<DashboardPage />} />
             {/* Example: <Route path="/residents" element={<ResidentListPage />} /> */}
          </Route>

          {/* Admin Only Route Example */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}> { /* Wrap admin-only routes */}
             {/* Example: <Route path="/admin/users" element={<AdminUserManagementPage />} /> */}
             {/* For now, just a placeholder for the link demo */}
             <Route path="/admin/users" element={<div><h2>Admin User Management</h2><p>Placeholder page for admins.</p></div>} />
          </Route>

          {/* Redirect root path or add a home page */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

          {/* Add a 404 Not Found route */}
          <Route path="*" element={<div><h2>404 Not Found</h2><p>The page you requested does not exist.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

// Basic inline styles (consider moving to CSS files/modules)
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '20px' // Add some space below navbar
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '15px'
  },
  navLink: {
    textDecoration: 'none',
    color: '#007bff'
  },
  logoutButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  mainContent: {
    padding: '0 20px 20px 20px' // Adjust padding if navbar is present
  }
};

export default App;
