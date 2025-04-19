import React from 'react';
import { useSelector } from 'react-redux'; // Removed useDispatch
import { Navigate, Route, Routes } from 'react-router-dom'; // Removed Link, useNavigate
// Removed logout actions import

// Import Page Components
import Dashboard from './components/Dashboard';
import Login from './components/Login';

// Import Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Import CSS
import './App.css';

function App() {
  // Only need isAuthenticated here for the root redirect logic
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Remove handleLogout function
  // const handleLogout = () => { ... };

  // Remove inline DashboardPage function

  return (
    <div>
      {/* Remove the entire <nav> element */}
      {/* {isAuthenticated && ( ... </nav> )} */}

      <main> { /* Removed inline style, use CSS */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
             <Route path="/dashboard" element={<Dashboard />} />
             {/* Example: <Route path="/residents" element={<ResidentListPage />} /> */}
             {/* Example: Admin routes should now be nested here if Dashboard handles internal routing OR defined separately */}
             <Route path="/admin/users" element={<div><h2>Admin User Management</h2><p>Placeholder page for admins.</p></div>} />
          </Route>

          {/* NOTE: The Admin Only Route Example below might be redundant now if */}
          {/* Dashboard handles showing the Admin module internally based on role */}
          {/* Or if you want a separate top-level admin route, keep it */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}> */}
             {/* <Route path="/admin/users" element={<div><h2>Admin User Management</h2><p>Placeholder page for admins.</p></div>} /> */}
          {/* </Route> */}

          {/* Redirect root path */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

          {/* Add a 404 Not Found route */}
          <Route path="*" element={<div><h2>404 Not Found</h2><p>The page you requested does not exist.</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

// Remove inline styles object
// const styles = { ... };

export default App;
