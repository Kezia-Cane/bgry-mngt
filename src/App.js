import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import OfficialForm from "./components/OfficialForm"; // Import the new form component

// Wrapper component to use useNavigate inside App
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/dashboard"); // Navigate to dashboard on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login"); // Navigate to login on logout
  };

  return (
    <div className="App">
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace /> // Redirect if already logged in
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not logged in
            )
          }
        />

        {/* Protected Official Form Route */}
        <Route
          path="/dashboard/officials/add"
          element={
            isLoggedIn ? (
              <OfficialForm /> // Render the form if logged in
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not logged in
            )
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Optional: Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Main App component wraps everything in BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
