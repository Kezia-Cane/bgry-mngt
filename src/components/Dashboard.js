import React from 'react';
import './Dashboard.css';

function Dashboard() {
  // In a real app, user info and permissions would determine which modules are shown
  // const { user } = useAuth(); // Example of getting user context

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Barangay Management System</h1>
        {/* Add user info/logout button here later */}
        <button className="logout-button" onClick={() => alert('Logout functionality to be added')} >Logout</button>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><a href="/dashboard">Dashboard Home</a></li>
          <li><a href="/officials">Brgy Officials</a></li>
          <li><a href="/residents">Residents</a></li>
          <li><a href="/blotter">Blotter Records</a></li>
          <li><a href="/certificates">Certificates</a></li>
          <li><a href="/about">About</a></li>
          {/* Conditionally render Admin link based on user role */}
          {/* {user?.role === 'admin' && ( */}
            <li><a href="/admin">Admin</a></li>
          {/* )} */}
        </ul>
      </nav>
      <main className="dashboard-content">
        <h2>Welcome to the Dashboard</h2>
        <p>Select a module from the navigation menu to get started.</p>
        {/* Content for the selected module will be rendered here via routing */}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; 2025 Barangay Management System</p>
      </footer>
    </div>
  );
}

export default Dashboard;
