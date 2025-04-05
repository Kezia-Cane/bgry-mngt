import React, { useState } from 'react'; // Import useState
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to call upon successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout (can be passed to Dashboard later)
  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  // };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard /* onLogout={handleLogout} */ /> // Show Dashboard if logged in
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} /> // Show Login if not logged in
      )}
    </div>
  );
}

export default App;
