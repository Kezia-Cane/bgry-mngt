import React, { useState } from 'react'; // Import useState
import './App.css';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to call upon successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} /> // Pass handleLogout to Dashboard
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} /> // Show Login if not logged in
      )}
    </div>
  );
}

export default App;
